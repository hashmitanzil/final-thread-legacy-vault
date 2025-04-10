
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  File, 
  FolderOpen, 
  Upload, 
  Download, 
  Trash2, 
  Share2, 
  MoreVertical, 
  Plus, 
  Search, 
  Calendar, 
  Eye, 
  Image, 
  FileText, 
  Film, 
  Music, 
  Archive, 
  Code, 
  Lock, 
  Unlock, 
  Tag, 
  Filter, 
  X, 
  Clock,
  Calendar as CalendarIcon, 
  Folder,
  FileIcon
} from 'lucide-react';
import FileUpload, { FileVisibility } from '@/components/FileUpload';
import { DigitalAssetExtended } from '@/types/supabase-extensions';

const FILE_CATEGORIES = {
  image: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'],
  document: ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt', 'ppt', 'pptx', 'xls', 'xlsx', 'csv'],
  video: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'],
  audio: ['mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac'],
  archive: ['zip', 'rar', '7z', 'tar', 'gz'],
  code: ['html', 'css', 'js', 'jsx', 'ts', 'tsx', 'json', 'xml', 'php', 'py', 'rb', 'java', 'c', 'cpp'],
};

const FOLDERS = [
  { id: 'general', name: 'General', icon: <Folder className="h-4 w-4" /> },
  { id: 'family', name: 'Family', icon: <Folder className="h-4 w-4" /> },
  { id: 'career', name: 'Career', icon: <Folder className="h-4 w-4" /> },
  { id: 'travel', name: 'Travel', icon: <Folder className="h-4 w-4" /> },
  { id: 'legal', name: 'Legal Documents', icon: <Folder className="h-4 w-4" /> },
  { id: 'financial', name: 'Financial', icon: <Folder className="h-4 w-4" /> },
  { id: 'medical', name: 'Medical', icon: <Folder className="h-4 w-4" /> },
];

interface DigitalAsset {
  id: string;
  user_id: string;
  name: string;
  size: string;
  type: string;
  storage_path: string;
  last_accessed: string | null;
  created_at: string;
  updated_at: string;
  visibility?: string;
  tags?: string[];
  folder?: string;
  scheduled_release_date?: string | null;
  watermark?: boolean;
  restrict_download?: boolean;
}

