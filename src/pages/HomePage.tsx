
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  MessageSquare, 
  Users, 
  FileImage, 
  Lock, 
  Shield, 
  Sparkles, 
  Clock, 
  Heart
} from 'lucide-react';

const HomePage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white py-20 md:py-32">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Your Digital Legacy,{' '}
              <span className="text-primary">Preserved Forever</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10">
              Secure messages and digital assets for your loved ones, 
              delivered exactly when and how you want them to be.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isLoading ? (
                <div className="animate-pulse">Loading...</div>
              ) : isAuthenticated ? (
                <>
                  <Link to="/dashboard">
                    <Button size="lg" className="w-full sm:w-auto">
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Link to="/messages/new">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Create New Message
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg" className="w-full sm:w-auto">
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Log In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-primary/5"></div>
          <div className="absolute top-1/3 -left-24 w-72 h-72 rounded-full bg-secondary/5"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Secure Your Digital Legacy</h2>
            <p className="text-muted-foreground text-lg">
              Final Thread provides all the tools you need to prepare and secure your digital footprint for the future.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm transition-all hover:shadow-md">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Final Messages</h3>
              <p className="text-muted-foreground">
                Create heartfelt messages that will be delivered to your loved ones after your passing or on specific dates.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 shadow-sm transition-all hover:shadow-md">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FileImage className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Digital Asset Vault</h3>
              <p className="text-muted-foreground">
                Store important files, photos, videos, and documents in a secure digital vault that your trusted contacts can access.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 shadow-sm transition-all hover:shadow-md">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Trusted Contacts</h3>
              <p className="text-muted-foreground">
                Designate trusted individuals who will be notified and given access to your digital legacy.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 shadow-sm transition-all hover:shadow-md">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Proof of Life</h3>
              <p className="text-muted-foreground">
                Simple login requirement every 30 days ensures your messages aren't delivered prematurely.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">
              Final Thread makes it easy to preserve your digital legacy in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">1. Create Your Account</h3>
              <p className="text-muted-foreground">
                Sign up and set up your secure digital legacy vault with bank-level encryption.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">2. Add Content & Contacts</h3>
              <p className="text-muted-foreground">
                Upload files, create messages, and designate trusted contacts who will receive them.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">3. Set Delivery Conditions</h3>
              <p className="text-muted-foreground">
                Choose when and how your messages will be delivered based on specific triggers.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to={isAuthenticated ? "/dashboard" : "/register"}>
              <Button size="lg">Get Started Today</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-muted-foreground text-lg">
              Thousands of people trust Final Thread with their digital legacy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <Sparkles className="text-yellow-500 h-5 w-5 mr-1" />
                <Sparkles className="text-yellow-500 h-5 w-5 mr-1" />
                <Sparkles className="text-yellow-500 h-5 w-5 mr-1" />
                <Sparkles className="text-yellow-500 h-5 w-5 mr-1" />
                <Sparkles className="text-yellow-500 h-5 w-5" />
              </div>
              <p className="italic mb-4">
                "Final Thread gave me peace of mind knowing that my loved ones will receive my messages and have access to important documents when the time comes."
              </p>
              <p className="font-medium">Sarah K.</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <Sparkles className="text-yellow-500 h-5 w-5 mr-1" />
                <Sparkles className="text-yellow-500 h-5 w-5 mr-1" />
                <Sparkles className="text-yellow-500 h-5 w-5 mr-1" />
                <Sparkles className="text-yellow-500 h-5 w-5 mr-1" />
                <Sparkles className="text-yellow-500 h-5 w-5" />
              </div>
              <p className="italic mb-4">
                "I created a time capsule of messages for my children as they grow up. Such a meaningful way to connect with them across time."
              </p>
              <p className="font-medium">Michael T.</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <Sparkles className="text-yellow-500 h-5 w-5 mr-1" />
                <Sparkles className="text-yellow-500 h-5 w-5 mr-1" />
                <Sparkles className="text-yellow-500 h-5 w-5 mr-1" />
                <Sparkles className="text-yellow-500 h-5 w-5 mr-1" />
                <Sparkles className="text-yellow-500 h-5 w-5" />
              </div>
              <p className="italic mb-4">
                "The security features are impressive, and the interface makes it easy to organize all my important digital assets in one place."
              </p>
              <p className="font-medium">Jennifer L.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Secure Your Legacy Today</h2>
            <p className="text-lg mb-8 opacity-90">
              Don't leave your digital legacy to chance. Create your account now and ensure your wishes are honored.
            </p>
            <Link to={isAuthenticated ? "/dashboard" : "/register"}>
              <Button size="lg" variant="secondary">
                {isAuthenticated ? "Go to Dashboard" : "Get Started for Free"}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
