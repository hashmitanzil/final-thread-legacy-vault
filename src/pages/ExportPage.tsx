
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  FileZip, 
  FileText, 
  ShieldCheck, 
  CheckCircle, 
  AlertCircle, 
  BookOpen,
  Cloud,
  Lock,
  Database
} from 'lucide-react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { format } from 'date-fns';

interface ExportLog {
  id: string;
  user_id: string;
  type: 'zip' | 'pdf';
  download_url: string;
  requested_at: string;
  completed_at?: string;
  status: 'pending' | 'completed' | 'failed';
}

const ExportPage: React.FC = () => {
  const { user } = useAuth();
  const [exportStatus, setExportStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  // Fetch export logs
  const { data: exportLogs, isLoading, refetch } = useQuery({
    queryKey: ['exportLogs', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('export_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('requested_at', { ascending: false });
        
      if (error) throw error;
      return data as ExportLog[];
    },
    enabled: !!user,
  });

  // Create export request
  const exportMutation = useMutation({
    mutationFn: async (type: 'zip' | 'pdf') => {
      if (!user) throw new Error('Not authenticated');
      
      setExportStatus('loading');
      
      // In a real implementation, this would call an Edge Function to generate the export
      // For demo purposes, we'll simulate a successful export after a delay
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 2000);
      });
    },
    onSuccess: () => {
      setExportStatus('success');
      refetch();
      toast({
        title: 'Export requested',
        description: 'Your export is being prepared and will be available shortly.',
      });
      // Reset status after showing success message
      setTimeout(() => {
        setExportStatus('idle');
      }, 3000);
    },
    onError: (error) => {
      setExportStatus('error');
      toast({
        title: 'Export failed',
        description: error instanceof Error ? error.message : 'Failed to create export',
        variant: 'destructive',
      });
      // Reset status after showing error message
      setTimeout(() => {
        setExportStatus('idle');
      }, 3000);
    },
  });

  const handleExport = (type: 'zip' | 'pdf') => {
    exportMutation.mutate(type);
  };

  // Mock export statistics
  const exportStats = {
    messages: 12,
    digitalAssets: 25,
    trustedContacts: 4,
    endOfLifeInstructions: 1,
    totalSizeMB: 236.5
  };

  if (isLoading) {
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
          <h1 className="text-3xl font-bold">Vault Backup & Export</h1>
          <p className="text-muted-foreground">
            Export your entire digital legacy for offline archiving or legal backup
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
              <CardDescription>
                Choose how you want to export your digital legacy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="backup" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="backup">Complete Backup</TabsTrigger>
                  <TabsTrigger value="report">Printable Report</TabsTrigger>
                </TabsList>
                
                <TabsContent value="backup">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <FileZip className="h-5 w-5 mr-2 text-blue-500" />
                        ZIP Archive Backup
                      </CardTitle>
                      <CardDescription>
                        Download a complete backup of all your digital legacy content
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm">
                          This comprehensive backup includes all your messages, digital assets, 
                          trusted contacts information, and end-of-life instructions in their 
                          original formats.
                        </p>
                        
                        <div className="bg-muted p-4 rounded-md">
                          <h4 className="font-medium text-sm mb-3">Included in this export:</h4>
                          <ul className="text-sm space-y-2">
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                              <span>{exportStats.messages} messages (including scheduled and drafts)</span>
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                              <span>{exportStats.digitalAssets} digital assets (documents, images, videos)</span>
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                              <span>{exportStats.trustedContacts} trusted contacts</span>
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                              <span>End-of-life instructions and preferences</span>
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                              <span>Time capsule content</span>
                            </li>
                          </ul>
                          
                          <div className="mt-4 pt-3 border-t border-border">
                            <p className="text-sm font-medium">Estimated Size: {exportStats.totalSizeMB} MB</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={() => handleExport('zip')}
                        disabled={exportStatus === 'loading'}
                        className="w-full"
                      >
                        {exportStatus === 'loading' ? (
                          <>
                            <div className="spinner mr-2" /> Preparing Backup...
                          </>
                        ) : exportStatus === 'success' ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" /> Backup Requested
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" /> Create ZIP Backup
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="report">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-amber-500" />
                        PDF Summary Report
                      </CardTitle>
                      <CardDescription>
                        Generate a printable report of your digital legacy plan
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm">
                          This report provides a comprehensive summary of your digital legacy plan in a 
                          PDF format that's easy to print, share with legal advisors, or store in a 
                          physical safe.
                        </p>
                        
                        <div className="bg-muted p-4 rounded-md">
                          <h4 className="font-medium text-sm mb-3">Included in this report:</h4>
                          <ul className="text-sm space-y-2">
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                              <span>Complete inventory of all digital assets</span>
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                              <span>List of message recipients and delivery schedules</span>
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                              <span>Trusted contacts information and assigned roles</span>
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                              <span>End-of-life instructions and preferences</span>
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                              <span>Time capsule inventory and unlock dates</span>
                            </li>
                            <li className="flex items-center">
                              <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                              <span>Note: Does not include actual message content or files</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={() => handleExport('pdf')}
                        disabled={exportStatus === 'loading'}
                        className="w-full"
                      >
                        {exportStatus === 'loading' ? (
                          <>
                            <div className="spinner mr-2" /> Generating Report...
                          </>
                        ) : exportStatus === 'success' ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" /> Report Requested
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" /> Generate PDF Report
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Export History</CardTitle>
              <CardDescription>
                Your previous exports and downloads
              </CardDescription>
            </CardHeader>
            <CardContent>
              {exportLogs && exportLogs.length > 0 ? (
                <div className="space-y-4">
                  {exportLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-4 border rounded-md">
                      <div className="flex items-center">
                        {log.type === 'zip' ? (
                          <FileZip className="h-5 w-5 mr-3 text-blue-500" />
                        ) : (
                          <FileText className="h-5 w-5 mr-3 text-amber-500" />
                        )}
                        <div>
                          <p className="font-medium">{log.type === 'zip' ? 'ZIP Backup' : 'PDF Report'}</p>
                          <p className="text-xs text-muted-foreground">
                            Requested on {format(new Date(log.requested_at), 'PPp')}
                          </p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        disabled={log.status !== 'completed'}
                        onClick={() => window.open(log.download_url, '_blank')}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-10 w-10 mx-auto mb-4 opacity-50" />
                  <p>No export history available</p>
                  <p className="text-sm">Your previous exports will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <ShieldCheck className="h-5 w-5 mr-2 text-green-500" />
                Why Export?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                Creating regular exports of your digital legacy ensures that:
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <Lock className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                  <p className="text-sm">
                    <span className="font-medium">Redundant Security:</span> Your important 
                    files and messages are backed up in multiple locations.
                  </p>
                </div>
                <div className="flex items-start">
                  <BookOpen className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                  <p className="text-sm">
                    <span className="font-medium">Legal Documentation:</span> You have 
                    offline proof of your digital legacy plan for legal or estate purposes.
                  </p>
                </div>
                <div className="flex items-start">
                  <Cloud className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                  <p className="text-sm">
                    <span className="font-medium">Service Independence:</span> Your legacy 
                    isn't tied exclusively to our online service.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Database className="h-5 w-5 mr-2 text-blue-500" />
                Export Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Messages</span>
                  <span className="font-medium">{exportStats.messages}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Digital Assets</span>
                  <span className="font-medium">{exportStats.digitalAssets}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Trusted Contacts</span>
                  <span className="font-medium">{exportStats.trustedContacts}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">End-of-Life Instructions</span>
                  <span className="font-medium">{exportStats.endOfLifeInstructions}</span>
                </div>
                <div className="pt-3 mt-3 border-t border-border flex justify-between items-center">
                  <span className="text-sm font-medium">Total Size</span>
                  <span className="font-medium">{exportStats.totalSizeMB} MB</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExportPage;
