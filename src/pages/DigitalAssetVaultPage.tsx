import React, { useState, useRef } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { 
  PlusCircle,
  Search,
  Filter,
  MoreVertical,
  FileText,
  Video,
  Image as ImageIcon,
  File,
  Trash2,
  Download,
  Eye,
  Upload,
  AlertCircle,
  Folder,
  FolderOpen,
  Tag,
  Lock,
  Calendar,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import FileUpload, { FileVisibility } from '@/components/FileUpload';
import { format } from 'date-fns';

interface DigitalAsset {
  id: string;
  user_id: string;
  name: string;
  type: string;
  size: string;
  storage_path: string;
  created_at: string;
  updated_at: string;
  last_accessed?: string;
  visibility: FileVisibility;
  tags: string[];
  folder: string;
  scheduled_release_date: string | null;
  watermark: boolean;
  restrict_download: boolean;
}

type AssetFolder = 'all' | 'general' | 'family' | 'career' | 'travel' | 'legal' | 'financial' | 'medical';

const DigitalAssetVaultPage: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewingAsset, setViewingAsset] = useState<DigitalAsset | null>(null);
  const [viewUrl, setViewUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [activeFolder, setActiveFolder] = useState<AssetFolder>('all');
  const [visibilityFilter, setVisibilityFilter] = useState<FileVisibility | 'all'>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const queryClient = useQueryClient();
  
  // Query digital assets
  const { data: assets = [], isLoading } = useQuery({
    queryKey: ['digitalAssets', user?.id, activeFolder, visibilityFilter, selectedTags],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase
        .from('digital_assets')
        .select('*')
        .eq('user_id', user.id);
      
      // Apply folder filter
      if (activeFolder !== 'all') {
        query = query.eq('folder', activeFolder);
      }
      
      // Apply visibility filter
      if (visibilityFilter !== 'all') {
        query = query.eq('visibility', visibilityFilter);
      }
      
      // Apply tag filter if any tags are selected
      if (selectedTags.length > 0) {
        // For each selected tag, add an overlap condition
        selectedTags.forEach(tag => {
          query = query.containsAny('tags', [tag]);
        });
      }
      
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
        
      if (error) throw error;
      return (data || []) as DigitalAsset[];
    },
    enabled: !!user,
  });

  // Get all unique tags from assets
  const allTags = React.useMemo(() => {
    if (!assets) return [];
    
    const tagSet = new Set<string>();
    assets.forEach(asset => {
      if (asset.tags && Array.isArray(asset.tags)) {
        asset.tags.forEach(tag => tagSet.add(tag));
      }
    });
    
    return Array.from(tagSet);
  }, [assets]);

  // Upload asset mutation
  const uploadAssetMutation = useMutation({
    mutationFn: async (data: { 
      file: File; 
      name?: string; 
      visibility: FileVisibility;
      scheduledDate?: Date | null;
      tags?: string[];
      folder?: string;
      watermark?: boolean;
      restrictDownload?: boolean;
    }) => {
      if (!user) throw new Error('Not authenticated');
      
      const { 
        file, 
        name, 
        visibility, 
        scheduledDate, 
        tags, 
        folder = 'general',
        watermark = false,
        restrictDownload = false
      } = data;
      
      const fileName = name || file.name;
      const fileType = file.type.split('/')[0]; // e.g., 'image', 'video', etc.
      const filePath = `${user.id}/${Date.now()}_${fileName}`;
      
      // Upload file to storage
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('digital_vault')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Save metadata to database
      const { error: dbError } = await supabase
        .from('digital_assets')
        .insert({
          user_id: user.id,
          name: fileName,
          type: fileType,
          size: formatFileSize(file.size),
          storage_path: filePath,
          visibility: visibility,
          scheduled_release_date: scheduledDate ? scheduledDate.toISOString() : null,
          tags: tags || [],
          folder: folder,
          watermark: watermark,
          restrict_download: restrictDownload
        });
        
      if (dbError) {
        // Clean up storage if database insert fails
        await supabase.storage.from('digital_vault').remove([filePath]);
        throw dbError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['digitalAssets'] });
      toast({
        title: 'File uploaded',
        description: 'Your file has been uploaded to the digital vault.',
      });
      setIsUploadDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload file',
        variant: 'destructive',
      });
    },
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
        title: 'File deleted',
        description: 'Your file has been deleted from the vault.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete file',
        variant: 'destructive',
      });
    },
  });

  const handleUploadComplete = (
    filePath: string, 
    fileName: string, 
    fileSize: number,
    visibility?: FileVisibility,
    scheduledDate?: Date | null,
    tags?: string[],
    folder?: string,
    watermark?: boolean,
    restrictDownload?: boolean
  ) => {
    // Create a File object from the file input (this won't be used for actual upload)
    const dummyFile = new File([], fileName, { type: getMimeType(fileName) });
    
    uploadAssetMutation.mutate({
      file: dummyFile,
      name: fileName,
      visibility: visibility || 'private',
      scheduledDate,
      tags,
      folder,
      watermark,
      restrictDownload
    });
  };

  const handleViewAsset = async (asset: DigitalAsset) => {
    try {
      setViewingAsset(asset);
      setIsViewDialogOpen(true);
      
      // Update last accessed timestamp
      await supabase
        .from('digital_assets')
        .update({ last_accessed: new Date().toISOString() })
        .eq('id', asset.id);
      
      // Get temporary URL for the file
      const { data, error } = await supabase.storage
        .from('digital_vault')
        .createSignedUrl(asset.storage_path, 60); // 60 seconds expiry
      
      if (error) throw error;
      setViewUrl(data.signedUrl);
      
    } catch (error) {
      console.error('Error getting file URL:', error);
      toast({
        title: 'Error',
        description: 'Failed to retrieve the file. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadAsset = async (asset: DigitalAsset) => {
    try {
      // Check if downloads are restricted
      if (asset.restrict_download) {
        toast({
          title: 'Download restricted',
          description: 'This file has download restrictions enabled.',
          variant: 'destructive'
        });
        return;
      }
      
      // Get temporary URL for the file
      const { data, error } = await supabase.storage
        .from('digital_vault')
        .createSignedUrl(asset.storage_path, 60); // 60 seconds expiry
      
      if (error) throw error;
      
      // Update last accessed timestamp
      await supabase
        .from('digital_assets')
        .update({ last_accessed: new Date().toISOString() })
        .eq('id', asset.id);
      
      // Create a temporary anchor element and trigger download
      const a = document.createElement('a');
      a.href = data.signedUrl;
      a.download = asset.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: 'Download failed',
        description: 'Failed to download the file. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getIconForAssetType = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'application':
        return <FileText className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const getColorForAssetType = (type: string) => {
    switch (type) {
      case 'image':
        return 'blue';
      case 'video':
        return 'red';
      case 'application':
        return 'amber';
      default:
        return 'gray';
    }
  };

  const getIconForFolder = (folder: string) => {
    switch (folder) {
      case 'family':
        return <FolderOpen className="h-4 w-4 mr-2" />;
      case 'career':
        return <FolderOpen className="h-4 w-4 mr-2" />;
      case 'travel':
        return <FolderOpen className="h-4 w-4 mr-2" />;
      case 'legal':
        return <FolderOpen className="h-4 w-4 mr-2" />;
      case 'financial':
        return <FolderOpen className="h-4 w-4 mr-2" />;
      case 'medical':
        return <FolderOpen className="h-4 w-4 mr-2" />;
      default:
        return <Folder className="h-4 w-4 mr-2" />;
    }
  };

  const getIconForVisibility = (visibility: FileVisibility) => {
    switch (visibility) {
      case 'private':
        return <Lock className="h-4 w-4" />;
      case 'post-death':
        return <AlertCircle className="h-4 w-4" />;
      case 'scheduled':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Lock className="h-4 w-4" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getMimeType = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    
    const mimeTypes: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      xls: 'application/vnd.ms-excel',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ppt: 'application/vnd.ms-powerpoint',
      pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      mp3: 'audio/mpeg',
      mp4: 'video/mp4',
      mov: 'video/quicktime',
      txt: 'text/plain',
    };
    
    return ext ? mimeTypes[ext] || 'application/octet-stream' : 'application/octet-stream';
  };

  const toggleTagSelection = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  let filteredAssets = assets || [];
  
  // Filter by search query
  if (searchQuery) {
    filteredAssets = filteredAssets.filter(asset => 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  // Filter by tab selection (asset type)
  if (activeTab !== 'all') {
    filteredAssets = filteredAssets.filter(asset => asset.type === activeTab);
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
          <h1 className="text-3xl font-bold">Digital Asset Vault</h1>
          <p className="text-muted-foreground">
            Store and protect your most important digital assets
          </p>
        </div>

        <Button onClick={() => setIsUploadDialogOpen(true)} className="flex items-center gap-2">
          <Upload className="h-4 w-4" /> 
          Upload New Asset
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Folders</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                <Button 
                  variant={activeFolder === 'all' ? 'default' : 'ghost'} 
                  className="w-full justify-start" 
                  onClick={() => setActiveFolder('all')}
                >
                  <Folder className="h-4 w-4 mr-2" /> All Files
                </Button>
                <Button 
                  variant={activeFolder === 'general' ? 'default' : 'ghost'} 
                  className="w-full justify-start" 
                  onClick={() => setActiveFolder('general')}
                >
                  <Folder className="h-4 w-4 mr-2" /> General
                </Button>
                <Button 
                  variant={activeFolder === 'family' ? 'default' : 'ghost'} 
                  className="w-full justify-start" 
                  onClick={() => setActiveFolder('family')}
                >
                  <FolderOpen className="h-4 w-4 mr-2" /> Family
                </Button>
                <Button 
                  variant={activeFolder === 'career' ? 'default' : 'ghost'} 
                  className="w-full justify-start" 
                  onClick={() => setActiveFolder('career')}
                >
                  <FolderOpen className="h-4 w-4 mr-2" /> Career
                </Button>
                <Button 
                  variant={activeFolder === 'travel' ? 'default' : 'ghost'} 
                  className="w-full justify-start" 
                  onClick={() => setActiveFolder('travel')}
                >
                  <FolderOpen className="h-4 w-4 mr-2" /> Travel
                </Button>
                <Button 
                  variant={activeFolder === 'legal' ? 'default' : 'ghost'} 
                  className="w-full justify-start" 
                  onClick={() => setActiveFolder('legal')}
                >
                  <FolderOpen className="h-4 w-4 mr-2" /> Legal Documents
                </Button>
                <Button 
                  variant={activeFolder === 'financial' ? 'default' : 'ghost'} 
                  className="w-full justify-start" 
                  onClick={() => setActiveFolder('financial')}
                >
                  <FolderOpen className="h-4 w-4 mr-2" /> Financial
                </Button>
                <Button 
                  variant={activeFolder === 'medical' ? 'default' : 'ghost'} 
                  className="w-full justify-start" 
                  onClick={() => setActiveFolder('medical')}
                >
                  <FolderOpen className="h-4 w-4 mr-2" /> Medical
                </Button>
              </div>
            </CardContent>
            <Separator />
            <CardHeader>
              <CardTitle className="text-lg">Visibility</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                <Button 
                  variant={visibilityFilter === 'all' ? 'default' : 'ghost'} 
                  className="w-full justify-start" 
                  onClick={() => setVisibilityFilter('all')}
                >
                  <Eye className="h-4 w-4 mr-2" /> All
                </Button>
                <Button 
                  variant={visibilityFilter === 'private' ? 'default' : 'ghost'} 
                  className="w-full justify-start" 
                  onClick={() => setVisibilityFilter('private')}
                >
                  <Lock className="h-4 w-4 mr-2" /> Private
                </Button>
                <Button 
                  variant={visibilityFilter === 'post-death' ? 'default' : 'ghost'} 
                  className="w-full justify-start" 
                  onClick={() => setVisibilityFilter('post-death')}
                >
                  <AlertCircle className="h-4 w-4 mr-2" /> Post-Death
                </Button>
                <Button 
                  variant={visibilityFilter === 'scheduled' ? 'default' : 'ghost'} 
                  className="w-full justify-start" 
                  onClick={() => setVisibilityFilter('scheduled')}
                >
                  <Calendar className="h-4 w-4 mr-2" /> Scheduled
                </Button>
              </div>
            </CardContent>
            <Separator />
            <CardHeader>
              <CardTitle className="text-lg">Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {allTags.length > 0 ? (
                  allTags.map(tag => (
                    <Badge 
                      key={tag} 
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTagSelection(tag)}
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No tags yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Asset Manager</CardTitle>
              <CardDescription>
                Manage your digital assets securely stored in your vault
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search assets..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="all">All Assets</TabsTrigger>
                  <TabsTrigger value="image">Images</TabsTrigger>
                  <TabsTrigger value="video">Videos</TabsTrigger>
                  <TabsTrigger value="application">Documents</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-0">
                  {isLoading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-pulse">Loading assets...</div>
                    </div>
                  ) : filteredAssets.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full table-auto">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Visibility</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Size</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date Added</th>
                            <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAssets.map((asset) => (
                            <tr key={asset.id} className="border-b hover:bg-muted/50">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-md bg-${getColorForAssetType(asset.type)}-100`}>
                                    {getIconForAssetType(asset.type)}
                                  </div>
                                  <div>
                                    <span className="truncate max-w-[200px] block" title={asset.name}>
                                      {asset.name}
                                    </span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {asset.tags && asset.tags.length > 0 && asset.tags.slice(0, 2).map(tag => (
                                        <Badge key={tag} variant="outline" className="text-xs">
                                          {tag}
                                        </Badge>
                                      ))}
                                      {asset.tags && asset.tags.length > 2 && (
                                        <Badge variant="outline" className="text-xs">
                                          +{asset.tags.length - 2}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 capitalize">{asset.type}</td>
                              <td className="py-3 px-4">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <div className="flex items-center gap-1">
                                        {getIconForVisibility(asset.visibility)}
                                        <span className="capitalize">{asset.visibility}</span>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {asset.visibility === 'scheduled' && asset.scheduled_release_date && (
                                        <p>Scheduled for release on {format(new Date(asset.scheduled_release_date), 'PP')}</p>
                                      )}
                                      {asset.visibility === 'post-death' && (
                                        <p>Will be available after death</p>
                                      )}
                                      {asset.visibility === 'private' && (
                                        <p>Only visible to you</p>
                                      )}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </td>
                              <td className="py-3 px-4">{asset.size}</td>
                              <td className="py-3 px-4">
                                {new Date(asset.created_at).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8" 
                                    onClick={() => handleViewAsset(asset)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8"
                                    onClick={() => handleDownloadAsset(asset)}
                                    disabled={asset.restrict_download}
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-8">
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => handleViewAsset(asset)}>
                                        <Eye className="h-4 w-4 mr-2" />
                                        View
                                      </DropdownMenuItem>
                                      {!asset.restrict_download && (
                                        <DropdownMenuItem onClick={() => handleDownloadAsset(asset)}>
                                          <Download className="h-4 w-4 mr-2" />
                                          Download
                                        </DropdownMenuItem>
                                      )}
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem 
                                        className="text-red-600"
                                        onClick={() => deleteAssetMutation.mutate(asset)}
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <File className="mx-auto h-10 w-10 text-muted-foreground opacity-50 mb-4" />
                      <h3 className="text-lg font-medium mb-1">No assets found</h3>
                      <p className="text-muted-foreground mb-4">
                        {searchQuery 
                          ? `No results for "${searchQuery}"` 
                          : "You haven't uploaded any assets yet"}
                      </p>
                      <Button onClick={() => setIsUploadDialogOpen(true)}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Your First Asset
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="image" className="mt-0">
                  {isLoading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-pulse">Loading images...</div>
                    </div>
                  ) : filteredAssets.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {filteredAssets.map(asset => (
                        <Card key={asset.id} className="overflow-hidden">
                          <div 
                            className="aspect-square bg-muted flex items-center justify-center cursor-pointer"
                            onClick={() => handleViewAsset(asset)}
                          >
                            <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                          </div>
                          <CardContent className="p-3">
                            <div className="truncate font-medium">{asset.name}</div>
                            <div className="text-xs text-muted-foreground flex justify-between mt-1">
                              <span>{asset.size}</span>
                              <span>{new Date(asset.created_at).toLocaleDateString()}</span>
                            </div>
                          </CardContent>
                          <CardFooter className="p-3 pt-0 flex justify-between">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewAsset(asset)}
                            >
                              View
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-red-600"
                              onClick={() => deleteAssetMutation.mutate(asset)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground opacity-50 mb-4" />
                      <h3 className="text-lg font-medium mb-1">No images found</h3>
                      <p className="text-muted-foreground mb-4">
                        {searchQuery 
                          ? `No results for "${searchQuery}"` 
                          : "You haven't uploaded any images yet"}
                      </p>
                      <Button onClick={() => setIsUploadDialogOpen(true)}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload an Image
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="video" className="mt-0">
                  {isLoading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-pulse">Loading videos...</div>
                    </div>
                  ) : filteredAssets.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredAssets.map(asset => (
                        <Card key={asset.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <div className="bg-red-100 rounded-md p-3">
                                <Video className="h-8 w-8 text-red-600" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium truncate" title={asset.name}>{asset.name}</h3>
                                <div className="text-sm text-muted-foreground mt-1">
                                  {asset.size} • Added on {new Date(asset.created_at).toLocaleDateString()}
                                </div>
                                <div className="flex gap-2 mt-3">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleViewAsset(asset)}
                                  >
                                    View
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleDownloadAsset(asset)}
                                  >
                                    Download
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-red-600"
                                    onClick={() => deleteAssetMutation.mutate(asset)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Video className="mx-auto h-10 w-10 text-muted-foreground opacity-50 mb-4" />
                      <h3 className="text-lg font-medium mb-1">No videos found</h3>
                      <p className="text-muted-foreground mb-4">
                        {searchQuery 
                          ? `No results for "${searchQuery}"` 
                          : "You haven't uploaded any videos yet"}
                      </p>
                      <Button onClick={() => setIsUploadDialogOpen(true)}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload a Video
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="application" className="mt-0">
                  {isLoading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-pulse">Loading documents...</div>
                    </div>
                  ) : filteredAssets.length > 0 ? (
                    <div className="space-y-4">
                      {filteredAssets.map(asset => (
                        <Card key={asset.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              <div className="bg-amber-100 rounded-md p-3">
                                <FileText className="h-6 w-6 text-amber-600" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium truncate" title={asset.name}>{asset.name}</h3>
                                <div className="text-sm text-muted-foreground mt-1">
                                  {asset.size} • Added on {new Date(asset.created_at).toLocaleDateString()}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleViewAsset(asset)}
                                >
                                  View
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleDownloadAsset(asset)}
                                >
                                  Download
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-red-600"
                                  onClick={() => deleteAssetMutation.mutate(asset)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="mx-auto h-10 w-10 text-muted-foreground opacity-50 mb-4" />
                      <h3 className="text-lg font-medium mb-1">No documents found</h3>
                      <p className="text-muted-foreground mb-4">
                        {searchQuery 
                          ? `No results for "${searchQuery}"` 
                          : "You haven't uploaded any documents yet"}
                      </p>
                      <Button onClick={() => setIsUploadDialogOpen(true)}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload a Document
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upload File Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Upload New Asset</DialogTitle>
            <DialogDescription>
              Upload a file to your digital asset vault. Maximum file size is 10MB.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <FileUpload 
              bucketName="digital_vault"
              path={user?.id}
              onUploadComplete={handleUploadComplete}
              maxSizeMB={10}
              showAdvancedOptions={true}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* View Asset Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        {viewingAsset && (
          <DialogContent className="sm:max-w-[800px] sm:max-h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="truncate" title={viewingAsset.name}>{viewingAsset.name}</DialogTitle>
              <DialogDescription>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span>Uploaded on {new Date(viewingAsset.created_at).toLocaleString()}</span>
                  <Separator orientation="vertical" className="h-4" />
                  <span className="flex items-center gap-1">
                    {getIconForVisibility(viewingAsset.visibility)}
                    <span className="capitalize">{viewingAsset.visibility}</span>
                  </span>
                  {viewingAsset.visibility === 'scheduled' && viewingAsset.scheduled_release_date && (
                    <>
                      <Separator orientation="vertical" className="h-4" />
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(viewingAsset.scheduled_release_date), 'PP')}
                      </span>
                    </>
                  )}
                  {viewingAsset.restrict_download && (
                    <>
                      <Separator orientation="vertical" className="h-4" />
                      <span className="flex items-center gap-1 text-orange-500">
                        <XCircle className="h-4 w-4" />
                        Download restricted
                      </span>
                    </>
                  )}
                  {viewingAsset.watermark && (
                    <>
                      <Separator orientation="vertical" className="h-4" />
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" />
                        Watermarked
                      </span>
                    </>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {viewingAsset.tags && viewingAsset.tags.length > 0 && viewingAsset.tags.map(tag => (
                    <Badge key={tag} variant="outline">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center items-center overflow-auto p-2 max-h-[60vh]">
              {viewUrl ? (
                viewingAsset.type === 'image' ? (
                  <div className="relative">
                    <img 
                      src={viewUrl} 
                      alt={viewingAsset.name} 
                      className="max-w-full max-h-full object-contain"
                    />
                    {viewingAsset.watermark && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                        <div className="text-5xl font-bold rotate-[-45deg] text-gray-700">
                          PROTECTED ASSET
                        </div>
                      </div>
                    )}
                  </div>
                ) : viewingAsset.type === 'video' ? (
                  <video 
                    src={viewUrl} 
                    controls 
                    className="max-w-full max-h-full"
                  />
                ) : viewingAsset.type === 'application' ? (
                  <div className="text-center">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p>Document preview not available.</p>
                    {!viewingAsset.restrict_download && (
                      <Button 
                        className="mt-4"
                        onClick={() => handleDownloadAsset(viewingAsset)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Document
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    <File className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p>Preview not available for this file type.</p>
                    {!viewingAsset.restrict_download && (
                      <Button 
                        className="mt-4"
                        onClick={() => handleDownloadAsset(viewingAsset)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download File
                      </Button>
                    )}
                  </div>
                )
              ) : (
                <div className="animate-pulse">Loading preview...</div>
              )}
            </div>
            <DialogFooter>
              {!viewingAsset.restrict_download && (
                <Button 
                  onClick={() => handleDownloadAsset(viewingAsset)}
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              )}
              <Button 
                variant="destructive"
                onClick={() => {
                  deleteAssetMutation.mutate(viewingAsset);
                  setIsViewDialogOpen(false);
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default DigitalAssetVaultPage;
