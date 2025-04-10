
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { PostgrestError } from '@supabase/supabase-js';
import { DigitalAsset } from '@/types/supabase-extensions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
  File,
  FilePlus,
  FileEdit,
  FileX,
  MoreVertical,
  Download,
  Eye,
  AlertTriangle,
  Info,
  Lock,
  Unlock,
  Folder,
  Plus,
  Search,
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Generic approach for database operations
type GenericRecord = Record<string, any>;

// Form schema for creating and editing assets
const assetFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  type: z.string().min(1, "Type is required"),
  size: z.string().min(1, "Size is required"),
  category: z.string().min(1, "Category is required"),
  is_encrypted: z.boolean().default(false),
});

type AssetFormValues = z.infer<typeof assetFormSchema>;

export default function DigitalAssetVaultPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<DigitalAsset | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Create form
  const createForm = useForm<AssetFormValues>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: {
      name: '',
      description: '',
      type: '',
      size: '',
      category: 'documents',
      is_encrypted: false,
    },
  });

  // Edit form
  const editForm = useForm<AssetFormValues>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: {
      name: '',
      description: '',
      type: '',
      size: '',
      category: 'documents',
      is_encrypted: false,
    },
  });

  // Fetch digital assets with a simpler approach to avoid deep type instantiation
  const { data: assets = [], isLoading } = useQuery({
    queryKey: ['digitalAssets', user?.id, searchTerm, activeCategory],
    queryFn: async () => {
      if (!user) return [] as DigitalAsset[];
      
      // First step: Create a basic query - no chaining yet to avoid deep typing issues
      let { data, error } = await supabase
        .from('digital_assets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      // Handle initial query error
      if (error) throw error;
      
      // Filter the data in memory instead of chaining query methods
      // This avoids the TypeScript deep instantiation problem
      let filteredData = data || [];
      
      // Apply category filter if needed - checking if the property exists
      if (activeCategory && activeCategory !== 'all') {
        filteredData = filteredData.filter(asset => 
          // Check if 'category' exists as a key and matches activeCategory
          'category' in asset && asset.category === activeCategory
        );
      }
      
      // Apply search filter if needed
      if (searchTerm) {
        filteredData = filteredData.filter(asset => 
          asset.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Cast the result to the expected type
      return filteredData as DigitalAsset[];
    },
    enabled: !!user,
  });

  // Create asset mutation
  const createAssetMutation = useMutation({
    mutationFn: async (data: AssetFormValues) => {
      if (!user) throw new Error("Not authenticated");
      
      const newAsset = {
        user_id: user.id,
        name: data.name,
        description: data.description || null,
        type: data.type,
        size: data.size,
        category: data.category,
        is_encrypted: data.is_encrypted,
        storage_path: `assets/${user.id}/${Date.now()}_${data.name}`,
        last_accessed: new Date().toISOString(),
      };
      
      const { error } = await supabase
        .from('digital_assets')
        .insert(newAsset);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['digitalAssets'] });
      toast({
        title: "Asset created",
        description: "Digital asset has been created successfully.",
      });
      setIsCreateDialogOpen(false);
      createForm.reset();
    },
    onError: (error) => {
      console.error("Error creating asset:", error);
      toast({
        title: "Error",
        description: "Failed to create digital asset.",
        variant: "destructive",
      });
    },
  });

  // Update asset mutation
  const updateAssetMutation = useMutation({
    mutationFn: async (data: AssetFormValues) => {
      if (!selectedAsset) throw new Error("No asset selected");
      
      const updatedAsset = {
        name: data.name,
        description: data.description || null,
        type: data.type,
        size: data.size,
        category: data.category,
        is_encrypted: data.is_encrypted,
        updated_at: new Date().toISOString(),
      };
      
      const { error } = await supabase
        .from('digital_assets')
        .update(updatedAsset)
        .eq('id', selectedAsset.id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['digitalAssets'] });
      toast({
        title: "Asset updated",
        description: "Digital asset has been updated successfully.",
      });
      setIsEditDialogOpen(false);
      setSelectedAsset(null);
      editForm.reset();
    },
    onError: (error) => {
      console.error("Error updating asset:", error);
      toast({
        title: "Error",
        description: "Failed to update digital asset.",
        variant: "destructive",
      });
    },
  });

  // Delete asset mutation
  const deleteAssetMutation = useMutation({
    mutationFn: async () => {
      if (!selectedAsset) throw new Error("No asset selected");
      
      const { error } = await supabase
        .from('digital_assets')
        .delete()
        .eq('id', selectedAsset.id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['digitalAssets'] });
      toast({
        title: "Asset deleted",
        description: "Digital asset has been deleted successfully.",
      });
      setIsDeleteDialogOpen(false);
      setSelectedAsset(null);
    },
    onError: (error) => {
      console.error("Error deleting asset:", error);
      toast({
        title: "Error",
        description: "Failed to delete digital asset.",
        variant: "destructive",
      });
    },
  });

  const handleCreateDialogOpen = () => {
    createForm.reset();
    setIsCreateDialogOpen(true);
  };

  const handleCreateDialogClose = () => {
    setIsCreateDialogOpen(false);
    createForm.reset();
  };

  const handleEditDialogOpen = (asset: DigitalAsset) => {
    setSelectedAsset(asset);
    editForm.reset({
      name: asset.name,
      description: asset.description || '',
      type: asset.type,
      size: asset.size,
      category: asset.category || 'documents',
      is_encrypted: asset.is_encrypted || false,
    });
    setIsEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setSelectedAsset(null);
    editForm.reset();
  };

  const handleDeleteDialogOpen = (asset: DigitalAsset) => {
    setSelectedAsset(asset);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
    setSelectedAsset(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  const onCreateSubmit = (data: AssetFormValues) => {
    createAssetMutation.mutate(data);
  };

  const onEditSubmit = (data: AssetFormValues) => {
    updateAssetMutation.mutate(data);
  };

  return (
    <div>
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Digital Asset Vault</h1>
          <div className="flex items-center space-x-4">
            <Input
              type="search"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="max-w-md"
            />
            <Button onClick={handleCreateDialogOpen}>
              <Plus className="mr-2 h-4 w-4" />
              Add Asset
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <Label>Category:</Label>
          <div className="flex space-x-2 mt-1">
            <Button
              variant={activeCategory === 'all' ? 'default' : 'outline'}
              onClick={() => handleCategoryChange('all')}
            >
              All
            </Button>
            <Button
              variant={activeCategory === 'documents' ? 'default' : 'outline'}
              onClick={() => handleCategoryChange('documents')}
            >
              Documents
            </Button>
            <Button
              variant={activeCategory === 'images' ? 'default' : 'outline'}
              onClick={() => handleCategoryChange('images')}
            >
              Images
            </Button>
            <Button
              variant={activeCategory === 'videos' ? 'default' : 'outline'}
              onClick={() => handleCategoryChange('videos')}
            >
              Videos
            </Button>
            <Button
              variant={activeCategory === 'other' ? 'default' : 'outline'}
              onClick={() => handleCategoryChange('other')}
            >
              Other
            </Button>
          </div>
        </div>

        <Separator className="mb-4" />

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-pulse">Loading assets...</div>
          </div>
        ) : assets.length === 0 ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-gray-500">No assets found.</div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Last Accessed</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      {asset.is_encrypted ? <Lock className="h-4 w-4 mr-2 text-green-500" /> : null}
                      {asset.name}
                    </div>
                  </TableCell>
                  <TableCell>{asset.type}</TableCell>
                  <TableCell>{asset.category || 'Uncategorized'}</TableCell>
                  <TableCell>{asset.size}</TableCell>
                  <TableCell>
                    {asset.last_accessed 
                      ? format(new Date(asset.last_accessed), 'MMM dd, yyyy') 
                      : 'Never'}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditDialogOpen(asset)}>
                          <FileEdit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteDialogOpen(asset)}>
                          <FileX className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Create Asset Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={handleCreateDialogClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Digital Asset</DialogTitle>
            <DialogDescription>
              Add a new digital asset to your vault.
            </DialogDescription>
          </DialogHeader>
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
              <FormField
                control={createForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Asset name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={createForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Asset description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={createForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="File type" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={createForm.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="File size" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={createForm.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="documents">Documents</SelectItem>
                        <SelectItem value="images">Images</SelectItem>
                        <SelectItem value="videos">Videos</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={createForm.control}
                name="is_encrypted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Encrypt asset</FormLabel>
                      <FormDescription>
                        Enable encryption for this digital asset
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCreateDialogClose}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createAssetMutation.isPending}>
                  {createAssetMutation.isPending ? "Creating..." : "Create Asset"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Asset Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={handleEditDialogClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Digital Asset</DialogTitle>
            <DialogDescription>
              Make changes to the selected digital asset.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Asset name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Asset description" value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="File type" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="File size" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={editForm.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="documents">Documents</SelectItem>
                        <SelectItem value="images">Images</SelectItem>
                        <SelectItem value="videos">Videos</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="is_encrypted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Encrypt asset</FormLabel>
                      <FormDescription>
                        Enable encryption for this digital asset
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleEditDialogClose}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateAssetMutation.isPending}>
                  {updateAssetMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Asset Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={handleDeleteDialogClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Digital Asset</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this asset? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div>
            {selectedAsset && (
              <div className="py-4">
                <p><strong>Name:</strong> {selectedAsset.name}</p>
                <p><strong>Type:</strong> {selectedAsset.type}</p>
                <p><strong>Category:</strong> {selectedAsset.category || 'Uncategorized'}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleDeleteDialogClose}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive"
              onClick={() => deleteAssetMutation.mutate()}
              disabled={deleteAssetMutation.isPending}
            >
              {deleteAssetMutation.isPending ? "Deleting..." : "Delete Asset"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
