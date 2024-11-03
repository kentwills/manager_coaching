import React, {useRef, useEffect} from 'react';
import { ItemType } from '@openai/realtime-api-beta/dist/lib/client.js';
import { X } from 'react-feather';


interface ConversationBlockProps {
  items: ItemType[];
  deleteConversationItem: (id: string) => void;
}


const ConversationBlock: React.FC<ConversationBlockProps> = ({
  items,
  deleteConversationItem,
}) => {
  const conversationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [items]);

  return (
    <>
      <div className="content-block-title">Conversation</div>
      <div className="content-block-body" ref={conversationRef} data-conversation-content>
        {!items.length && `Awaiting connection...`}
        {items.map((conversationItem) => (
          <div className="conversation-item" key={conversationItem.id}>
            <div className={`speaker ${conversationItem.role || ''}`}>
              <div>
                {(conversationItem.role || conversationItem.type).replaceAll('_', ' ')}
              </div>
              <div
                className="close"
                onClick={() => deleteConversationItem(conversationItem.id)}
              >
                <X />
              </div>
            </div>
            <div className={`speaker-content`}>
              {conversationItem.type === 'function_call_output' && (
                <div>{conversationItem.formatted.output}</div>
              )}
              {!!conversationItem.formatted.tool && (
                <div>
                  {conversationItem.formatted.tool.name}(
                  {conversationItem.formatted.tool.arguments})
                </div>
              )}
              {!conversationItem.formatted.tool &&
                conversationItem.role === 'user' && (
                  <div>
                    {conversationItem.formatted.transcript ||
                      (conversationItem.formatted.audio?.length
                        ? '(awaiting transcript)'
                        : conversationItem.formatted.text ||
                          '(item sent)')}
                  </div>
                )}
              {!conversationItem.formatted.tool &&
                conversationItem.role === 'assistant' && (
                  <div>
                    {conversationItem.formatted.transcript ||
                      conversationItem.formatted.text ||
                      '(truncated)'}
                  </div>
                )}
              {conversationItem.formatted.file && (
                <audio
                  src={conversationItem.formatted.file.url}
                  controls
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ConversationBlock;