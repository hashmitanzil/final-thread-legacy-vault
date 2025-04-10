import React, { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { PostgrestError } from '@supabase/supabase-js';
import { LegacyMedia } from '@/types/supabase-extensions';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { 
  Video,
  Mic,
  Calendar as CalendarIcon,
  Plus,
  MoreVertical,
  Trash2,
  Edit,
  Eye as EyeIcon,
  Save,
  PlayCircle,
  PauseCircle,
  Mail,
  Users,
  X,
  Upload,
  AlertCircle,
  Info,
  Check,
  Clock,
  Film,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import FileUpload from '@/components/FileUpload';

type GenericRecord = Record<string, any>;

const mediaFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  media_type: z.enum(['video', 'audio']),
  delivery_type: z.enum(['date', 'event', 'post-death']),
  delivery_date: z.date().optional().nullable(),
  delivery_event: z.string().optional().nullable(),
  recipients: z.array(z.string().email()).min(1, 'At least one recipient is required'),
});

type LegacyMediaData = {
  user_id: string;
  title: string;
  description: string | null;
  media_type: 'video' | 'audio';
  storage_path: string;
  thumbnail_path: string | null;
  delivery_type: 'date' | 'event' | 'post-death';
  delivery_date: string | null;
  delivery_event: string | null;
  is_draft: boolean;
  recipients: string[];
  id?: string;
  created_at?: string;
  updated_at?: string;
};

