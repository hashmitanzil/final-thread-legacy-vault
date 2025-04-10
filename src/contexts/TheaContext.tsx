
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
  isSpeaking: boolean;
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
  isSpeaking: false,
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

// Application knowledge base
const appKnowledge = {
  features: [
    {
      id: 'final-messages',
      name: 'Final Messages',
      description: 'Create heartfelt messages that will be delivered to your loved ones after your passing or on specific dates.'
    },
    {
      id: 'digital-asset-vault',
      name: 'Digital Asset Vault',
      description: 'Store important files, photos, videos, and documents in a secure digital vault that your trusted contacts can access.'
    },
    {
      id: 'trusted-contacts',
      name: 'Trusted Contacts',
      description: 'Designate trusted individuals who will be notified and given access to your digital legacy.'
    },
    {
      id: 'proof-of-life',
      name: 'Proof of Life',
      description: 'Simple login requirement every 30 days ensures your messages aren't delivered prematurely.'
    },
    {
      id: 'legacy-video',
      name: 'Legacy Video Messages',
      description: 'Record and schedule personal video messages for specific occasions or as part of your legacy.'
    },
    {
      id: 'smart-triggers',
      name: 'Smart Triggers',
      description: 'Set messages to deliver based on specific dates, events, or after a period of inactivity.'
    },
    {
      id: 'legal-documents',
      name: 'Legal Documents',
      description: 'Securely store important legal documents and set specific access permissions for after your passing.'
    },
    {
      id: 'ai-avatar',
      name: 'AI Avatar',
      description: 'Create a future AI version of yourself that can interact with your loved ones using your voice and personality.',
      comingSoon: true
    }
  ],
  howItWorks: [
    {
      step: 1,
      title: 'Create Your Account',
      description: 'Sign up and set up your secure digital legacy vault with bank-level encryption.'
    },
    {
      step: 2,
      title: 'Add Content & Contacts',
      description: 'Upload files, create messages, and designate trusted contacts who will receive them.'
    },
    {
      step: 3,
      title: 'Set Delivery Conditions',
      description: 'Choose when and how your messages will be delivered based on specific triggers.'
    }
  ],
  faq: [
    {
      question: 'How does the proof of life system work?',
      answer: 'Our proof of life system requires you to log in at least once every 30 days. If you don\'t log in, we\'ll send you reminders. If you still don\'t respond after a period you specify, we\'ll begin the process of delivering your legacy to your trusted contacts.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, all your data is encrypted with bank-level security. We use end-to-end encryption for all stored files and messages.'
    },
    {
      question: 'Can I schedule messages for specific dates?',
      answer: 'Absolutely! You can schedule messages to be delivered on birthdays, anniversaries, or any other significant date in the future.'
    },
    {
      question: 'What happens if I lose my password?',
      answer: 'We have a secure password recovery process that requires verification of your identity. Your data remains safe during this process.'
    }
  ]
};

export const TheaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isIntroShown, setIsIntroShown] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
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
          text: "Hi, I'm Thea, your legacy guide. Let me walk you through your experience with Final Thread.",
          sender: 'thea',
          timestamp: new Date()
        }
      ]);
      simulateSpeaking(5000); // Simulate speaking for 5 seconds
    }
  }, [location.pathname]);

  // Simulate speaking effect
  const simulateSpeaking = (duration: number) => {
    setIsSpeaking(true);
    setTimeout(() => {
      setIsSpeaking(false);
    }, duration);
  };

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
              const newMessage = {
                id: Date.now().toString(),
                text: matchingTrigger.message,
                sender: 'thea' as const,
                timestamp: new Date()
              };
              
              setMessages(prev => [...prev, newMessage]);
              
              // Mark this trigger as used
              setScrollTriggers(prev => 
                prev.map(trigger => 
                  trigger.sectionId === sectionId 
                    ? { ...trigger, triggered: true } 
                    : trigger
                )
              );
              
              // Simulate speaking
              simulateSpeaking(3000);
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

  // Process user message and generate response
  const processUserMessage = (text: string): string => {
    // Convert the text to lowercase for easier matching
    const input = text.toLowerCase();
    
    // Check for feature-related questions
    const featureMatch = appKnowledge.features.find(feature => 
      input.includes(feature.id) || input.includes(feature.name.toLowerCase())
    );
    
    if (featureMatch) {
      return `${featureMatch.name}: ${featureMatch.description} ${featureMatch.comingSoon ? '(Coming Soon)' : ''}`;
    }
    
    // Check for how it works questions
    if (input.includes('how') && (input.includes('work') || input.includes('use'))) {
      return appKnowledge.howItWorks.map(step => 
        `Step ${step.step}: ${step.title} - ${step.description}`
      ).join('\n\n');
    }
    
    // Check for FAQ questions
    const faqMatch = appKnowledge.faq.find(faq => 
      input.includes(faq.question.toLowerCase().substring(0, 15))
    );
    
    if (faqMatch) {
      return faqMatch.answer;
    }
    
    // Generic responses based on keywords
    if (input.includes('hello') || input.includes('hi')) {
      return "Hello! How can I help you with your digital legacy today?";
    } else if (input.includes('feature') || input.includes('what can you do')) {
      return "Final Thread offers secure messages, digital asset vault, trusted contacts, and more. What would you like to know more about?";
    } else if (input.includes('help')) {
      return "I'm here to help! You can ask me about features, how to set up your legacy, or navigate to specific sections.";
    } else if (input.includes('dashboard')) {
      return "The dashboard gives you an overview of your legacy setup. Would you like me to help you navigate there?";
    } else if (input.includes('message') || input.includes('letter')) {
      return "Legacy messages let you create heartfelt communications for your loved ones. Would you like to create one?";
    } else if (input.includes('contact') || input.includes('trusted')) {
      return "Trusted contacts are people who will receive your legacy. You can add them in the Trusted Contacts section.";
    } else {
      return "I'm still learning! If you have specific questions about Final Thread, I'll do my best to help.";
    }
  };

  const sendMessage = (text: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Begin "typing" effect by setting isSpeaking to true
    setIsSpeaking(true);
    
    // Process message and generate response
    const responseText = processUserMessage(text);
    
    // Simulate AI thinking/typing - add delay based on response length
    const typingDelay = Math.min(1000 + responseText.length * 10, 3000);
    
    setTimeout(() => {
      const theaMessage: Message = {
        id: Date.now().toString(),
        text: responseText,
        sender: 'thea',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, theaMessage]);
      
      // Simulate speaking for a duration based on message length
      const speakingDuration = Math.min(2000 + responseText.length * 50, 10000);
      simulateSpeaking(speakingDuration);
    }, typingDelay);
  };

  const toggleChat = () => {
    setIsChatOpen(prev => !prev);
    
    // If opening the chat and no messages, add a greeting
    if (!isChatOpen && messages.length === 0) {
      setMessages([
        {
          id: Date.now().toString(),
          text: "Hi there! I'm Thea, your guide to Final Thread. How can I help you today?",
          sender: 'thea',
          timestamp: new Date()
        }
      ]);
      simulateSpeaking(3000);
    }
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
        isSpeaking,
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
