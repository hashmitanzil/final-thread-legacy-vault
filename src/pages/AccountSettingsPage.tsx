
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Settings, 
  Bell, 
  Shield, 
  Key, 
  Lock, 
  LogOut, 
  User, 
  Trash2,
  Upload,
  Calendar, 
  Clock
} from 'lucide-react';

const profileFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const AccountSettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accountDeleteOpen, setAccountDeleteOpen] = useState(false);
  
  const defaultValues: Partial<ProfileFormValues> = {
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setIsSubmitting(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Profile updated',
        description: 'Your profile information has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Update failed',
        description: 'There was an error updating your profile.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Account scheduled for deletion',
        description: 'Your account will be permanently deleted in 15 days. You can cancel this by logging back in.',
      });
      
      logout();
      navigate('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'There was an error processing your request.',
        variant: 'destructive',
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your profile, security, and notification preferences
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="danger" className="flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            <span>Danger Zone</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your profile details and personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-start sm:justify-start">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-center gap-2 sm:items-start">
                  <h3 className="text-lg font-medium">{user?.name}</h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Change Avatar
                  </Button>
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 123-4567" {...field} />
                        </FormControl>
                        <FormDescription>
                          For recovery and trusted contact verification purposes
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your password and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Password</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Change Password</p>
                    <p className="text-sm text-muted-foreground">
                      Update your password regularly to keep your account secure
                    </p>
                  </div>
                  <Button variant="outline">
                    <Key className="h-4 w-4 mr-2" />
                    Update Password
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4 pt-6 border-t">
                <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable 2FA</p>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
              
              <div className="space-y-4 pt-6 border-t">
                <h3 className="text-lg font-medium">Activity Log</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Login History</p>
                    <p className="text-sm text-muted-foreground">
                      View your recent login activities
                    </p>
                  </div>
                  <Button variant="outline">
                    <Clock className="h-4 w-4 mr-2" />
                    View Log
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4 pt-6 border-t">
                <h3 className="text-lg font-medium">Last Login Proof</h3>
                <div>
                  <p className="text-sm text-muted-foreground">
                    You must log in at least once every 30 days to indicate you're still alive.
                    If you don't log in, your trusted contacts will be notified.
                  </p>
                  <div className="mt-2 p-3 bg-muted rounded-md flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Last login: Today</span>
                    </div>
                    <div className="text-sm text-green-600 font-medium">Active</div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Next required login: <span className="font-medium">May 8, 2025</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Control how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Notifications</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Login Alerts</p>
                    <p className="text-sm text-muted-foreground">
                      Receive an email when someone logs into your account
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Trusted Contact Updates</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified when a trusted contact accepts or declines
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Login Reminders</p>
                    <p className="text-sm text-muted-foreground">
                      Receive reminders to log in before the 30-day period ends
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <div className="space-y-4 pt-6 border-t">
                <h3 className="text-lg font-medium">System Notifications</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Security Alerts</p>
                    <p className="text-sm text-muted-foreground">
                      Important security notifications and warnings
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New Features</p>
                    <p className="text-sm text-muted-foreground">
                      Updates about new features and improvements
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="danger">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>
                Actions that will delete your data or remove your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Log out of all devices</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">End all active sessions</p>
                    <p className="text-sm text-muted-foreground">
                      This will sign you out from all devices except the current one
                    </p>
                  </div>
                  <Button variant="outline">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out All Devices
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4 pt-6 border-t">
                <h3 className="text-lg font-medium text-red-600">Delete Account</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Delete your Final Thread account</p>
                    <p className="text-sm text-muted-foreground">
                      Your account will be scheduled for deletion. All data will be permanently 
                      removed after 15 days, and this action cannot be undone.
                    </p>
                  </div>
                  <AlertDialog open={accountDeleteOpen} onOpenChange={setAccountDeleteOpen}>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will schedule your account for deletion. All your data, including messages, 
                          digital assets, and trusted contacts will be permanently removed after 15 days. 
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                          Yes, delete my account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountSettingsPage;
