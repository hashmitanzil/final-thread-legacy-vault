
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  HelpCircle, 
  FileText, 
  BookOpen, 
  MessageCircle, 
  Laptop,
  Lock,
  User,
  FileArchive,
  Clock,
  Users,
  Mail
} from 'lucide-react';
import { motion } from 'framer-motion';

const HelpCenterPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const generalFaqs = [
    {
      question: "What is Final Thread?",
      answer: "Final Thread is a secure digital legacy platform that helps you plan and manage your digital assets, create time-delayed messages, and ensure your digital legacy is preserved and passed on according to your wishes."
    },
    {
      question: "How secure is my data on Final Thread?",
      answer: "Final Thread employs end-to-end encryption, secure storage, and follows industry best practices for data security. Your information is stored on encrypted servers, and we regularly perform security audits to ensure your data remains protected."
    },
    {
      question: "Can I access Final Thread on mobile devices?",
      answer: "Yes, Final Thread is designed to be responsive and works on desktop computers, tablets, and mobile phones. You can access all features through any modern web browser."
    },
    {
      question: "What happens to my account if I stop paying for the subscription?",
      answer: "If your subscription lapses, your account will be downgraded to the free tier with limited functionality. Your data will be preserved for 30 days, during which you can reactivate your subscription. After 30 days, some data may be archived according to our data retention policy."
    },
    {
      question: "How can I delete my account?",
      answer: "You can delete your account from the Account Settings page. Please note that account deletion is permanent and will remove all your data from our servers after a 14-day grace period."
    }
  ];
  
  const messagesFaqs = [
    {
      question: "How do I create a final message?",
      answer: "Navigate to the Messages section from your dashboard, click on 'Create New Message', and follow the guided process to compose your message, select recipients, and set delivery conditions."
    },
    {
      question: "Can I edit or delete messages after they've been scheduled?",
      answer: "Yes, you can edit or delete any message that hasn't been delivered yet. Once a message has been delivered, it cannot be recalled or edited."
    },
    {
      question: "How are message delivery conditions verified?",
      answer: "Final Thread uses a secure verification system that includes automated checks and optional manual verification through your trusted contacts to ensure message delivery conditions are met before releasing messages."
    },
    {
      question: "Can I attach files to my messages?",
      answer: "Yes, you can attach documents, photos, videos, and other files to your messages up to the storage limit of your subscription plan."
    },
    {
      question: "Will recipients know about the messages before they're delivered?",
      answer: "No, recipients will not be notified about pending messages. They will only receive notification when a message is actually delivered according to your specified conditions."
    }
  ];
  
  const digitalAssetsFaqs = [
    {
      question: "What types of digital assets can I store?",
      answer: "You can store various types of digital assets including documents, images, videos, login credentials for online accounts, cryptocurrency information, and other important digital files."
    },
    {
      question: "Is there a size limit for uploaded files?",
      answer: "Yes, individual files are limited to 50MB on the standard plan and 250MB on the premium plan. The total storage space depends on your subscription tier."
    },
    {
      question: "How do I organize my digital assets?",
      answer: "You can organize assets using folders, tags, and categories. You can also add descriptions and notes to help your beneficiaries understand the significance of each asset."
    },
    {
      question: "Can I control who has access to specific digital assets?",
      answer: "Yes, you can set access permissions for each asset or group of assets, specifying which trusted contacts can access them and under what conditions."
    },
    {
      question: "Are my digital assets encrypted?",
      answer: "Yes, all digital assets are encrypted both during transit and while stored on our servers. Only you and your designated trusted contacts (when conditions are met) can decrypt and access them."
    }
  ];
  
  const timeCapsuleFaqs = [
    {
      question: "What is a Time Capsule?",
      answer: "A Time Capsule is a feature that allows you to lock away messages or files until a future date. It's great for milestone birthdays, anniversaries, or simply sending a message to your future self."
    },
    {
      question: "How do I create a Time Capsule?",
      answer: "Go to the Time Capsule page, click 'Create New Time Capsule', add your content (message or file), set the unlock date, and save. Your content will be locked until the specified date."
    },
    {
      question: "Can I unlock a Time Capsule before the scheduled date?",
      answer: "No, once a Time Capsule is locked, it remains locked until the scheduled unlock date. This ensures the integrity of the time capsule concept."
    },
    {
      question: "What happens when a Time Capsule is unlocked?",
      answer: "When a Time Capsule reaches its unlock date, it becomes accessible to you. If it's a message, you can read it directly on the platform. If it's a file, you can download it."
    },
    {
      question: "Can I share Time Capsules with others?",
      answer: "Currently, Time Capsules are only available to the creator. Future updates may include the ability to create shared Time Capsules or ones that are released to designated recipients."
    }
  ];
  
  const trustedContactsFaqs = [
    {
      question: "What are Trusted Contacts?",
      answer: "Trusted Contacts are individuals you designate to help manage your digital legacy. They can verify conditions for message delivery, access designated digital assets, and help execute your wishes."
    },
    {
      question: "How do I add a Trusted Contact?",
      answer: "Navigate to the Trusted Contacts section, click 'Add New Contact', and enter their details including name, email, and relationship. They'll receive an invitation to confirm their role."
    },
    {
      question: "What permissions can I give to Trusted Contacts?",
      answer: "You can customize what each contact can access, including specific digital assets, messages, or the ability to verify conditions for message delivery."
    },
    {
      question: "Can Trusted Contacts see my messages before they're delivered?",
      answer: "No, Trusted Contacts cannot see the content of your messages. They can only verify conditions and help with the delivery process according to the permissions you've granted."
    },
    {
      question: "How do I remove a Trusted Contact?",
      answer: "You can remove a Trusted Contact at any time from the Trusted Contacts management page. The contact will be notified that they are no longer serving in this role."
    }
  ];
  
  // Filter FAQs based on search query
  const filterFaqs = (faqs) => {
    if (!searchQuery.trim()) return faqs;
    
    return faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  
  const filteredGeneralFaqs = filterFaqs(generalFaqs);
  const filteredMessagesFaqs = filterFaqs(messagesFaqs);
  const filteredAssetsFaqs = filterFaqs(digitalAssetsFaqs);
  const filteredTimeCapsuleFaqs = filterFaqs(timeCapsuleFaqs);
  const filteredContactsFaqs = filterFaqs(trustedContactsFaqs);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-10">
        <motion.h1 
          className="text-4xl font-bold mb-4" 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Help Center
        </motion.h1>
        <motion.p 
          className="text-muted-foreground max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Find answers to frequently asked questions and learn how to make the most of your Final Thread account.
        </motion.p>
      </div>

      <motion.div 
        className="max-w-3xl mx-auto mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Search for answers..." 
            className="pl-10 py-6 text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <BookOpen className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Guides & Tutorials</CardTitle>
            <CardDescription>Step-by-step instructions for using every feature</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">View Guides</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <MessageCircle className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>Get help from our support team</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Contact Us</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <Laptop className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>System Status</CardTitle>
            <CardDescription>Check if our services are running properly</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">View Status</Button>
          </CardContent>
        </Card>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="w-full md:w-auto flex flex-wrap mb-6 justify-start">
            <TabsTrigger value="general" className="flex items-center">
              <HelpCircle className="mr-2 h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="assets" className="flex items-center">
              <FileArchive className="mr-2 h-4 w-4" />
              Digital Assets
            </TabsTrigger>
            <TabsTrigger value="timecapsule" className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              Time Capsule
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Trusted Contacts
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            {filteredGeneralFaqs.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {filteredGeneralFaqs.map((faq, i) => (
                  <AccordionItem value={`general-item-${i}`} key={i}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <p className="text-muted-foreground text-center py-6">No matching FAQs found. Try a different search term.</p>
            )}
          </TabsContent>
          
          <TabsContent value="messages">
            {filteredMessagesFaqs.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {filteredMessagesFaqs.map((faq, i) => (
                  <AccordionItem value={`messages-item-${i}`} key={i}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <p className="text-muted-foreground text-center py-6">No matching FAQs found. Try a different search term.</p>
            )}
          </TabsContent>
          
          <TabsContent value="assets">
            {filteredAssetsFaqs.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {filteredAssetsFaqs.map((faq, i) => (
                  <AccordionItem value={`assets-item-${i}`} key={i}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <p className="text-muted-foreground text-center py-6">No matching FAQs found. Try a different search term.</p>
            )}
          </TabsContent>
          
          <TabsContent value="timecapsule">
            {filteredTimeCapsuleFaqs.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {filteredTimeCapsuleFaqs.map((faq, i) => (
                  <AccordionItem value={`timecapsule-item-${i}`} key={i}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <p className="text-muted-foreground text-center py-6">No matching FAQs found. Try a different search term.</p>
            )}
          </TabsContent>
          
          <TabsContent value="contacts">
            {filteredContactsFaqs.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {filteredContactsFaqs.map((faq, i) => (
                  <AccordionItem value={`contacts-item-${i}`} key={i}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <p className="text-muted-foreground text-center py-6">No matching FAQs found. Try a different search term.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="bg-muted p-8 rounded-lg text-center">
        <h3 className="text-xl font-bold mb-4">Still need help?</h3>
        <p className="mb-6 text-muted-foreground">Our support team is ready to assist you with any questions or issues.</p>
        <Button>Contact Support</Button>
      </div>
    </div>
  );
};

export default HelpCenterPage;
