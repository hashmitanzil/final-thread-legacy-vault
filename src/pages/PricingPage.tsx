
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Check, X, HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const PricingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
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

  // Pricing data
  const pricingPlans = [
    {
      name: "Free",
      description: "Basic digital legacy protection for individuals",
      price: { monthly: 0, yearly: 0 },
      storage: "1 GB",
      features: [
        { name: "1 Final message", included: true },
        { name: "1 Trusted contact", included: true },
        { name: "Basic scheduled delivery", included: true },
        { name: "Basic notification chain", included: true },
        { name: "Email support", included: true },
        { name: "AI Legacy Avatar", included: false },
        { name: '"Digital Executor" Mode', included: false },
        { name: "Priority support", included: false },
      ],
      highlighted: false,
      buttonText: isAuthenticated ? "Current Plan" : "Get Started",
      buttonVariant: "outline" as const,
    },
    {
      name: "Premium",
      description: "Complete digital legacy management solution",
      price: { monthly: 9.99, yearly: 99.99 },
      storage: "10 GB",
      features: [
        { name: "Unlimited final messages", included: true },
        { name: "Up to 10 trusted contacts", included: true },
        { name: "Advanced scheduled delivery", included: true },
        { name: "Enhanced notification chain", included: true },
        { name: "Priority support", included: true },
        { name: "Basic AI Legacy Avatar", included: true },
        { name: '"Digital Executor" Mode', included: false },
        { name: "Dedicated support", included: false },
      ],
      highlighted: true,
      buttonText: "Choose Plan",
      buttonVariant: "default" as const,
    },
    {
      name: "Legacy",
      description: "Lifetime access with premium features",
      price: { monthly: null, yearly: 299 },
      storage: "Unlimited",
      features: [
        { name: "Unlimited final messages", included: true },
        { name: "Unlimited trusted contacts", included: true },
        { name: "Advanced scheduled delivery", included: true },
        { name: "Enhanced notification chain", included: true },
        { name: "Dedicated support", included: true },
        { name: "Advanced AI Legacy Avatar", included: true },
        { name: '"Digital Executor" Mode', included: true },
        { name: "Lifetime access", included: true },
      ],
      highlighted: false,
      buttonText: "Choose Plan",
      buttonVariant: "outline" as const,
      specialLabel: "Lifetime Access"
    }
  ];

  // Helper function to format price
  const formatPrice = (price: number | null) => {
    if (price === null) return 'One-time';
    if (price === 0) return 'Free';
    return `$${price.toFixed(2)}`;
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
              Simple, Transparent <span className="text-gradient">Pricing</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Choose the plan that's right for you - whether you're just starting out or need a comprehensive solution.
            </p>
            
            <div className="bg-card/50 backdrop-blur-sm p-1.5 rounded-full inline-flex items-center border mb-8">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  billingCycle === 'monthly' 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  billingCycle === 'yearly' 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Yearly <span className="text-xs opacity-80">(Save 15%)</span>
              </button>
            </div>
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

      {/* Pricing Cards */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {pricingPlans.map((plan) => (
              <motion.div
                key={plan.name}
                variants={itemVariants}
                className={`relative rounded-xl overflow-hidden border ${
                  plan.highlighted 
                    ? 'border-primary shadow-lg shadow-primary/10' 
                    : 'border-border shadow-sm'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-accent"></div>
                )}
                
                {plan.specialLabel && (
                  <div className="absolute top-6 right-0 bg-accent text-white text-xs font-bold px-3 py-1 rounded-l-full shadow-sm">
                    {plan.specialLabel}
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-muted-foreground mt-2 min-h-[40px]">{plan.description}</p>
                  
                  <div className="mt-6 mb-6">
                    <div className="flex items-end">
                      <span className="text-4xl font-bold">
                        {formatPrice(plan.price[billingCycle])}
                      </span>
                      {plan.price[billingCycle] !== 0 && plan.price[billingCycle] !== null && (
                        <span className="text-muted-foreground ml-2 mb-1">
                          / {billingCycle === 'monthly' ? 'month' : 'year'}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      {plan.storage} storage
                    </div>
                  </div>
                  
                  <Link to={isAuthenticated ? "/dashboard" : "/register"}>
                    <Button 
                      variant={plan.buttonVariant} 
                      className="w-full"
                      disabled={isAuthenticated && plan.name === "Free" && plan.buttonText === "Current Plan"}
                    >
                      {plan.buttonText}
                    </Button>
                  </Link>
                </div>
                
                <div className="border-t border-border p-6">
                  <strong className="text-sm font-medium">Includes:</strong>
                  <ul className="mt-4 space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start text-sm">
                        {feature.included ? (
                          <Check className="mr-3 h-5 w-5 text-primary shrink-0" />
                        ) : (
                          <X className="mr-3 h-5 w-5 text-muted-foreground shrink-0" />
                        )}
                        <span className={feature.included ? "" : "text-muted-foreground"}>
                          {feature.name}
                          {feature.name === "Basic AI Legacy Avatar" && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="inline-block ml-1 h-3.5 w-3.5 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="w-[200px] text-xs">
                                    Create an AI avatar based on your text messages and responses. Premium includes basic avatar customization.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          {feature.name === "Advanced AI Legacy Avatar" && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="inline-block ml-1 h-3.5 w-3.5 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="w-[200px] text-xs">
                                    Full AI avatar with voice training, video generation, and extensive personality customization.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-lg">
              Find answers to common questions about our pricing and plans.
            </p>
          </motion.div>

          <motion.div 
            className="max-w-3xl mx-auto divide-y"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div className="py-6" variants={itemVariants}>
              <h3 className="text-xl font-semibold mb-2">Can I upgrade my plan later?</h3>
              <p className="text-muted-foreground">Yes, you can upgrade your plan at any time. Your new features will be available immediately, and we'll prorate your billing.</p>
            </motion.div>
            
            <motion.div className="py-6" variants={itemVariants}>
              <h3 className="text-xl font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground">We accept all major credit cards, PayPal, and selected cryptocurrencies for payment.</p>
            </motion.div>
            
            <motion.div className="py-6" variants={itemVariants}>
              <h3 className="text-xl font-semibold mb-2">Is my data safe if I cancel my subscription?</h3>
              <p className="text-muted-foreground">Your data remains secure for 30 days after cancellation, allowing you time to download anything important. After that period, it will be permanently deleted from our servers.</p>
            </motion.div>
            
            <motion.div className="py-6" variants={itemVariants}>
              <h3 className="text-xl font-semibold mb-2">What is the Legacy plan?</h3>
              <p className="text-muted-foreground">The Legacy plan is a one-time payment for lifetime access to Final Thread. It includes all our premium features and guarantees that your digital legacy will be maintained indefinitely.</p>
            </motion.div>
            
            <motion.div className="py-6" variants={itemVariants}>
              <h3 className="text-xl font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-muted-foreground">We offer a 30-day money-back guarantee for monthly and yearly subscriptions. The Legacy plan has a 90-day refund policy.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/90 via-primary to-accent/90 text-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Securing Your Digital Legacy Today</h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands who trust Final Thread to protect what matters most.
            </p>
            <Link to={isAuthenticated ? "/dashboard" : "/register"}>
              <Button size="lg" variant="secondary" className="mr-4">
                {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
              </Button>
            </Link>
            <Link to="/features">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Explore Features
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default PricingPage;
