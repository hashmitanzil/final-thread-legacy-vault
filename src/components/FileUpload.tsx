
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';
import { UploadCloud, X, FileText, Image, Film, Music, File, Tag, Calendar, Lock } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';

export type FileVisibility = 'private' | 'post-death' | 'scheduled';

interface FileUploadProps {
  bucketName: string;
  path?: string;
  onUploadComplete: (
    filePath: string, 
    fileName: string, 
    fileSize: number, 
    visibility?: FileVisibility,
    scheduledDate?: Date | null,
    tags?: string[],
    folder?: string,
    watermark?: boolean,
    restrictDownload?: boolean
  ) => void;
  maxSizeMB?: number;
  acceptedFileTypes?: string[];
  className?: string;
  showAdvancedOptions?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  bucketName,
  path = '',
  onUploadComplete,
  maxSizeMB = 50,
  acceptedFileTypes,
  className = '',
  showAdvancedOptions = false,
}) => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [visibility, setVisibility] = useState<FileVisibility>('private');
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [tags, setTags] = useState<string>('');
  const [folder, setFolder] = useState('general');
  const [watermark, setWatermark] = useState(false);
  const [restrictDownload, setRestrictDownload] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      // Check file size
      if (selectedFile.size > maxSizeMB * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: `File must be less than ${maxSizeMB}MB`,
          variant: 'destructive'
        });
        return;
      }
      
      // Check file type if specified
      if (acceptedFileTypes && acceptedFileTypes.length > 0) {
        const fileType = selectedFile.type;
        if (!acceptedFileTypes.some(type => fileType.includes(type))) {
          toast({
            title: 'Unsupported file type',
            description: `Supported types: ${acceptedFileTypes.join(', ')}`,
            variant: 'destructive'
          });
          return;
        }
      }
      
      setFile(selectedFile);
    }
  };
  
  const handleRemoveFile = () => {
    setFile(null);
  };
  
  const handleUpload = async () => {
    if (!file || !user) return;
    
    setUploading(true);
    setProgress(0);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${path ? path + '/' : ''}${fileName}`;
    
    try {
      // Track upload progress with an event listener
      const uploadTask = supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          upsert: true
        });
      
      // Set up a manual progress tracker (since onUploadProgress is not available)
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          // Simulate progress until we get the actual result
          if (prev < 90) return prev + 10;
          return prev;
        });
      }, 300);
      
      const { error } = await uploadTask;
      
      // Clear the progress interval
      clearInterval(progressInterval);
      
      if (error) throw error;
      
      // Set to 100% when complete
      setProgress(100);
      
      // Process tags
      const tagArray = tags ? tags.split(',').map(tag => tag.trim()) : [];
      
      onUploadComplete(
        filePath, 
        file.name, 
        file.size, 
        visibility, 
        visibility === 'scheduled' ? scheduledDate : null,
        tagArray,
        folder,
        watermark,
        restrictDownload
      );
      
      toast({
        title: 'Upload complete',
        description: 'Your file has been uploaded successfully.'
      });
      
      // Reset form
      setFile(null);
      setVisibility('private');
      setScheduledDate(null);
      setTags('');
      setFolder('general');
      setWatermark(false);
      setRestrictDownload(false);
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload file',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };
  
  const getFileIcon = () => {
    if (!file) return <FileText />;
    
    const fileType = file.type;
    if (fileType.includes('image')) return <Image />;
    if (fileType.includes('video')) return <Film />;
    if (fileType.includes('audio')) return <Music />;
    if (fileType.includes('pdf')) return <FileText />;
    return <File />;
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      {!file ? (
        <div className="border-2 border-dashed rounded-lg p-6 text-center bg-muted/50 hover:bg-muted/70 transition-colors">
          <Input 
            type="file" 
            id="file-upload" 
            className="hidden" 
            onChange={handleFileChange} 
            accept={acceptedFileTypes?.join(',')}
          />
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
            <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">Click to upload or drag and drop</p>
            <p className="text-xs text-muted-foreground mt-1">
              {acceptedFileTypes 
                ? `Accepted file types: ${acceptedFileTypes.join(', ')}`
                : 'All file types accepted'
              }
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Max size: {maxSizeMB}MB
            </p>
          </label>
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-muted rounded-md">
                {getFileIcon()}
              </div>
              <div className="overflow-hidden">
                <p className="font-medium text-sm truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleRemoveFile} 
              disabled={uploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {showAdvancedOptions && (
            <div className="space-y-4 mt-4 p-4 bg-muted/20 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="visibility">Visibility</Label>
                  <Select 
                    value={visibility} 
                    onValueChange={(value: FileVisibility) => {
                      setVisibility(value);
                      if (value === 'scheduled') {
                        setShowDatePicker(true);
                      }
                    }}
                  >
                    <SelectTrigger id="visibility">
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Private (Only You)</SelectItem>
                      <SelectItem value="post-death">Post-Death</SelectItem>
                      <SelectItem value="scheduled">Scheduled Release</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="folder">Folder</Label>
                  <Select value={folder} onValueChange={setFolder}>
                    <SelectTrigger id="folder">
                      <SelectValue placeholder="Select folder" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="family">Family</SelectItem>
                      <SelectItem value="career">Career</SelectItem>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="legal">Legal Documents</SelectItem>
                      <SelectItem value="financial">Financial</SelectItem>
                      <SelectItem value="medical">Medical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {visibility === 'scheduled' && (
                <div className="space-y-2">
                  <Label>Release Date</Label>
                  <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {scheduledDate ? format(scheduledDate, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={scheduledDate || undefined}
                        onSelect={(date) => {
                          setScheduledDate(date);
                          setShowDatePicker(false);
                        }}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <div className="flex items-center">
                  <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="tags"
                    placeholder="family, important, vacation, etc."
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="watermark" 
                    checked={watermark} 
                    onCheckedChange={(checked) => setWatermark(checked === true)} 
                  />
                  <Label htmlFor="watermark" className="cursor-pointer">Apply watermark to protect content</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="restrictDownload" 
                    checked={restrictDownload} 
                    onCheckedChange={(checked) => setRestrictDownload(checked === true)} 
                  />
                  <Label htmlFor="restrictDownload" className="cursor-pointer">Restrict downloading (view only)</Label>
                </div>
              </div>
            </div>
          )}
          
          {uploading && (
            <div className="space-y-2 mt-4">
              <Progress value={progress} />
              <p className="text-xs text-right text-muted-foreground">{progress}%</p>
            </div>
          )}
          
          <div className="mt-4 flex justify-end">
            <Button 
              onClick={handleUpload} 
              disabled={uploading} 
              className="w-full sm:w-auto"
            >
              {uploading ? 'Uploading...' : 'Upload File'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
