
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Search, 
  HelpCircle, 
  Mail, 
  MessageSquare, 
  Bookmark,
  FileQuestion,
  ShieldCheck,
  Key,
  Archive
} from 'lucide-react';

const faqs = [
  {
    category: 'general',
    title: 'What is Legacy Vault?',
    content: 'Legacy Vault is a secure digital platform that helps you prepare and organize your legacy information, important documents, final wishes, and digital assets. It provides a centralized place to store information that will be important for your loved ones in the future.',
  },
  {
    category: 'general',
    title: 'How secure is my data?',
    content: 'Legacy Vault uses end-to-end encryption to protect your data. Your information is encrypted during transit and at rest. We use industry-standard security practices and regular security audits to ensure your data remains private and secure.',
  },
  {
    category: 'general',
    title: 'Can I cancel my subscription?',
    content: 'Yes, you can cancel your subscription at any time. After cancellation, you will still have access to your account until the end of your current billing period. After that, your account will be downgraded to the free tier with limited storage.',
  },
  {
    category: 'features',
    title: 'What are Time Capsules?',
    content: 'Time Capsules allow you to create messages or upload files that are locked until a future date of your choosing. This feature is perfect for creating birthday messages, future advice, or preserving memories to be accessed at a significant future date.',
  },
  {
    category: 'features',
    title: 'How do Trusted Contacts work?',
    content: 'Trusted Contacts are individuals you designate to have access to certain information in your account. You can specify which contacts have access to which parts of your legacy information. They will receive instructions on how to access the information when needed.',
  },
  {
    category: 'features',
    title: 'What is the Digital Asset Vault?',
    content: 'The Digital Asset Vault is a secure storage space for your important digital files such as legal documents, photos, videos, financial information, and more. Files are encrypted and can be organized, tagged, and set with specific access permissions.',
  },
  {
    category: 'account',
    title: 'How do I reset my password?',
    content: 'To reset your password, click on the "Forgot Password" link on the login page. Enter the email address associated with your account, and you\'ll receive an email with instructions to reset your password.',
  },
  {
    category: 'account',
    title: 'Can I change my email address?',
    content: 'Yes, you can change your email address in the Account Settings page. For security reasons, a verification email will be sent to both your old and new email addresses to confirm the change.',
  },
  {
    category: 'account',
    title: 'What happens to my account if I pass away?',
    content: 'Legacy Vault includes an inactivity protocol that can be customized in your settings. If you don\'t log in for an extended period, the system can send notifications to your trusted contacts with instructions on accessing designated information. You can customize these settings in the Account Settings page.',
  },
  {
    category: 'technical',
    title: 'Which browsers are supported?',
    content: 'Legacy Vault supports the latest versions of Chrome, Firefox, Safari, and Edge. For the best experience and security, we recommend keeping your browser updated to the latest version.',
  },
  {
    category: 'technical',
    title: 'Is there a mobile app?',
    content: 'Currently, Legacy Vault is optimized as a web application that works on both desktop and mobile browsers. A dedicated mobile app is under development and will be released in the near future.',
  },
  {
    category: 'technical',
    title: 'How do I export my data?',
    content: 'You can export your data from the Export page in your account settings. Legacy Vault provides options to export your data in various formats, including PDF for documents and ZIP for all files and information.',
  },
  {
    category: 'privacy',
    title: 'Who can see my information?',
    content: 'Only you have access to your information by default. You can specify trusted contacts and set permissions for what information they can access and under what circumstances. Legacy Vault staff cannot access your encrypted data.',
  },
  {
    category: 'privacy',
    title: 'How long is my data stored?',
    content: 'Your data is stored as long as your account is active. If you choose to delete your account, all your data will be permanently deleted from our servers within 30 days as per our data retention policy.',
  },
  {
    category: 'privacy',
    title: 'Is my information shared with third parties?',
    content: 'Legacy Vault does not sell or share your personal information with third parties for marketing purposes. We may use trusted service providers to help deliver our services, but they are bound by strict confidentiality agreements and only process data as instructed.',
  },
];

const categories = [
  { id: 'all', name: 'All Questions', icon: <HelpCircle className="h-4 w-4" /> },
  { id: 'general', name: 'General', icon: <Bookmark className="h-4 w-4" /> },
  { id: 'features', name: 'Features', icon: <Archive className="h-4 w-4" /> },
  { id: 'account', name: 'Account', icon: <Key className="h-4 w-4" /> },
  { id: 'technical', name: 'Technical', icon: <FileQuestion className="h-4 w-4" /> },
  { id: 'privacy', name: 'Privacy & Security', icon: <ShieldCheck className="h-4 w-4" /> },
];

const HelpCenterPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch = faq.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        faq.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-4xl font-bold mb-4">Help Center</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          Find answers to common questions about Legacy Vault, or contact our support team for personalized assistance.
        </p>
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search for answers..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <motion.div 
          className="md:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="space-y-2">
            <h3 className="font-medium mb-3">Categories</h3>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.icon}
                <span className="ml-2">{category.name}</span>
              </Button>
            ))}
          </div>

          <div className="mt-8 bg-muted/30 p-4 rounded-lg">
            <h3 className="font-medium mb-3 flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Need more help?
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <Button className="w-full" variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
          </div>
        </motion.div>

        <motion.div 
          className="md:col-span-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {filteredFaqs.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {filteredFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.title}</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{faq.content}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-10">
              <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No results found</h3>
              <p className="text-muted-foreground">
                We couldn't find any FAQs matching your search. Try different keywords or contact support.
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Start Guide</CardTitle>
                <CardDescription>
                  New to Legacy Vault? Learn how to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <ul className="space-y-2">
                  <li>• Set up your profile and account preferences</li>
                  <li>• Add your first trusted contact</li>
                  <li>• Upload important documents to the Digital Vault</li>
                  <li>• Create your first time capsule</li>
                  <li>• Document your end-of-life wishes</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Video Tutorials</CardTitle>
                <CardDescription>
                  Watch step-by-step guides to using Legacy Vault
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <ul className="space-y-2">
                  <li>• Getting started with Legacy Vault</li>
                  <li>• Managing your digital assets</li>
                  <li>• Setting up trusted contacts</li>
                  <li>• Creating and managing time capsules</li>
                  <li>• Securing your account</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HelpCenterPage;
