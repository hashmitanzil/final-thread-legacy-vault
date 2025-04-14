
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Mail, 
  BookOpen, 
  Search,
  ChevronRight,
  ArrowRight,
  HelpCircle,
  ExternalLink,
  Clock,
  Shield,
  User,
  MessageSquare,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';

// Documentation content data structure
const documentationContent = [
  {
    id: 'getting-started',
    category: 'Getting Started',
    icon: <BookOpen className="h-5 w-5" />,
    articles: [
      {
        id: 'welcome',
        title: 'Welcome to Final Thread',
        content: `
          <h2>Welcome to Final Thread</h2>
          <p>Final Thread is a platform designed to help you preserve your digital legacy for future generations. This guide will help you get started with the key features and options available to you.</p>
          <h3>Key Features</h3>
          <ul>
            <li><strong>Final Messages</strong>: Create heartfelt messages that will be delivered to your loved ones after your passing.</li>
            <li><strong>Digital Asset Vault</strong>: Store important files, photos, and documents securely.</li>
            <li><strong>Trusted Contacts</strong>: Designate individuals who will receive your legacy.</li>
            <li><strong>Proof of Life</strong>: Simple check-in system ensures your content isn't delivered prematurely.</li>
          </ul>
          <p>To get started, create an account and explore our dashboard. If you need any assistance, our support team is here to help.</p>
        `
      },
      {
        id: 'create-account',
        title: 'How to Create an Account',
        content: `
          <h2>Creating Your Final Thread Account</h2>
          <p>Setting up your Final Thread account is quick and easy. Follow these steps to get started:</p>
          <ol>
            <li>Visit the Final Thread homepage and click on "Sign Up"</li>
            <li>Enter your email address and create a secure password</li>
            <li>Verify your email address by clicking the link in the confirmation email</li>
            <li>Complete your profile information</li>
            <li>Set up your security questions and recovery options</li>
          </ol>
          <p>Once your account is created, you'll be redirected to your dashboard where you can begin setting up your digital legacy.</p>
          <p><strong>Note:</strong> You can also sign up using your Google account for faster access.</p>
        `
      },
      {
        id: 'dashboard-overview',
        title: 'Dashboard Overview',
        content: `
          <h2>Understanding Your Dashboard</h2>
          <p>Your Final Thread dashboard is the central hub for managing your digital legacy. Here's an overview of the key sections:</p>
          <h3>Main Dashboard Areas</h3>
          <ul>
            <li><strong>Legacy Summary</strong>: Overview of your messages, contacts, and proof of life status</li>
            <li><strong>Quick Actions</strong>: Shortcuts to create messages, add contacts, or update settings</li>
            <li><strong>Activity Timeline</strong>: Recent actions and upcoming scheduled deliveries</li>
            <li><strong>Vault Status</strong>: Usage and security status of your digital asset vault</li>
          </ul>
          <p>The sidebar navigation provides access to all main features including Messages, Digital Vault, Trusted Contacts, and Account Settings.</p>
          <p>Use the search function at the top to quickly find specific items in your account.</p>
        `
      }
    ]
  },
  {
    id: 'account-management',
    category: 'Account Management',
    icon: <User className="h-5 w-5" />,
    articles: [
      {
        id: 'security-settings',
        title: 'Security Settings',
        content: `
          <h2>Security Settings</h2>
          <p>Your security is our top priority. Final Thread offers several features to keep your account secure:</p>
          <h3>Key Security Features</h3>
          <ul>
            <li><strong>Two-Factor Authentication</strong>: Add an extra layer of security beyond your password</li>
            <li><strong>Login Notifications</strong>: Get alerts when your account is accessed from a new device</li>
            <li><strong>Password Requirements</strong>: Create strong passwords with a mix of characters</li>
            <li><strong>Session Management</strong>: View and close active sessions remotely</li>
          </ul>
          <h3>How to Enable Two-Factor Authentication</h3>
          <ol>
            <li>Go to Account Settings > Security</li>
            <li>Click "Enable Two-Factor Authentication"</li>
            <li>Choose your preferred method (SMS or Authenticator App)</li>
            <li>Follow the on-screen instructions to complete setup</li>
          </ol>
          <p>We recommend reviewing your security settings regularly to ensure your account remains protected.</p>
        `
      },
      {
        id: 'profile-settings',
        title: 'Profile Settings',
        content: `
          <h2>Managing Your Profile</h2>
          <p>Your profile information helps us personalize your experience and is important for your trusted contacts. Here's how to manage it:</p>
          <h3>Profile Information</h3>
          <ul>
            <li><strong>Personal Details</strong>: Update your name, photo, and contact information</li>
            <li><strong>Communication Preferences</strong>: Control what notifications you receive</li>
            <li><strong>Privacy Settings</strong>: Manage what information is visible to others</li>
          </ul>
          <h3>How to Update Your Profile</h3>
          <ol>
            <li>Go to Account Settings > Profile</li>
            <li>Edit the fields you wish to update</li>
            <li>Upload a profile photo if desired</li>
            <li>Save your changes</li>
          </ol>
          <p>Your profile information is only shared with the trusted contacts you designate and is never sold or shared with third parties.</p>
        `
      }
    ]
  },
  {
    id: 'messages-delivery',
    category: 'Messages & Delivery',
    icon: <MessageSquare className="h-5 w-5" />,
    articles: [
      {
        id: 'create-message',
        title: 'Creating a New Message',
        content: `
          <h2>Creating Legacy Messages</h2>
          <p>Legacy messages are at the heart of Final Thread. These are the personal communications that will be delivered to your loved ones according to your specifications.</p>
          <h3>Types of Messages You Can Create</h3>
          <ul>
            <li><strong>Text Messages</strong>: Written letters or notes</li>
            <li><strong>Video Messages</strong>: Recorded personal videos</li>
            <li><strong>Audio Messages</strong>: Voice recordings or personal audio</li>
            <li><strong>Combined Media</strong>: Text with photos, videos, or audio attachments</li>
          </ul>
          <h3>Steps to Create a Message</h3>
          <ol>
            <li>From your dashboard, click "Create New Message"</li>
            <li>Select the message type (text, video, audio)</li>
            <li>Compose your message using our editor</li>
            <li>Add attachments if desired</li>
            <li>Choose recipients from your trusted contacts</li>
            <li>Set delivery conditions (time-based or event-based)</li>
            <li>Preview your message</li>
            <li>Save or publish your message</li>
          </ol>
          <p>You can save messages as drafts and come back to edit them later. Once a message is published, it's stored securely until the delivery conditions are met.</p>
        `
      },
      {
        id: 'delivery-options',
        title: 'Message Delivery Options',
        content: `
          <h2>Message Delivery Options</h2>
          <p>Final Thread offers flexible delivery options to ensure your messages reach your loved ones exactly when and how you intend:</p>
          <h3>Timing Options</h3>
          <ul>
            <li><strong>After Inactivity</strong>: Delivered after a specified period of account inactivity</li>
            <li><strong>On Specific Date</strong>: Delivered on a future date you specify</li>
            <li><strong>On Recurring Events</strong>: Delivered on birthdays, anniversaries, or other annual events</li>
            <li><strong>Manual Trigger</strong>: Delivered when activated by an authorized executor</li>
          </ul>
          <h3>Delivery Methods</h3>
          <ul>
            <li><strong>Email</strong>: Sent directly to recipient's email</li>
            <li><strong>Text Message</strong>: Notification with secure link</li>
            <li><strong>Portal Access</strong>: Recipients log in to access their messages</li>
          </ul>
          <h3>Confirmation and Verification</h3>
          <p>Recipients may need to verify their identity before accessing sensitive messages. This adds an extra layer of security to ensure only intended recipients can view your legacy.</p>
          <p>You can modify delivery settings for any message up until the point it's delivered.</p>
        `
      }
    ]
  },
  {
    id: 'trusted-contacts',
    category: 'Trusted Contacts',
    icon: <Users className="h-5 w-5" />,
    articles: [
      {
        id: 'add-contact',
        title: 'Adding Trusted Contacts',
        content: `
          <h2>Adding Trusted Contacts</h2>
          <p>Trusted contacts are the individuals who will receive your legacy messages and have access to your digital assets according to your specifications.</p>
          <h3>How to Add a Trusted Contact</h3>
          <ol>
            <li>Go to the Trusted Contacts section from your dashboard</li>
            <li>Click "Add New Contact"</li>
            <li>Enter their name and contact information (email and/or phone)</li>
            <li>Specify their relationship to you</li>
            <li>Set permissions for what content they can access</li>
            <li>Choose whether they'll be a verifier for your proof of life system</li>
            <li>Save the contact</li>
          </ol>
          <h3>Contact Verification</h3>
          <p>For security, your contacts will receive an invitation email asking them to confirm their relationship with you. They'll need to create a Final Thread account (if they don't already have one) to access your legacy when the time comes.</p>
          <p>You can update or remove trusted contacts at any time from the Trusted Contacts management page.</p>
        `
      },
      {
        id: 'contact-permissions',
        title: 'Contact Permissions',
        content: `
          <h2>Managing Contact Permissions</h2>
          <p>Not all trusted contacts should have access to everything. Final Thread lets you customize exactly what each contact can see:</p>
          <h3>Permission Levels</h3>
          <ul>
            <li><strong>Full Access</strong>: Access to all messages and digital assets</li>
            <li><strong>Specific Messages</strong>: Access only to messages specifically addressed to them</li>
            <li><strong>Document Access</strong>: Access to specific documents or collections in your vault</li>
            <li><strong>Media Access</strong>: Access to photos, videos, or other media files</li>
            <li><strong>Executor Status</strong>: Authority to make decisions about your digital legacy</li>
          </ul>
          <h3>How to Set Permissions</h3>
          <ol>
            <li>Go to Trusted Contacts and select the contact</li>
            <li>Click "Edit Permissions"</li>
            <li>Check or uncheck access to specific types of content</li>
            <li>For detailed control, use the "Advanced Permissions" option</li>
            <li>Save your changes</li>
          </ol>
          <p>Permissions can be updated at any time. Recipients will only see the content you've specifically granted them access to.</p>
        `
      }
    ]
  }
];

