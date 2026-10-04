import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  X,
  Send,
  FileText,
} from 'lucide-react';
import { SecureMessage } from '../../types';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
  reportId?: string;
  contextMessageId?: string;
}

interface FloatingSecurityAssistantProps {
  selectedMessage?: SecureMessage | null;
  onClearSelectedMessage?: () => void;
  onOpenReport?: (reportId: string, message?: SecureMessage) => void;
  onNavigateSection?: (section: string) => void;
  onSelectMessageById?: (msgId: string) => void;
}

export const FloatingSecurityAssistant: React.FC<FloatingSecurityAssistantProps> = ({
  selectedMessage,
  onClearSelectedMessage,
  onOpenReport,
  onNavigateSection,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Hello, I am the IN V PROTECT Security Assistant.\n\nI monitor your authorized communication channels in real time, analyze fraud signals, verify claimed senders against regulatory registries (SEBI, RBI, exchanges), and preserve forensic evidence.\n\nHow can I help protect your financial communications today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        'Is this message safe?',
        'Show recent threats',
        'Where is this message actually coming from?',
      ],
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setLoading(true);

    try {
      const token = localStorage.getItem('sangyan_access_token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query: textToSend,
          current_message_id: selectedMessage?.id || undefined,
          context: selectedMessage
            ? {
                id: selectedMessage.id,
                sender: selectedMessage.sender,
                claimed_source: selectedMessage.claimed_source,
                actual_sender: selectedMessage.actual_sender,
                risk_level: selectedMessage.risk_level,
                protection_tier: selectedMessage.protection_tier,
                signals: selectedMessage.detected_signals.map((s) => s.name),
              }
            : undefined,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: data.answer || 'I evaluated your security telemetry.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: data.suggested_actions,
        reportId: data.report_id,
        contextMessageId: data.context_message_id,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'Unable to connect to the IN V PROTECT Security Assistant service. Please verify your connection or try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action: string, msg?: ChatMessage) => {
    if (action.includes('View Incident Report') || action.includes('Generate Report')) {
      const repId = msg?.reportId || selectedMessage?.report_id || `INC-${selectedMessage?.id || 'RECENT'}`;
      if (onOpenReport) {
        onOpenReport(repId, selectedMessage || undefined);
      }
      return;
    }

    if (action.includes('Quarantined') || action.includes('recent threats')) {
      if (onNavigateSection) {
        onNavigateSection('alerts');
      }
      return;
    }

    if (action.includes('Security Inbox') || action.includes('important messages')) {
      if (onNavigateSection) {
        onNavigateSection('messages');
      }
      return;
    }

    // Default: send action as user query
    handleSendMessage(action);
  };

  return (
    <>
      {/* Discreet Bottom-Right Floating Button */}
      {!isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9000,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open IN V PROTECT Security Assistant"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#0a0d14',
              color: '#ffffff',
              border: '1px solid rgba(229, 62, 62, 0.4)',
              borderRadius: '9999px',
              padding: '10px 16px',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5), 0 0 16px rgba(229, 62, 62, 0.25)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(229, 62, 62, 0.8)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.6), 0 0 20px rgba(229, 62, 62, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(229, 62, 62, 0.4)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.5), 0 0 16px rgba(229, 62, 62, 0.25)';
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: 'rgba(229, 62, 62, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(229, 62, 62, 0.35)',
              }}
            >
              <Shield style={{ width: '15px', height: '15px', color: '#e53e3e' }} />
            </div>

            <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
              <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.06em', color: '#ffffff' }}>
                IN V PROTECT
              </div>
              <div style={{ fontSize: '9px', color: '#a0aec0', fontFamily: 'var(--font-mono)' }}>
                Security Assistant
              </div>
            </div>

            {selectedMessage && (
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: selectedMessage.risk_level === 'high' ? '#e53e3e' : '#38a169',
                  boxShadow: `0 0 8px ${selectedMessage.risk_level === 'high' ? '#e53e3e' : '#38a169'}`,
                  marginLeft: '4px',
                }}
                title={`Active context: ${selectedMessage.id}`}
              />
            )}
          </button>
        </div>
      )}

      {/* Floating Assistant Drawer / Sliding Panel */}
      {isOpen && (
        <aside
          role="dialog"
          aria-label="IN V PROTECT Security Assistant"
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: '440px',
            maxWidth: '100vw',
            backgroundColor: '#0c0f17',
            borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '-12px 0 40px rgba(0, 0, 0, 0.75)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideInRight 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'rgba(15, 20, 31, 0.85)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(229, 62, 62, 0.15)',
                  border: '1px solid rgba(229, 62, 62, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Shield style={{ width: '18px', height: '18px', color: '#e53e3e' }} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff', letterSpacing: '0.04em' }}>
                  IN V PROTECT
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  <span style={{ fontSize: '11px', color: '#a0aec0' }}>Security Assistant</span>
                  <span style={{ color: '#4a5568' }}>•</span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '10px',
                      fontFamily: 'var(--font-mono)',
                      color: '#48bb78',
                      fontWeight: 600,
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: '#48bb78',
                        boxShadow: '0 0 6px #48bb78',
                      }}
                    />
                    Ready
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close assistant"
              style={{
                background: 'none',
                border: 'none',
                color: '#a0aec0',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#a0aec0')}
            >
              <X style={{ width: '18px', height: '18px' }} />
            </button>
          </div>

          {/* Context-Aware Message Card Banner (Prompt Section 12) */}
          {selectedMessage && (
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: 'rgba(26, 32, 44, 0.95)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span
                  style={{
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#a0aec0',
                    letterSpacing: '0.08em',
                  }}
                >
                  ACTIVE CONTEXT • {selectedMessage.source_channel} #{selectedMessage.id}
                </span>
                {onClearSelectedMessage && (
                  <button
                    onClick={onClearSelectedMessage}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#718096',
                      fontSize: '10px',
                      cursor: 'pointer',
                      padding: '2px 4px',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#e2e8f0')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#718096')}
                  >
                    Clear Context
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontFamily: 'var(--font-mono)',
                    backgroundColor:
                      selectedMessage.risk_level === 'high'
                        ? 'rgba(229, 62, 62, 0.2)'
                        : selectedMessage.risk_level === 'review'
                        ? 'rgba(214, 158, 46, 0.2)'
                        : 'rgba(56, 161, 105, 0.2)',
                    color:
                      selectedMessage.risk_level === 'high'
                        ? '#feb2b2'
                        : selectedMessage.risk_level === 'review'
                        ? '#fbd38d'
                        : '#9ae6b4',
                    border: `1px solid ${
                      selectedMessage.risk_level === 'high'
                        ? 'rgba(229, 62, 62, 0.4)'
                        : selectedMessage.risk_level === 'review'
                        ? 'rgba(214, 158, 46, 0.4)'
                        : 'rgba(56, 161, 105, 0.4)'
                    }`,
                  }}
                >
                  RISK: {selectedMessage.risk_level.toUpperCase()}
                </span>

                <span style={{ fontSize: '11px', color: '#cbd5e0', fontWeight: 600 }}>
                  Claimed: <strong style={{ color: '#ffffff' }}>{selectedMessage.claimed_source || 'Unknown'}</strong>
                </span>

                <span style={{ fontSize: '10px', color: '#718096' }}>
                  ({selectedMessage.sender_verification || 'UNVERIFIED'})
                </span>
              </div>

              <div
                style={{
                  fontSize: '11px',
                  color: '#a0aec0',
                  lineHeight: 1.35,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                &ldquo;{selectedMessage.content}&rdquo;
              </div>
            </div>
          )}

          {/* Conversation Area */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            {messages.map((m) => {
              const isAssistant = m.sender === 'assistant';
              return (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isAssistant ? 'flex-start' : 'flex-end',
                    gap: '4px',
                    maxWidth: '100%',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '88%',
                      padding: '12px 14px',
                      borderRadius: isAssistant ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                      backgroundColor: isAssistant ? 'rgba(22, 28, 42, 0.85)' : '#e53e3e',
                      color: '#ffffff',
                      fontSize: '12.5px',
                      lineHeight: 1.5,
                      border: isAssistant ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {m.text}

                    {/* Action buttons embedded inside assistant messages */}
                    {isAssistant && m.suggestedActions && m.suggestedActions.length > 0 && (
                      <div
                        style={{
                          marginTop: '10px',
                          paddingTop: '8px',
                          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '6px',
                        }}
                      >
                        {m.suggestedActions.map((action, aidx) => (
                          <button
                            key={aidx}
                            onClick={() => handleActionClick(action, m)}
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.06)',
                              color: '#cbd5e0',
                              border: '1px solid rgba(255, 255, 255, 0.12)',
                              borderRadius: '6px',
                              padding: '4px 8px',
                              fontSize: '11px',
                              fontWeight: 500,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              transition: 'all 0.15s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(229, 62, 62, 0.2)';
                              e.currentTarget.style.color = '#ffffff';
                              e.currentTarget.style.borderColor = 'rgba(229, 62, 62, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                              e.currentTarget.style.color = '#cbd5e0';
                              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                            }}
                          >
                            {action.includes('Report') ? <FileText style={{ width: '11px', height: '11px' }} /> : null}
                            {action}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <span style={{ fontSize: '9px', color: '#4a5568', padding: '0 4px', fontFamily: 'var(--font-mono)' }}>
                    {m.timestamp}
                  </span>
                </div>
              );
            })}

            {loading && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  padding: '10px 14px',
                  borderRadius: '4px 14px 14px 14px',
                  backgroundColor: 'rgba(22, 28, 42, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#a0aec0',
                  fontSize: '12px',
                }}
              >
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    border: '2px solid rgba(229, 62, 62, 0.3)',
                    borderTopColor: '#e53e3e',
                    animation: 'spin 0.8s linear infinite',
                  }}
                />
                Analyzing security telemetry...
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts Carousel / Pills */}
          <div
            style={{
              padding: '8px 16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              backgroundColor: 'rgba(12, 15, 23, 0.7)',
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
            }}
          >
            {[
              ...(selectedMessage
                ? [
                    'Is this message safe?',
                    'Why was this marked high risk?',
                    'Where is this message actually coming from?',
                    'Show me the evidence',
                    'Give me a report for this message',
                    'What should I do next?',
                  ]
                : [
                    'Show my recent high-risk messages',
                    'Show quarantined messages',
                    'Show important messages',
                    'Explain active protection tiers',
                  ]),
            ].map((prompt, pidx) => (
              <button
                key={pidx}
                onClick={() => handleSendMessage(prompt)}
                disabled={loading}
                style={{
                  background: 'none',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  color: '#a0aec0',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.color = '#a0aec0';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{
              padding: '12px 16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              backgroundColor: 'rgba(15, 20, 31, 0.95)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask about a message, report, threat or verification..."
              disabled={loading}
              style={{
                flex: 1,
                backgroundColor: 'rgba(26, 32, 44, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '9px 12px',
                color: '#ffffff',
                fontSize: '12.5px',
                outline: 'none',
                transition: 'border-color 0.15s ease',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#e53e3e')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
            />

            <button
              type="submit"
              disabled={!inputQuery.trim() || loading}
              aria-label="Send message"
              style={{
                backgroundColor: inputQuery.trim() && !loading ? '#e53e3e' : 'rgba(255, 255, 255, 0.08)',
                color: inputQuery.trim() && !loading ? '#ffffff' : '#718096',
                border: 'none',
                borderRadius: '8px',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: inputQuery.trim() && !loading ? 'pointer' : 'not-allowed',
                transition: 'background-color 0.15s ease',
              }}
            >
              <Send style={{ width: '15px', height: '15px' }} />
            </button>
          </form>

          {/* Footer Zero-Credentials Guarantee */}
          <div
            style={{
              padding: '6px 16px',
              backgroundColor: '#0a0d14',
              borderTop: '1px solid rgba(255, 255, 255, 0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '10px',
              color: '#4a5568',
              fontFamily: 'var(--font-mono)',
            }}
          >
            <span>ZERO-CREDENTIAL POLICY</span>
            <span>NO PASSWORDS / NO PINS STORED</span>
          </div>
        </aside>
      )}
    </>
  );
};
