
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  Shield, 
  MessageCircle, 
  Key, 
  Users,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <MessageCircle className="h-8 w-8 text-legacy-blue" />,
      title: 'Create Final Messages',
      description: 'Leave messages that will be delivered to your loved ones at the time of your choosing.',
    },
    {
      icon: <Clock className="h-8 w-8 text-legacy-purple" />,
      title: 'Schedule Future Delivery',
      description: 'Set specific dates for message delivery like birthdays or anniversaries.',
    },
    {
      icon: <Users className="h-8 w-8 text-legacy-indigo" />,
      title: 'Trusted Contacts',
      description: 'Assign contacts who can help verify your status and access your vault.',
    },
    {
      icon: <Key className="h-8 w-8 text-legacy-teal" />,
      title: 'Crypto Key Storage',
      description: 'Safely store and share access to your digital assets and cryptocurrency.',
    },
    {
      icon: <Shield className="h-8 w-8 text-legacy-slate" />,
      title: 'End-to-End Encryption',
      description: 'Your messages and files are protected with advanced encryption.',
    },
  ];

  const testimonials = [
    {
      quote: "This service gave me peace of mind knowing my children will have access to my memories and messages when they need them most.",
      author: "Sarah J.",
      role: "Parent & Estate Planner"
    },
    {
      quote: "As someone who values privacy, I appreciate how secure Final Thread is while still making it easy to set up my digital legacy.",
      author: "Michael T.",
      role: "Privacy Advocate"
    },
    {
      quote: "The scheduled message feature allowed me to create meaningful time capsules for my family's future milestones.",
      author: "Elena R.",
      role: "Family Historian"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-legacy-purple/10 to-legacy-blue/10 z-0" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Your Legacy, <span className="text-gradient">Preserved Forever</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Secure storage and scheduled delivery of your most important messages, memories, and digital assets for future generations.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button size="lg" className="px-8">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg" className="px-8">
                      Create Your Legacy Vault
                    </Button>
                  </Link>
                  <Link to="/learn-more">
                    <Button size="lg" variant="outline" className="px-8">
                      Learn More
                    </Button>
                  </Link>
                </>
              )}
            </motion.div>
          </div>
          
          <motion.div 
            className="mt-16 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <div className="glass-card overflow-hidden">
              <img 
                src="/placeholder.svg" 
                alt="Final Thread Dashboard Preview" 
                className="w-full h-auto rounded-lg shadow-xl" 
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How Final Thread Works</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Create, secure, and schedule your digital legacy with our intuitive platform.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="glass-card p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">The Journey of Your Legacy</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Follow these simple steps to preserve your digital legacy for future generations.
            </p>
          </div>
          
          <div className="relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 transform -translate-x-1/2"></div>
            
            <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-2 md:gap-y-12">
              {[
                {
                  number: "01",
                  title: "Create Your Account",
                  description: "Sign up and secure your personal legacy vault with end-to-end encryption."
                },
                {
                  number: "02",
                  title: "Build Your Profile",
                  description: "Add personal details and customize your legacy preferences."
                },
                {
                  number: "03",
                  title: "Create Messages & Upload Content",
                  description: "Write heartfelt messages and upload important files for your loved ones."
                },
                {
                  number: "04",
                  title: "Schedule Delivery",
                  description: "Choose when and how your messages will be delivered in the future."
                },
                {
                  number: "05",
                  title: "Add Trusted Contacts",
                  description: "Select people who can help verify your status and access your vault when needed."
                },
                {
                  number: "06",
                  title: "Rest Assured",
                  description: "Know that your digital legacy is secured and will be delivered as per your wishes."
                }
              ].map((step, index) => (
                <motion.div 
                  key={index} 
                  className={`md:${index % 2 === 0 ? 'text-right pr-8' : 'ml-auto pl-8'} relative md:w-1/2`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className={`mb-4 md:absolute md:${index % 2 === 0 ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2'} md:top-0 z-10`}>
                    <div className="w-10 h-10 rounded-full legacy-gradient flex items-center justify-center text-white font-semibold">
                      {step.number}
                    </div>
                  </div>
                  
                  <div className="p-6 glass-card">
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 legacy-gradient-soft text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-lg max-w-3xl mx-auto opacity-90">
              Join thousands who trust Final Thread with their digital legacy.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <p className="mb-4 text-lg italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm opacity-80">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Secure Your Digital Legacy?</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Join thousands of users who trust Final Thread to preserve their memories and digital assets.
          </p>
          
          <Link to="/register">
            <Button size="lg" className="px-8">
              Create Your Legacy Vault <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
