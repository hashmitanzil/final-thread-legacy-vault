
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
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
  User,
  UserPlus,
  Mail,
  Phone,
  Trash2,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Shield,
  AlertCircle,
  Info,
  Send,
  Edit,
  Users,
  UserCheck,
  Key,
  Lock,
  Eye
} from 'lucide-react';
import { motion } from 'framer-motion';

// Form schema for adding trusted contacts
const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().optional(),
  relationship: z.string().min(1, {
    message: "Please select a relationship.",
  }),
  permissions: z.array(z.string()).refine((value) => value.length > 0, {
    message: "You must select at least one permission.",
  }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

// Mock data for trusted contacts (replace with real data implementation)
const mockTrustedContacts = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+1 (555) 123-4567",
    relationship: "Family",
    status: "active",
    createdAt: new Date(2025, 3, 1),
    permissions: ["view", "confirm_death", "manage"],
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael@example.com",
    phone: "+1 (555) 987-6543",
    relationship: "Friend",
    status: "pending",
    createdAt: new Date(2025, 3, 5),
    permissions: ["view"],
  },
];

const TrustedContactsPage: React.FC = () => {
  const { user } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      relationship: "",
      permissions: [],
    },
  });

  // Handle form submission
  const onSubmit = (values: ContactFormValues) => {
    console.log("Form submitted:", values);
    toast({
      title: "Contact Added",
      description: `${values.name} has been added as a trusted contact.`,
    });
    setIsAddDialogOpen(false);
    form.reset();
  };

  // Handle contact deletion
  const handleDelete = (id: string) => {
    console.log("Deleting contact with ID:", id);
    toast({
      title: "Contact Deleted",
      description: "The trusted contact has been removed.",
    });
    setIsDeleteDialogOpen(false);
  };

  // Get relationship options
  const relationshipOptions = [
    { value: "family", label: "Family" },
    { value: "friend", label: "Friend" },
    { value: "partner", label: "Partner" },
    { value: "colleague", label: "Colleague" },
    { value: "legal", label: "Legal Representative" },
    { value: "other", label: "Other" },
  ];

  // Permission options
  const permissionOptions = [
    {
      id: "view",
      label: "View Legacy",
      description: "Can view your digital legacy content after your passing",
      icon: <Eye className="h-4 w-4 text-purple-500" />,
    },
    {
      id: "confirm_death",
      label: "Confirm Death",
      description: "Can confirm your passing to trigger content release",
      icon: <CheckCircle className="h-4 w-4 text-purple-500" />,
    },
    {
      id: "manage",
      label: "Manage Content",
      description: "Full control to manage your digital legacy",
      icon: <Key className="h-4 w-4 text-purple-500" />,
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="h-8 w-8 text-purple-600" />
              Trusted Contacts
            </h1>
            <p className="text-muted-foreground">
              Designate trusted individuals who will be notified and given access to your digital legacy
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="legacy-button">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Trusted Contact
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add Trusted Contact</DialogTitle>
                <DialogDescription>
                  Add someone you trust to handle parts of your digital legacy
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="relationship"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relationship</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select relationship" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {relationshipOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="permissions"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>Permissions</FormLabel>
                          <FormDescription>
                            What can this person do with your digital legacy?
                          </FormDescription>
                        </div>
                        <div className="space-y-2">
                          {permissionOptions.map((option) => (
                            <FormField
                              key={option.id}
                              control={form.control}
                              name="permissions"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={option.id}
                                    className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(option.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, option.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== option.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel className="flex items-center">
                                        {option.icon}
                                        <span className="ml-2">{option.label}</span>
                                      </FormLabel>
                                      <FormDescription>
                                        {option.description}
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter className="pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="legacy-button">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add Contact
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Trusted Contacts</CardTitle>
                <CardDescription>
                  People you trust to handle your digital legacy
                </CardDescription>
              </CardHeader>
              <CardContent>
                {mockTrustedContacts.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Contact Info</TableHead>
                        <TableHead>Relationship</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Permissions</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockTrustedContacts.map((contact) => (
                        <TableRow key={contact.id}>
                          <TableCell className="font-medium">{contact.name}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="flex items-center text-sm">
                                <Mail className="h-3 w-3 mr-1 text-gray-500" />
                                {contact.email}
                              </span>
                              {contact.phone && (
                                <span className="flex items-center text-sm text-gray-500 mt-1">
                                  <Phone className="h-3 w-3 mr-1" />
                                  {contact.phone}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{contact.relationship}</TableCell>
                          <TableCell>
                            {contact.status === "active" ? (
                              <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-yellow-600 bg-yellow-100 border-yellow-300 hover:bg-yellow-200">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Pending
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {contact.permissions.includes("view") && (
                                <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50">
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </Badge>
                              )}
                              {contact.permissions.includes("confirm_death") && (
                                <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Confirm
                                </Badge>
                              )}
                              {contact.permissions.includes("manage") && (
                                <Badge variant="outline" className="text-indigo-600 border-indigo-200 bg-indigo-50">
                                  <Key className="h-3 w-3 mr-1" />
                                  Manage
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="dropdown-menu-content">
                                <DropdownMenuItem className="nav-dropdown-item">
                                  <Edit className="mr-2 h-4 w-4" />
                                  <span>Edit Contact</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="nav-dropdown-item">
                                  <Send className="mr-2 h-4 w-4" />
                                  <span>Resend Invitation</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="nav-dropdown-item text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => {
                                    setSelectedContact(contact);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  <span>Remove</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <Users className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No trusted contacts yet</h3>
                    <p className="text-muted-foreground max-w-sm">
                      Add trusted people who can access your digital legacy after your passing
                    </p>
                    <Button 
                      className="mt-6 legacy-button"
                      onClick={() => setIsAddDialogOpen(true)}
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add Your First Contact
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-100 dark:border-purple-800/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-purple-600" />
                  How Trusted Contacts Work
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-white dark:bg-gray-800 rounded-full p-2 mt-1">
                    <UserCheck className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Choose Trusted People</h4>
                    <p className="text-sm text-muted-foreground">
                      Select individuals you trust to handle your digital legacy
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-white dark:bg-gray-800 rounded-full p-2 mt-1">
                    <Lock className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Set Specific Permissions</h4>
                    <p className="text-sm text-muted-foreground">
                      Control who can view, confirm, or manage your legacy
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-white dark:bg-gray-800 rounded-full p-2 mt-1">
                    <Mail className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Automatic Notification</h4>
                    <p className="text-sm text-muted-foreground">
                      Contacts will be notified when your legacy is triggered
                    </p>
                  </div>
                </div>
                
                <Separator className="my-2" />
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-yellow-100 text-yellow-600">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Important Note</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Trusted contacts don't require a Final Thread account to access your legacy when it's triggered.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
      
      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Remove Trusted Contact
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {selectedContact?.name} from your trusted contacts?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => handleDelete(selectedContact?.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrustedContactsPage;