// Component for article content
const ArticleContent = ({ html }: { html: string }) => {
  return <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />;
};

// Help Center Page Component
const HelpCenterPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('getting-started');
  const [selectedArticle, setSelectedArticle] = useState('welcome');
  const articleContentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Filter articles based on search query
  const filteredCategories = searchQuery 
    ? documentationContent.map(category => ({
        ...category,
        articles: category.articles.filter(article => 
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.articles.length > 0)
    : documentationContent;

  // Get current article content
  const currentArticle = documentationContent
    .flatMap(category => category.articles)
    .find(article => article.id === selectedArticle);

  // Scroll to top of article content when new article is selected
  useEffect(() => {
    if (articleContentRef.current) {
      articleContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedArticle]);

  // Effect to highlight search terms
  useEffect(() => {
    if (searchQuery && currentArticle) {
      const contentElements = document.querySelectorAll('.prose p, .prose li, .prose h2, .prose h3, .prose h4');
      
      contentElements.forEach(element => {
        const originalText = element.textContent || '';
        if (originalText.toLowerCase().includes(searchQuery.toLowerCase())) {
          const regex = new RegExp(`(${searchQuery})`, 'gi');
          element.innerHTML = originalText.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-900 px-1 rounded">$1</mark>');
        }
      });
    }
  }, [searchQuery, currentArticle]);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-10">
      {/* Header Section */}
      <motion.header 
        className="mb-10"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 mb-3">
            Help Center
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find answers to frequently asked questions and learn how to use Final Thread to secure your digital legacy.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search for help articles..."
            className="pl-12 py-6 text-lg rounded-xl shadow-sm hover:shadow-md transition-shadow"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={() => setSearchQuery('')}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03157 3.2184C3.80702 2.99385 3.44295 2.99385 3.2184 3.2184C2.99385 3.44295 2.99385 3.80702 3.2184 4.03157L6.68682 7.50005L3.2184 10.9685C2.99385 11.193 2.99385 11.5571 3.2184 11.7816C3.44295 12.0062 3.80702 12.0062 4.03157 11.7816L7.50005 8.31322L10.9685 11.7816C11.193 12.0062 11.5571 12.0062 11.7816 11.7816C12.0062 11.5571 12.0062 11.193 11.7816 10.9685L8.31322 7.50005L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
            </Button>
          )}
        </div>
      </motion.header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Categories List - Desktop */}
        <motion.div 
          className="hidden md:block md:col-span-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="sticky top-4">
            <CardHeader className="pb-3">
              <CardTitle>Categories</CardTitle>
              <CardDescription>Browse topics by category</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <ul className="space-y-1">
                {filteredCategories.map((category) => (
                  <li key={category.id}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start px-6 py-3 text-left ${selectedCategory === category.id ? 'bg-primary/10 text-primary font-medium' : ''}`}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        if (category.articles.length > 0) {
                          setSelectedArticle(category.articles[0].id);
                        }
                      }}
                    >
                      <span className="flex items-center">
                        {category.icon}
                        <span className="ml-2">{category.category}</span>
                      </span>
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Categories Dropdown - Mobile */}
        <motion.div 
          className="md:hidden col-span-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <select 
              className="w-full p-2 border rounded-md"
              value={selectedCategory}
              onChange={(e) => {
                const newCategory = e.target.value;
                setSelectedCategory(newCategory);
                const categoryArticles = documentationContent.find(cat => cat.id === newCategory)?.articles || [];
                if (categoryArticles.length > 0) {
                  setSelectedArticle(categoryArticles[0].id);
                }
              }}
            >
              {documentationContent.map(category => (
                <option key={category.id} value={category.id}>
                  {category.category}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Article List */}
        <motion.div 
          className="md:col-span-3 lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Articles</CardTitle>
              <CardDescription>
                {documentationContent.find(cat => cat.id === selectedCategory)?.category || 'Browse all articles'}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[calc(100vh-18rem)] p-0">
              <ScrollArea className="h-full pr-4">
                <ul className="space-y-1 px-6 pb-6">
                  {filteredCategories
                    .find(cat => cat.id === selectedCategory)
                    ?.articles.map((article) => (
                      <li key={article.id}>
                        <Button
                          variant="ghost"
                          className={`w-full justify-start text-left ${selectedArticle === article.id ? 'bg-primary/10 text-primary font-medium' : ''}`}
                          onClick={() => setSelectedArticle(article.id)}
                        >
                          <div className="flex items-start">
                            <ChevronRight className={`h-4 w-4 mt-1 mr-2 transition-transform ${selectedArticle === article.id ? 'rotate-90 text-primary' : ''}`} />
                            <span>{article.title}</span>
                          </div>
                        </Button>
                      </li>
                    ))}
                  {filteredCategories.find(cat => cat.id === selectedCategory)?.articles.length === 0 && (
                    <li className="px-3 py-2 text-muted-foreground italic">No articles found</li>
                  )}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>

        {/* Article Content */}
        <motion.div 
          className="md:col-span-6 lg:col-span-7"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="h-full">
            <CardContent className="h-[calc(100vh-10rem)] p-6" ref={articleContentRef}>
              <ScrollArea className="h-full pr-4">
                <AnimatePresence mode="wait">
                  {currentArticle ? (
                    <motion.div
                      key={currentArticle.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                          {documentationContent.find(cat => cat.articles.some(art => art.id === currentArticle.id))?.category}
                        </Badge>
                        <span className="text-muted-foreground text-sm">Updated: April 14, 2025</span>
                      </div>
                      <ArticleContent html={currentArticle.content} />
                      
                      <div className="mt-8 border-t pt-4 flex flex-wrap justify-between items-center gap-4">
                        <div className="text-sm text-muted-foreground">
                          Was this article helpful?
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <HelpCircle className="h-4 w-4" />
                            Yes
                          </Button>
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <ExternalLink className="h-4 w-4" />
                            No
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="text-center py-12">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-xl font-medium mb-2">No articles found</h3>
                        <p className="text-muted-foreground">Try adjusting your search query</p>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Contact Support Section */}
      <motion.div 
        className="mt-12 rounded-xl overflow-hidden shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Our support team is available to assist you with any questions or issues not covered in our documentation.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button onClick={() => navigate('/contact')} className="bg-white text-purple-600 hover:bg-gray-100 flex items-center gap-2 px-6">
              <Mail className="h-4 w-4" />
              Contact Support
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10 flex items-center gap-2 px-6">
              <Clock className="h-4 w-4" />
              View FAQ
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10 flex items-center gap-2 px-6">
              <Shield className="h-4 w-4" />
              Privacy & Security
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HelpCenterPage;
