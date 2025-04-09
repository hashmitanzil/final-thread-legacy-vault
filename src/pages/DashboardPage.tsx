
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Clock, 
  File, 
  MessageSquare, 
  Users, 
  Heart, 
  ShieldCheck, 
  BarChart3, 
  Send, 
  Clock4, 
  Bot, 
  FileKey, 
  Brain 
} from "lucide-react";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Sample data for charts
  const pieData = [
    { name: "Messages", value: 12, color: "#36A2EB" },
    { name: "Documents", value: 8, color: "#FF6384" },
    { name: "Media", value: 5, color: "#FFCE56" },
  ];
  
  const barData = [
    { name: "Jan", count: 2 },
    { name: "Feb", count: 5 },
    { name: "Mar", count: 3 },
    { name: "Apr", count: 7 },
    { name: "May", count: 4 },
    { name: "Jun", count: 8 },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.user_metadata?.name || "Friend"}</h1>
      <p className="text-muted-foreground mb-8">Create, manage, and schedule your legacy for your loved ones.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <MessageSquare className="mr-2 h-5 w-5 text-primary" />
              Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">12</p>
            <p className="text-sm text-muted-foreground">3 scheduled for delivery</p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => navigate("/messages")}
            >
              Manage Messages
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <File className="mr-2 h-5 w-5 text-primary" />
              Digital Assets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">25</p>
            <p className="text-sm text-muted-foreground">8 documents, 17 media files</p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => navigate("/digital-assets")}
            >
              View Vault
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="mr-2 h-5 w-5 text-primary" />
              Trusted Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">4</p>
            <p className="text-sm text-muted-foreground">2 with full access</p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => navigate("/trusted-contacts")}
            >
              Manage Contacts
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="mr-2 h-5 w-5 text-primary" />
              Next Delivery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">Jun 15, 2025</p>
            <p className="text-sm text-muted-foreground">Birthday message for Emma</p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => navigate("/messages")}
            >
              View Schedule
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Create and manage your digital legacy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-auto py-4 px-3 flex flex-col items-center justify-center text-center"
                onClick={() => navigate("/messages/new")}
              >
                <MessageSquare className="h-10 w-10 mb-2 text-primary" />
                <span className="text-sm font-medium">Create New Message</span>
                <span className="text-xs text-muted-foreground mt-1">Text, video or voice</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto py-4 px-3 flex flex-col items-center justify-center text-center"
                onClick={() => navigate("/digital-assets")}
              >
                <FileKey className="h-10 w-10 mb-2 text-primary" />
                <span className="text-sm font-medium">Upload to Vault</span>
                <span className="text-xs text-muted-foreground mt-1">Documents, photos, videos</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto py-4 px-3 flex flex-col items-center justify-center text-center"
                onClick={() => navigate("/trusted-contacts")}
              >
                <Users className="h-10 w-10 mb-2 text-primary" />
                <span className="text-sm font-medium">Add Trusted Contact</span>
                <span className="text-xs text-muted-foreground mt-1">Assign access permissions</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto py-4 px-3 flex flex-col items-center justify-center text-center"
                onClick={() => navigate("/end-of-life")}
              >
                <Heart className="h-10 w-10 mb-2 text-primary" />
                <span className="text-sm font-medium">Final Wishes</span>
                <span className="text-xs text-muted-foreground mt-1">End-of-life instructions</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto py-4 px-3 flex flex-col items-center justify-center text-center"
                onClick={() => navigate("/messages?time-capsule=true")}
              >
                <Clock4 className="h-10 w-10 mb-2 text-primary" />
                <span className="text-sm font-medium">Time Capsule</span>
                <span className="text-xs text-muted-foreground mt-1">Lock content until future date</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto py-4 px-3 flex flex-col items-center justify-center text-center"
                onClick={() => navigate("/export")}
              >
                <ShieldCheck className="h-10 w-10 mb-2 text-primary" />
                <span className="text-sm font-medium">Backup Legacy</span>
                <span className="text-xs text-muted-foreground mt-1">Export all content</span>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>AI Avatar</CardTitle>
            <CardDescription>
              Coming Soon
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            <div className="relative w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Brain className="h-12 w-12 text-primary opacity-50" />
              <div className="absolute -top-2 -right-2 bg-yellow-600 text-white text-xs px-2 py-1 rounded-full">
                Soon
              </div>
            </div>
            <h3 className="font-medium text-lg mb-1">Digital Memory Preservation</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create an AI version of yourself that your loved ones can interact with after you're gone. Preserve your voice, personality, and memories.
            </p>
            <Button variant="secondary" disabled>Join Waitlist</Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest actions and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <File className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Uploaded will document</p>
                  <p className="text-sm text-muted-foreground">Added to Legal Documents folder</p>
                  <p className="text-xs text-muted-foreground">Today at 9:42 AM</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Created new message</p>
                  <p className="text-sm text-muted-foreground">For Emma, scheduled for her 21st birthday</p>
                  <p className="text-xs text-muted-foreground">Yesterday at 3:15 PM</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Added new trusted contact</p>
                  <p className="text-sm text-muted-foreground">James Smith (Family)</p>
                  <p className="text-xs text-muted-foreground">May 3, 2025 at 11:23 AM</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Set up inactivity trigger</p>
                  <p className="text-sm text-muted-foreground">Will activate after 90 days of inactivity</p>
                  <p className="text-xs text-muted-foreground">April 28, 2025 at 2:07 PM</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Legacy Overview</CardTitle>
            <CardDescription>
              Content distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="type">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="type">By Type</TabsTrigger>
                <TabsTrigger value="time">Timeline</TabsTrigger>
              </TabsList>
              
              <TabsContent value="type" className="h-[240px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="time" className="h-[240px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#36A2EB" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
