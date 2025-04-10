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

// Generic approach for database operations
type GenericRecord = Record<string, any>;

export default function DigitalAssetVaultPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<DigitalAsset | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

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
      
      // Apply category filter if needed
      if (activeCategory && activeCategory !== 'all') {
        filteredData = filteredData.filter(asset => 
          asset.category === activeCategory
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

  const handleCreateDialogOpen = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCreateDialogClose = () => {
    setIsCreateDialogOpen(false);
  };

  const handleEditDialogOpen = (asset: DigitalAsset) => {
    setSelectedAsset(asset);
    setIsEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setSelectedAsset(null);
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
                <TableHead>Size</TableHead>
                <TableHead>Last Accessed</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">{asset.name}</TableCell>
                  <TableCell>{asset.type}</TableCell>
                  <TableCell>{asset.size}</TableCell>
                  <TableCell>{format(new Date(asset.last_accessed), 'MMM dd, yyyy')}</TableCell>
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Digital Asset</DialogTitle>
            <DialogDescription>
              Add a new digital asset to your vault.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value="" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Input id="type" value="" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="size" className="text-right">
                Size
              </Label>
              <Input id="size" value="" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Asset Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={handleEditDialogClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Digital Asset</DialogTitle>
            <DialogDescription>
              Make changes to the selected digital asset.
            </DialogDescription>
          </DialogHeader>
          {selectedAsset && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" defaultValue={selectedAsset.name} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Input id="type" defaultValue={selectedAsset.type} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="size" className="text-right">
                  Size
                </Label>
                <Input id="size" defaultValue={selectedAsset.size} className="col-span-3" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
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
          <DialogFooter>
            <Button type="submit" variant="destructive">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
