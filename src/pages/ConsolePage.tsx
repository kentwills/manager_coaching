import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Edit } from 'react-feather';
import { RealtimeClient } from '@openai/realtime-api-beta';
import { ItemType } from '@openai/realtime-api-beta/dist/lib/client';
import { WebRTCConnection } from '../utils/webrtc';

import { Button } from '../components/button/Button';
import ConversationBlock from './ConversationBlock';
import SystemPromptForm from '../components/SystemPromptForm';

import './ConsolePage.scss';

interface RealtimeEvent {
  time: string;
  source: 'client' | 'server';
  count?: number;
  event: { [key: string]: any };
}

export function ConsolePage() {
  const [apiKey, setApiKey] = useState(() => {
    const storedKey = localStorage.getItem('tmp::voice_api_key');
    return storedKey || '';
  });

  const clientRef = useRef<RealtimeClient>(
    new RealtimeClient({ apiKey, dangerouslyAllowAPIKeyInBrowser: true })
  );
  const webrtcRef = useRef<WebRTCConnection | null>(null);
  const localAudioRef = useRef<HTMLAudioElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const startTimeRef = useRef<string>(new Date().toISOString());

  const [items, setItems] = useState<ItemType[]>([]);
  const [realtimeEvents, setRealtimeEvents] = useState<RealtimeEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleError = async (message: string) => {
    setErrorMessage(message);
    setIsConnected(false);
    const client = clientRef.current;
    client.disconnect();
    webrtcRef.current?.close();
  };

  const resetAPIKey = useCallback(() => {
    const key = prompt('OpenAI API Key');
    if (key !== null) {
      localStorage.clear();
      localStorage.setItem('tmp::voice_api_key', key);
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    clientRef.current = new RealtimeClient({
      apiKey,
      dangerouslyAllowAPIKeyInBrowser: true,
    });
  }, [apiKey]);

  useEffect(() => {
    if (!apiKey) {
      const key = prompt('OpenAI API Key') || '';
      if (key) {
        setApiKey(key);
        localStorage.setItem('tmp::voice_api_key', key);
      }
    }
  }, [apiKey]);

  const connectConversation = useCallback(async (systemPrompt: string) => {
    try {
      setErrorMessage('');
      setRealtimeEvents([]);
      setItems([]);
      const client = clientRef.current;

      client.updateSession({
        turn_detection: { type: 'server_vad' },
        input_audio_transcription: { model: 'whisper-1' },
        instructions: systemPrompt,
      });

      startTimeRef.current = new Date().toISOString();
      setIsConnected(true);
      setItems(client.conversation.getItems());

      webrtcRef.current = new WebRTCConnection({
        client,
        onRemoteStream: (stream) => {
          if (remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = stream;
            remoteAudioRef.current.play().catch(() => {});
          }
        },
      });

      const localStream = await webrtcRef.current.start();
      if (localAudioRef.current) {
        localAudioRef.current.srcObject = localStream;
        localAudioRef.current.muted = true;
        localAudioRef.current.play().catch(() => {});
      }

      await client.connect();
    } catch (e) {
      setIsConnected(false);
      setErrorMessage((e as Error).message);
      console.error(e);
    }
  }, []);

  const disconnectConversation = useCallback(async () => {
    setIsConnected(false);
    const client = clientRef.current;
    client.disconnect();
    webrtcRef.current?.close();
  }, []);

  const deleteConversationItem = useCallback(async (id: string) => {
    const client = clientRef.current;
    client.deleteItem(id);
  }, []);

  useEffect(() => {
    const client = clientRef.current;

    client.on('realtime.event', async (realtimeEvent: RealtimeEvent) => {
      if (realtimeEvent.event.type === 'error') {
        const code = realtimeEvent.event.error.code;
        if (code === 'invalid_api_key') {
          await handleError(realtimeEvent.event.error.message);
        }
      }
      if (realtimeEvent.event.type === 'response.done') {
        const response = realtimeEvent.event.response;
        if (response.status === 'failed') {
          const error = response.status_details?.error;
          if (error && error.type === 'insufficient_quota') {
            await handleError(error.message);
          }
        }
      }
      setRealtimeEvents((prevEvents) => {
        const lastEvent = prevEvents[prevEvents.length - 1];
        if (lastEvent?.event.type === realtimeEvent.event.type) {
          const updatedEvent = {
            ...lastEvent,
            count: (lastEvent.count || 0) + 1,
          };
          return [...prevEvents.slice(0, -1), updatedEvent];
        } else {
          return [...prevEvents, realtimeEvent];
        }
      });
    });

    client.on('error', (event: any) => console.error(event));

    client.on('conversation.updated', async ({ item }: any) => {
      const items = client.conversation.getItems();
      setItems(items);
    });

    setItems(client.conversation.getItems());

    return () => {
      client.reset();
    };
  }, []);

  return (
    <div data-component="ConsolePage">
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <div className="content-top">
        <div className="content-title">
          <span>AI Coaching</span>
        </div>
        <div className="content-api-key">
          <Button
            icon={Edit}
            iconPosition="end"
            buttonStyle="flush"
            onClick={() => resetAPIKey()}
          >
            {`API Key: ${apiKey.slice(0, 3)}...`}
          </Button>
        </div>
      </div>
      <div className="content-main">
        <div className="content-logs">
          <div className="content-actions">
            <audio ref={localAudioRef} hidden />
            <audio ref={remoteAudioRef} />
            <div className="spacer" />
          </div>
          <div className="content-block conversation">
            <ConversationBlock
              items={items}
              deleteConversationItem={deleteConversationItem}
            />
          </div>
        </div>
        <div className="content-right">
          <div className="content-block system-prompt">
            <div className="content-block-body">
              <SystemPromptForm
                isConnected={isConnected}
                connectConversation={connectConversation}
                disconnectConversation={disconnectConversation}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
