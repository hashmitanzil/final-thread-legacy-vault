
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  relationship: z.string().min(1, 'Please select a relationship')
});

const AddContactForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      relationship: '',
    },
  });
  
  const addContactMutation = useMutation({
    mutationFn: async (values: z.infer<typeof contactSchema>) => {
      if (!user) throw new Error('You must be logged in to add a contact');
      
      setIsSubmitting(true);
      
      try {
        // Add contact to database
        const { data, error } = await supabase
          .from('trusted_contacts')
          .insert({
            user_id: user.id,
            name: values.name,
            email: values.email,
            phone: values.phone || null,
            relationship: values.relationship,
          })
          .select('*')
          .single();
          
        if (error) throw error;
        
        // Send notification email (this would typically be done via a server function)
        // For this simulation, we'll just log and show a success message
        console.log(`Notification email would be sent to ${values.email}`);
        
        return data;
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trusted-contacts'] });
      toast({
        title: 'Trusted contact added',
        description: 'The contact has been added and will receive a notification email.',
      });
      form.reset();
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: 'Failed to add contact',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    }
  });
  
  const onSubmit = (values: z.infer<typeof contactSchema>) => {
    addContactMutation.mutate(values);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              <FormDescription>
                They will receive a notification at this email address.
              </FormDescription>
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
                <Input placeholder="+1 (555) 123-4567" {...field} />
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
              <FormLabel>Relationship</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="family">Family</SelectItem>
                  <SelectItem value="spouse">Spouse/Partner</SelectItem>
                  <SelectItem value="friend">Friend</SelectItem>
                  <SelectItem value="attorney">Attorney</SelectItem>
                  <SelectItem value="executor">Executor</SelectItem>
                  <SelectItem value="advisor">Financial Advisor</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Add Trusted Contact
        </Button>
      </form>
    </Form>
  );
};

export default AddContactForm;
