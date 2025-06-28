// src/components/chat/ChatWidget.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback, Component } from 'react';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';

// Constants for session management
const SESSION_ID_KEY = 'reChatSessionId';

// Configuration for response effects
const CHUNK_REVEAL_DELAY = 250;
const FADE_IN_DURATION = 300;
const MOBILE_BREAKPOINT = 768;

// Message interfaces
interface Message {
  type: 'user' | 'bot';
  content: string;
  id?: string;
  timestamp?: number;
}

interface ChatContext {
  lastTopic: string | null;
  flightTime: string | null;
  flightDestination: string | null;
  lastServiceType: string | null;
  isGroupBooking: boolean;
  groupDetails: {
    adults: number;
    youths: number;
    children: number;
  } | null;
  lastQuery: string | null;
}

interface ChatResponse {
  message: string;
  sessionId: string;
  language: string;
  context: ChatContext;
}

interface TypingMessage {
  text: string;
  visibleChars: number;
  currentChunk?: number;
  totalChunks?: number;
  isComplete: boolean;
  fadeIn: boolean;
}

interface MessageFeedback {
  isPositive: boolean;
  submitted: boolean;
}

// Error boundary for graceful error handling
class ErrorBoundary extends Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("Chat error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '8px',
          backgroundColor: '#f8f8f8',
          border: '1px solid #ddd',
          borderRadius: '4px',
          margin: '8px',
          fontSize: '12px',
          textAlign: 'center'
        }}>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '4px 8px',
              backgroundColor: '#4AA19E',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reload Chat
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Message formatter component
const MessageFormatter: React.FC<{ message: string }> = ({ message }) => {
  // Simple URL regex for Google Maps links
  const urlRegex = /https:\/\/www\.google\.com\/maps\/[^"\s]+/g;
  const paragraphs = message.split('\n\n').filter(Boolean);

  if (paragraphs.length <= 1 && !message.includes('https://www.google.com/maps/')) {
    return <>{message}</>;
  }

  return (
    <>
      {paragraphs.map((paragraph, index) => {
        const parts = paragraph.split(urlRegex);
        const matches = paragraph.match(urlRegex) || [];

        if (parts.length <= 1) {
          return <p key={index} className="mb-4">{paragraph}</p>;
        }

        return (
          <p key={index} className="mb-4">
            {parts.map((part, partIndex) => (
              <React.Fragment key={partIndex}>
                {part}
                {matches[partIndex] && (
                  <a 
                    href={matches[partIndex]}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[#4AA19E] hover:text-[#3a8f8c] underline"
                  >
                    View location on Google Maps 📍
                  </a>
                )}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
};

const ChatWidget = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMinimized, setIsMinimized] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [typingMessages, setTypingMessages] = useState<{[key: string]: TypingMessage}>({});
  const [messageFeedback, setMessageFeedback] = useState<{[key: string]: MessageFeedback}>({});
  const isMobile = windowWidth <= MOBILE_BREAKPOINT;

  // Session management
  const generateSessionId = useCallback(() => {
    return `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  }, []);
  
  const initializeSession = useCallback(() => {
    let existingSessionId = localStorage.getItem(SESSION_ID_KEY);
    
    if (!existingSessionId) {
      existingSessionId = generateSessionId();
      localStorage.setItem(SESSION_ID_KEY, existingSessionId);
    }
    
    setSessionId(existingSessionId);
  }, [generateSessionId]);

  // Initialize session on mount
  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  // Window resize listener
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load saved context
  useEffect(() => {
    const storedContext = localStorage.getItem('reChatContext');
    if (storedContext) {
      try {
        // Parse but don't use - just validate it exists
        JSON.parse(storedContext);
      } catch (e) {
        console.error('Error parsing stored context:', e);
      }
    }
  }, []);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const chatContainer = messagesEndRef.current.parentElement;
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingMessages]);

  // Chunked reveal effect (premium feel)
  const renderMessage = useCallback((messageId: string, fullText: string) => {
    if (!fullText) return null;
    
    const safeText = typeof fullText === 'string' ? fullText : String(fullText || '');
    
    if (isMobile) {
      return startSimpleRender(messageId, safeText);
    } else {
      return startChunkedReveal(messageId, safeText);
    }
  }, [isMobile]);

  const startSimpleRender = (messageId: string, fullText: string) => {
    try {
      setTypingMessages(prev => ({
        ...prev,
        [messageId]: { 
          text: fullText,
          visibleChars: fullText.length,
          isComplete: true,
          fadeIn: true
        }
      }));
      
      setTimeout(() => scrollToBottom(), 50);
      return messageId;
    } catch (error) {
      console.error('Error in simple render:', error);
      return null;
    }
  };

  const startChunkedReveal = (messageId: string, fullText: string) => {
    try {
      let numberOfChunks = 1;
      
      if (fullText.length < 100) {
        numberOfChunks = 1;
      } else if (fullText.length < 300) {
        numberOfChunks = 2;
      } else {
        numberOfChunks = 3;
      }
      
      const chunkSize = Math.ceil(fullText.length / numberOfChunks);
      
      setTypingMessages(prev => ({
        ...prev,
        [messageId]: { 
          text: fullText,
          visibleChars: 0,
          currentChunk: 0,
          totalChunks: numberOfChunks,
          isComplete: false,
          fadeIn: true
        }
      }));
      
      setTimeout(() => scrollToBottom(), 50);
      
      let currentChunk = 0;
      
      const revealNextChunk = () => {
        if (currentChunk < numberOfChunks) {
          const charsToReveal = Math.min(
            (currentChunk + 1) * chunkSize,
            fullText.length
          );
          
          setTypingMessages(prev => ({
            ...prev,
            [messageId]: {
              ...prev[messageId],
              visibleChars: charsToReveal,
              currentChunk: currentChunk + 1,
              isComplete: charsToReveal === fullText.length
            }
          }));
          
          currentChunk++;
          
          setTimeout(() => scrollToBottom(), 50);
          
          if (currentChunk < numberOfChunks) {
            setTimeout(revealNextChunk, CHUNK_REVEAL_DELAY);
          }
        }
      };
      
      setTimeout(revealNextChunk, 100);
      return messageId;
    } catch (error) {
      console.error('Error in chunked reveal:', error);
      return null;
    }
  };

  // Welcome message
  useEffect(() => {
    if (!isMinimized && messages.length === 0) {
      const welcomeMessage = "Hello! I'm your AI assistant at Reykjavík Excursions. I can help you with Flybus airport transfers, schedules, and bookings. What would you like to know? 😊";
      const welcomeId = 'welcome-' + Date.now();
      
      setMessages([{
        type: 'bot',
        content: welcomeMessage,
        id: welcomeId
      }]);
      
      renderMessage(welcomeId, welcomeMessage);
    }
  }, [isMinimized, messages.length, renderMessage]);

  const shouldShowFeedback = (message: Message) => {
    if (!message.content) return false;
    
    // Skip welcome messages
    if (message.content.includes("I'm your AI assistant")) return false;
    
    // Skip error messages
    if (message.content.includes("I'm sorry, I'm having trouble")) return false;
    
    // Skip very short responses
    if (message.content.length < 50) return false;
    
    return true;
  };

  const handleMessageFeedback = async (messageId: string, isPositive: boolean) => {
    if (messageFeedback[messageId]) return;
    
    setMessageFeedback(prev => ({
      ...prev,
      [messageId]: { isPositive, submitted: true }
    }));
    
    // Here you would send feedback to your backend
    console.log('Feedback submitted:', { messageId, isPositive });
  };

  const TypingIndicator = () => (
    <div className="flex justify-start mb-4 items-start gap-2">
      <div className="relative h-8 w-8">
        <Image 
          src="/images/logo.png" 
          alt="RE Logo" 
          fill
          className="rounded-full bg-white p-1 object-contain shadow-sm"
        />
      </div>
      <div className="px-4 py-3 rounded-2xl bg-gray-100 flex gap-1 items-center shadow-sm border border-gray-200/50">
        <span className="h-2 w-2 bg-[#4AA19E] rounded-full opacity-60 animate-pulse" />
        <span className="h-2 w-2 bg-[#4AA19E] rounded-full opacity-60 animate-pulse delay-150" />
        <span className="h-2 w-2 bg-[#4AA19E] rounded-full opacity-60 animate-pulse delay-300" />
      </div>
    </div>
  );

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    const messageText = inputValue.trim();
    setInputValue('');

    const userMsgId = 'user-' + Date.now();
    setMessages(prev => [...prev, {
      type: 'user',
      content: messageText,
      id: userMsgId,
      timestamp: Date.now()
    }]);
    
    setIsTyping(true);

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
        },
        body: JSON.stringify({ 
          message: messageText,
          sessionId: sessionId
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ChatResponse = await response.json();
      
      if (data.sessionId && data.sessionId !== sessionId) {
        setSessionId(data.sessionId);
        localStorage.setItem(SESSION_ID_KEY, data.sessionId);
      }

      if (data.context) {
        localStorage.setItem('reChatContext', JSON.stringify(data.context));
      }

      const botMsgId = 'bot-' + Date.now();
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: data.message,
        id: botMsgId,
        timestamp: Date.now()
      }]);
      
      renderMessage(botMsgId, data.message);
    } catch (error) {
      console.error('Chat request failed:', error);
      
      const errorMsgId = 'error-' + Date.now();
      const errorMessage = "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
      
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: errorMessage,
        id: errorMsgId
      }]);
      
      renderMessage(errorMsgId, errorMessage);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <ErrorBoundary>
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: isMinimized ? (windowWidth <= 768 ? '60px' : '70px') : '400px',
        height: isMinimized ? (windowWidth <= 768 ? '60px' : '70px') : 'auto',
        maxHeight: isMinimized ? 'auto' : 'calc(100vh - 40px)',
        backgroundColor: isMinimized ? 'rgba(74, 161, 158, 0.95)' : 'rgba(74, 161, 158, 1)',
        borderRadius: isMinimized ? '50%' : '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2), 0 0 15px rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
        transformOrigin: 'bottom right',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        maxWidth: isMinimized ? 'auto' : '90vw'
      }}>
        {/* Header - Click anywhere to toggle */}
        <div 
          onClick={() => setIsMinimized(!isMinimized)}
          style={{
            padding: isMinimized ? '0' : '20px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isMinimized ? 'center' : 'flex-start',
            cursor: 'pointer',
            gap: '12px',
            backgroundColor: 'rgba(74, 161, 158, 1)',
            width: '100%',
            height: isMinimized ? '100%' : 'auto',
            boxSizing: 'border-box',
            flexDirection: isMinimized ? 'row' : 'column',
            boxShadow: isMinimized ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div style={{
            position: 'relative',
            height: isMinimized ? (windowWidth <= 768 ? '40px' : '50px') : '60px',
            width: isMinimized ? (windowWidth <= 768 ? '40px' : '50px') : '60px',
            borderRadius: '50%',
            backgroundColor: 'white',
            padding: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            <Image 
              src="/images/logo.png" 
              alt="RE Logo" 
              fill
              className="object-contain p-1"
            />
          </div>
          
          {!isMinimized && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span style={{ 
                color: 'white',
                fontSize: '16px',
                fontWeight: '500',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
              }}>
                Reykjavík Excursions
              </span>
              <span style={{ 
                color: '#e0e0e0',
                fontSize: '14px',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
              }}>
                AI Assistant
              </span>
            </div>
          )}
          
          {!isMinimized && (
            <ChevronDown 
              size={20}
              style={{ 
                color: 'white',
                position: 'absolute',
                right: '16px',
                top: '16px'
              }}
            />
          )}
        </div>

        {/* Chat area */}
        {!isMinimized && (
          <div style={{
            height: '400px',
            backgroundColor: 'white',
            overflowY: 'auto',
            padding: '16px'
          }}>
            {messages.map((msg) => (
              <div 
                key={msg.id || Math.random()} 
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.type === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '16px'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start',
                  width: '100%',
                  gap: '8px'
                }}>
                  {msg.type === 'bot' && (
                    <div className="relative h-8 w-8 rounded-full bg-[#4AA19E] flex items-center justify-center flex-shrink-0">
                      <Image 
                        src="/images/logo.png" 
                        alt="RE Logo" 
                        fill
                        className="rounded-full bg-white p-1 object-contain"
                      />
                    </div>
                  )}
                  
                  <div
                    style={{
                      maxWidth: '70%',
                      padding: '12px 16px',
                      borderRadius: '16px',
                      backgroundColor: msg.type === 'user' ? '#4AA19E' : '#f0f0f0',
                      color: msg.type === 'user' ? 'white' : '#333333',
                      fontSize: '14px',
                      lineHeight: '1.5',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      border: msg.type === 'user' ? 
                        '1px solid rgba(255, 255, 255, 0.1)' : 
                        '1px solid rgba(0, 0, 0, 0.05)',
                      position: 'relative',
                      overflowWrap: 'break-word',
                      wordWrap: 'break-word',
                      wordBreak: 'break-word'
                    }}
                  >
                    {msg.type === 'bot' ? (
                      typingMessages[msg.id || ''] ? (
                        <div style={{ 
                          position: 'relative',
                          opacity: typingMessages[msg.id || ''].fadeIn ? '0.99' : '1',
                          transition: `opacity ${FADE_IN_DURATION}ms ease-in-out`
                        }}>
                          <div style={{ 
                            visibility: 'hidden', 
                            position: 'absolute', 
                            width: '100%',
                            height: 0,
                            overflow: 'hidden' 
                          }}>
                            <MessageFormatter message={typingMessages[msg.id || ''].text} />
                          </div>
                          
                          <div className={typingMessages[msg.id || ''].fadeIn ? 're-fade-in' : ''}>
                            <MessageFormatter 
                              message={typingMessages[msg.id || ''].text.substring(0, typingMessages[msg.id || ''].visibleChars)} 
                            />
                          </div>
                        </div>
                      ) : (
                        <MessageFormatter message={msg.content} />
                      )
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
                
                {/* Feedback buttons */}
                {msg.type === 'bot' && 
                 msg.id &&
                 typingMessages[msg.id] && 
                 typingMessages[msg.id].isComplete && 
                 shouldShowFeedback(msg) && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: '4px',
                    marginLeft: '38px',
                    gap: '8px'
                  }}>
                    {messageFeedback[msg.id] ? (
                      <div style={{
                        fontSize: '12px',
                        color: '#4AA19E',
                        fontStyle: 'italic',
                        opacity: 0.8,
                        padding: '4px 8px',
                        borderRadius: '12px',
                        backgroundColor: 'rgba(74, 161, 158, 0.08)'
                      }}>
                        Thank you for your feedback!
                      </div>
                    ) : (
                      <>
                        <button 
                          onClick={() => handleMessageFeedback(msg.id || '', true)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#4AA19E',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            transition: 'all 0.2s ease',
                            opacity: 0.8,
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(74, 161, 158, 0.1)';
                            e.currentTarget.style.opacity = '1';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.opacity = '0.8';
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#4AA19E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Helpful
                        </button>
                        
                        <button 
                          onClick={() => handleMessageFeedback(msg.id || '', false)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#4AA19E',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            transition: 'all 0.2s ease',
                            opacity: 0.8,
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(74, 161, 158, 0.1)';
                            e.currentTarget.style.opacity = '1';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.opacity = '0.8';
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M17 2H20C20.5304 2 21.0391 2.21071 21.4142 2.58579C21.7893 2.96086 22 3.46957 22 4V11C22 11.5304 21.7893 12.0391 21.4142 12.4142C21.0391 12.7893 20.5304 13 20 13H17M10 15V19C10 19.7956 10.3161 20.5587 10.8787 21.1213C11.4413 21.6839 12.2044 22 13 22L17 13V2H5.72C5.23964 1.99453 4.77175 2.16359 4.40125 2.47599C4.03075 2.78839 3.78958 3.22309 3.72 3.7L2.34 12.7C2.29651 12.9866 2.31583 13.2793 2.39666 13.5577C2.4775 13.8362 2.61788 14.0937 2.80812 14.3125C2.99836 14.5313 3.23395 14.7061 3.49843 14.8248C3.76291 14.9435 4.05009 15.0033 4.34 15H10Z" stroke="#4AA19E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Not helpful
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}

            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input area */}
        {!isMinimized && (
          <div style={{
            padding: '12px 16px',
            backgroundColor: 'white',
            borderTop: '1px solid #eee',
            display: 'flex',
            gap: '8px'
          }}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isTyping && handleSend()}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: '8px 16px',
                borderRadius: '20px',
                border: '1px solid #ddd',
                outline: 'none',
                fontSize: '14px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
              }}
            />
            <button
              onClick={handleSend}
              disabled={isTyping}
              style={{
                backgroundColor: isTyping ? '#a0a0a0' : '#4AA19E',
                color: 'white',
                border: 'none',
                padding: '8px 20px',
                borderRadius: '20px',
                cursor: isTyping ? 'default' : 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                opacity: isTyping ? 0.7 : 1,
                transition: 'all 0.3s ease'
              }}
            >
              Send
            </button>
          </div>
        )}

        {/* Styles */}
        <style jsx>{`
          @keyframes re-fade-in {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }
          
          .re-fade-in {
            animation: re-fade-in ${FADE_IN_DURATION}ms ease-in-out;
          }
          
          @media (max-width: 768px) {
            input, button {
              font-size: 16px !important;
            }
          }
        `}</style>
      </div>
    </ErrorBoundary>
  );
};

export default ChatWidget;