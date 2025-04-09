
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Heart, 
  Info, 
  UserPlus, 
  Eye, 
  EyeOff,
  AlertCircle,
  FileText,
  CheckCircle,
  Lock
} from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface EOLInstructions {
  id: string;
  user_id: string;
  funeral_notes: string;
  organ_donation: boolean;
  final_message: string;
  access_level: 'private' | 'contacts' | 'public';
  created_at: string;
  updated_at: string;
}

const formSchema = z.object({
  funeral_notes: z.string().optional(),
  organ_donation: z.boolean().default(false),
  final_message: z.string().min(1, 'Please provide a final message').max(10000),
  access_level: z.enum(['private', 'contacts', 'public']).default('private'),
});

const EndOfLifePage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('funeral');
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      funeral_notes: '',
      organ_donation: false,
      final_message: '',
      access_level: 'private',
    },
  });

  // Fetch existing EOL instructions
  const { data: eolInstructions, isLoading } = useQuery({
    queryKey: ['eolInstructions', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('eol_instructions')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
      
      if (data) {
        // Update form with existing data
        form.reset({
          funeral_notes: data.funeral_notes || '',
          organ_donation: data.organ_donation || false,
          final_message: data.final_message || '',
          access_level: data.access_level || 'private',
        });
      }
      
      return data as EOLInstructions | null;
    },
    enabled: !!user,
  });

  // Save EOL instructions
  const saveEOLMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      if (!user) throw new Error('Not authenticated');
      
      if (eolInstructions) {
        // Update existing record
        const { error } = await supabase
          .from('eol_instructions')
          .update({
            funeral_notes: data.funeral_notes,
            organ_donation: data.organ_donation,
            final_message: data.final_message,
            access_level: data.access_level,
            updated_at: new Date().toISOString(),
          })
          .eq('id', eolInstructions.id);
          
        if (error) throw error;
        return { ...eolInstructions, ...data };
      } else {
        // Create new record
        const { data: newRecord, error } = await supabase
          .from('eol_instructions')
          .insert({
            user_id: user.id,
            funeral_notes: data.funeral_notes,
            organ_donation: data.organ_donation,
            final_message: data.final_message,
            access_level: data.access_level,
          })
          .select()
          .single();
          
        if (error) throw error;
        return newRecord as EOLInstructions;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eolInstructions'] });
      toast({
        title: 'Instructions saved',
        description: 'Your end-of-life instructions have been saved successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save instructions',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    saveEOLMutation.mutate(data);
  };

  if (isLoading) {
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
          <h1 className="text-3xl font-bold">End-of-Life Instructions</h1>
          <p className="text-muted-foreground">
            Document your final wishes and preferences for your loved ones
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>My Final Wishes</CardTitle>
              <CardDescription>
                These instructions will be shared according to your privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="funeral">Funeral Preferences</TabsTrigger>
                      <TabsTrigger value="medical">Medical Wishes</TabsTrigger>
                      <TabsTrigger value="final">Final Message</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="funeral" className="space-y-4 pt-4">
                      <FormField
                        control={form.control}
                        name="funeral_notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Funeral and Memorial Preferences</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter your preferences for funeral, memorial service, burial or cremation, specific songs, readings, or other requests..."
                                className="min-h-[200px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Describe your preferences for your funeral or memorial service. This helps your loved ones honor your wishes.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    
                    <TabsContent value="medical" className="space-y-4 pt-4">
                      <FormField
                        control={form.control}
                        name="organ_donation"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Organ Donation</FormLabel>
                              <FormDescription>
                                I wish to be an organ donor and give the gift of life
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <div className="rounded-lg border p-4">
                        <h3 className="font-medium mb-2 flex items-center">
                          <Info className="h-4 w-4 mr-2" />
                          Additional Medical Documents
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Upload important medical documentation such as living will, 
                          DNR orders, or healthcare proxy in the Digital Asset Vault.
                        </p>
                        <Button variant="outline" onClick={() => window.location.href = '/digital-assets'}>
                          <FileText className="h-4 w-4 mr-2" />
                          Go to Digital Vault
                        </Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="final" className="space-y-4 pt-4">
                      <FormField
                        control={form.control}
                        name="final_message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Final Message to Loved Ones</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Write your final message, words of wisdom, or what you want your loved ones to know and remember..."
                                className="min-h-[200px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              This is your opportunity to share final thoughts, expressions of love, or important life lessons.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="access_level"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Privacy Settings</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                              >
                                <div className="flex items-center space-x-2 rounded-md border p-3">
                                  <RadioGroupItem value="private" id="private" />
                                  <Label htmlFor="private" className="flex items-center cursor-pointer">
                                    <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <div>
                                      <span className="font-medium">Private</span>
                                      <p className="text-sm text-muted-foreground">Only you can see this information</p>
                                    </div>
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2 rounded-md border p-3">
                                  <RadioGroupItem value="contacts" id="contacts" />
                                  <Label htmlFor="contacts" className="flex items-center cursor-pointer">
                                    <UserPlus className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <div>
                                      <span className="font-medium">Trusted Contacts</span>
                                      <p className="text-sm text-muted-foreground">Only your trusted contacts can see this</p>
                                    </div>
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2 rounded-md border p-3">
                                  <RadioGroupItem value="public" id="public" />
                                  <Label htmlFor="public" className="flex items-center cursor-pointer">
                                    <Eye className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <div>
                                      <span className="font-medium">Public</span>
                                      <p className="text-sm text-muted-foreground">Anyone with the link can see this</p>
                                    </div>
                                  </Label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                  </Tabs>
                  
                  <CardFooter className="px-0 pb-0 pt-6 flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setActiveTab(activeTab === 'funeral' ? 'medical' : activeTab === 'medical' ? 'final' : 'funeral')}
                    >
                      {activeTab === 'final' ? 'Previous' : 'Next'}
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={saveEOLMutation.isPending}
                    >
                      {saveEOLMutation.isPending ? 'Saving...' : 'Save Instructions'}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Heart className="h-5 w-5 mr-2 text-red-500" />
                Why This Matters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                Documenting your end-of-life wishes provides clarity and guidance for your loved ones 
                during a difficult time, ensuring your final wishes are respected.
              </p>
              
              <div className="rounded-md border p-3">
                <h4 className="font-medium text-sm flex items-center mb-2">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  Benefits
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Reduces decision burden on family members</li>
                  <li>• Ensures your wishes are followed</li>
                  <li>• Prevents potential family conflicts</li>
                  <li>• Provides peace of mind for everyone</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Info className="h-5 w-5 mr-2 text-blue-500" />
                Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-3">
                <li className="flex">
                  <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0 text-muted-foreground" />
                  <span>Be specific about your funeral preferences, including music, readings, or cultural traditions.</span>
                </li>
                <li className="flex">
                  <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0 text-muted-foreground" />
                  <span>Consider including personal messages for specific family members or friends.</span>
                </li>
                <li className="flex">
                  <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0 text-muted-foreground" />
                  <span>Upload important legal documents to your Digital Vault for safekeeping.</span>
                </li>
                <li className="flex">
                  <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0 text-muted-foreground" />
                  <span>Review and update your wishes regularly as your preferences may change over time.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EndOfLifePage;
