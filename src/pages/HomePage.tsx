
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import HeroAnimation from '@/components/HeroAnimation';
import { 
  MessageSquare, 
  Users, 
  FileImage, 
  Lock, 
  Shield, 
  Sparkles, 
  Clock, 
  Heart,
  Brain,
  Video,
  Calendar,
  FileText,
  Database,
  Play,
  Gift
} from 'lucide-react';
import { motion } from 'framer-motion';

const featureAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const containerAnimation = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const HomePage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (featuresRef.current) {
        const featureElements = featuresRef.current.querySelectorAll('.feature-card');
        featureElements.forEach((el) => {
          const rect = el.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight * 0.8;
          if (isVisible) {
            el.classList.add('animate-fade-in');
          }
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Hero Section with 3D Animation */}
      <section className="relative bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 py-20 text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
              >
                Your Digital Legacy,{' '}
                <span className="text-white">Preserved Forever</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-xl md:text-2xl text-gray-200 mb-10"
              >
                Secure messages and digital assets for your loved ones, 
                delivered exactly when and how you want them to be.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                {isLoading ? (
                  <div className="animate-pulse h-12 w-32 bg-white/20 rounded-md"></div>
                ) : isAuthenticated ? (
                  <>
                    <Link to="/dashboard">
                      <Button size="lg" className="w-full sm:w-auto bg-white text-purple-900 hover:bg-gray-200">
                        Go to Dashboard
                      </Button>
                    </Link>
                    <Link to="/messages/new">
                      <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                        Create New Message
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/register">
                      <Button size="lg" className="w-full sm:w-auto bg-white text-purple-900 hover:bg-gray-200">
                        Get Started
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                        Log In
                      </Button>
                    </Link>
                  </>
                )}
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="lg:w-1/2"
            >
              <HeroAnimation />
            </motion.div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-gray-900 to-transparent"></div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-16 md:py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Secure Your Digital Legacy</h2>
            <p className="text-gray-300 text-lg">
              Final Thread provides all the tools you need to prepare and secure your digital footprint for the future.
            </p>
          </motion.div>

          <motion.div 
            variants={containerAnimation}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <motion.div variants={featureAnimation} className="feature-card bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/30 shadow-lg shadow-purple-500/10 transition-all hover:border-purple-500/50 hover:shadow-purple-500/20">
              <div className="h-12 w-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-white">Final Messages</h3>
              <p className="text-gray-300">
                Create heartfelt messages that will be delivered to your loved ones after your passing or on specific dates.
              </p>
            </motion.div>

            <motion.div variants={featureAnimation} className="feature-card bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-blue-500/30 shadow-lg shadow-blue-500/10 transition-all hover:border-blue-500/50 hover:shadow-blue-500/20">
              <div className="h-12 w-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                <FileImage className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-white">Digital Asset Vault</h3>
              <p className="text-gray-300">
                Store important files, photos, videos, and documents in a secure digital vault that your trusted contacts can access.
              </p>
            </motion.div>

            <motion.div variants={featureAnimation} className="feature-card bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-indigo-500/30 shadow-lg shadow-indigo-500/10 transition-all hover:border-indigo-500/50 hover:shadow-indigo-500/20">
              <div className="h-12 w-12 rounded-lg bg-indigo-500/20 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-white">Trusted Contacts</h3>
              <p className="text-gray-300">
                Designate trusted individuals who will be notified and given access to your digital legacy.
              </p>
            </motion.div>

            <motion.div variants={featureAnimation} className="feature-card bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-pink-500/30 shadow-lg shadow-pink-500/10 transition-all hover:border-pink-500/50 hover:shadow-pink-500/20">
              <div className="h-12 w-12 rounded-lg bg-pink-500/20 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-pink-400" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-white">Proof of Life</h3>
              <p className="text-gray-300">
                Simple login requirement every 30 days ensures your messages aren't delivered prematurely.
              </p>
            </motion.div>
            
            <motion.div variants={featureAnimation} className="feature-card bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-green-500/30 shadow-lg shadow-green-500/10 transition-all hover:border-green-500/50 hover:shadow-green-500/20">
              <div className="h-12 w-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
                <Video className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-white">Legacy Video Messages</h3>
              <p className="text-gray-300">
                Record and schedule personal video messages for specific occasions or as part of your legacy.
              </p>
            </motion.div>
            
            <motion.div variants={featureAnimation} className="feature-card bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-yellow-500/30 shadow-lg shadow-yellow-500/10 transition-all hover:border-yellow-500/50 hover:shadow-yellow-500/20">
              <div className="h-12 w-12 rounded-lg bg-yellow-500/20 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-yellow-400" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-white">Smart Triggers</h3>
              <p className="text-gray-300">
                Set messages to deliver based on specific dates, events, or after a period of inactivity.
              </p>
            </motion.div>
            
            <motion.div variants={featureAnimation} className="feature-card bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-teal-500/30 shadow-lg shadow-teal-500/10 transition-all hover:border-teal-500/50 hover:shadow-teal-500/20">
              <div className="h-12 w-12 rounded-lg bg-teal-500/20 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-teal-400" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-white">Legal Documents</h3>
              <p className="text-gray-300">
                Securely store important legal documents and set specific access permissions for after your passing.
              </p>
            </motion.div>
            
            <motion.div variants={featureAnimation} className="feature-card bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-cyan-500/30 shadow-lg shadow-cyan-500/10 transition-all hover:border-cyan-500/50 hover:shadow-cyan-500/20">
              <div className="h-12 w-12 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-cyan-400" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-white">AI Avatar <span className="text-xs text-cyan-400 ml-1">(Coming Soon)</span></h3>
              <p className="text-gray-300">
                Create a future AI version of yourself that can interact with your loved ones using your voice and personality.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 md:py-24 bg-gray-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">How It Works</h2>
            <p className="text-gray-300 text-lg">
              Final Thread makes it easy to preserve your digital legacy in three simple steps.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-medium mb-2 text-white">1. Create Your Account</h3>
              <p className="text-gray-300">
                Sign up and set up your secure digital legacy vault with bank-level encryption.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center p-6"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-medium mb-2 text-white">2. Add Content & Contacts</h3>
              <p className="text-gray-300">
                Upload files, create messages, and designate trusted contacts who will receive them.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              viewport={{ once: true }}
              className="text-center p-6"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-medium mb-2 text-white">3. Set Delivery Conditions</h3>
              <p className="text-gray-300">
                Choose when and how your messages will be delivered based on specific triggers.
              </p>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to={isAuthenticated ? "/dashboard" : "/register"}>
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
                Get Started Today
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">What Our Users Say</h2>
            <p className="text-gray-300 text-lg">
              Thousands of people trust Final Thread with their digital legacy.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-purple-500/20 shadow-lg"
            >
              <div className="flex items-center mb-4">
                <Sparkles className="text-yellow-400 h-5 w-5 mr-1" />
                <Sparkles className="text-yellow-400 h-5 w-5 mr-1" />
                <Sparkles className="text-yellow-400 h-5 w-5 mr-1" />
                <Sparkles className="text-yellow-400 h-5 w-5 mr-1" />
                <Sparkles className="text-yellow-400 h-5 w-5" />
              </div>
              <p className="italic mb-4 text-gray-300">
                "Final Thread gave me peace of mind knowing that my loved ones will receive my messages and have access to important documents when the time comes."
              </p>
              <p className="font-medium text-white">Sarah K.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-blue-500/20 shadow-lg"
            >
              <div className="flex items-center mb-4">
                <Sparkles className="text-yellow-400 h-5 w-5 mr-1" />
                <Sparkles className="text-yellow-400 h-5 w-5 mr-1" />
                <Sparkles className="text-yellow-400 h-5 w-5 mr-1" />
                <Sparkles className="text-yellow-400 h-5 w-5 mr-1" />
                <Sparkles className="text-yellow-400 h-5 w-5" />
              </div>
              <p className="italic mb-4 text-gray-300">
                "I created a time capsule of messages for my children as they grow up. Such a meaningful way to connect with them across time."
              </p>
              <p className="font-medium text-white">Michael T.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-indigo-500/20 shadow-lg"
            >
              <div className="flex items-center mb-4">
                <Sparkles className="text-yellow-400 h-5 w-5 mr-1" />
                <Sparkles className="text-yellow-400 h-5 w-5 mr-1" />
                <Sparkles className="text-yellow-400 h-5 w-5 mr-1" />
                <Sparkles className="text-yellow-400 h-5 w-5 mr-1" />
                <Sparkles className="text-yellow-400 h-5 w-5" />
              </div>
              <p className="italic mb-4 text-gray-300">
                "The security features are impressive, and the interface makes it easy to organize all my important digital assets in one place."
              </p>
              <p className="font-medium text-white">Jennifer L.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-purple-900 to-gray-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Secure Your Legacy Today</h2>
            <p className="text-lg mb-8 text-gray-200">
              Don't leave your digital legacy to chance. Create your account now and ensure your wishes are honored.
            </p>
            <Link to={isAuthenticated ? "/dashboard" : "/register"}>
              <Button size="lg" variant="secondary" className="bg-white text-purple-900 hover:bg-gray-100">
                {isAuthenticated ? "Go to Dashboard" : "Get Started for Free"}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