const DigitalAssetVaultPage: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFileType, setSelectedFileType] = useState<string | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedVisibility, setSelectedVisibility] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [allTags, setAllTags] = useState<string[]>([]);
  
  // Fetch digital assets
  const { data: digitalAssets = [], isLoading } = useQuery({
    queryKey: ['digitalAssets', user?.id, selectedFolder, selectedFileType, selectedVisibility, selectedTags, searchTerm],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase
        .from('digital_assets')
        .select('*')
        .eq('user_id', user.id);
      
      if (selectedFolder) {
        query = query.eq('folder', selectedFolder);
      }
      
      if (selectedVisibility) {
        query = query.eq('visibility', selectedVisibility);
      }
      
      if (selectedFileType) {
        // Instead of using containsAny (which doesn't exist), we'll use a more basic approach
        query = query.ilike('type', `%${selectedFileType}%`);
      }
      
      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }
      
      // For tags (which is an array), we need to use Postgres array operators
      // But since we can't guarantee they exist in all records, we'll filter in JS instead
      
      const { data, error } = await query.order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Filter by tags in JavaScript if tags are selected
      let filteredData = data as unknown as DigitalAssetExtended[];
      if (selectedTags.length > 0) {
        filteredData = filteredData.filter(asset => {
          if (!asset.tags) return false;
          return selectedTags.some(tag => asset.tags!.includes(tag));
        });
      }
      
      return filteredData;
    },
    enabled: !!user,
  });
  
  // Delete asset mutation
  const deleteAssetMutation = useMutation({
    mutationFn: async (asset: DigitalAsset) => {
      // Delete file from storage
      const { error: storageError } = await supabase.storage
        .from('digital_vault')
        .remove([asset.storage_path]);
      
      if (storageError) throw storageError;
      
      // Delete metadata from database
      const { error: dbError } = await supabase
        .from('digital_assets')
        .delete()
        .eq('id', asset.id);
        
      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['digitalAssets'] });
      toast({
        title: 'Asset deleted',
        description: 'The asset has been permanently deleted.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete asset',
        variant: 'destructive',
      });
    },
  });
  
  // Update asset mutation
  const updateAssetMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<DigitalAsset> }) => {
      const { error } = await supabase
        .from('digital_assets')
        .update(updates)
        .eq('id', id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['digitalAssets'] });
      toast({
        title: 'Asset updated',
        description: 'The asset has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update asset',
        variant: 'destructive',
      });
    },
  });
  
  // Handle file upload completion
  const handleUploadComplete = async (
    filePath: string, 
    fileName: string, 
    fileSize: number, 
    visibility: FileVisibility = 'private',
    scheduledDate: Date | null = null,
    tags: string[] = [],
    folder: string = 'general',
    watermark: boolean = false,
    restrictDownload: boolean = false
  ) => {
    try {
      // Get file extension
      const fileExt = fileName.split('.').pop()?.toLowerCase() || '';
      
      // Determine file type category
      let fileType = 'other';
      for (const [category, extensions] of Object.entries(FILE_CATEGORIES)) {
        if (extensions.includes(fileExt)) {
          fileType = category;
          break;
        }
      }
      
      // Insert file metadata into database
      const { error } = await supabase
        .from('digital_assets')
        .insert({
          user_id: user?.id,
          name: fileName,
          size: (fileSize / 1024).toFixed(2) + ' KB',
          type: fileType,
          storage_path: filePath,
          visibility: visibility,
          tags: tags,
          folder: folder,
          scheduled_release_date: scheduledDate ? scheduledDate.toISOString() : null,
          watermark: watermark,
          restrict_download: restrictDownload
        });
        
      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['digitalAssets'] });
      
      // Update all tags list
      if (tags.length > 0) {
        setAllTags(prevTags => {
          const newTags = [...prevTags];
          tags.forEach(tag => {
            if (!newTags.includes(tag)) {
              newTags.push(tag);
            }
          });
          return newTags;
        });
      }
      
      setIsUploadDialogOpen(false);
      
    } catch (error) {
      console.error('Error saving file metadata:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save file metadata',
        variant: 'destructive',
      });
    }
  };
  
  // Extract all unique tags from assets
  useEffect(() => {
    if (digitalAssets.length > 0) {
      const tagsSet = new Set<string>();
      digitalAssets.forEach(asset => {
        if (asset.tags && Array.isArray(asset.tags)) {
          asset.tags.forEach(tag => tagsSet.add(tag));
        }
      });
      setAllTags(Array.from(tagsSet));
    }
  }, [digitalAssets]);
  
  // Handle downloading an asset
  const handleDownloadAsset = async (asset: DigitalAsset) => {
    try {
      const { data, error } = await supabase.storage
        .from('digital_vault')
        .download(asset.storage_path);
        
      if (error) throw error;
      
      // Create a download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = asset.name;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      // Update last accessed timestamp
      updateAssetMutation.mutate({
        id: asset.id,
        updates: { last_accessed: new Date().toISOString() }
      });
      
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: 'Download failed',
        description: error instanceof Error ? error.message : 'Failed to download file',
        variant: 'destructive',
      });
    }
  };
  
  // Handle viewing an asset
  const handleViewAsset = async (asset: DigitalAsset) => {
    try {
      // Get a signed URL
      const { data, error } = await supabase.storage
        .from('digital_vault')
        .createSignedUrl(asset.storage_path, 60); // 60 seconds expiry
        
      if (error) throw error;
      
      // Open in a new tab
      window.open(data.signedUrl, '_blank');
      
      // Update last accessed timestamp
      updateAssetMutation.mutate({
        id: asset.id,
        updates: { last_accessed: new Date().toISOString() }
      });
      
    } catch (error) {
      console.error('View error:', error);
      toast({
        title: 'View failed',
        description: error instanceof Error ? error.message : 'Failed to view file',
        variant: 'destructive',
      });
    }
  };
  
  // Get file icon based on type
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'video':
        return <Film className="h-4 w-4" />;
      case 'audio':
        return <Music className="h-4 w-4" />;
      case 'archive':
        return <Archive className="h-4 w-4" />;
      case 'code':
        return <Code className="h-4 w-4" />;
      default:
        return <FileIcon className="h-4 w-4" />;
    }
  };
  
  // Helper to format file size
  const formatFileSize = (size: string) => {
    return size;
  };
  
  // Handle adding a tag to filter
  const handleAddTagFilter = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  // Handle removing a tag from filter
  const handleRemoveTagFilter = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };
  
  // Handle tag input in the filter
  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput) {
      e.preventDefault();
      handleAddTagFilter(tagInput);
      setTagInput('');
    }
  };
  
  // Calculate stats
  const totalFiles = digitalAssets.length;
  const totalSize = digitalAssets.reduce((acc, asset) => {
    const sizeStr = asset.size;
    const sizeNum = parseFloat(sizeStr);
    const unit = sizeStr.includes('MB') ? 1024 : 1;
    return acc + (sizeNum * unit);
  }, 0);
  
  const formatTotalSize = () => {
    if (totalSize < 1024) {
      return `${totalSize.toFixed(2)} KB`;
    } else {
      return `${(totalSize / 1024).toFixed(2)} MB`;
    }
  };
  
  // Group assets by folder
  const assetsByFolder = digitalAssets.reduce((acc, asset) => {
    const folder = asset.folder || 'general';
    if (!acc[folder]) {
      acc[folder] = [];
    }
    acc[folder].push(asset);
    return acc;
  }, {} as Record<string, DigitalAsset[]>);
  
  // Record audio or video
  const startRecording = (mediaType: 'audio' | 'video') => {
    if (!user) return;
    
    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: mediaType === 'video',
    })
      .then(stream => {
        // Create a MediaRecorder instance
        const mediaRecorder = new MediaRecorder(stream);
        const recordedChunks: Blob[] = [];
        
        // Listen for dataavailable event (fired when recording stops)
        mediaRecorder.addEventListener('dataavailable', function(e) {
          if (e.data.size > 0) {
            recordedChunks.push(e.data);
          }
        });
        
        // Listen for stop event
        mediaRecorder.addEventListener('stop', function() {
          // Create a blob from the recorded chunks
          const blob = new Blob(recordedChunks, {
            type: mediaType === 'video' ? 'video/webm' : 'audio/webm'
          });
          
          // Upload the blob to Supabase storage
          const fileName = `recording_${Date.now()}.webm`;
          const filePath = `${user.id}/${fileName}`;
          
          supabase.storage
            .from('digital_vault')
            .upload(filePath, blob)
            .then(({ data, error }) => {
              if (error) {
                throw error;
              }
              
              // Add the file to the database
              handleUploadComplete(
                filePath,
                fileName,
                blob.size,
                'private',
                null,
                [],
                'general',
                false,
                false
              );
            })
            .catch(error => {
              console.error('Upload error:', error);
              toast({
                title: 'Upload failed',
                description: error.message || 'Failed to upload recording',
                variant: 'destructive',
              });
            });
            
          // Stop all tracks
          stream.getTracks().forEach(track => track.stop());
        });
        
        // Start recording
        mediaRecorder.start();
        
        // Stop recording after 5 seconds (for testing)
        setTimeout(() => mediaRecorder.stop(), 5000);
      })
      .catch(err => {
        console.error('Error accessing media devices:', err);
        toast({
          title: 'Recording error',
          description: 'Could not access camera or microphone',
          variant: 'destructive',
        });
      });
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
          <h1 className="text-3xl font-bold">Digital Asset Vault</h1>
          <p className="text-muted-foreground">
            Store and protect your most important digital assets
          </p>
        </div>
        
        <Button onClick={() => setIsUploadDialogOpen(true)} className="flex items-center gap-2">
          <Upload className="h-4 w-4" /> 
          Upload Files
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
        <Card className="md:col-span-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Files & Documents</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search files..."
                    className="pl-8 w-[200px] md:w-[300px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Filter Files</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    <div className="p-2">
                      <Label className="text-xs font-medium mb-1 block">File Type</Label>
                      <Select
                        value={selectedFileType || ''}
                        onValueChange={(value) => setSelectedFileType(value || null)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All types</SelectItem>
                          <SelectItem value="image">Images</SelectItem>
                          <SelectItem value="document">Documents</SelectItem>
                          <SelectItem value="video">Videos</SelectItem>
                          <SelectItem value="audio">Audio</SelectItem>
                          <SelectItem value="archive">Archives</SelectItem>
                          <SelectItem value="code">Code</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="p-2">
                      <Label className="text-xs font-medium mb-1 block">Visibility</Label>
                      <Select
                        value={selectedVisibility || ''}
                        onValueChange={(value) => setSelectedVisibility(value || null)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All visibility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All visibility</SelectItem>
                          <SelectItem value="private">Private Only</SelectItem>
                          <SelectItem value="post-death">Post-Death</SelectItem>
                          <SelectItem value="scheduled">Scheduled Release</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="p-2">
                      <Label className="text-xs font-medium mb-1 block">Tags</Label>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {selectedTags.map(tag => (
                          <Badge key={tag} variant="secondary" className="gap-1">
                            {tag}
                            <button
                              onClick={() => handleRemoveTagFilter(tag)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex gap-1">
                        <Input
                          placeholder="Add tag..."
                          className="text-xs h-8"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleTagInputKeyDown}
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            if (tagInput) {
                              handleAddTagFilter(tagInput);
                              setTagInput('');
                            }
                          }}
                          className="h-8 px-2"
                        >
                          Add
                        </Button>
                      </div>
                      
                      {allTags.length > 0 && (
                        <div className="mt-2">
                          <Label className="text-xs font-medium mb-1 block">Suggested tags:</Label>
                          <div className="flex flex-wrap gap-1">
                            {allTags
                              .filter(tag => !selectedTags.includes(tag))
                              .slice(0, 8)
                              .map(tag => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="cursor-pointer hover:bg-secondary"
                                  onClick={() => handleAddTagFilter(tag)}
                                >
                                  {tag}
                                </Badge>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {(selectedFileType || selectedVisibility || selectedTags.length > 0) && (
                      <div className="p-2 pt-0">
                        <Button
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedFileType(null);
                            setSelectedVisibility(null);
                            setSelectedTags([]);
                          }}
                          className="w-full justify-start text-xs h-8 mt-2"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Clear all filters
                        </Button>
                      </div>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="all" className="mb-6">
              <TabsList>
                <TabsTrigger value="all" onClick={() => setSelectedFolder(null)}>
                  All Files
                </TabsTrigger>
                {FOLDERS.map(folder => (
                  <TabsTrigger 
                    key={folder.id} 
                    value={folder.id}
                    onClick={() => setSelectedFolder(folder.id)}
                  >
                    {folder.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-pulse">Loading files...</div>
              </div>
            ) : digitalAssets.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Visibility</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {digitalAssets.map((asset) => (
                      <TableRow key={asset.id}>
                        <TableCell className="font-medium flex items-center gap-2">
                          {getFileIcon(asset.type)}
                          <span className="truncate max-w-[200px]">{asset.name}</span>
                          {asset.watermark && (
                            <Badge variant="outline" className="ml-1">Watermarked</Badge>
                          )}
                        </TableCell>
                        <TableCell>{asset.type}</TableCell>
                        <TableCell>{formatFileSize(asset.size)}</TableCell>
                        <TableCell>
                          {asset.visibility === 'private' ? (
                            <Badge variant="outline" className="flex items-center gap-1 border-blue-200">
                              <Lock className="h-3 w-3" />
                              Private
                            </Badge>
                          ) : asset.visibility === 'post-death' ? (
                            <Badge variant="outline" className="flex items-center gap-1 border-purple-200">
                              <Clock className="h-3 w-3" />
                              Post-Death
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="flex items-center gap-1 border-green-200">
                              <CalendarIcon className="h-3 w-3" />
                              Scheduled
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {format(new Date(asset.created_at), 'PP')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleViewAsset(asset)}
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDownloadAsset(asset)}
                              title="Download"
                              disabled={asset.restrict_download}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleViewAsset(asset)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDownloadAsset(asset)}
                                  disabled={asset.restrict_download}
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => deleteAssetMutation.mutate(asset)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <FolderOpen className="mx-auto h-10 w-10 text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-lg font-medium mb-1">No files found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || selectedFileType || selectedVisibility || selectedTags.length > 0
                    ? "No files match your search criteria"
                    : "Upload your first file to get started"}
                </p>
                <Button onClick={() => setIsUploadDialogOpen(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="md:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vault Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Files</span>
                  <span className="font-medium">{totalFiles}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Size</span>
                  <span className="font-medium">{formatTotalSize()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">File Types</span>
                  <div className="flex gap-1">
                    {Object.keys(FILE_CATEGORIES).map(category => 
                      digitalAssets.some(asset => asset.type === category) && (
                        <div key={category} className="w-6 h-6 flex items-center justify-center bg-muted rounded-full">
                          {getFileIcon(category)}
                        </div>
                      )
                    )}
                  </div>
                </div>
                
                <div className="pt-4">
                  <h4 className="text-sm font-medium mb-2">Quick Access</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      className="justify-start"
                      onClick={() => {
                        setSelectedFileType('document');
                        setSelectedFolder('legal');
                      }}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Legal Docs
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start"
                      onClick={() => {
                        setSelectedFileType('image');
                        setSelectedFolder(null);
                      }}
                    >
                      <Image className="h-4 w-4 mr-2" />
                      Photos
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start"
                      onClick={() => {
                        setSelectedFileType(null);
                        setSelectedVisibility('post-death');
                      }}
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      After Death
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start"
                      onClick={() => {
                        setSelectedFileType(null);
                        setSelectedFolder('financial');
                      }}
                    >
                      <Folder className="h-4 w-4 mr-2" />
                      Financial
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Popular Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {allTags.length > 0 ? (
                  allTags.slice(0, 20).map(tag => (
                    <Badge 
                      key={tag} 
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        if (selectedTags.includes(tag)) {
                          handleRemoveTagFilter(tag);
                        } else {
                          handleAddTagFilter(tag);
                        }
                      }}
                    >
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No tags yet. Add tags when uploading files.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
            <DialogDescription>
              Add files to your digital vault for safekeeping
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <FileUpload
              bucketName="digital_vault"
              path={user?.id}
              onUploadComplete={handleUploadComplete}
              maxSizeMB={50}
              showAdvancedOptions={showAdvancedOptions}
              className="border p-4 rounded-md"
            />
            
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              >
                {showAdvancedOptions ? 'Hide' : 'Show'} Advanced Options
              </Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DigitalAssetVaultPage;
