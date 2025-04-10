
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'thea';
  timestamp: Date;
};

type ScrollTrigger = {
  sectionId: string;
  message: string;
  triggered: boolean;
};

interface TheaContextType {
  isIntroShown: boolean;
  isMinimized: boolean;
  isChatOpen: boolean;
  messages: Message[];
  currentSection: string | null;
  scrollTriggers: ScrollTrigger[];
  sendMessage: (text: string) => void;
  toggleChat: () => void;
  minimizeThea: () => void;
  maximizeThea: () => void;
  completeIntro: () => void;
  resetIntro: () => void;
}

const defaultContext: TheaContextType = {
  isIntroShown: false,
  isMinimized: true,
  isChatOpen: false,
  messages: [],
  currentSection: null,
  scrollTriggers: [],
  sendMessage: () => {},
  toggleChat: () => {},
  minimizeThea: () => {},
  maximizeThea: () => {},
  completeIntro: () => {},
  resetIntro: () => {},
};

const TheaContext = createContext<TheaContextType>(defaultContext);

export const useThea = () => useContext(TheaContext);

export const TheaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isIntroShown, setIsIntroShown] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const location = useLocation();
  
  // Define scroll triggers for various sections
  const [scrollTriggers, setScrollTriggers] = useState<ScrollTrigger[]>([
    {
      sectionId: 'features-section',
      message: "These are the key features that help preserve your digital legacy.",
      triggered: false
    },
    {
      sectionId: 'how-it-works',
      message: "This is how Final Thread works to secure your legacy.",
      triggered: false
    },
    {
      sectionId: 'testimonials',
      message: "Here's what our users say about their experience.",
      triggered: false
    },
    {
      sectionId: 'cta-section',
      message: "Ready to secure your legacy? Let's get started!",
      triggered: false
    }
  ]);

  // Reset triggers when route changes
  useEffect(() => {
    setScrollTriggers(prev => 
      prev.map(trigger => ({ ...trigger, triggered: false }))
    );
    
    // If we're on the home page and intro hasn't been shown yet, show it
    if (location.pathname === '/' && !sessionStorage.getItem('thea-intro-shown')) {
      setIsIntroShown(true);
      setIsMinimized(false);
      // Add initial welcome message
      setMessages([
        {
          id: Date.now().toString(),
          text: "Hi, I'm Thea, your legacy guide. Let me walk you through your experience.",
          sender: 'thea',
          timestamp: new Date()
        }
      ]);
    }
  }, [location.pathname]);

  // Setup intersection observer for scroll triggers
  useEffect(() => {
    if (location.pathname === '/') {
      const observerCallback: IntersectionObserverCallback = (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            setCurrentSection(sectionId);
            
            // Find if we have a message for this section
            const matchingTrigger = scrollTriggers.find(
              trigger => trigger.sectionId === sectionId && !trigger.triggered
            );
            
            if (matchingTrigger) {
              // Send the message from Thea
              setMessages(prev => [
                ...prev,
                {
                  id: Date.now().toString(),
                  text: matchingTrigger.message,
                  sender: 'thea',
                  timestamp: new Date()
                }
              ]);
              
              // Mark this trigger as used
              setScrollTriggers(prev => 
                prev.map(trigger => 
                  trigger.sectionId === sectionId 
                    ? { ...trigger, triggered: true } 
                    : trigger
                )
              );
            }
          }
        });
      };

      const observer = new IntersectionObserver(observerCallback, {
        threshold: 0.3,
        rootMargin: '0px'
      });

      // Observe all sections that have IDs matching our triggers
      scrollTriggers.forEach(trigger => {
        const element = document.getElementById(trigger.sectionId);
        if (element) observer.observe(element);
      });

      return () => observer.disconnect();
    }
  }, [location.pathname, scrollTriggers]);

  const sendMessage = (text: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate Thea's response (in a real implementation, you would call an API here)
    setTimeout(() => {
      let response: string;
      
      // Simple response logic based on keywords
      if (text.toLowerCase().includes('hello') || text.toLowerCase().includes('hi')) {
        response = "Hello! How can I help you with your digital legacy today?";
      } else if (text.toLowerCase().includes('feature') || text.toLowerCase().includes('what can you do')) {
        response = "Final Thread offers secure messages, digital asset vault, trusted contacts, and more. What would you like to know more about?";
      } else if (text.toLowerCase().includes('help')) {
        response = "I'm here to help! You can ask me about features, how to set up your legacy, or navigate to specific sections.";
      } else if (text.toLowerCase().includes('dashboard')) {
        response = "The dashboard gives you an overview of your legacy setup. Would you like me to help you navigate there?";
      } else if (text.toLowerCase().includes('message') || text.toLowerCase().includes('letter')) {
        response = "Legacy messages let you create heartfelt communications for your loved ones. Would you like to create one?";
      } else if (text.toLowerCase().includes('contact') || text.toLowerCase().includes('trusted')) {
        response = "Trusted contacts are people who will receive your legacy. You can add them in the Trusted Contacts section.";
      } else {
        response = "I'm still learning! If you have specific questions about Final Thread, I'll do my best to help.";
      }
      
      const theaMessage: Message = {
        id: Date.now().toString(),
        text: response,
        sender: 'thea',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, theaMessage]);
    }, 1000);
  };

  const toggleChat = () => {
    setIsChatOpen(prev => !prev);
  };

  const minimizeThea = () => {
    setIsMinimized(true);
    setIsChatOpen(false);
  };

  const maximizeThea = () => {
    setIsMinimized(false);
  };

  const completeIntro = () => {
    setIsIntroShown(false);
    setIsMinimized(true);
    sessionStorage.setItem('thea-intro-shown', 'true');
  };

  const resetIntro = () => {
    sessionStorage.removeItem('thea-intro-shown');
    setIsIntroShown(true);
    setIsMinimized(false);
  };

  return (
    <TheaContext.Provider
      value={{
        isIntroShown,
        isMinimized,
        isChatOpen,
        messages,
        currentSection,
        scrollTriggers,
        sendMessage,
        toggleChat,
        minimizeThea,
        maximizeThea,
        completeIntro,
        resetIntro
      }}
    >
      {children}
    </TheaContext.Provider>
  );
};
