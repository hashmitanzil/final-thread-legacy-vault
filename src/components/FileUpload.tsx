
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';
import { UploadCloud, X, FileText, Image, Film, Music, File } from 'lucide-react';

interface FileUploadProps {
  bucketName: string;
  path?: string;
  onUploadComplete: (filePath: string, fileName: string, fileSize: number) => void;
  maxSizeMB?: number;
  acceptedFileTypes?: string[];
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  bucketName,
  path = '',
  onUploadComplete,
  maxSizeMB = 50,
  acceptedFileTypes,
  className = '',
}) => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  
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
      const { error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          upsert: true,
          onUploadProgress: (progress) => {
            const percent = (progress.uploadedBytes / progress.totalBytes) * 100;
            setProgress(Math.round(percent));
          }
        });
        
      if (error) throw error;
      
      onUploadComplete(filePath, file.name, file.size);
      
      toast({
        title: 'Upload complete',
        description: 'Your file has been uploaded successfully.'
      });
      
      setFile(null);
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
          
          {uploading && (
            <div className="space-y-2">
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
