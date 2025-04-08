
import React, { useState } from 'react';
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
  MoreVertical,
  Users,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TrustedContact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  addedOn: string;
  status: 'active' | 'pending' | 'declined';
  lastVerified?: string;
  avatar?: string;
}

const TrustedContactsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample contacts data
  const contacts: TrustedContact[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '(555) 123-4567',
      addedOn: '2023-03-15',
      status: 'active',
      lastVerified: '2023-06-20',
      avatar: ''
    },
    {
      id: '2',
      name: 'Michael Smith',
      email: 'michael@example.com',
      phone: '(555) 234-5678',
      addedOn: '2023-04-10',
      status: 'active',
      lastVerified: '2023-06-15'
    },
    {
      id: '3',
      name: 'Emily Davis',
      email: 'emily@example.com',
      addedOn: '2023-05-05',
      status: 'pending'
    },
    {
      id: '4',
      name: 'Robert Wilson',
      email: 'robert@example.com',
      phone: '(555) 345-6789',
      addedOn: '2023-05-20',
      status: 'declined'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'declined':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'declined':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Trusted Contacts</h1>
          <p className="text-muted-foreground">
            Manage the people you trust with your digital legacy
          </p>
        </div>

        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" /> 
          Add New Contact
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Contact Manager</CardTitle>
          <CardDescription>
            These trusted contacts will be notified if you don't log in for 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search contacts..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Contacts</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <div className="space-y-4">
                {filteredContacts.length > 0 ? (
                  filteredContacts.map((contact) => (
                    <div key={contact.id} className="p-4 rounded-lg border border-border flex flex-col sm:flex-row justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={contact.avatar} />
                          <AvatarFallback>
                            {contact.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {contact.name}
                            <Badge variant="outline" className={`text-xs ${getStatusColor(contact.status)}`}>
                              <span className="flex items-center gap-1">
                                {getStatusIcon(contact.status)}
                                {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                              </span>
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {contact.email}
                          </div>
                          {contact.phone && (
                            <div className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Phone className="h-3 w-3" />
                              {contact.phone}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 self-end sm:self-center">
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Added: {contact.addedOn}
                          </div>
                          {contact.lastVerified && (
                            <div className="flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Verified: {contact.lastVerified}
                            </div>
                          )}
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Send Verification</DropdownMenuItem>
                            <DropdownMenuItem>Edit Contact</DropdownMenuItem>
                            <DropdownMenuItem>Manage Access</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-8 border border-dashed rounded-lg">
                    <Users className="mx-auto h-10 w-10 text-muted-foreground opacity-50 mb-4" />
                    <h3 className="text-lg font-medium mb-1">No contacts found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery ? `No results for "${searchQuery}"` : "You haven't added any trusted contacts yet"}
                    </p>
                    <Button>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Your First Contact
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="active" className="mt-0">
              <div className="space-y-4">
                {filteredContacts
                  .filter(contact => contact.status === 'active')
                  .map((contact) => (
                    <div key={contact.id} className="p-4 rounded-lg border border-border flex flex-col sm:flex-row justify-between gap-4">
                      {/* Same content as above but filtered */}
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={contact.avatar} />
                          <AvatarFallback>
                            {contact.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {contact.name}
                            <Badge variant="outline" className={`text-xs ${getStatusColor(contact.status)}`}>
                              <span className="flex items-center gap-1">
                                {getStatusIcon(contact.status)}
                                {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                              </span>
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {contact.email}
                          </div>
                          {contact.phone && (
                            <div className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Phone className="h-3 w-3" />
                              {contact.phone}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 self-end sm:self-center">
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Added: {contact.addedOn}
                          </div>
                          {contact.lastVerified && (
                            <div className="flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Verified: {contact.lastVerified}
                            </div>
                          )}
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Send Verification</DropdownMenuItem>
                            <DropdownMenuItem>Edit Contact</DropdownMenuItem>
                            <DropdownMenuItem>Manage Access</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="pending" className="mt-0">
              <div className="space-y-4">
                {filteredContacts
                  .filter(contact => contact.status === 'pending')
                  .map((contact) => (
                    <div key={contact.id} className="p-4 rounded-lg border border-border flex flex-col sm:flex-row justify-between gap-4">
                      {/* Same content as above but filtered */}
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={contact.avatar} />
                          <AvatarFallback>
                            {contact.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {contact.name}
                            <Badge variant="outline" className={`text-xs ${getStatusColor(contact.status)}`}>
                              <span className="flex items-center gap-1">
                                {getStatusIcon(contact.status)}
                                {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                              </span>
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {contact.email}
                          </div>
                          {contact.phone && (
                            <div className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Phone className="h-3 w-3" />
                              {contact.phone}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 self-end sm:self-center">
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Added: {contact.addedOn}
                          </div>
                          {contact.lastVerified && (
                            <div className="flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Verified: {contact.lastVerified}
                            </div>
                          )}
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Resend Invitation</DropdownMenuItem>
                            <DropdownMenuItem>Edit Contact</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Cancel Invitation</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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

export default TrustedContactsPage;
