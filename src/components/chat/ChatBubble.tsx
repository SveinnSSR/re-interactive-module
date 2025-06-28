// src/components/chat/ChatBubble.tsx
"use client";

import React, { useState, useEffect, ReactElement, useRef } from 'react';
import { ChevronUp } from 'lucide-react';
import Image from 'next/image';

// Define interfaces for better type safety
interface Message {
  type: 'user' | 'bot';
  content: string;
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

// Add this right after your interfaces
const formatMessageContent = (content: string): ReactElement | string => {
    // Split content into paragraphs and handle URLs
    const urlRegex = /https:\/\/www\.google\.com\/maps\/[^"\s]+/g;
    const paragraphs = content.split('\n\n').filter(Boolean);

    // If no paragraphs and no urls, return as is
    if (paragraphs.length <= 1 && !content.includes('https://www.google.com/maps/')) {
        return content;
    }

    // Process paragraphs with URLs
    const processedParagraphs = paragraphs.map((paragraph, index) => {
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
                                className="text-blue-500 hover:text-blue-700 underline"
                            >
                                View location on Google Maps 📍
                            </a>
                        )}
                    </React.Fragment>
                ))}
            </p>
        );
    });

    return <>{processedParagraphs}</>;
};

const ChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [context, setContext] = useState<ChatContext>({
    lastTopic: null,
    flightTime: null,
    flightDestination: null,
    lastServiceType: null,
    isGroupBooking: false,
    groupDetails: null,
    lastQuery: null
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Load session and context from localStorage
  useEffect(() => {
    const storedSessionId = localStorage.getItem('chatSessionId');
    const storedContext = localStorage.getItem('chatContext');
    
    if (storedSessionId) {
      console.log('Restored session:', storedSessionId);
      setSessionId(storedSessionId);
    }
    
    if (storedContext) {
      try {
        const parsedContext = JSON.parse(storedContext);
        console.log('Restored context:', parsedContext);
        setContext(parsedContext);
      } catch (e) {
        console.error('Error parsing stored context:', e);
      }
    }

    if (isOpen && messages.length === 0) {
      setMessages([
        {
          type: 'bot',
          content: "Hello! I'm your AI assistant at Reykjavík Excursions. I can help you with Flybus airport transfers, schedules, and bookings. What would you like to know? 😊"
        }
      ]);
    }
  }, [isOpen, messages.length]);

  // Update handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const currentInput = input.trim();
    const currentSessionId = sessionId;

    console.log('Making request with:', {
      sessionId: currentSessionId,
      context: context,
      input: currentInput
    });

    setMessages(prev => [...prev, { type: 'user', content: currentInput }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
        },
        body: JSON.stringify({ 
          message: currentInput,
          sessionId: currentSessionId
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ChatResponse = await response.json();
      
      // Store new sessionId and context
      if (data.sessionId && (!currentSessionId || currentSessionId !== data.sessionId)) {
        console.log('Setting new session ID:', data.sessionId);
        setSessionId(data.sessionId);
        localStorage.setItem('chatSessionId', data.sessionId);
      }

      if (data.context) {
        console.log('Updating context:', data.context);
        setContext(data.context);
        localStorage.setItem('chatContext', JSON.stringify(data.context));
      }

      setMessages(prev => [...prev, { type: 'bot', content: data.message }]);
    } catch (error) {
      console.error('Chat request failed:', error);
      
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment." 
      }]);

      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          sessionId: currentSessionId,
          context: context
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#4AA19E]/90 hover:bg-[#4AA19E] text-white rounded-full px-6 py-3 shadow-lg transition-all duration-200 flex items-center gap-2 backdrop-blur-md"
          style={{
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2), 0 0 15px rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="relative h-8 w-8">
            <Image 
              src="/images/logo.png" 
              alt="RE Logo" 
              fill
              className="rounded-full bg-white p-1 object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Chat with us</span>
            <span className="text-xs opacity-80">Online</span>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="bg-white rounded-3xl shadow-2xl w-[400px] flex flex-col overflow-hidden"
          style={{
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2), 0 0 15px rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Header */}
          <div 
            className="text-white p-4 flex flex-col items-center gap-2"
            style={{
              background: 'rgba(74, 161, 158, 0.95)',
              backdropFilter: 'blur(8px)'
            }}
          >
            <div className="relative h-14 w-14 mb-1">
              <Image 
                src="/images/logo.png" 
                alt="RE Logo" 
                fill
                className="rounded-full bg-white p-1 object-contain"
              />
            </div>
            <div className="text-center">
              <h3 className="font-medium">Reykjavík Excursions</h3>
              <p className="text-xs opacity-80">Online</p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 hover:bg-[#4AA19E] p-2 rounded-full transition-colors"
            >
              <ChevronUp size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[400px] max-h-[400px] bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'bot' && (
                  <div className="relative h-8 w-8 rounded-full bg-[#4AA19E] flex items-center justify-center text-white mr-2 flex-shrink-0">
                    <Image 
                      src="/images/logo.png" 
                      alt="RE Logo" 
                      fill
                      className="rounded-full bg-white p-1 object-contain"
                    />
                  </div>
                )}
                <div
                  className={`max-w-[70%] px-4 py-3 rounded-2xl whitespace-pre-line ${
                    message.type === 'user'
                      ? 'bg-[#4AA19E] text-white ml-4'
                      : 'bg-white text-gray-800'
                  }`}
                  style={{
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    border: message.type === 'user' ? 
                      '1px solid rgba(255, 255, 255, 0.1)' : 
                      '1px solid rgba(0, 0, 0, 0.05)'
                  }}
                >
                  {message.type === 'bot' ? formatMessageContent(message.content) : message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-4 py-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} /> {/* Add this invisible div at the bottom */}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4AA19E]"
                style={{
                  border: '1px solid #ddd',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                }}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#4AA19E] hover:bg-[#3a8f8c] text-white rounded-full px-6 h-10 flex items-center justify-center disabled:opacity-50 transition-colors text-sm font-medium"
                style={{
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBubble;
