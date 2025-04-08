
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { MessageSquare, Users, Key, Clock, PlusCircle, FileText, Star, Lock, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  
  // Access user_metadata.name or fallback to email or generic "User"
  const userName = user?.user_metadata?.name || (user?.email ? user.email.split('@')[0] : 'User');
  
  const dashboardCards = [
    {
      title: 'Messages',
      description: 'Create and manage your final messages',
      icon: <MessageSquare className="h-6 w-6" />,
      count: 3,
      link: '/messages'
    },
    {
      title: 'Trusted Contacts',
      description: 'Manage people who can access your vault',
      icon: <Users className="h-6 w-6" />,
      count: 2,
      link: '/trusted-contacts'
    },
    {
      title: 'Crypto Keys',
      description: 'Secure your digital asset access keys',
      icon: <Key className="h-6 w-6" />,
      count: 1,
      link: '/crypto-vault'
    },
    {
      title: 'Scheduled Deliveries',
      description: 'Manage your message delivery schedule',
      icon: <Clock className="h-6 w-6" />,
      count: 5,
      link: '/scheduled-deliveries'
    }
  ];

  const recentMessages = [
    {
      title: "To My Children",
      recipient: "Family Group",
      deliveryDate: "After my passing",
      type: "Text",
      createdAt: "2023-08-15"
    },
    {
      title: "Digital Assets Guide",
      recipient: "Sarah Johnson",
      deliveryDate: "After my passing",
      type: "Document",
      createdAt: "2023-06-20"
    },
    {
      title: "Birthday Message 2030",
      recipient: "Michael Smith",
      deliveryDate: "April 12, 2030",
      type: "Video",
      createdAt: "2023-04-15"
    }
  ];

  const todoItems = [
    { text: "Complete your profile", done: true },
    { text: "Add at least one trusted contact", done: true },
    { text: "Create your first message", done: true },
    { text: "Set up your crypto vault", done: false },
    { text: "Configure delivery triggers", done: false }
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {userName}</h1>
          <p className="text-muted-foreground">
            Your digital legacy vault is secure and ready for your messages.
          </p>
        </div>

        <div className="flex gap-4">
          <Link to="/messages/new">
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" /> 
              New Message
            </Button>
          </Link>
          <Link to="/settings">
            <Button variant="outline">Settings</Button>
          </Link>
        </div>
      </div>

      {/* Vault Completion */}
      <Card className="mb-8">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Vault Completion</CardTitle>
          <CardDescription>
            Complete all steps to ensure your legacy is properly protected
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">60% Complete</span>
              <span className="text-sm text-muted-foreground">3 of 5 tasks complete</span>
            </div>
            <Progress value={60} className="h-2" />
          </div>
          <div className="mt-4 space-y-2">
            {todoItems.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${item.done ? 'bg-green-500' : 'border border-gray-300'}`}>
                  {item.done && <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                </div>
                <span className={item.done ? 'line-through text-muted-foreground' : ''}>{item.text}</span>
                {!item.done && (
                  <Button variant="ghost" size="sm" className="ml-auto h-8 text-xs">
                    Complete
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardCards.map((card, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">{card.title}</CardTitle>
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                {card.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.count}</div>
              <p className="text-sm text-muted-foreground">{card.description}</p>
            </CardContent>
            <CardFooter>
              <Link to={card.link} className="text-primary text-sm hover:underline">
                Manage {card.title}
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Messages */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Messages
            </CardTitle>
            <CardDescription>
              Your most recently created messages and their delivery status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMessages.map((message, index) => (
                <div key={index} className="p-4 rounded-lg border border-border flex justify-between">
                  <div>
                    <div className="font-medium">{message.title}</div>
                    <div className="text-sm text-muted-foreground">To: {message.recipient}</div>
                    <div className="text-sm mt-1">
                      <span className="inline-flex items-center mr-3">
                        <Clock className="h-3 w-3 mr-1" />
                        {message.deliveryDate}
                      </span>
                      <span className="inline-flex items-center">
                        <FileText className="h-3 w-3 mr-1" />
                        {message.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <Link to={`/messages/${index + 1}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                    <div className="text-xs text-muted-foreground mt-3">
                      Created: {message.createdAt}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t bg-muted/50 flex justify-between">
            <span className="text-sm text-muted-foreground">
              Showing 3 of 3 messages
            </span>
            <Link to="/messages">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Tips and Security Status */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Security Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Star className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium">Good Security</div>
                  <div className="text-sm text-muted-foreground">Your vault is secure</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span>Two-factor authentication active</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span>Password strength: Strong</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center">
                    <span className="text-white font-bold text-xs">!</span>
                  </div>
                  <span>Recovery email needs verification</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Tips & Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 rounded-lg border border-blue-100 bg-blue-50 text-sm">
                  Consider recording video messages for special occasions like birthdays or anniversaries.
                </div>
                <div className="p-3 rounded-lg border border-purple-100 bg-purple-50 text-sm">
                  Update your trusted contacts at least once a year to ensure contact information is accurate.
                </div>
                <div className="p-3 rounded-lg border border-teal-100 bg-teal-50 text-sm">
                  Store your cryptocurrency seed phrases and important passwords in the encrypted vault.
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link to="/tips" className="text-primary text-sm hover:underline">
                View all tips
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
