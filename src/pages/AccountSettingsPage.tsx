
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useQuery } from '@tanstack/react-query';
import { UserCircle, Lock, Shield, Calendar, BellRing } from 'lucide-react';

const profileFormSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
});

const passwordFormSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string().min(8, 'Password must be at least 8 characters'),
}).refine(data => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
});

const AccountSettingsPage: React.FC = () => {
  const { user, logout, deleteAccount, updateProfile } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [confirmDeleteText, setConfirmDeleteText] = useState('');
  
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: '',
      email: user?.email || '',
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  // Fetch user profile
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      
      // Set form defaults with current values
      profileForm.setValue('full_name', data.full_name || '');
      
      return data;
    },
    enabled: !!user,
  });

  // Query login activity
  const { data: loginActivity, isLoading: isLoadingActivity } = useQuery({
    queryKey: ['loginActivity', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('login_activity')
        .select('*')
        .eq('user_id', user.id)
        .order('login_time', { ascending: false })
        .limit(1)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      return data || null;
    },
    enabled: !!user,
  });

  const onSubmitProfile = async (data: z.infer<typeof profileFormSchema>) => {
    try {
      setIsUpdating(true);
      
      // Only update profile if full_name changed
      if (data.full_name !== profile?.full_name) {
        await updateProfile({ full_name: data.full_name });
      }
      
      // Email update requires special auth handling
      if (data.email !== user?.email) {
        const { error } = await supabase.auth.updateUser({ email: data.email });
        if (error) throw error;
        
        toast({
          title: 'Email update initiated',
          description: 'Please check your new email address to confirm the change.',
        });
      }
      
    } catch (error) {
      toast({
        title: 'Update failed',
        description: error instanceof Error ? error.message : 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const onSubmitPassword = async (data: z.infer<typeof passwordFormSchema>) => {
    try {
      setIsChangingPassword(true);
      
      // First verify current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: data.current_password,
      });
      
      if (signInError) {
        throw new Error('Current password is incorrect');
      }
      
      // Then update password
      const { error } = await supabase.auth.updateUser({
        password: data.new_password,
      });
      
      if (error) throw error;
      
      toast({
        title: 'Password updated',
        description: 'Your password has been successfully changed.',
      });
      
      passwordForm.reset();
      
    } catch (error) {
      toast({
        title: 'Password change failed',
        description: error instanceof Error ? error.message : 'Failed to update password',
        variant: 'destructive',
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmDeleteText !== 'DELETE') {
      toast({
        title: 'Confirmation failed',
        description: 'Please type DELETE to confirm account deletion',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      await deleteAccount();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to schedule account deletion',
        variant: 'destructive',
      });
    }
  };

  // Format date as Month day, year
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p>Please log in to access account settings.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your account profile details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-4">
                  <FormField
                    control={profileForm.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? 'Updating...' : 'Update Profile'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Password Change */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Change Password
              </CardTitle>
              <CardDescription>
                Update your account password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="current_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Your current password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="new_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Your new password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirm_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Confirm new password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isChangingPassword}>
                    {isChangingPassword ? 'Changing...' : 'Change Password'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BellRing className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Manage how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="email-notifications" defaultChecked />
                  <Label htmlFor="email-notifications">Receive email notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="login-alerts" defaultChecked />
                  <Label htmlFor="login-alerts">Send alerts for new logins</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="inactivity-warnings" defaultChecked />
                  <Label htmlFor="inactivity-warnings">
                    Send warnings before inactivity triggers
                  </Label>
                </div>
                <Button variant="outline">Save Preferences</Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>
                Actions here can permanently affect your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete Account</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      <p className="mb-4">
                        This will schedule your account for deletion after 15 days. 
                        After this period, all your data will be permanently removed.
                      </p>
                      <p className="mb-4">
                        You can cancel this process by logging in again during the 15-day period.
                      </p>
                      <div className="mt-4">
                        <Label htmlFor="confirm-delete" className="text-sm font-medium">
                          To confirm, type DELETE below:
                        </Label>
                        <Input 
                          id="confirm-delete"
                          value={confirmDeleteText}
                          onChange={(e) => setConfirmDeleteText(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setConfirmDeleteText('')}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteAccount}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Account Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Account Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label className="text-muted-foreground">Email</Label>
                <p>{user.email}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Account Created</Label>
                <p>{profile?.created_at ? formatDate(profile.created_at) : 'Loading...'}</p>
              </div>
              <Separator className="my-4" />
              <div className="space-y-1">
                <Label className="text-muted-foreground">Last Login</Label>
                <p>{loginActivity?.login_time ? formatDate(loginActivity.login_time) : 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Proof of Life Required By</Label>
                <p className="font-semibold">
                  {loginActivity?.next_required_login 
                    ? formatDate(loginActivity.next_required_login) 
                    : 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Security Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" /> 
                Security Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Password strength</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Strong</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Two-factor auth</span>
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Not enabled</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Recovery email</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Verified</span>
                </div>

                <Button variant="outline" className="w-full mt-4">
                  <Shield className="h-4 w-4 mr-2" />
                  Enable Two-Factor Auth
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Activity Log */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium">Login</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {loginActivity?.login_time 
                      ? new Date(loginActivity.login_time).toLocaleString() 
                      : 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Password changed</div>
                  <div className="text-xs text-muted-foreground mt-1">Never</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Profile updated</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {profile?.updated_at && profile.updated_at !== profile.created_at 
                      ? new Date(profile.updated_at).toLocaleString() 
                      : 'Never'}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full">
                View Full Activity Log
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsPage;
