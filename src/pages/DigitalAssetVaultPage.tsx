
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
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const formSchema = z.object({
  file: z.instanceof(FileList).refine(files => files.length > 0, {
    message: "Please select a file."
  }).refine(files => files[0].size <= MAX_FILE_SIZE, {
    message: `File size should be less than 10MB.`
  }),
  name: z.string().optional(),
});

const DigitalAssetVaultPage: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewingAsset, setViewingAsset] = useState<DigitalAsset | null>(null);
  const [viewUrl, setViewUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  // Query digital assets
  const { data: assets, isLoading } = useQuery({
    queryKey: ['digitalAssets', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('digital_assets')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as DigitalAsset[];
    },
    enabled: !!user,
  });

  // Upload asset mutation
  const uploadAssetMutation = useMutation({
    mutationFn: async (data: { file: File; name?: string }) => {
      if (!user) throw new Error('Not authenticated');
      
      const { file, name } = data;
      const fileName = name || file.name;
      const fileType = file.type.split('/')[0]; // e.g., 'image', 'video', etc.
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}_${fileName}`;
      
      // Upload file to storage
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('digital_assets')
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
          storage_path: filePath
        });
        
      if (dbError) {
        // Clean up storage if database insert fails
        await supabase.storage.from('digital_assets').remove([filePath]);
        throw dbError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['digitalAssets'] });
      toast({
        title: 'File uploaded',
        description: 'Your file has been uploaded to the digital asset vault.',
      });
      setIsUploadDialogOpen(false);
      form.reset();
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
        .from('digital_assets')
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

  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    if (formData.file && formData.file.length > 0) {
      const file = formData.file[0];
      await uploadAssetMutation.mutateAsync({ 
        file, 
        name: formData.name || file.name 
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      form.setValue('file', files);
      if (!form.getValues('name')) {
        form.setValue('name', files[0].name);
      }
    }
  };

  const handleUploadClick = () => {
    setIsUploadDialogOpen(true);
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
        .from('digital_assets')
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
      // Get temporary URL for the file
      const { data, error } = await supabase.storage
        .from('digital_assets')
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

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  let filteredAssets = assets || [];
  
  // Filter by search query
  if (searchQuery) {
    filteredAssets = filteredAssets.filter(asset => 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  // Filter by tab selection
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
            Store important documents, photos, and videos securely
          </p>
        </div>

        <Button onClick={handleUploadClick} className="flex items-center gap-2">
          <Upload className="h-4 w-4" /> 
          Upload New Asset
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Asset Manager</CardTitle>
          <CardDescription>
            Manage your digital assets securely stored for your loved ones
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Filter Assets</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActiveTab('all')}>All Assets</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab('image')}>Images</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab('video')}>Videos</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab('application')}>Documents</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab('audio')}>Audio</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                              <span className="truncate max-w-[200px]" title={asset.name}>
                                {asset.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 capitalize">{asset.type}</td>
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
                                  <DropdownMenuItem onClick={() => handleDownloadAsset(asset)}>
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                  </DropdownMenuItem>
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
                  <Button onClick={handleUploadClick}>
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
                  <Button onClick={handleUploadClick}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload an Image
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Render similar TabsContent for video and application (documents) */}
            <TabsContent value="video" className="mt-0">
              {/* Similar structure to image tab */}
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
                  <Button onClick={handleUploadClick}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload a Video
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="application" className="mt-0">
              {/* Similar structure to video tab */}
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
                  <Button onClick={handleUploadClick}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload a Document
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Upload File Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload New Asset</DialogTitle>
            <DialogDescription>
              Upload a file to your digital asset vault. Maximum file size is 10MB.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="file"
                render={() => (
                  <FormItem>
                    <FormLabel>File</FormLabel>
                    <FormControl>
                      <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Input
                          id="file-upload"
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                          ref={fileInputRef}
                        />
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Drag & drop or click to upload
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Max file size: 10MB
                          </p>
                        </div>
                        {form.watch('file') && form.watch('file').length > 0 && (
                          <p className="text-sm">
                            Selected file: {form.watch('file')[0].name}
                          </p>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Name (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a name for your file" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsUploadDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={uploadAssetMutation.isPending || !form.watch('file')}
                >
                  {uploadAssetMutation.isPending ? 'Uploading...' : 'Upload'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* View Asset Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        {viewingAsset && (
          <DialogContent className="sm:max-w-[800px] sm:max-h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="truncate" title={viewingAsset.name}>{viewingAsset.name}</DialogTitle>
              <DialogDescription>
                Uploaded on {new Date(viewingAsset.created_at).toLocaleString()}
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center items-center overflow-auto p-2 max-h-[60vh]">
              {viewUrl ? (
                viewingAsset.type === 'image' ? (
                  <img 
                    src={viewUrl} 
                    alt={viewingAsset.name} 
                    className="max-w-full max-h-full object-contain"
                  />
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
                    <Button 
                      className="mt-4"
                      onClick={() => handleDownloadAsset(viewingAsset)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Document
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <File className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p>Preview not available for this file type.</p>
                    <Button 
                      className="mt-4"
                      onClick={() => handleDownloadAsset(viewingAsset)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download File
                    </Button>
                  </div>
                )
              ) : (
                <div className="animate-pulse">Loading preview...</div>
              )}
            </div>
            <DialogFooter>
              <Button 
                onClick={() => handleDownloadAsset(viewingAsset)}
                variant="outline"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
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
