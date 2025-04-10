
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  User,
  UserPlus,
  Mail,
  Phone,
  Trash2,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Shield,
  AlertCircle,
  Info,
  Send,
  Edit,
  Users,
  UserCheck,
  Key,
  Lock,
} from 'lucide-react';

interface TrustedContact {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  relationship: string | null;
  role: 'verifier' | 'executor' | 'heir' | 'viewer';
  can_verify_death: boolean;
  can_trigger_messages: boolean;
  can_access_vault: boolean;
  temp_password: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  relationship: z.string().optional(),
  role: z.enum(['verifier', 'executor', 'heir', 'viewer']),
  can_verify_death: z.boolean().default(false),
  can_trigger_messages: z.boolean().default(false),
  can_access_vault: z.boolean().default(false),
});

const TrustedContactsPage: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<TrustedContact | null>(null);
  
  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      relationship: '',
      role: 'viewer',
      can_verify_death: false,
      can_trigger_messages: false,
      can_access_vault: false,
    },
  });
  
  // Fetch trusted contacts
  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['trustedContacts', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('trusted_contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as TrustedContact[];
    },
    enabled: !!user,
  });
  
  // Add contact mutation
  const addContactMutation = useMutation({
    mutationFn: async (data: z.infer<typeof contactFormSchema>) => {
      if (!user) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('trusted_contacts')
        .insert({
          user_id: user.id,
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          relationship: data.relationship || null,
          role: data.role,
          can_verify_death: data.can_verify_death,
          can_trigger_messages: data.can_trigger_messages,
          can_access_vault: data.can_access_vault,
          is_verified: false,
        });
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trustedContacts'] });
      toast({
        title: 'Contact added',
        description: 'Your trusted contact has been added successfully.',
      });
      setIsAddDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add contact',
        variant: 'destructive',
      });
    },
  });
  
  // Update contact mutation
  const updateContactMutation = useMutation({
    mutationFn: async (data: z.infer<typeof contactFormSchema> & { id: string }) => {
      if (!user) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('trusted_contacts')
        .update({
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          relationship: data.relationship || null,
          role: data.role,
          can_verify_death: data.can_verify_death,
          can_trigger_messages: data.can_trigger_messages,
          can_access_vault: data.can_access_vault,
          updated_at: new Date().toISOString(),
        })
        .eq('id', data.id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trustedContacts'] });
      toast({
        title: 'Contact updated',
        description: 'Your trusted contact has been updated successfully.',
      });
      setIsEditDialogOpen(false);
      setSelectedContact(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update contact',
        variant: 'destructive',
      });
    },
  });
  
  // Delete contact mutation
  const deleteContactMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('trusted_contacts')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trustedContacts'] });
      toast({
        title: 'Contact deleted',
        description: 'Your trusted contact has been deleted.',
      });
      setIsViewDialogOpen(false);
      setSelectedContact(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete contact',
        variant: 'destructive',
      });
    },
  });
  
  // Send invitation mutation
  const sendInvitationMutation = useMutation({
    mutationFn: async (contact: TrustedContact) => {
      // This is a placeholder for actual email sending
      // In a real implementation, you'd call a Supabase Edge Function to send the email
      
      // For now, we'll just generate a temporary password and update the contact
      const tempPassword = Math.random().toString(36).substring(2, 10);
      
      const { error } = await supabase
        .from('trusted_contacts')
        .update({
          temp_password: tempPassword,
          updated_at: new Date().toISOString(),
        })
        .eq('id', contact.id);
        
      if (error) throw error;
      
      return tempPassword;
    },
    onSuccess: (tempPassword, contact) => {
      queryClient.invalidateQueries({ queryKey: ['trustedContacts'] });
      
      // In a real implementation, the email would have been sent by now
      // We're showing the password for demo purposes
      toast({
        title: 'Invitation sent',
        description: `An invitation has been sent to ${contact.email}. Temporary password: ${tempPassword}`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send invitation',
        variant: 'destructive',
      });
    },
  });
  
  const handleEdit = (contact: TrustedContact) => {
    setSelectedContact(contact);
    
    form.reset({
      name: contact.name,
      email: contact.email,
      phone: contact.phone || '',
      relationship: contact.relationship || '',
      role: contact.role,
      can_verify_death: contact.can_verify_death,
      can_trigger_messages: contact.can_trigger_messages,
      can_access_vault: contact.can_access_vault,
    });
    
    setIsEditDialogOpen(true);
  };
  
  const handleView = (contact: TrustedContact) => {
    setSelectedContact(contact);
    setIsViewDialogOpen(true);
  };
  
  const handleAddSubmit = (data: z.infer<typeof contactFormSchema>) => {
    addContactMutation.mutate(data);
  };
  
  const handleEditSubmit = (data: z.infer<typeof contactFormSchema>) => {
    if (selectedContact) {
      updateContactMutation.mutate({
        ...data,
        id: selectedContact.id,
      });
    }
  };
  
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'verifier':
        return (
          <Badge variant="secondary" className="flex gap-1 items-center">
            <Shield className="h-3 w-3" />
            Verifier
          </Badge>
        );
      case 'executor':
        return (
          <Badge variant="default" className="flex gap-1 items-center">
            <Key className="h-3 w-3" />
            Executor
          </Badge>
        );
      case 'heir':
        return (
          <Badge variant="outline" className="flex gap-1 items-center bg-blue-50">
            <Users className="h-3 w-3" />
            Heir
          </Badge>
        );
      case 'viewer':
        return (
          <Badge variant="outline" className="flex gap-1 items-center">
            <Eye className="h-3 w-3" />
            Viewer
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {role}
          </Badge>
        );
    }
  };
  
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Trusted Contacts</h1>
          <p className="text-muted-foreground">
            Manage people you trust to help with your digital legacy
          </p>
        </div>
        
        <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" /> 
          Add Trusted Contact
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Trusted Contacts</CardTitle>
          <CardDescription>
            These people will help manage and execute your digital legacy
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-pulse">Loading contacts...</div>
            </div>
          ) : contacts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map(contact => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{contact.name}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {contact.email}
                        </span>
                        {contact.phone && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {contact.phone}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getRoleBadge(contact.role)}
                      {contact.relationship && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {contact.relationship}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {contact.can_verify_death && (
                          <Badge variant="outline" className="justify-start">
                            <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                            Verify Death
                          </Badge>
                        )}
                        {contact.can_trigger_messages && (
                          <Badge variant="outline" className="justify-start">
                            <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                            Trigger Messages
                          </Badge>
                        )}
                        {contact.can_access_vault && (
                          <Badge variant="outline" className="justify-start">
                            <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                            Access Vault
                          </Badge>
                        )}
                        {!contact.can_verify_death && !contact.can_trigger_messages && !contact.can_access_vault && (
                          <span className="text-xs text-muted-foreground">No special permissions</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {contact.is_verified ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      ) : contact.temp_password ? (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Invited
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                          <Info className="h-3 w-3 mr-1" />
                          Not Invited
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(contact)}>
                            <User className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(contact)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {!contact.is_verified && (
                            <DropdownMenuItem onClick={() => sendInvitationMutation.mutate(contact)}>
                              <Send className="h-4 w-4 mr-2" />
                              Send Invitation
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => deleteContactMutation.mutate(contact.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Users className="mx-auto h-10 w-10 text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-lg font-medium mb-1">No trusted contacts yet</h3>
              <p className="text-muted-foreground mb-4">
                Add people you trust to help manage and execute your digital legacy
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Your First Contact
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add Contact Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
        setIsAddDialogOpen(open);
        if (!open) {
          form.reset();
        }
      }}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add Trusted Contact</DialogTitle>
            <DialogDescription>
              Add someone you trust to help manage your digital legacy
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full Name" {...field} />
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
                        <Input placeholder="Email Address" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone Number" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="relationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Spouse, Child, Friend" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="executor">Executor (Full Access)</SelectItem>
                          <SelectItem value="verifier">Verifier (Confirms Death)</SelectItem>
                          <SelectItem value="heir">Heir (Receives Assets)</SelectItem>
                          <SelectItem value="viewer">Viewer (Limited Access)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      This determines what level of access they will have.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Permissions</h3>
                
                <FormField
                  control={form.control}
                  name="can_verify_death"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Can verify death</FormLabel>
                        <FormDescription>
                          This person can confirm your passing to trigger your end-of-life plan.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="can_trigger_messages"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Can trigger messages</FormLabel>
                        <FormDescription>
                          This person can manually trigger delivery of your messages.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="can_access_vault"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Can access vault</FormLabel>
                        <FormDescription>
                          This person can access your digital asset vault after your passing.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={addContactMutation.isPending}
                >
                  {addContactMutation.isPending ? 'Adding...' : 'Add Contact'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Contact Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        if (!open) {
          setSelectedContact(null);
        }
      }}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Trusted Contact</DialogTitle>
            <DialogDescription>
              Update the details and permissions for this contact
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditSubmit)} className="space-y-6">
              {/* Same form fields as in Add Dialog */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full Name" {...field} />
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
                        <Input placeholder="Email Address" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone Number" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="relationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Spouse, Child, Friend" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="executor">Executor (Full Access)</SelectItem>
                          <SelectItem value="verifier">Verifier (Confirms Death)</SelectItem>
                          <SelectItem value="heir">Heir (Receives Assets)</SelectItem>
                          <SelectItem value="viewer">Viewer (Limited Access)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      This determines what level of access they will have.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Permissions</h3>
                
                <FormField
                  control={form.control}
                  name="can_verify_death"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Can verify death</FormLabel>
                        <FormDescription>
                          This person can confirm your passing to trigger your end-of-life plan.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="can_trigger_messages"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Can trigger messages</FormLabel>
                        <FormDescription>
                          This person can manually trigger delivery of your messages.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="can_access_vault"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Can access vault</FormLabel>
                        <FormDescription>
                          This person can access your digital asset vault after your passing.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={updateContactMutation.isPending}
                >
                  {updateContactMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* View Contact Dialog */}
      {selectedContact && (
        <Dialog open={isViewDialogOpen} onOpenChange={(open) => {
          setIsViewDialogOpen(open);
          if (!open) {
            setSelectedContact(null);
          }
        }}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                {selectedContact.name}
              </DialogTitle>
              <DialogDescription>
                Trusted contact details and permissions
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedContact.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedContact.email}</span>
                    </div>
                    {selectedContact.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedContact.phone}</span>
                      </div>
                    )}
                    {selectedContact.relationship && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedContact.relationship}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Role & Status</h3>
                  <div className="space-y-2">
                    <div>
                      {getRoleBadge(selectedContact.role)}
                    </div>
                    <div>
                      {selectedContact.is_verified ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      ) : selectedContact.temp_password ? (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Invited
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                          <Info className="h-3 w-3 mr-1" />
                          Not Invited
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Added on {format(new Date(selectedContact.created_at), 'PP')}
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Permissions</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    {selectedContact.can_verify_death ? (
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                    )}
                    <div>
                      <div className="font-medium">Verify Death</div>
                      <div className="text-sm text-muted-foreground">
                        Can confirm your passing to trigger your end-of-life plan
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    {selectedContact.can_trigger_messages ? (
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                    )}
                    <div>
                      <div className="font-medium">Trigger Messages</div>
                      <div className="text-sm text-muted-foreground">
                        Can manually trigger delivery of your messages
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    {selectedContact.can_access_vault ? (
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                    )}
                    <div>
                      <div className="font-medium">Access Vault</div>
                      <div className="text-sm text-muted-foreground">
                        Can access your digital asset vault after your passing
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="flex justify-between items-center sm:justify-between">
                <Button 
                  variant="destructive"
                  onClick={() => deleteContactMutation.mutate(selectedContact.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                
                <div className="flex gap-2">
                  {!selectedContact.is_verified && (
                    <Button 
                      onClick={() => sendInvitationMutation.mutate(selectedContact)}
                      variant="secondary"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {selectedContact.temp_password ? 'Resend Invitation' : 'Send Invitation'}
                    </Button>
                  )}
                  
                  <Button 
                    onClick={() => {
                      setIsViewDialogOpen(false);
                      handleEdit(selectedContact);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TrustedContactsPage;
