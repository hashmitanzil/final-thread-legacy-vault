
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TimeCapsule } from '@/types/database';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Clock, 
  Calendar as CalendarIcon, 
  Lock, 
  Timer, 
  Hourglass, 
  Package,
  Plus,
  FileText,
  MessageSquare,
  ShieldX,
  Clock4,
  CheckCircle,
  AlertCircle,
  Unlock,
  CalendarDays
} from 'lucide-react';
import { format, addYears, differenceInDays, isBefore } from 'date-fns';

const formSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().optional(),
  type: z.enum(['message', 'file']),
  content: z.string().min(1, 'Content is required for message type').optional(),
  lock_until: z.date({
    required_error: "Please select a date",
  }).refine(date => isBefore(new Date(), date), {
    message: "Lock date must be in the future",
  }),
});

const TimeCapsulePage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<null | '5years' | '10years' | 'custom'>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'message',
      content: '',
      lock_until: addYears(new Date(), 5),
    },
  });

  const handlePresetSelection = (preset: '5years' | '10years' | 'custom') => {
    setSelectedPreset(preset);
    if (preset === '5years') {
      form.setValue('lock_until', addYears(new Date(), 5));
    } else if (preset === '10years') {
      form.setValue('lock_until', addYears(new Date(), 10));
    }
  };

  const { data: timeCapsules, isLoading } = useQuery({
    queryKey: ['timeCapsules', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('time_capsules')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as TimeCapsule[];
    },
    enabled: !!user,
  });

  const createCapsuleMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      if (!user) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('time_capsules')
        .insert({
          user_id: user.id,
          title: data.title,
          description: data.description || '',
          type: data.type,
          content: data.type === 'message' ? data.content : '',
          lock_until: data.lock_until.toISOString(),
          is_locked: true,
        });
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeCapsules'] });
      toast({
        title: 'Time Capsule created',
        description: 'Your time capsule has been created and locked until the specified date.',
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create time capsule',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createCapsuleMutation.mutate(data);
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
          <h1 className="text-3xl font-bold">Time Capsule</h1>
          <p className="text-muted-foreground">
            Lock messages and files for a future date
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create New Time Capsule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Time Capsule</DialogTitle>
              <DialogDescription>
                Lock away a message or file to be opened at a future date
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Name your time capsule" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Add a description to remind yourself what's inside"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Type</FormLabel>
                      <div className="grid grid-cols-2 gap-4">
                        <Button
                          type="button"
                          variant={field.value === 'message' ? 'default' : 'outline'}
                          className="flex flex-col items-center justify-center h-20 w-full"
                          onClick={() => form.setValue('type', 'message')}
                        >
                          <MessageSquare className="h-5 w-5 mb-1" />
                          <span>Message</span>
                        </Button>
                        <Button
                          type="button"
                          variant={field.value === 'file' ? 'default' : 'outline'}
                          className="flex flex-col items-center justify-center h-20 w-full"
                          onClick={() => form.setValue('type', 'file')}
                        >
                          <FileText className="h-5 w-5 mb-1" />
                          <span>File</span>
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {form.watch('type') === 'message' && (
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Write your message here..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <FormField
                  control={form.control}
                  name="lock_until"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Lock Until</FormLabel>
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <Button
                          type="button"
                          variant={selectedPreset === '5years' ? 'default' : 'outline'}
                          className="flex flex-col items-center justify-center py-2"
                          onClick={() => handlePresetSelection('5years')}
                        >
                          <span className="text-xs">5 Years</span>
                        </Button>
                        <Button
                          type="button"
                          variant={selectedPreset === '10years' ? 'default' : 'outline'}
                          className="flex flex-col items-center justify-center py-2"
                          onClick={() => handlePresetSelection('10years')}
                        >
                          <span className="text-xs">10 Years</span>
                        </Button>
                        <Button
                          type="button"
                          variant={selectedPreset === 'custom' ? 'default' : 'outline'}
                          className="flex flex-col items-center justify-center py-2"
                          onClick={() => handlePresetSelection('custom')}
                        >
                          <span className="text-xs">Custom Date</span>
                        </Button>
                      </div>
                      
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="w-full pl-3 text-left font-normal"
                              onClick={(e) => {
                                // Prevent the form from submitting when opening the date picker
                                e.preventDefault();
                                if (selectedPreset === 'custom') {
                                  // Set focus to calendar when custom is selected
                                  setTimeout(() => {
                                    document.querySelector('.rdp-button')?.focus();
                                  }, 100);
                                }
                              }}
                            >
                              <span className={!field.value ? "text-muted-foreground" : ""}>
                                {field.value ? format(field.value, "PPP") : "Pick a date"}
                              </span>
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              if (date) {
                                field.onChange(date);
                                // Set preset to custom when a date is manually selected
                                setSelectedPreset('custom');
                              }
                            }}
                            disabled={(date) => 
                              date < new Date() || date.getTime() === new Date().setHours(0, 0, 0, 0)
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Your time capsule will be locked until this date.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createCapsuleMutation.isPending}
                  >
                    {createCapsuleMutation.isPending ? 'Creating...' : 'Create & Lock'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {timeCapsules && timeCapsules.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {timeCapsules.map((capsule) => {
              const lockDate = new Date(capsule.lock_until);
              const daysRemaining = differenceInDays(lockDate, new Date());
              const isUnlocked = daysRemaining <= 0;
              
              return (
                <Card key={capsule.id} className={`border ${isUnlocked ? 'border-green-500' : 'border-amber-500'}`}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{capsule.title}</CardTitle>
                      {isUnlocked ? (
                        <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center">
                          <Unlock className="h-3 w-3 mr-1" />
                          Unlocked
                        </div>
                      ) : (
                        <div className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full flex items-center">
                          <Lock className="h-3 w-3 mr-1" />
                          Locked
                        </div>
                      )}
                    </div>
                    <CardDescription>
                      {capsule.description || "No description provided"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center text-sm">
                        <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Type: {capsule.type === 'message' ? 'Message' : 'File'}</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Created: {format(new Date(capsule.created_at), 'PP')}</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <Clock4 className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {isUnlocked 
                            ? `Unlocked on ${format(lockDate, 'PP')}`
                            : `Unlocks on ${format(lockDate, 'PP')} (${daysRemaining} days remaining)`
                          }
                        </span>
                      </div>
                      
                      {isUnlocked && capsule.type === 'message' && (
                        <div className="mt-4 p-3 bg-muted rounded-md">
                          <h4 className="text-sm font-medium mb-2">Time Capsule Message:</h4>
                          <p className="text-sm whitespace-pre-line">{capsule.content}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    {isUnlocked ? (
                      <Button className="w-full" variant="default">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {capsule.type === 'message' ? 'Message Revealed' : 'Download File'}
                      </Button>
                    ) : (
                      <Button className="w-full" variant="outline" disabled>
                        <Lock className="h-4 w-4 mr-2" />
                        Locked Until {format(lockDate, 'PP')}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Hourglass className="h-5 w-5 mr-2" />
                No Time Capsules
              </CardTitle>
              <CardDescription>
                You haven't created any time capsules yet
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-12">
              <div className="bg-muted inline-flex rounded-full p-6 mb-4">
                <Clock className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Create Your First Time Capsule</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Lock away special messages or files that will be revealed at a future date. 
                Perfect for milestone birthdays, anniversaries, or future life events.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Time Capsule
              </Button>
            </CardContent>
          </Card>
        )}
        
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>About Time Capsules</CardTitle>
            <CardDescription>
              How our digital time capsules work
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <Lock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Secure Locking</h3>
                <p className="text-sm text-muted-foreground">
                  Time capsules are securely locked until your chosen date. 
                  You can't edit or modify them once created.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Flexible Timing</h3>
                <p className="text-sm text-muted-foreground">
                  Choose from preset time periods (5 or 10 years) or set a custom 
                  date for your time capsule to unlock.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Multiple Content Types</h3>
                <p className="text-sm text-muted-foreground">
                  Store text messages now, with file support coming soon. Perfect for 
                  messages to your future self or loved ones.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TimeCapsulePage;
