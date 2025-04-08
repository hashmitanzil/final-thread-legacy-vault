
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { History, Shield, Sparkles, Users, FileArchive, Code } from 'lucide-react';

const AboutPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Our <span className="text-gradient">Mission</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Final Thread was founded with a simple but powerful vision: to help people preserve their digital legacy and ensure their final wishes are honored.
            </p>
          </motion.div>
        </div>
        
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/5"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.7, 0.5]
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute top-1/3 -left-20 w-72 h-72 rounded-full bg-secondary/5"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                Final Thread was born from a deeply personal experience. Our founder lost a close family member unexpectedly and discovered how challenging it was to access important digital assets and information.
              </p>
              <p className="text-muted-foreground mb-4">
                In today's digital world, our lives are increasingly lived online, yet most of us haven't prepared for what happens to our digital legacy after we're gone.
              </p>
              <p className="text-muted-foreground">
                We created Final Thread to solve this problem - a secure, intuitive platform that ensures your digital legacy is preserved and passed on according to your wishes.
              </p>
            </motion.div>
            <motion.div 
              variants={itemVariants}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-xl relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent opacity-80 z-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                  alt="Team working together" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-xl bg-primary/10 z-0"></div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground text-lg">
              These principles guide everything we do at Final Thread.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <motion.div 
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              variants={itemVariants}
            >
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Shield className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Security & Privacy</h3>
              <p className="text-muted-foreground">
                We treat your data with the utmost care, using enterprise-grade encryption and security protocols to keep your information safe.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              variants={itemVariants}
            >
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Human Connection</h3>
              <p className="text-muted-foreground">
                Technology should enhance human connection, not replace it. We design our platform to foster meaningful connections across time.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              variants={itemVariants}
            >
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Code className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Technological Innovation</h3>
              <p className="text-muted-foreground">
                We constantly push the boundaries of what's possible, incorporating the latest advancements in encryption, AI, and digital storage.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Team</h2>
            <p className="text-muted-foreground text-lg">
              Passionate experts dedicated to preserving digital legacies.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <motion.div 
              className="text-center"
              variants={itemVariants}
            >
              <div className="relative w-40 h-40 mx-auto mb-4 overflow-hidden rounded-full">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80" 
                  alt="Team member" 
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-lg font-semibold">Alex Morgan</h3>
              <p className="text-primary">Founder & CEO</p>
            </motion.div>

            <motion.div 
              className="text-center"
              variants={itemVariants}
            >
              <div className="relative w-40 h-40 mx-auto mb-4 overflow-hidden rounded-full">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=388&q=80" 
                  alt="Team member" 
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-lg font-semibold">Sarah Chen</h3>
              <p className="text-primary">CTO</p>
            </motion.div>

            <motion.div 
              className="text-center"
              variants={itemVariants}
            >
              <div className="relative w-40 h-40 mx-auto mb-4 overflow-hidden rounded-full">
                <img 
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80" 
                  alt="Team member" 
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-lg font-semibold">Michael Wong</h3>
              <p className="text-primary">Head of Security</p>
            </motion.div>

            <motion.div 
              className="text-center"
              variants={itemVariants}
            >
              <div className="relative w-40 h-40 mx-auto mb-4 overflow-hidden rounded-full">
                <img 
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=461&q=80" 
                  alt="Team member" 
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-lg font-semibold">Emma Davis</h3>
              <p className="text-primary">UX Director</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Us On Our Mission</h2>
            <p className="text-lg mb-8 opacity-90">
              Be part of the movement to secure digital legacies for generations to come.
            </p>
            <Link to={isAuthenticated ? "/dashboard" : "/register"}>
              <Button size="lg" variant="secondary">
                {isAuthenticated ? "Go to Dashboard" : "Get Started Today"}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
