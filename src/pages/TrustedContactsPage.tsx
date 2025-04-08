
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { 
  AlertCircle, 
  UserPlus, 
  Trash2, 
  Mail, 
  Phone, 
  UserCircle, 
  Heart,
  PencilLine 
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface TrustedContact {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  relationship?: string;
  created_at: string;
}

const formSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  relationship: z.string().optional(),
});

const TrustedContactsPage: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<TrustedContact | null>(null);
  const queryClient = useQueryClient();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      relationship: '',
    },
  });

  // Query trusted contacts
  const { data: contacts, isLoading } = useQuery({
    queryKey: ['trustedContacts', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('trusted_contacts')
        .select('*')
        .order('created_at');
        
      if (error) throw error;
      return data as TrustedContact[];
    },
    enabled: !!user,
  });

  // Add trusted contact mutation
  const addContactMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      if (!user) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('trusted_contacts')
        .insert({
          user_id: user.id,
          ...data
        });
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trustedContacts'] });
      toast({
        title: 'Contact added',
        description: 'Trusted contact has been added successfully.',
      });
      setIsDialogOpen(false);
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

  // Update trusted contact mutation
  const updateContactMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema> & { id: string }) => {
      if (!user) throw new Error('Not authenticated');
      
      const { id, ...contactData } = data;
      const { error } = await supabase
        .from('trusted_contacts')
        .update(contactData)
        .eq('id', id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trustedContacts'] });
      toast({
        title: 'Contact updated',
        description: 'Trusted contact has been updated successfully.',
      });
      setIsDialogOpen(false);
      form.reset();
      setEditingContact(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update contact',
        variant: 'destructive',
      });
    },
  });

  // Delete trusted contact mutation
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
        description: 'Trusted contact has been removed.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete contact',
        variant: 'destructive',
      });
    },
  });

  // Reset form when editing contact changes
  useEffect(() => {
    if (editingContact) {
      form.reset({
        name: editingContact.name,
        email: editingContact.email,
        phone: editingContact.phone || '',
        relationship: editingContact.relationship || '',
      });
    } else {
      form.reset({
        name: '',
        email: '',
        phone: '',
        relationship: '',
      });
    }
  }, [editingContact, form]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (editingContact) {
      updateContactMutation.mutate({ ...data, id: editingContact.id });
    } else {
      addContactMutation.mutate(data);
    }
  };

  const handleEditContact = (contact: TrustedContact) => {
    setEditingContact(contact);
    setIsDialogOpen(true);
  };

  const handleAddNewClick = () => {
    setEditingContact(null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingContact(null);
    form.reset();
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
            Manage the people who can access your messages and digital assets
          </p>
        </div>
        <Button onClick={handleAddNewClick} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add New Contact
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-pulse">Loading contacts...</div>
        </div>
      ) : (
        <div>
          {contacts && contacts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contacts.map((contact) => (
                <Card key={contact.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <UserCircle className="h-5 w-5" />
                          {contact.name}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {contact.relationship || 'No relationship specified'}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{contact.email}</span>
                      </div>
                      {contact.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{contact.phone}</span>
                        </div>
                      )}
                      {contact.relationship && (
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{contact.relationship}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditContact(contact)}
                    >
                      <PencilLine className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deleteContactMutation.mutate(contact.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Remove
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  No Trusted Contacts
                </CardTitle>
                <CardDescription>
                  You haven't added any trusted contacts yet. Trusted contacts can be notified in case of your inactivity and can access your messages and digital assets.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center py-8">
                  <Button onClick={handleAddNewClick}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Your First Trusted Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Add/Edit Contact Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingContact ? 'Edit Trusted Contact' : 'Add Trusted Contact'}
            </DialogTitle>
            <DialogDescription>
              {editingContact 
                ? 'Update the details of your trusted contact.' 
                : 'Add a person you trust to access your messages and digital assets.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
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
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
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
                      <Input placeholder="+1234567890" {...field} />
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
                      <Input placeholder="Family, Friend, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={addContactMutation.isPending || updateContactMutation.isPending}>
                  {editingContact ? 'Update' : 'Add'} Contact
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrustedContactsPage;