const LegacyMediaPage: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewingMedia, setViewingMedia] = useState<LegacyMedia | null>(null);
  const [viewUrl, setViewUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [recipientsList, setRecipientsList] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  
  const form = useForm<z.infer<typeof mediaFormSchema>>({
    resolver: zodResolver(mediaFormSchema),
    defaultValues: {
      title: '',
      description: '',
      media_type: 'video',
      delivery_type: 'date',
      delivery_date: null,
      delivery_event: null,
      recipients: [],
    },
  });
  
  const { data: legacyMedia = [], isLoading } = useQuery({
    queryKey: ['legacyMedia', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await (supabase as any)
        .from('legacy_media')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as LegacyMedia[];
    },
    enabled: !!user,
  });
  
  const createMediaMutation = useMutation({
    mutationFn: async (data: z.infer<typeof mediaFormSchema> & { filePath: string }) => {
      if (!user) throw new Error('Not authenticated');
      
      const legacyMediaData: LegacyMediaData = {
        user_id: user.id,
        title: data.title,
        description: data.description || null,
        media_type: data.media_type,
        storage_path: data.filePath,
        thumbnail_path: null,
        delivery_type: data.delivery_type,
        delivery_date: data.delivery_date ? data.delivery_date.toISOString() : null,
        delivery_event: data.delivery_event || null,
        is_draft: true,
        recipients: data.recipients,
      };
      
      const { error } = await (supabase as any)
        .from('legacy_media')
        .insert(legacyMediaData);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legacyMedia'] });
      toast({
        title: 'Media message created',
        description: 'Your legacy media message has been saved as a draft',
      });
      form.reset();
      setIsCreateDialogOpen(false);
      setRecipientsList([]);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create legacy media',
        variant: 'destructive',
      });
    },
  });
  
  const deleteMediaMutation = useMutation({
    mutationFn: async (media: LegacyMedia) => {
      const { error: storageError } = await supabase.storage
        .from('legacy_media')
        .remove([media.storage_path]);
      
      if (storageError) throw storageError;
      
      const { error: dbError } = await (supabase as any)
        .from('legacy_media')
        .delete()
        .eq('id', media.id);
        
      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legacyMedia'] });
      toast({
        title: 'Media deleted',
        description: 'Your legacy media message has been deleted.',
      });
      if (isViewDialogOpen) {
        setIsViewDialogOpen(false);
      }
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete media',
        variant: 'destructive',
      });
    },
  });
  
  const publishMediaMutation = useMutation({
    mutationFn: async (media: LegacyMedia) => {
      const { error } = await (supabase as any)
        .from('legacy_media')
        .update({ is_draft: false })
        .eq('id', media.id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legacyMedia'] });
      toast({
        title: 'Message published',
        description: 'Your legacy media message has been published and scheduled for delivery.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to publish message',
        variant: 'destructive',
      });
    },
  });
  
  const handlePlayPause = () => {
    if (viewingMedia?.media_type === 'video' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else if (viewingMedia?.media_type === 'audio' && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const startRecording = async (mediaType: 'video' | 'audio') => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: mediaType === 'video',
      });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      recordedChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: mediaType === 'video' ? 'video/webm' : 'audio/webm',
        });
        
        const fileName = `recorded_${mediaType}_${Date.now()}.webm`;
        const filePath = `${user?.id}/${fileName}`;
        
        try {
          const { error } = await supabase.storage
            .from('legacy_media')
            .upload(filePath, blob);
            
          if (error) throw error;
          
          const formValues = form.getValues();
          await createMediaMutation.mutateAsync({
            ...formValues,
            filePath,
          });
        } catch (error) {
          toast({
            title: 'Upload failed',
            description: error instanceof Error ? error.message : 'Failed to upload recorded media',
            variant: 'destructive',
          });
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      toast({
        title: 'Recording error',
        description: 'Could not access camera or microphone. Please check permissions.',
        variant: 'destructive',
      });
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      
      const tracks = mediaRecorderRef.current.stream?.getTracks();
      tracks?.forEach(track => track.stop());
      
      mediaRecorderRef.current = null;
      setIsRecording(false);
    }
  };
  
  const handleUploadComplete = async (
    filePath: string, 
    fileName: string, 
    fileSize: number
  ) => {
    const formValues = form.getValues();
    await createMediaMutation.mutateAsync({
      ...formValues,
      filePath,
    });
  };
  
  const handleViewMedia = async (media: LegacyMedia) => {
    try {
      setViewingMedia(media);
      setIsViewDialogOpen(true);
      setIsPlaying(false);
      
      const { data, error } = await supabase.storage
        .from('legacy_media')
        .createSignedUrl(media.storage_path, 60);
      
      if (error) throw error;
      setViewUrl(data.signedUrl);
    } catch (error) {
      console.error('Error getting media URL:', error);
      toast({
        title: 'Error',
        description: 'Failed to retrieve the media. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const handleAddRecipient = () => {
    if (emailInput && /\S+@\S+\.\S+/.test(emailInput)) {
      if (!recipientsList.includes(emailInput)) {
        const newList = [...recipientsList, emailInput];
        setRecipientsList(newList);
        form.setValue('recipients', newList);
        setEmailInput('');
      } else {
        toast({
          title: 'Duplicate email',
          description: 'This email is already in the recipients list',
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
    }
  };
  
  const handleRemoveRecipient = (email: string) => {
    const newList = recipientsList.filter(e => e !== email);
    setRecipientsList(newList);
    form.setValue('recipients', newList);
  };
  
  const onSubmit = (data: z.infer<typeof mediaFormSchema>) => {
    console.log('Form data ready for submission:', data);
  };
  
  let filteredMedia = legacyMedia || [];
  
  if (activeTab === 'video') {
    filteredMedia = filteredMedia.filter(media => media.media_type === 'video');
  } else if (activeTab === 'audio') {
    filteredMedia = filteredMedia.filter(media => media.media_type === 'audio');
  } else if (activeTab === 'drafts') {
    filteredMedia = filteredMedia.filter(media => media.is_draft);
  } else if (activeTab === 'scheduled') {
    filteredMedia = filteredMedia.filter(media => !media.is_draft);
  }
  
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
          <h1 className="text-3xl font-bold">Legacy Video & Voice Messages</h1>
          <p className="text-muted-foreground">
            Leave meaningful messages for your loved ones
          </p>
        </div>
        
        <Button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> 
          Create New Message
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Legacy Messages</CardTitle>
          <CardDescription>
            Record and schedule messages to be delivered to your loved ones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Messages</TabsTrigger>
              <TabsTrigger value="video">Video</TabsTrigger>
              <TabsTrigger value="audio">Audio</TabsTrigger>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-pulse">Loading messages...</div>
            </div>
          ) : filteredMedia.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedia.map(media => (
                <Card key={media.id} className="overflow-hidden">
                  <div 
                    className="aspect-video bg-muted flex items-center justify-center cursor-pointer"
                    onClick={() => handleViewMedia(media)}
                  >
                    {media.media_type === 'video' ? (
                      <>
                        <Video className="h-12 w-12 text-muted-foreground/50" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/40">
                          <PlayCircle className="h-16 w-16 text-white" />
                        </div>
                      </>
                    ) : (
                      <>
                        <Mic className="h-12 w-12 text-muted-foreground/50" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/40">
                          <PlayCircle className="h-16 w-16 text-white" />
                        </div>
                      </>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold truncate">{media.title}</h3>
                      {media.is_draft ? (
                        <Badge variant="outline" className="text-yellow-500 border-yellow-200">
                          Draft
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-green-500 border-green-200">
                          Scheduled
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {media.description || 'No description provided'}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline" className="flex items-center gap-1">
                        {media.media_type === 'video' ? (
                          <Video className="h-3 w-3" />
                        ) : (
                          <Mic className="h-3 w-3" />
                        )}
                        {media.media_type === 'video' ? 'Video' : 'Audio'}
                      </Badge>
                      
                      <Badge variant="outline" className="flex items-center gap-1">
                        {media.delivery_type === 'date' ? (
                          <CalendarIcon className="h-3 w-3" />
                        ) : media.delivery_type === 'event' ? (
                          <AlertCircle className="h-3 w-3" />
                        ) : (
                          <Clock className="h-3 w-3" />
                        )}
                        {media.delivery_type === 'date' 
                          ? (media.delivery_date ? format(new Date(media.delivery_date), 'PP') : 'Date') 
                          : media.delivery_type === 'event' 
                          ? (media.delivery_event || 'Event')
                          : 'Post-Death'
                        }
                      </Badge>
                      
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {media.recipients?.length || 0} recipient{media.recipients?.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Created {format(new Date(media.created_at), 'PPp')}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewMedia(media)}
                    >
                      <EyeIcon className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    
                    {media.is_draft && (
                      <Button 
                        size="sm"
                        onClick={() => publishMediaMutation.mutate(media)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Publish
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Film className="mx-auto h-10 w-10 text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-lg font-medium mb-1">No messages found</h3>
              <p className="text-muted-foreground mb-4">
                Create your first legacy message to be delivered to your loved ones
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Message
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
        setIsCreateDialogOpen(open);
        if (!open) {
          form.reset();
          setRecipientsList([]);
        }
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Legacy Message</DialogTitle>
            <DialogDescription>
              Record or upload a message to be delivered to your loved ones
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a title for your message" {...field} />
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
                        placeholder="Add more context about this message"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="media_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Media Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select media type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="video">Video Message</SelectItem>
                          <SelectItem value="audio">Audio Message</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="delivery_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Trigger</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select delivery type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="date">Specific Date</SelectItem>
                          <SelectItem value="event">Life Event</SelectItem>
                          <SelectItem value="post-death">Post-Death</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {form.watch('delivery_type') === 'date' && (
                <FormField
                  control={form.control}
                  name="delivery_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Delivery Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value || undefined}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              {form.watch('delivery_type') === 'event' && (
                <FormField
                  control={form.control}
                  name="delivery_event"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Description</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Daughter's Wedding, Son's 18th Birthday" 
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormDescription>
                        This message will need to be manually triggered by a trusted contact.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={form.control}
                name="recipients"
                render={() => (
                  <FormItem>
                    <FormLabel>Recipients</FormLabel>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter email address"
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                        />
                        <Button type="button" onClick={handleAddRecipient}>
                          Add
                        </Button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        {recipientsList.map(email => (
                          <Badge key={email} variant="secondary" className="gap-1">
                            {email}
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-4 w-4 p-0 hover:bg-transparent"
                              onClick={() => handleRemoveRecipient(email)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                      
                      {form.formState.errors.recipients && (
                        <p className="text-sm font-medium text-destructive">
                          {form.formState.errors.recipients.message}
                        </p>
                      )}
                    </div>
                  </FormItem>
                )}
              />
              
              <div className="space-y-4">
                <div className="text-sm font-medium">Media Source</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex flex-col items-center justify-center h-24 p-2"
                    onClick={() => startRecording(form.getValues('media_type'))}
                    disabled={isRecording || createMediaMutation.isPending}
                  >
                    {form.watch('media_type') === 'video' ? (
                      <Video className="h-8 w-8 mb-2" />
                    ) : (
                      <Mic className="h-8 w-8 mb-2" />
                    )}
                    <span>Record Now</span>
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="flex flex-col items-center justify-center h-24 p-2"
                    disabled={!isRecording || createMediaMutation.isPending}
                    onClick={stopRecording}
                  >
                    {isRecording ? (
                      <>
                        <AlertTriangle className="h-8 w-8 mb-2 text-red-500" />
                        <span>Stop Recording</span>
                      </>
                    ) : (
                      <>
                        <X className="h-8 w-8 mb-2" />
                        <span>Not Recording</span>
                      </>
                    )}
                  </Button>
                  
                  <div className="border rounded-md h-24 flex flex-col items-center justify-center p-2">
                    <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                    <span className="text-sm text-center text-muted-foreground">
                      Or upload existing file
                    </span>
                    
                    <div className="mt-2 w-full">
                      <FileUpload
                        bucketName="legacy_media"
                        path={user?.id}
                        onUploadComplete={handleUploadComplete}
                        maxSizeMB={50}
                        acceptedFileTypes={form.watch('media_type') === 'video' 
                          ? ['video/mp4', 'video/webm', 'video/quicktime'] 
                          : ['audio/mpeg', 'audio/wav', 'audio/ogg']
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={
                    form.formState.isSubmitting || 
                    isRecording || 
                    createMediaMutation.isPending
                  }
                >
                  {createMediaMutation.isPending ? 'Creating...' : 'Create Message'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isViewDialogOpen} onOpenChange={(open) => {
        setIsViewDialogOpen(open);
        if (!open) {
          setIsPlaying(false);
          setViewUrl(null);
          setViewingMedia(null);
        }
      }}>
        {viewingMedia && (
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>{viewingMedia.title}</DialogTitle>
              <DialogDescription>
                {viewingMedia.description || 'No description provided'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  {viewingMedia.media_type === 'video' ? (
                    <Video className="h-3 w-3" />
                  ) : (
                    <Mic className="h-3 w-3" />
                  )}
                  {viewingMedia.media_type === 'video' ? 'Video' : 'Audio'}
                </Badge>
                
                <Badge variant="outline" className="flex items-center gap-1">
                  {viewingMedia.delivery_type === 'date' ? (
                    <CalendarIcon className="h-3 w-3" />
                  ) : viewingMedia.delivery_type === 'event' ? (
                    <AlertCircle className="h-3 w-3" />
                  ) : (
                    <Clock className="h-3 w-3" />
                  )}
                  {viewingMedia.delivery_type === 'date' 
                    ? (viewingMedia.delivery_date ? format(new Date(viewingMedia.delivery_date), 'PP') : 'Date') 
                    : viewingMedia.delivery_type === 'event' 
                    ? (viewingMedia.delivery_event || 'Event')
                    : 'Post-Death'
                  }
                </Badge>
                
                <Badge variant="outline" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {viewingMedia.recipients?.length || 0} recipient{viewingMedia.recipients?.length !== 1 ? 's' : ''}
                </Badge>
                
                {viewingMedia.is_draft ? (
                  <Badge variant="outline" className="flex items-center gap-1 text-yellow-500 border-yellow-200">
                    <Info className="h-3 w-3" />
                    Draft
                  </Badge>
                ) : (
                  <Badge variant="outline" className="flex items-center gap-1 text-green-500 border-green-200">
                    <Check className="h-3 w-3" />
                    Published
                  </Badge>
                )}
              </div>
              
              <div className="text-sm text-muted-foreground">
                <div>Created: {format(new Date(viewingMedia.created_at), 'PPp')}</div>
                <div>
                  Recipients: {viewingMedia.recipients?.join(', ') || 'None specified'}
                </div>
              </div>
              
              <div className="relative aspect-video bg-black rounded-md overflow-hidden flex items-center justify-center">
                {viewUrl ? (
                  viewingMedia.media_type === 'video' ? (
                    <video 
                      ref={videoRef}
                      src={viewUrl}
                      className="w-full h-full"
                      controls={false}
                      onClick={handlePlayPause}
                    />
                  ) : (
                    <audio 
                      ref={audioRef}
                      src={viewUrl}
                      className="w-full"
                      controls={false}
                    />
                  )
                ) : (
                  <div className="animate-pulse text-white">Loading media...</div>
                )}
                
                {viewUrl && (
                  <button
                    onClick={handlePlayPause}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
                  >
                    {isPlaying ? (
                      <PauseCircle className="h-16 w-16 text-white" />
                    ) : (
                      <PlayCircle className="h-16 w-16 text-white" />
                    )}
                  </button>
                )}
              </div>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setIsViewDialogOpen(false);
                  }}
                >
                  Close
                </Button>
                
                <div className="space-x-2">
                  {viewingMedia.is_draft && (
                    <Button 
                      onClick={() => publishMediaMutation.mutate(viewingMedia)}
                      disabled={publishMediaMutation.isPending}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {publishMediaMutation.isPending ? 'Publishing...' : 'Publish Message'}
                    </Button>
                  )}
                  
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this message?')) {
                        deleteMediaMutation.mutate(viewingMedia);
                      }
                    }}
                    disabled={deleteMediaMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {deleteMediaMutation.isPending ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default LegacyMediaPage;
