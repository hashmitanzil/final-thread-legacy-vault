
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
  MessageSquare,
  PlusCircle,
  Search,
  Filter,
  MoreVertical,
  FileText,
  Video,
  Mic,
  Clock,
  Edit,
  Trash2,
  Copy,
  Eye,
  Calendar,
  Users,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: number;
  title: string;
  type: 'text' | 'video' | 'audio' | 'document';
  recipients: string[];
  deliveryTrigger: string;
  deliveryDate: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'scheduled' | 'delivered';
  content: string;
}

const MessagesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample messages data
  const messages: Message[] = [
    {
      id: 1,
      title: 'To My Children',
      type: 'text',
      recipients: ['Family Group'],
      deliveryTrigger: 'On Death',
      deliveryDate: 'After my passing',
      createdAt: '2023-08-15',
      updatedAt: '2023-08-15',
      status: 'scheduled',
      content: 'This is a heartfelt message to my children...'
    },
    {
      id: 2,
      title: 'Digital Assets Guide',
      type: 'document',
      recipients: ['Sarah Johnson'],
      deliveryTrigger: 'On Death',
      deliveryDate: 'After my passing',
      createdAt: '2023-06-20',
      updatedAt: '2023-06-25',
      status: 'scheduled',
      content: 'Guide to accessing all my digital assets...'
    },
    {
      id: 3,
      title: 'Birthday Message 2030',
      type: 'video',
      recipients: ['Michael Smith'],
      deliveryTrigger: 'On Date',
      deliveryDate: 'April 12, 2030',
      createdAt: '2023-04-15',
      updatedAt: '2023-04-15',
      status: 'scheduled',
      content: 'Happy 30th birthday message...'
    },
    {
      id: 4,
      title: 'Wedding Anniversary Wishes',
      type: 'audio',
      recipients: ['Emily & John'],
      deliveryTrigger: 'On Date',
      deliveryDate: 'June 15, 2025',
      createdAt: '2023-03-10',
      updatedAt: '2023-03-10',
      status: 'scheduled',
      content: 'Congratulations on your anniversary...'
    },
    {
      id: 5,
      title: 'Life Advice',
      type: 'text',
      recipients: ['All Family Members'],
      deliveryTrigger: 'On Death',
      deliveryDate: 'After my passing',
      createdAt: '2023-02-05',
      updatedAt: '2023-02-10',
      status: 'draft',
      content: 'Some important life lessons I want to share...'
    }
  ];

  const getIconForMessageType = (type: string) => {
    switch (type) {
      case 'text':
        return <MessageSquare className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'audio':
        return <Mic className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredMessages = messages.filter(message => 
    message.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.recipients.some(recipient => recipient.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Your Messages</h1>
          <p className="text-muted-foreground">
            Create, manage, and schedule your legacy messages
          </p>
        </div>

        <div>
          <Link to="/messages/new">
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" /> 
              Create New Message
            </Button>
          </Link>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Message Overview</CardTitle>
          <CardDescription>
            A summary of all your created messages and their delivery status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search messages..."
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
                <DropdownMenuLabel>Filter Messages</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>All Messages</DropdownMenuItem>
                <DropdownMenuItem>Text Messages</DropdownMenuItem>
                <DropdownMenuItem>Video Messages</DropdownMenuItem>
                <DropdownMenuItem>Audio Messages</DropdownMenuItem>
                <DropdownMenuItem>Documents</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Drafts</DropdownMenuItem>
                <DropdownMenuItem>Scheduled</DropdownMenuItem>
                <DropdownMenuItem>Delivered</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Messages</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <div className="space-y-4">
                {filteredMessages.length > 0 ? (
                  filteredMessages.map((message) => (
                    <div key={message.id} className="p-4 rounded-lg border border-border flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-3 rounded-md bg-${message.type === 'text' ? 'blue' : message.type === 'video' ? 'red' : message.type === 'audio' ? 'green' : 'amber'}-100`}>
                          {getIconForMessageType(message.type)}
                        </div>
                        <div>
                          <div className="font-medium">{message.title}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            To: {message.recipients.join(', ')}
                          </div>
                          <div className="text-sm mt-1 flex items-center gap-3">
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {message.deliveryDate}
                            </span>
                            <Badge variant="outline" className={`text-xs ${getStatusColor(message.status)}`}>
                              {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 md:flex-col md:items-end">
                        <div className="flex">
                          <Link to={`/messages/${message.id}`}>
                            <Button variant="ghost" size="sm" className="h-8 gap-1">
                              <Eye className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">View</span>
                            </Button>
                          </Link>
                          <Link to={`/messages/${message.id}/edit`}>
                            <Button variant="ghost" size="sm" className="h-8 gap-1">
                              <Edit className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Edit</span>
                            </Button>
                          </Link>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8">
                                <MoreVertical className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Change Delivery Date
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center gap-2">
                                <Copy className="h-4 w-4" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 hidden md:block">
                          Last updated: {message.updatedAt}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-8 border border-dashed rounded-lg">
                    <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground opacity-50 mb-4" />
                    <h3 className="text-lg font-medium mb-1">No messages found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery ? `No results for "${searchQuery}"` : "You haven't created any messages yet"}
                    </p>
                    <Link to="/messages/new">
                      <Button>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create Your First Message
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="scheduled" className="mt-0">
              <div className="space-y-4">
                {filteredMessages
                  .filter(message => message.status === 'scheduled')
                  .map((message) => (
                    <div key={message.id} className="p-4 rounded-lg border border-border flex flex-col md:flex-row justify-between gap-4">
                      {/* Same content as above, but filtered for scheduled messages */}
                      <div className="flex items-start gap-3">
                        <div className={`p-3 rounded-md bg-${message.type === 'text' ? 'blue' : message.type === 'video' ? 'red' : message.type === 'audio' ? 'green' : 'amber'}-100`}>
                          {getIconForMessageType(message.type)}
                        </div>
                        <div>
                          <div className="font-medium">{message.title}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            To: {message.recipients.join(', ')}
                          </div>
                          <div className="text-sm mt-1 flex items-center gap-3">
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {message.deliveryDate}
                            </span>
                            <Badge variant="outline" className={`text-xs ${getStatusColor(message.status)}`}>
                              {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 md:flex-col md:items-end">
                        <div className="flex">
                          <Link to={`/messages/${message.id}`}>
                            <Button variant="ghost" size="sm" className="h-8 gap-1">
                              <Eye className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">View</span>
                            </Button>
                          </Link>
                          <Link to={`/messages/${message.id}/edit`}>
                            <Button variant="ghost" size="sm" className="h-8 gap-1">
                              <Edit className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Edit</span>
                            </Button>
                          </Link>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8">
                                <MoreVertical className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Change Delivery Date
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center gap-2">
                                <Copy className="h-4 w-4" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 hidden md:block">
                          Last updated: {message.updatedAt}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="drafts" className="mt-0">
              <div className="space-y-4">
                {filteredMessages
                  .filter(message => message.status === 'draft')
                  .map((message) => (
                    <div key={message.id} className="p-4 rounded-lg border border-border flex flex-col md:flex-row justify-between gap-4">
                      {/* Same content as above, but filtered for draft messages */}
                      <div className="flex items-start gap-3">
                        <div className={`p-3 rounded-md bg-${message.type === 'text' ? 'blue' : message.type === 'video' ? 'red' : message.type === 'audio' ? 'green' : 'amber'}-100`}>
                          {getIconForMessageType(message.type)}
                        </div>
                        <div>
                          <div className="font-medium">{message.title}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            To: {message.recipients.join(', ')}
                          </div>
                          <div className="text-sm mt-1 flex items-center gap-3">
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {message.deliveryDate}
                            </span>
                            <Badge variant="outline" className={`text-xs ${getStatusColor(message.status)}`}>
                              {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 md:flex-col md:items-end">
                        <div className="flex">
                          <Link to={`/messages/${message.id}`}>
                            <Button variant="ghost" size="sm" className="h-8 gap-1">
                              <Eye className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">View</span>
                            </Button>
                          </Link>
                          <Link to={`/messages/${message.id}/edit`}>
                            <Button variant="ghost" size="sm" className="h-8 gap-1">
                              <Edit className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Edit</span>
                            </Button>
                          </Link>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8">
                                <MoreVertical className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Change Delivery Date
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center gap-2">
                                <Copy className="h-4 w-4" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 hidden md:block">
                          Last updated: {message.updatedAt}
                        </div>
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

export default MessagesPage;
