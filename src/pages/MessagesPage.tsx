
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  DialogTrigger,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  MessageSquare, 
  PlusCircle, 
  Trash2, 
  Calendar, 
  Clock, 
  Mail, 
  Eye, 
  Edit, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Message {
  id: string;
  user_id: string;
  recipient_email: string;
  subject: string;
  content: string;
  delivery_date: string;
  trigger_condition?: string;
  message_type: string;
  is_delivered: boolean;
  created_at: string;
}

interface TrustedContact {
  id: string;
  email: string;
  name: string;
}

const formSchema = z.object({
  recipient_email: z.string().email('Valid email address required'),
  subject: z.string().min(2, 'Subject is required'),
  content: z.string().min(2, 'Message content is required'),
  trigger_condition: z.string().optional(),
  delivery_date: z.string(),
  message_type: z.string(),
});

const MessagesPage: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [viewingMessage, setViewingMessage] = useState<Message | null>(null);
  const queryClient = useQueryClient();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipient_email: '',
      subject: '',
      content: '',
      trigger_condition: 'after_passing',
      delivery_date: new Date().toISOString().split('T')[0],
      message_type: 'text',
    },
  });

  // Query messages
  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as Message[];
    },
    enabled: !!user,
  });

  // Query trusted contacts for recipients
  const { data: trustedContacts } = useQuery({
    queryKey: ['trustedContacts', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('trusted_contacts')
        .select('id, email, name')
        .order('name');
        
      if (error) throw error;
      return data as TrustedContact[];
    },
    enabled: !!user,
  });

  // Add message mutation
  const addMessageMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      if (!user) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('messages')
        .insert({
          user_id: user.id,
          ...data,
          is_delivered: false,
        });
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast({
        title: 'Message created',
        description: 'Your message has been saved and scheduled for delivery.',
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create message',
        variant: 'destructive',
      });
    },
  });

  // Update message mutation
  const updateMessageMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema> & { id: string }) => {
      if (!user) throw new Error('Not authenticated');
      
      const { id, ...messageData } = data;
      const { error } = await supabase
        .from('messages')
        .update(messageData)
        .eq('id', id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast({
        title: 'Message updated',
        description: 'Your message has been updated successfully.',
      });
      setIsDialogOpen(false);
      form.reset();
      setEditingMessage(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update message',
        variant: 'destructive',
      });
    },
  });

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast({
        title: 'Message deleted',
        description: 'Your message has been deleted.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete message',
        variant: 'destructive',
      });
    },
  });

  // Reset form when editing message changes
  React.useEffect(() => {
    if (editingMessage) {
      form.reset({
        recipient_email: editingMessage.recipient_email,
        subject: editingMessage.subject,
        content: editingMessage.content,
        trigger_condition: editingMessage.trigger_condition || 'after_passing',
        delivery_date: new Date(editingMessage.delivery_date).toISOString().split('T')[0],
        message_type: editingMessage.message_type || 'text',
      });
    } else {
      form.reset({
        recipient_email: '',
        subject: '',
        content: '',
        trigger_condition: 'after_passing',
        delivery_date: new Date().toISOString().split('T')[0],
        message_type: 'text',
      });
    }
  }, [editingMessage, form]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (editingMessage) {
      updateMessageMutation.mutate({ ...data, id: editingMessage.id });
    } else {
      addMessageMutation.mutate(data);
    }
  };

  const handleEditMessage = (message: Message) => {
    setEditingMessage(message);
    setIsDialogOpen(true);
  };

  const handleAddNewClick = () => {
    setEditingMessage(null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingMessage(null);
    form.reset();
  };

  const handleViewMessage = (message: Message) => {
    setViewingMessage(message);
  };

  const formatTriggerCondition = (condition: string | undefined) => {
    if (!condition) return "After my passing";
    
    switch (condition) {
      case 'after_passing':
        return 'After my passing';
      case 'on_specific_date':
        return 'On specific date';
      case 'on_inactivity':
        return 'After inactivity period';
      default:
        return condition;
    }
  };

  const formatMessageType = (type: string) => {
    switch (type) {
      case 'text':
        return 'Text Message';
      case 'video':
        return 'Video Message';
      case 'audio':
        return 'Audio Message';
      case 'document':
        return 'Document';
      default:
        return type;
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
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">
            Create and manage your final messages to loved ones
          </p>
        </div>
        <Button onClick={handleAddNewClick} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Create New Message
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-pulse">Loading messages...</div>
        </div>
      ) : (
        <div>
          {messages && messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((message) => (
                <Card key={message.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{message.subject}</CardTitle>
                        <CardDescription className="mt-1">
                          To: {message.recipient_email}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewMessage(message)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditMessage(message)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => deleteMessageMutation.mutate(message.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{formatMessageType(message.message_type)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{formatTriggerCondition(message.trigger_condition)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Created: {new Date(message.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-between text-sm text-muted-foreground">
                    <span>Status: {message.is_delivered ? 'Delivered' : 'Pending'}</span>
                    <span>
                      {message.trigger_condition === 'on_specific_date' &&
                        `Scheduled: ${new Date(message.delivery_date).toLocaleDateString()}`}
                    </span>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  No Messages
                </CardTitle>
                <CardDescription>
                  You haven't created any messages yet. Messages can be delivered to your loved ones based on specific triggers like your passing or a specific date.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center py-8">
                  <Button onClick={handleAddNewClick}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Create Your First Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Create/Edit Message Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingMessage ? 'Edit Message' : 'Create New Message'}
            </DialogTitle>
            <DialogDescription>
              {editingMessage 
                ? 'Update your message details and content.' 
                : 'Compose a message to be delivered in the future.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="recipient_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient's Email</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input placeholder="recipient@example.com" {...field} />
                      </FormControl>
                      {trustedContacts && trustedContacts.length > 0 && (
                        <Select
                          onValueChange={(value) => {
                            const contact = trustedContacts.find(c => c.id === value);
                            if (contact) {
                              form.setValue('recipient_email', contact.email);
                            }
                          }}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select contact" />
                          </SelectTrigger>
                          <SelectContent>
                            {trustedContacts.map(contact => (
                              <SelectItem key={contact.id} value={contact.id}>
                                {contact.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="Message Subject" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select message type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="text">Text Message</SelectItem>
                        <SelectItem value="document">Document</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="audio">Audio</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="trigger_condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Trigger</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="When to deliver this message" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="after_passing">After my passing</SelectItem>
                        <SelectItem value="on_specific_date">On a specific date</SelectItem>
                        <SelectItem value="on_inactivity">After inactivity period</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.watch('trigger_condition') === 'on_specific_date' && (
                <FormField
                  control={form.control}
                  name="delivery_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Write your message here..." 
                        className="min-h-[200px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={addMessageMutation.isPending || updateMessageMutation.isPending}>
                  {editingMessage ? 'Update' : 'Save'} Message
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* View Message Dialog */}
      <Dialog open={!!viewingMessage} onOpenChange={(open) => !open && setViewingMessage(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{viewingMessage?.subject}</DialogTitle>
            <DialogDescription>
              To: {viewingMessage?.recipient_email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-muted-foreground">Type:</Label>
              <div className="mt-1">{viewingMessage?.message_type}</div>
            </div>
            <div>
              <Label className="text-muted-foreground">Delivery Trigger:</Label>
              <div className="mt-1">{formatTriggerCondition(viewingMessage?.trigger_condition)}</div>
            </div>
            <div>
              <Label className="text-muted-foreground">Content:</Label>
              <div className="mt-1 p-4 border rounded-md bg-muted/20 whitespace-pre-wrap">
                {viewingMessage?.content}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setViewingMessage(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MessagesPage;
