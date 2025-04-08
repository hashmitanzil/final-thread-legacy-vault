
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  MessageSquare, 
  FileArchive, 
  Users, 
  Lock, 
  Shield, 
  Clock, 
  Calendar,
  Video,
  Settings,
  Key,
  FileText,
  Bell,
  User
} from 'lucide-react';

const FeaturesPage: React.FC = () => {
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

  // Features sections data
  const featureSections = [
    {
      title: "Ultra-Secure Digital Vault",
      description: "Keep your most important documents and information secure with our state-of-the-art encryption.",
      icon: Lock,
      features: [
        "AES-256 + End-to-End Encryption",
        "Zero-knowledge storage: even we can't see your data",
        "Multi-layer biometric and 2FA authentication",
        "Geo-replicated backup system across multiple zones"
      ],
      color: "bg-blue-500/10",
      textColor: "text-blue-600"
    },
    {
      title: "Wills & Financial Instructions",
      description: "Store and manage your most important legal and financial documents.",
      icon: FileText,
      features: [
        "Upload legal documents (will, insurance, property papers)",
        "Add crypto wallet keys, bank info, and critical accounts",
        "Assign future recipients (heirs, executor, trustee)",
        "Securely store passwords and access information"
      ],
      color: "bg-purple-500/10",
      textColor: "text-purple-600"
    },
    {
      title: "Final Messages",
      description: "Leave personalized messages for your loved ones to be delivered at the right time.",
      icon: MessageSquare,
      features: [
        "Text, audio, and video messages for loved ones",
        "\"Open on birthday\" or \"After I pass away\" triggers",
        "AI-enhanced voice & video cleanup for professional feel",
        "End-to-end encrypted for complete privacy"
      ],
      color: "bg-emerald-500/10",
      textColor: "text-emerald-600"
    },
    {
      title: "Scheduled & Conditional Message Delivery",
      description: "Set up sophisticated delivery rules for your messages and digital assets.",
      icon: Calendar,
      features: [
        "Time-triggered messages (e.g., 18th birthday, wedding day)",
        "Event-based triggers via trusted human verification",
        "Scheduled drops with auto-notification to recipients",
        "Multi-factor authentication for recipient access"
      ],
      color: "bg-amber-500/10",
      textColor: "text-amber-600"
    },
    {
      title: "Auto-Notified Contact Chain",
      description: "Ensure the right people know when they need to access your digital legacy.",
      icon: Bell,
      features: [
        "Add trusted contacts (family, lawyers, advisors)",
        "Upon death confirmation, notify via SMS, email, or app",
        "Role-based access (e.g., lawyer sees legal docs only)",
        "Cascading notification system with fallbacks"
      ],
      color: "bg-rose-500/10",
      textColor: "text-rose-600"
    },
    {
      title: "Cross-Platform Access",
      description: "Access your digital legacy from any device, anytime, anywhere.",
      icon: Settings,
      features: [
        "Web App + Progressive Web App (PWA)",
        "Mobile responsive design with offline fallback",
        "Fingerprint or FaceID access on mobile",
        "Secure third-party app integrations"
      ],
      color: "bg-indigo-500/10",
      textColor: "text-indigo-600"
    }
  ];

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
              Powerful <span className="text-gradient">Features</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Discover the innovative tools we've built to help you secure and preserve your digital legacy.
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

      {/* Main Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="space-y-32">
            {featureSections.map((section, index) => (
              <motion.div 
                key={section.title}
                className={`grid grid-cols-1 ${index % 2 === 0 ? 'md:grid-cols-[1fr_1.2fr]' : 'md:grid-cols-[1.2fr_1fr] md:flex-row-reverse'} gap-12 items-center`}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                <motion.div 
                  variants={itemVariants}
                  className="flex flex-col justify-center"
                >
                  <div className={`w-16 h-16 ${section.color} rounded-2xl flex items-center justify-center mb-6`}>
                    <section.icon className={`h-8 w-8 ${section.textColor}`} />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">{section.title}</h2>
                  <p className="text-lg text-muted-foreground mb-6">{section.description}</p>
                  
                  <ul className="space-y-3">
                    {section.features.map((feature, i) => (
                      <motion.li 
                        key={i}
                        className="flex items-start space-x-3"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <div className={`mt-1.5 min-w-4 h-4 w-4 rounded-full ${section.color} flex items-center justify-center`}>
                          <div className={`h-2 w-2 rounded-full ${section.textColor.replace('text', 'bg')}`}></div>
                        </div>
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
                
                <motion.div
                  variants={itemVariants}
                  className="relative order-first md:order-none"
                >
                  <div className={`rounded-2xl overflow-hidden shadow-lg aspect-video`}>
                    <div className={`absolute inset-0 bg-gradient-to-br from-${section.color.split('-')[1]}-500/30 to-transparent opacity-80 z-10`}></div>
                    <img 
                      src={`https://images.unsplash.com/photo-${1550000000 + index * 10000000}?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80`}
                      alt={section.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute inset-0 ${section.color} shadow-inner opacity-20`}></div>
                  </div>
                  <div className={`absolute -bottom-6 ${index % 2 === 0 ? '-right-6' : '-left-6'} w-24 h-24 ${section.color} rounded-xl shadow-lg z-0`}></div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Matrix */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Compare Plans</h2>
            <p className="text-muted-foreground text-lg">
              Find the right package for your needs. All plans include our core security features.
            </p>
          </motion.div>

          <motion.div 
            className="overflow-x-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <table className="w-full min-w-[800px] border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="p-4 text-left font-semibold text-lg">Feature</th>
                  <th className="p-4 text-center font-semibold text-lg">Free</th>
                  <th className="p-4 text-center font-semibold text-lg">Premium</th>
                  <th className="p-4 text-center font-semibold text-lg">Legacy</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="p-4 font-medium">Storage Space</td>
                  <td className="p-4 text-center">1 GB</td>
                  <td className="p-4 text-center">10 GB</td>
                  <td className="p-4 text-center">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-4 font-medium">Final Messages</td>
                  <td className="p-4 text-center">1</td>
                  <td className="p-4 text-center">Unlimited</td>
                  <td className="p-4 text-center">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-4 font-medium">Trusted Contacts</td>
                  <td className="p-4 text-center">1</td>
                  <td className="p-4 text-center">10</td>
                  <td className="p-4 text-center">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-4 font-medium">Scheduled Delivery</td>
                  <td className="p-4 text-center">Basic</td>
                  <td className="p-4 text-center">Advanced</td>
                  <td className="p-4 text-center">Advanced</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-4 font-medium">Notification Chain</td>
                  <td className="p-4 text-center">✓</td>
                  <td className="p-4 text-center">✓</td>
                  <td className="p-4 text-center">✓</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-4 font-medium">AI Legacy Avatar</td>
                  <td className="p-4 text-center">-</td>
                  <td className="p-4 text-center">Basic</td>
                  <td className="p-4 text-center">Advanced</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-4 font-medium">"Digital Executor" Mode</td>
                  <td className="p-4 text-center">-</td>
                  <td className="p-4 text-center">-</td>
                  <td className="p-4 text-center">✓</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Customer Support</td>
                  <td className="p-4 text-center">Email</td>
                  <td className="p-4 text-center">Priority</td>
                  <td className="p-4 text-center">Dedicated</td>
                </tr>
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary/90 to-accent/90 text-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Secure Your Digital Legacy?</h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of others who are ensuring their digital footprints are preserved for generations to come.
            </p>
            <Link to={isAuthenticated ? "/dashboard" : "/register"}>
              <Button size="lg" variant="secondary" className="mr-4">
                {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                View Pricing
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default FeaturesPage;
