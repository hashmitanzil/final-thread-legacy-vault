
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
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
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DigitalAsset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'pdf' | 'other';
  size: string;
  dateAdded: string;
  lastAccessed?: string;
  url: string;
}

const DigitalAssetVaultPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample assets data
  const assets: DigitalAsset[] = [
    {
      id: '1',
      name: 'Family Photo.jpg',
      type: 'image',
      size: '2.4 MB',
      dateAdded: '2023-04-15',
      lastAccessed: '2023-05-20',
      url: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?q=80&w=2070'
    },
    {
      id: '2',
      name: 'Last Will.pdf',
      type: 'pdf',
      size: '1.2 MB',
      dateAdded: '2023-03-10',
      lastAccessed: '2023-06-10',
      url: '/documents/will.pdf'
    },
    {
      id: '3',
      name: 'Birthday Message.mp4',
      type: 'video',
      size: '45.6 MB',
      dateAdded: '2023-02-28',
      url: '/videos/birthday.mp4'
    },
    {
      id: '4',
      name: 'Property Deed.pdf',
      type: 'pdf',
      size: '3.1 MB',
      dateAdded: '2023-01-15',
      lastAccessed: '2023-05-05',
      url: '/documents/deed.pdf'
    },
    {
      id: '5',
      name: 'Travel Photos 2022.jpg',
      type: 'image',
      size: '5.7 MB',
      dateAdded: '2022-12-20',
      url: 'https://images.unsplash.com/photo-1682686580391-615b1e82d3d3?q=80&w=2070'
    }
  ];

  const getIconForAssetType = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const filteredAssets = assets.filter(asset => 
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Digital Asset Vault</h1>
          <p className="text-muted-foreground">
            Store important documents, photos, and videos securely
          </p>
        </div>

        <Button className="flex items-center gap-2">
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
                <DropdownMenuItem>All Assets</DropdownMenuItem>
                <DropdownMenuItem>Images</DropdownMenuItem>
                <DropdownMenuItem>Videos</DropdownMenuItem>
                <DropdownMenuItem>Documents (PDF)</DropdownMenuItem>
                <DropdownMenuItem>Other Files</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Assets</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
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
                    {filteredAssets.length > 0 ? (
                      filteredAssets.map((asset) => (
                        <tr key={asset.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-md bg-${asset.type === 'image' ? 'blue' : asset.type === 'video' ? 'red' : 'amber'}-100`}>
                                {getIconForAssetType(asset.type)}
                              </div>
                              <span>{asset.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 capitalize">{asset.type}</td>
                          <td className="py-3 px-4">{asset.size}</td>
                          <td className="py-3 px-4">{asset.dateAdded}</td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" className="h-8">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8">
                                <Download className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem className="flex items-center gap-2">
                                    <PlusCircle className="h-4 w-4" />
                                    Assign to Message
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="flex items-center gap-2">
                                    <Download className="h-4 w-4" />
                                    Download
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-10 text-center">
                          <File className="mx-auto h-10 w-10 text-muted-foreground opacity-50 mb-4" />
                          <h3 className="text-lg font-medium mb-1">No assets found</h3>
                          <p className="text-muted-foreground mb-4">
                            {searchQuery 
                              ? `No results for "${searchQuery}"` 
                              : "You haven't uploaded any assets yet"}
                          </p>
                          <Button>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Your First Asset
                          </Button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="images" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredAssets
                  .filter(asset => asset.type === 'image')
                  .map(asset => (
                    <div key={asset.id} className="border rounded-lg overflow-hidden">
                      <div className="aspect-square relative">
                        <img 
                          src={asset.url} 
                          alt={asset.name} 
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="p-3">
                        <div className="truncate font-medium">{asset.name}</div>
                        <div className="text-xs text-muted-foreground flex justify-between mt-1">
                          <span>{asset.size}</span>
                          <span>{asset.dateAdded}</span>
                        </div>
                        <div className="flex justify-between mt-3">
                          <Button variant="outline" size="sm">View</Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>Download</DropdownMenuItem>
                              <DropdownMenuItem>Share</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="videos" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAssets
                  .filter(asset => asset.type === 'video')
                  .map(asset => (
                    <div key={asset.id} className="border rounded-lg p-4 flex items-start gap-4">
                      <div className="bg-gray-100 rounded-md p-3">
                        <Video className="h-8 w-8 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{asset.name}</h3>
                        <div className="text-sm text-muted-foreground mt-1">
                          {asset.size} • Added on {asset.dateAdded}
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button variant="outline" size="sm">Play</Button>
                          <Button variant="outline" size="sm">Download</Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="documents" className="mt-0">
              <div className="space-y-4">
                {filteredAssets
                  .filter(asset => asset.type === 'pdf')
                  .map(asset => (
                    <div key={asset.id} className="border rounded-lg p-4 flex items-center gap-4">
                      <div className="bg-amber-100 rounded-md p-3">
                        <FileText className="h-6 w-6 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{asset.name}</h3>
                        <div className="text-sm text-muted-foreground mt-1">
                          {asset.size} • Added on {asset.dateAdded}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Download</Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DigitalAssetVaultPage;
