
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import FileUpload, { FileVisibility } from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Archive,
  FileSpreadsheet,
  FileText,
  Filter,
  Folder,
  Image,
  Lock,
  MoreHorizontal,
  Plus,
  Search,
  Download,
  FileLock2,
  FileUp,
  Trash2,
  FileVideo,
  FileAudio,
  File,
  Tag,
  FileIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

// Define types for digital assets
interface DigitalAsset {
  id: string;
  name: string;
  type: string;
  size: string;
  storage_path: string;
  tags?: string[];
  category?: string;
  description?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  is_encrypted?: boolean;
  last_accessed?: string;
}

const DigitalAssetVaultPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  // Fetch user's digital assets
  const { data: assets, isLoading } = useQuery({
    queryKey: ['digital-assets', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('digital_assets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as DigitalAsset[];
    },
    enabled: !!user,
  });

  // Create a storage bucket if it doesn't exist
  const { isLoading: isCreatingBucket } = useQuery({
    queryKey: ['create-bucket'],
    queryFn: async () => {
      try {
        // Try to create the bucket (this will fail silently if it already exists)
        await supabase.storage.createBucket('digital-assets', {
          public: false,
        });
        return true;
      } catch (error) {
        console.error('Error creating bucket:', error);
        return false;
      }
    },
    refetchOnWindowFocus: false,
    retry: false,
  });

  // Handle asset upload completion
  const handleUploadComplete = async (
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
    if (!user) return;

    try {
      const fileType = fileName.split('.').pop()?.toLowerCase() || '';
      let category = 'document';
      
      // Determine file category based on extension
      if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileType)) {
        category = 'image';
      } else if (['mp4', 'mov', 'avi', 'webm'].includes(fileType)) {
        category = 'video';
      } else if (['mp3', 'wav', 'ogg', 'flac'].includes(fileType)) {
        category = 'audio';
      } else if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(fileType)) {
        category = 'document';
      } else if (['xls', 'xlsx', 'csv'].includes(fileType)) {
        category = 'spreadsheet';
      }

      // Format file size
      const formattedSize = formatFileSize(fileSize);

      // Save asset metadata to database
      const { error } = await supabase.from('digital_assets').insert({
        user_id: user.id,
        name: fileName,
        type: fileType,
        category,
        size: formattedSize,
        storage_path: filePath,
        tags: tags || [],
        description: '',
        is_encrypted: false,
      });

      if (error) throw error;

      // Refresh the assets list
      queryClient.invalidateQueries({ queryKey: ['digital-assets'] });
      setShowUploadDialog(false);

    } catch (error) {
      toast({
        title: 'Error saving asset',
        description: error instanceof Error ? error.message : 'Failed to save asset metadata',
        variant: 'destructive',
      });
    }
  };

  // Delete an asset
  const deleteAssetMutation = useMutation({
    mutationFn: async (asset: DigitalAsset) => {
      if (!user) throw new Error('Not authenticated');

      // First delete the file from storage
      const { error: storageError } = await supabase.storage
        .from('digital-assets')
        .remove([asset.storage_path]);

      if (storageError) throw storageError;

      // Then delete the metadata from the database
      const { error: dbError } = await supabase
        .from('digital_assets')
        .delete()
        .eq('id', asset.id);

      if (dbError) throw dbError;

      return asset.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['digital-assets'] });
      toast({
        title: 'Asset deleted',
        description: 'The digital asset has been successfully deleted.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting asset',
        description: error instanceof Error ? error.message : 'Failed to delete asset',
        variant: 'destructive',
      });
    },
  });

  // Download an asset
  const downloadAsset = async (asset: DigitalAsset) => {
    try {
      const { data, error } = await supabase.storage
        .from('digital-assets')
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
      await supabase
        .from('digital_assets')
        .update({ last_accessed: new Date().toISOString() })
        .eq('id', asset.id);

      toast({
        title: 'Download started',
        description: `Downloading ${asset.name}`,
      });
    } catch (error) {
      toast({
        title: 'Download failed',
        description: error instanceof Error ? error.message : 'Failed to download file',
        variant: 'destructive',
      });
    }
  };

  // Filter assets based on search and folder
  const filteredAssets = assets?.filter((asset) => {
    const matchesSearch = 
      searchQuery === '' || 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (asset.description && asset.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (asset.tags && asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const matchesFolder = 
      selectedFolder === 'all' || 
      (selectedFolder === 'documents' && ['document', 'pdf', 'doc', 'docx', 'txt'].includes(asset.category || '')) ||
      (selectedFolder === 'images' && asset.category === 'image') ||
      (selectedFolder === 'videos' && asset.category === 'video') ||
      (selectedFolder === 'audio' && asset.category === 'audio') ||
      (selectedFolder === 'spreadsheets' && asset.category === 'spreadsheet');
    
    return matchesSearch && matchesFolder;
  });

  // Helper function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get appropriate icon for file type
  const getFileIcon = (asset: DigitalAsset) => {
    const category = asset.category || '';
    const type = asset.type || '';
    
    switch (category) {
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'video':
        return <FileVideo className="h-4 w-4" />;
      case 'audio':
        return <FileAudio className="h-4 w-4" />;
      case 'spreadsheet':
        return <FileSpreadsheet className="h-4 w-4" />;
      case 'document':
        return type === 'pdf' ? <FileText className="h-4 w-4" /> : <File className="h-4 w-4" />;
      default:
        return <FileIcon className="h-4 w-4" />;
    }
  };

  if (isLoading || isCreatingBucket) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse">Loading Digital Asset Vault...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div 
        className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-3xl font-bold">Digital Asset Vault</h1>
          <p className="text-muted-foreground">
            Securely store and manage your important digital files
          </p>
        </div>
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Upload New Asset
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Upload Digital Asset</DialogTitle>
              <DialogDescription>
                Upload files to your secure digital vault
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <FileUpload
                bucketName="digital-assets"
                path={user?.id}
                onUploadComplete={handleUploadComplete}
                maxSizeMB={50}
                showAdvancedOptions={true}
              />
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div 
          className="md:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Folders</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                <Button
                  variant={selectedFolder === 'all' ? 'secondary' : 'ghost'}
                  className="w-full justify-start px-4"
                  onClick={() => setSelectedFolder('all')}
                >
                  <Archive className="mr-2 h-4 w-4" />
                  All Files
                </Button>
                <Button
                  variant={selectedFolder === 'documents' ? 'secondary' : 'ghost'}
                  className="w-full justify-start px-4"
                  onClick={() => setSelectedFolder('documents')}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Documents
                </Button>
                <Button
                  variant={selectedFolder === 'images' ? 'secondary' : 'ghost'}
                  className="w-full justify-start px-4"
                  onClick={() => setSelectedFolder('images')}
                >
                  <Image className="mr-2 h-4 w-4" />
                  Images
                </Button>
                <Button
                  variant={selectedFolder === 'videos' ? 'secondary' : 'ghost'}
                  className="w-full justify-start px-4"
                  onClick={() => setSelectedFolder('videos')}
                >
                  <FileVideo className="mr-2 h-4 w-4" />
                  Videos
                </Button>
                <Button
                  variant={selectedFolder === 'audio' ? 'secondary' : 'ghost'}
                  className="w-full justify-start px-4"
                  onClick={() => setSelectedFolder('audio')}
                >
                  <FileAudio className="mr-2 h-4 w-4" />
                  Audio
                </Button>
                <Button
                  variant={selectedFolder === 'spreadsheets' ? 'secondary' : 'ghost'}
                  className="w-full justify-start px-4"
                  onClick={() => setSelectedFolder('spreadsheets')}
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Spreadsheets
                </Button>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button variant="outline" className="w-full" onClick={() => setShowUploadDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Upload File
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div 
          className="md:col-span-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center mb-2">
                <CardTitle>Your Digital Assets</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search files and folders..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              {filteredAssets && filteredAssets.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Date Added</TableHead>
                        <TableHead className="w-[80px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAssets.map((asset) => (
                        <TableRow key={asset.id}>
                          <TableCell className="font-medium flex items-center">
                            <div className="mr-2">
                              {getFileIcon(asset)}
                            </div>
                            <span className="truncate max-w-[200px]">{asset.name}</span>
                          </TableCell>
                          <TableCell>
                            {asset.type.toUpperCase()}
                          </TableCell>
                          <TableCell>{asset.size}</TableCell>
                          <TableCell>
                            {format(new Date(asset.created_at), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem 
                                  onClick={() => downloadAsset(asset)}
                                  className="cursor-pointer"
                                >
                                  <Download className="mr-2 h-4 w-4" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => deleteAssetMutation.mutate(asset)}
                                  className="text-destructive cursor-pointer"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <Folder className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No files found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery 
                      ? "No files match your search criteria" 
                      : "Upload your first file to get started"}
                  </p>
                  <Button onClick={() => setShowUploadDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Upload File
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div 
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Storage Security</CardTitle>
            <CardDescription>
              Information about how your digital assets are protected
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <Lock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-medium mb-2">End-to-End Encryption</h3>
                <p className="text-sm text-muted-foreground">
                  Your files are encrypted during transit and at rest, ensuring 
                  maximum protection of your sensitive information.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <FileLock2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Access Control</h3>
                <p className="text-sm text-muted-foreground">
                  Define who can access your digital assets and under what conditions
                  with our comprehensive permission system.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <FileUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Secure Storage</h3>
                <p className="text-sm text-muted-foreground">
                  All files are stored in our secure vault with regular backups
                  and protection against unauthorized access.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default DigitalAssetVaultPage;
