
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LegacyStatsDashboard from '@/components/LegacyStatsDashboard';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  Clock,
  Mail,
  FileArchive,
  User,
  UserPlus,
  Heart,
  Download,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p>Please log in to view your dashboard.</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your digital legacy
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="plan" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="plan">Legacy Plan</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="plan">
              <Card>
                <CardHeader>
                  <CardTitle>Complete Your Legacy Plan</CardTitle>
                  <CardDescription>
                    Take steps to ensure your digital legacy is preserved
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="mr-4 p-2 rounded-full bg-blue-100">
                        <Mail className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">Legacy Messages</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Create scheduled messages to be delivered to your loved ones in the future.
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center"
                          onClick={() => navigate('/messages')}
                        >
                          Manage Messages
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-start p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="mr-4 p-2 rounded-full bg-purple-100">
                        <Clock className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">Time Capsules</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Lock away messages and files to be opened at a future date.
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center"
                          onClick={() => navigate('/time-capsule')}
                        >
                          Manage Time Capsules
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-start p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="mr-4 p-2 rounded-full bg-amber-100">
                        <FileArchive className="h-5 w-5 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">Digital Asset Vault</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Store important documents, photos, and other digital assets securely.
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center"
                          onClick={() => navigate('/digital-assets')}
                        >
                          Manage Digital Assets
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-start p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="mr-4 p-2 rounded-full bg-red-100">
                        <Heart className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">End-of-Life Instructions</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Document your final wishes and preferences for your loved ones.
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center"
                          onClick={() => navigate('/end-of-life')}
                        >
                          Manage Instructions
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Recent changes to your digital legacy plan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="flex items-start">
                      <div className="relative mr-4">
                        <div className="p-2 rounded-full bg-blue-100">
                          <Mail className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                          <div className="w-px h-full bg-border absolute top-[30px]"></div>
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">Message Created</p>
                        <p className="text-xs text-muted-foreground">Today at 10:30 AM</p>
                        <p className="text-sm mt-1">You created a new legacy message for your family.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="relative mr-4">
                        <div className="p-2 rounded-full bg-purple-100">
                          <UserPlus className="h-4 w-4 text-purple-600" />
                        </div>
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                          <div className="w-px h-full bg-border absolute top-[30px]"></div>
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">Trusted Contact Added</p>
                        <p className="text-xs text-muted-foreground">Yesterday at 2:15 PM</p>
                        <p className="text-sm mt-1">You added Jane Doe as a trusted contact.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="relative mr-4">
                        <div className="p-2 rounded-full bg-green-100">
                          <Download className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">Vault Export</p>
                        <p className="text-xs text-muted-foreground">April 5, 2025</p>
                        <p className="text-sm mt-1">You exported a backup of your digital legacy vault.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/export')}>
                    View All Activity
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <LegacyStatsDashboard />
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <User className="h-5 w-5 mr-2 text-primary" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Email</span>
                <span className="text-sm font-medium">{user.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Plan</span>
                <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                  Free Plan
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Storage</span>
                <span className="text-sm font-medium">1 GB</span>
              </div>
              <div className="pt-3 mt-3 border-t flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => navigate('/settings')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4"
                  >
                    <path d="M12 2H2v10h10V2Z" />
                    <path d="M22 2h-6v6h6V2Z" />
                    <path d="M22 12h-6v10h6V12Z" />
                    <path d="M12 12H2v10h10V12Z" />
                  </svg>
                  Account Settings
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => navigate('/export')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export Your Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
