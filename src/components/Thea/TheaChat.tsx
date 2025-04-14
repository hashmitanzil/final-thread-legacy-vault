
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, MinusCircle, Bot, Sparkles, HelpCircle, MessagesSquare } from 'lucide-react';
import { useThea } from '@/contexts/TheaContext';
import { toast } from '@/hooks/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const TheaChat: React.FC = () => {
  const { 
    messages, 
    sendMessage, 
    isChatOpen, 
    toggleChat,
    minimizeThea,
    isSpeaking
  } = useThea();
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      try {
        sendMessage(input.trim());
        setInput('');
      } catch (error) {
        console.error('Error sending message:', error);
        toast({
          title: "Message Error",
          description: "There was an issue sending your message. Please try again.",
          variant: "destructive"
        });
      }
    }
  };
  
  // Suggested questions
  const suggestedQuestions = [
    "What is Final Thread?",
    "How do I create a legacy message?",
    "How does proof of life work?",
    "How do I add trusted contacts?",
    "Is my data secure?"
  ];
  
  // Handle suggested question click
  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };
  
  // Toggle expanded chat view
  const toggleExpandChat = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  if (!isChatOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className={`fixed ${isExpanded ? 'bottom-4 right-4 top-4 w-[400px]' : 'bottom-20 right-4 sm:right-8 w-[90vw] sm:w-80 md:w-96 max-h-[70vh]'} bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden z-[999] border border-gray-200 dark:border-gray-700`}
        ref={chatContainerRef}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 border border-white/20">
              <AvatarImage src="https://i.imgur.com/WLtEBnI.png" alt="Thea" />
              <AvatarFallback className="bg-purple-600 text-white">
                <Sparkles className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-sm">Thea - Legacy Guide</h3>
              <div className="flex items-center gap-1 text-xs text-white/70">
                {isSpeaking ? (
                  <>
                    <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse mr-1"></span>
                    Typing...
                  </>
                ) : (
                  <>
                    <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                    Online
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleExpandChat}
              className="hover:bg-white/20 rounded-full p-1.5 transition-colors"
              aria-label="Expand/Collapse"
            >
              <HelpCircle className="h-4 w-4" />
            </button>
            <button 
              onClick={minimizeThea}
              className="hover:bg-white/20 rounded-full p-1.5 transition-colors"
              aria-label="Minimize"
            >
              <MinusCircle className="h-4 w-4" />
            </button>
            <button 
              onClick={toggleChat}
              className="hover:bg-white/20 rounded-full p-1.5 transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Messages */}
        <div className={`p-3 ${isExpanded ? 'h-[calc(100vh-12rem)]' : 'h-80'} overflow-y-auto bg-gray-50 dark:bg-gray-900 custom-scrollbar`}>
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-500">
              <Sparkles className="w-12 h-12 text-purple-500 mb-4" />
              <p className="text-sm">Welcome to Final Thread's virtual assistant!</p>
              <p className="text-xs mt-2">Ask me anything about your digital legacy.</p>
            </div>
          )}
          
          {messages.map((message, index) => (
            <div 
              key={message.id} 
              className={`mb-3 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'thea' && index > 0 && messages[index - 1].sender !== 'thea' && (
                <div className="h-8 w-8 mr-2 flex-shrink-0">
                  <Avatar>
                    <AvatarImage src="https://i.imgur.com/WLtEBnI.png" alt="Thea" />
                    <AvatarFallback className="bg-purple-600 text-white">
                      <Sparkles className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
              {message.sender === 'thea' && (index === 0 || messages[index - 1].sender === 'thea') && (
                <div className="h-8 w-8 mr-2 flex-shrink-0"></div>
              )}
              
              <div 
                className={`px-3 py-2 rounded-lg max-w-[85%] ${
                  message.sender === 'user' 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none shadow-md' 
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-bl-none shadow-sm border border-gray-100 dark:border-gray-700'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                <div 
                  className={`text-xs mt-1 ${
                    message.sender === 'user' 
                      ? 'text-purple-100' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {isSpeaking && (
            <div className="flex justify-start mb-3">
              <div className="h-8 w-8 mr-2 flex-shrink-0">
                <Avatar>
                  <AvatarImage src="https://i.imgur.com/WLtEBnI.png" alt="Thea" />
                  <AvatarFallback className="bg-purple-600 text-white">
                    <Sparkles className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="px-3 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-bl-none shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Suggested questions */}
        {messages.length === 0 && (
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <motion.button
                  key={index}
                  className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-purple-100 dark:hover:bg-purple-800 rounded-full px-3 py-1 text-gray-700 dark:text-gray-200 whitespace-nowrap transition-colors"
                  onClick={() => handleSuggestedQuestion(question)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {question}
                </motion.button>
              ))}
            </div>
          </div>
        )}
        
        {/* Input */}
        <form onSubmit={handleSubmit} className="border-t border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 py-2 px-3 bg-gray-100 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
              disabled={isSpeaking}
            />
            <button 
              type="submit"
              className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md hover:from-purple-700 hover:to-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!input.trim() || isSpeaking}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
};

export default TheaChat;
