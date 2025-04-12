
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, BotIcon, User } from 'lucide-react';
import { toast } from 'sonner';

const ChatbotComponent = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi there! I\'m VocabAssist, your vocabulary learning assistant. How can I help you today?',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputMessage.trim() === '') return;

    // Add user message
    const userMessage = {
      role: 'user',
      content: inputMessage,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate API call delay
    setTimeout(() => {
      const botResponses = getBotResponse(inputMessage);
      setMessages((prev) => [...prev, botResponses]);
      setIsTyping(false);
    }, 1000);
  };

  const getBotResponse = (message) => {
    const lowerCaseMessage = message.toLowerCase();
    
    // Simple response logic based on keywords
    if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
      return { role: 'assistant', content: 'Hello! How can I help you with vocabulary today?' };
    } 
    else if (lowerCaseMessage.includes('synonym') || lowerCaseMessage.includes('similar')) {
      return { role: 'assistant', content: 'To find synonyms for a word, you can use the "Find Word" feature and look at related words section. Would you like me to guide you there?' };
    }
    else if (lowerCaseMessage.includes('save') || lowerCaseMessage.includes('bookmark')) {
      return { role: 'assistant', content: 'To save words to your collection, use the bookmark icon when viewing a word. You can access all your saved words in the "Saved Words" section.' };
    }
    else if (lowerCaseMessage.includes('learn') || lowerCaseMessage.includes('tips') || lowerCaseMessage.includes('improve')) {
      return { role: 'assistant', content: 'Great way to improve your vocabulary: 1) Read regularly 2) Use new words in sentences 3) Review your saved words daily 4) Try to learn words in context rather than in isolation.' };
    }
    else if (lowerCaseMessage.includes('thank')) {
      return { role: 'assistant', content: "You're welcome! If you have any more questions, feel free to ask me anytime." };
    }
    else if (lowerCaseMessage.includes('logout') || lowerCaseMessage.includes('sign out')) {
      return { role: 'assistant', content: "To logout, click on the logout button in the top-right corner of the page." };
    }
    else if (lowerCaseMessage.includes('word') && (lowerCaseMessage.includes('meaning') || lowerCaseMessage.includes('definition'))) {
      return { role: 'assistant', content: "To find the meaning of a word, use the 'Find Word' feature from the navigation menu. Enter the word you want to look up and you'll see its definition, examples, and more." };
    }
    else {
      return { role: 'assistant', content: "I'm a demo assistant to help with vocabulary questions. Try asking me about how to save words, find meanings, or get vocabulary learning tips!" };
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {/* Chat button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 md:bottom-6 right-6 bg-primary text-white rounded-full p-3 shadow-lg hover:bg-primary/90 transition-all z-50"
        aria-label="Open chat"
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-20 md:bottom-6 right-6 w-[90%] sm:w-80 md:w-96 h-[500px] max-h-[80vh] bg-white rounded-lg shadow-xl flex flex-col z-50 border border-border">
          {/* Chat header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-primary/10 rounded-t-lg">
            <div className="flex items-center">
              <BotIcon size={20} className="text-primary mr-2" />
              <h3 className="font-semibold">VocabAssist</h3>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Chat messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary text-white rounded-tr-none'
                      : 'bg-white border border-border rounded-tl-none'
                  }`}
                >
                  <div className="flex items-center mb-1">
                    {message.role === 'assistant' ? (
                      <BotIcon size={14} className="mr-1 text-primary" />
                    ) : (
                      <User size={14} className="mr-1" />
                    )}
                    <span className="text-xs font-medium">
                      {message.role === 'user' ? 'You' : 'VocabAssist'}
                    </span>
                  </div>
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="bg-white border border-border p-3 rounded-lg rounded-tl-none max-w-[80%]">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat input */}
          <div className="p-3 border-t border-border">
            <div className="flex">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 border border-border rounded-l-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                onClick={handleSend}
                disabled={inputMessage.trim() === ''}
                className="bg-primary text-white rounded-r-md px-4 py-2 hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1 text-center">
              This is a demo assistant. Try asking about vocabulary features!
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotComponent;
