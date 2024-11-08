// src/pages/ConsolePage.tsx

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { RealtimeClient } from '@openai/realtime-api-beta';
import { ItemType } from '@openai/realtime-api-beta/dist/lib/client.js';
import { WavRecorder, WavStreamPlayer } from '../lib/wavtools/index.js';
import { WavRenderer } from '../utils/wav_renderer';

import { X, Edit } from 'react-feather';
import { Button } from '../components/button/Button';

import './ConsolePage.scss';

import ConversationBlock from './ConversationBlock';
import SystemPromptForm from '../components/SystemPromptForm';
import Visualization from '../components/Visualization';

/**
 * Type for all event logs
 */
interface RealtimeEvent {
  time: string;
  source: 'client' | 'server';
  count?: number;
  event: { [key: string]: any };
}

export function ConsolePage() {
  const apiKey =
    localStorage.getItem('tmp::voice_api_key') ||
    prompt('OpenAI API Key') ||
    '';
  if (apiKey !== '') {
    localStorage.setItem('tmp::voice_api_key', apiKey);
  }

  const wavRecorderRef = useRef<WavRecorder>(
    new WavRecorder({ sampleRate: 24000 })
  );
  const wavStreamPlayerRef = useRef<WavStreamPlayer>(
    new WavStreamPlayer({ sampleRate: 24000 })
  );
  const clientRef = useRef<RealtimeClient>(
    new RealtimeClient({
      apiKey: apiKey,
      dangerouslyAllowAPIKeyInBrowser: true,
    })
  );

  const clientCanvasRef = useRef<HTMLCanvasElement>(null);
  const serverCanvasRef = useRef<HTMLCanvasElement>(null);
  const startTimeRef = useRef<string>(new Date().toISOString());

  const [items, setItems] = useState<ItemType[]>([]);
  const [realtimeEvents, setRealtimeEvents] = useState<RealtimeEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const resetAPIKey = useCallback(() => {
    const apiKey = prompt('OpenAI API Key');
    if (apiKey !== null) {
      localStorage.clear();
      localStorage.setItem('tmp::voice_api_key', apiKey);
      window.location.reload();
    }
  }, []);

  const connectConversation = useCallback(async (systemPrompt:string) => {
    setRealtimeEvents([]);
    setItems([]);
    const client = clientRef.current;

    client.updateSession({
      turn_detection: { type: 'server_vad' },
      input_audio_transcription: { model: 'whisper-1' },
      instructions: systemPrompt,
    });

    const wavRecorder = wavRecorderRef.current;
    const wavStreamPlayer = wavStreamPlayerRef.current;

    startTimeRef.current = new Date().toISOString();
    setIsConnected(true);
    setRealtimeEvents([]);
    setItems(client.conversation.getItems());

    await wavRecorder.begin();
    await wavStreamPlayer.connect();
    await client.connect();
    await wavRecorder.record((data) => client.appendInputAudio(data.mono));
  }, []);

  const disconnectConversation = useCallback(async () => {
    setIsConnected(false);

    const client = clientRef.current;
    client.disconnect();

    const wavRecorder = wavRecorderRef.current;
    await wavRecorder.end();

    const wavStreamPlayer = wavStreamPlayerRef.current;
    await wavStreamPlayer.interrupt();
  }, []);

  const deleteConversationItem = useCallback(async (id: string) => {
    const client = clientRef.current;
    client.deleteItem(id);
  }, []);



  //Draws the visualization of the audio in realtime
  useEffect(() => {
    let isLoaded = true;

    const wavRecorder = wavRecorderRef.current;
    const clientCanvas = clientCanvasRef.current;
    let clientCtx: CanvasRenderingContext2D | null = null;

    const wavStreamPlayer = wavStreamPlayerRef.current;
    const serverCanvas = serverCanvasRef.current;
    let serverCtx: CanvasRenderingContext2D | null = null;

    const render = () => {
      if (isLoaded) {
        if (clientCanvas) {
          if (!clientCanvas.width || !clientCanvas.height) {
            clientCanvas.width = clientCanvas.offsetWidth;
            clientCanvas.height = clientCanvas.offsetHeight;
          }
          clientCtx = clientCtx || clientCanvas.getContext('2d');
          if (clientCtx) {
            clientCtx.clearRect(0, 0, clientCanvas.width, clientCanvas.height);
            const result = wavRecorder.recording
              ? wavRecorder.getFrequencies('voice')
              : { values: new Float32Array([0]) };
            WavRenderer.drawBars(
              clientCanvas,
              clientCtx,
              result.values,
              '#0099ff',
              10,
              0,
              8
            );
          }
        }
        if (serverCanvas) {
          if (!serverCanvas.width || !serverCanvas.height) {
            serverCanvas.width = serverCanvas.offsetWidth;
            serverCanvas.height = serverCanvas.offsetHeight;
          }
          serverCtx = serverCtx || serverCanvas.getContext('2d');
          if (serverCtx) {
            serverCtx.clearRect(0, 0, serverCanvas.width, serverCanvas.height);
            const result = wavStreamPlayer.analyser
              ? wavStreamPlayer.getFrequencies('voice')
              : { values: new Float32Array([0]) };
            WavRenderer.drawBars(
              serverCanvas,
              serverCtx,
              result.values,
              '#009900',
              10,
              0,
              8
            );
          }
        }
        window.requestAnimationFrame(render);
      }
    };
    render();

    return () => {
      isLoaded = false;
    };
  }, []);

  //realtime event handling 
  useEffect(() => {
    const wavStreamPlayer = wavStreamPlayerRef.current;
    const client = clientRef.current;

    client.on('realtime.event', (realtimeEvent: RealtimeEvent) => {
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
    client.on('conversation.interrupted', async () => {
      const trackSampleOffset = await wavStreamPlayer.interrupt();
      if (trackSampleOffset?.trackId) {
        const { trackId, offset } = trackSampleOffset;
        await client.cancelResponse(trackId, offset);
      }
    });
    client.on('conversation.updated', async ({ item, delta }: any) => {
      const items = client.conversation.getItems();
      if (delta?.audio) {
        wavStreamPlayer.add16BitPCM(delta.audio, item.id);
      }
      if (item.status === 'completed' && item.formatted.audio?.length) {
        const wavFile = await WavRecorder.decode(
          item.formatted.audio,
          24000,
          24000
        );
        item.formatted.file = wavFile;
      }
      setItems(items);
    });

    setItems(client.conversation.getItems());

    return () => {
      client.reset();
    };
  }, []);

  return (
    <div data-component="ConsolePage">
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
            <Visualization
              clientCanvasRef={clientCanvasRef}
              serverCanvasRef={serverCanvasRef}
            />
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
