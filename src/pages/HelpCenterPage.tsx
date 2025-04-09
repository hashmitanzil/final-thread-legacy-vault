
import React, { useState } from 'react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MessageSquare, FileQuestion, LifeBuoy, BookOpen } from "lucide-react";

const HelpCenterPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const faqs = [
    {
      question: "How does Digital Legacy Vault ensure my data is secure?",
      answer: "We employ bank-level encryption for all stored data. Your files and messages are encrypted both in transit and at rest. Additionally, we use multi-factor authentication and regular security audits to ensure your legacy data remains protected."
    },
    {
      question: "What happens to my legacy data after I pass away?",
      answer: "After your passing is confirmed (either by trusted contacts or through our verification system), your pre-set instructions are followed. Messages and files are delivered to recipients based on your preferences, and your trusted contacts gain access to any information you've designated for them."
    },
    {
      question: "Can I change the delivery date for a scheduled message?",
      answer: "Yes, you have complete control over all scheduled messages. You can modify the delivery date, edit the content, or delete the message entirely at any time before it's delivered."
    },
    {
      question: "How do trusted contacts verify my passing?",
      answer: "Trusted contacts can confirm your passing through our secure verification process. This typically involves uploading a death certificate or other official documentation. Multiple trusted contacts can be required for verification to ensure accuracy."
    },
    {
      question: "What happens if I stop using the platform for a long time?",
      answer: "If you enable inactivity triggers, the system will first attempt to contact you through various channels. If you don't respond within your specified timeframe, your pre-selected messages and files will be delivered according to your instructions."
    },
    {
      question: "Is there a limit to how much data I can store in my vault?",
      answer: "Storage limits depend on your subscription plan. Free accounts include 1GB of storage, while premium plans offer expanded storage options. You can view your current usage and upgrade your plan at any time from your account settings."
    },
    {
      question: "How do I create personalized messages for different recipients?",
      answer: "When creating a new message, you can select multiple recipients and choose to customize the content for each person. This allows you to create variations of your message tailored to your relationship with each recipient."
    },
    {
      question: "Can I export my entire vault as a backup?",
      answer: "Yes, you can export your entire vault as a ZIP file or printable report at any time. This gives you an offline backup of all your digital legacy information for personal archiving or legal purposes."
    }
  ];

  const filteredFaqs = searchQuery 
    ? faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  const categories = [
    { name: "Getting Started", icon: <BookOpen className="h-5 w-5 mr-2" />, count: 5 },
    { name: "Account Management", icon: <FileQuestion className="h-5 w-5 mr-2" />, count: 7 },
    { name: "Messages & Delivery", icon: <MessageSquare className="h-5 w-5 mr-2" />, count: 12 },
    { name: "Trusted Contacts", icon: <LifeBuoy className="h-5 w-5 mr-2" />, count: 6 }
  ];

  return (
    <div className="container mx-auto py-12 px-4 max-w-7xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Help Center</h1>
        <p className="text-xl text-muted-foreground mb-8">Find answers to common questions and get support</p>
        
        <div className="flex w-full max-w-lg mx-auto items-center space-x-2 mb-12">
          <Search className="w-5 h-5 text-muted-foreground absolute ml-3" />
          <Input
            placeholder="Search for answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Button type="submit">Search</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="md:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
          <div className="space-y-2">
            {categories.map((category, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start font-normal text-base hover:bg-muted"
              >
                {category.icon}
                {category.name}
                <span className="ml-auto bg-muted rounded-full px-2 py-0.5 text-xs">
                  {category.count}
                </span>
              </Button>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">Need more help?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Can't find what you're looking for? Contact our support team.
            </p>
            <Button className="w-full">
              <MessageSquare className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
          </div>
        </div>
        
        <div className="md:col-span-3">
          <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
          
          {filteredFaqs.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {filteredFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <Card className="border border-dashed">
              <CardContent className="py-8">
                <div className="text-center">
                  <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                  <p className="text-sm mt-2">Try using different keywords or contact support</p>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="mt-8 p-6 bg-primary/5 rounded-lg">
            <h3 className="text-xl font-medium mb-2">Still have questions?</h3>
            <p className="text-muted-foreground mb-4">
              Our support team is here to help you with any questions or issues you may have.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline">
                <BookOpen className="mr-2 h-4 w-4" />
                View Documentation
              </Button>
              <Button>
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;
