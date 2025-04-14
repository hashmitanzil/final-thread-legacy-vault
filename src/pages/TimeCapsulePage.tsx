
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TimeCapsule } from '@/types/database';
import { toast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, addDays } from 'date-fns';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Lock,
  MessageSquare,
  File as FileIcon,
  PlusCircle,
  ChevronDown,
  Edit,
  Trash2,
  CalendarIcon,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FileUpload from '@/components/FileUpload';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

// Form schema for creating a time capsule
const createTimeCapsuleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  type: z.enum(['message', 'file']),
  content: z.string().optional(),
  lockUntil: z.date().min(new Date(), 'Date must be in the future'),
});

const TimeCapsulePage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'message' | 'file'>('message');
  const [unlockDialogOpen, setUnlockDialogOpen] = useState(false);
  const [selectedCapsule, setSelectedCapsule] = useState<TimeCapsule | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  // Create form
  const form = useForm<z.infer<typeof createTimeCapsuleSchema>>({
    resolver: zodResolver(createTimeCapsuleSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'message',
      content: '',
      lockUntil: addDays(new Date(), 7),
    },
  });

  // Watch the type field to toggle tabs
  const watchType = form.watch('type');
  React.useEffect(() => {
    setActiveTab(watchType);
  }, [watchType]);

  // Fetch time capsules
  const { data: timeCapsules, isLoading } = useQuery({
    queryKey: ['time-capsules', user?.id],
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

  // Create a time capsule mutation
  const createMutation = useMutation({
    mutationFn: async (values: z.infer<typeof createTimeCapsuleSchema>) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('time_capsules').insert({
        user_id: user.id,
        title: values.title,
        description: values.description,
        type: values.type,
        content: values.type === 'message' ? values.content : null,
        storage_path: values.type === 'file' ? '/' : null, // This will be updated when the file is uploaded
        lock_until: values.lockUntil.toISOString(),
        is_locked: true,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-capsules'] });
      toast({
        title: 'Time Capsule Created',
        description: 'Your time capsule has been created successfully',
      });
      setIsCreateDialogOpen(false);
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

  // Delete time capsule mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('time_capsules').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-capsules'] });
      toast({
        title: 'Time Capsule Deleted',
        description: 'Your time capsule has been deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete time capsule',
        variant: 'destructive',
      });
    },
  });

  // Handle form submission
  const onSubmit = (values: z.infer<typeof createTimeCapsuleSchema>) => {
    createMutation.mutate(values);
  };

  // Handle file upload completion
  const handleFileUploadComplete = (filePath: string, fileName: string) => {
    // Update the last created time capsule with the file path
    if (!user) return;

    // Get the most recently created time capsule
    supabase
      .from('time_capsules')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          console.error('Error fetching time capsule:', error);
          return;
        }

        // Update the storage_path for this time capsule
        supabase
          .from('time_capsules')
          .update({ storage_path: filePath })
          .eq('id', data.id)
          .then(({ error }) => {
            if (error) {
              console.error('Error updating time capsule:', error);
            } else {
              queryClient.invalidateQueries({ queryKey: ['time-capsules'] });
              toast({
                title: 'File Uploaded',
                description: `${fileName} has been added to your time capsule`,
              });
            }
          });
      });
  };

  // Handle unlock time capsule
  const handleUnlockCapsule = async () => {
    if (!selectedCapsule) return;

    try {
      const { error } = await supabase
        .from('time_capsules')
        .update({ is_locked: false })
        .eq('id', selectedCapsule.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['time-capsules'] });
      toast({
        title: 'Time Capsule Unlocked',
        description: 'Your time capsule has been unlocked',
      });
      setUnlockDialogOpen(false);
      setSelectedCapsule(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to unlock time capsule',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-3xl font-bold">Time Capsules</h1>
          <p className="text-muted-foreground">
            Create digital time capsules to preserve messages and files for future access
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Time Capsule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create a New Time Capsule</DialogTitle>
              <DialogDescription>
                Lock away a message or file until a future date of your choosing.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Tabs value={activeTab} onValueChange={(value) => {
                  setActiveTab(value as 'message' | 'file');
                  form.setValue('type', value as 'message' | 'file');
                }}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="message">Message</TabsTrigger>
                    <TabsTrigger value="file">File</TabsTrigger>
                  </TabsList>
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="hidden">
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="pt-4 space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter a title for your time capsule" {...field} />
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
                            <Input
                              placeholder="Add a brief description"
                              {...field}
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lockUntil"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Unlock Date</FormLabel>
                          <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className="w-full pl-3 text-left font-normal"
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                  <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComponent
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  if (date) {
                                    field.onChange(date);
                                    setShowCalendar(false);
                                  }
                                }}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            The time capsule will be locked until this date.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <TabsContent value="message">
                      <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Write a message to your future self or loved ones..."
                                className="min-h-[150px]"
                                {...field}
                                value={field.value || ''}
                              />
                            </FormControl>
                            <FormDescription>
                              This message will be locked until the unlock date.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    <TabsContent value="file">
                      <div className="space-y-4">
                        <Label>Upload File</Label>
                        <FileUpload
                          bucketName="time-capsules"
                          path={user?.id}
                          onUploadComplete={handleFileUploadComplete}
                          maxSizeMB={20}
                        />
                        <FormDescription>
                          The file will be securely stored and locked until the unlock date.
                        </FormDescription>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
                <DialogFooter>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? 'Creating...' : 'Create Time Capsule'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </motion.div>

      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Input
            placeholder="Search time capsules..."
            className="max-w-xs"
          />
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="message">Messages</SelectItem>
              <SelectItem value="file">Files</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="text-center py-10">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your time capsules...</p>
          </div>
        ) : timeCapsules && timeCapsules.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {timeCapsules.map((capsule) => (
              <motion.div
                key={capsule.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Card className={capsule.is_locked ? 'border-primary/30' : ''}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center">
                          {capsule.type === 'message' ? (
                            <MessageSquare className="h-4 w-4 mr-2 text-primary" />
                          ) : (
                            <FileIcon className="h-4 w-4 mr-2 text-primary" />
                          )}
                          {capsule.title}
                        </CardTitle>
                        <CardDescription>{capsule.description}</CardDescription>
                      </div>
                      <div className="flex">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                          onClick={() => deleteMutation.mutate(capsule.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Unlocks on {format(new Date(capsule.lock_until), 'MMMM d, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Created on {format(new Date(capsule.created_at), 'MMMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    {capsule.is_locked ? (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setSelectedCapsule(capsule);
                          setUnlockDialogOpen(true);
                        }}
                      >
                        <Lock className="mr-2 h-4 w-4" />
                        Unlock Early
                      </Button>
                    ) : capsule.type === 'message' ? (
                      <div className="w-full p-4 bg-muted rounded-md">
                        <p className="text-sm">{capsule.content}</p>
                      </div>
                    ) : (
                      <Button className="w-full" variant="outline">
                        <FileIcon className="mr-2 h-4 w-4" />
                        Download File
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-muted/20 rounded-lg border">
            <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium mb-2">No Time Capsules Yet</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Create your first time capsule to preserve messages or files for your future self or
              loved ones.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Your First Time Capsule
            </Button>
          </div>
        )}
      </div>

      <Dialog open={unlockDialogOpen} onOpenChange={setUnlockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unlock Time Capsule Early</DialogTitle>
            <DialogDescription>
              Are you sure you want to unlock this time capsule before its scheduled date? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUnlockDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleUnlockCapsule}>
              Unlock Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TimeCapsulePage;
