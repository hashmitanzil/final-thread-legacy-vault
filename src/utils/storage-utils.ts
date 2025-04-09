
import { supabase } from '@/integrations/supabase/client';

/**
 * Convert file size in bytes to a human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get total used storage for a user across all buckets
 */
export async function getUserStorageUsage(userId: string): Promise<{
  totalSizeBytes: number;
  totalFiles: number;
  formattedSize: string;
}> {
  try {
    const { data: digitalAssets } = await supabase
      .from('digital_assets')
      .select('size')
      .eq('user_id', userId);
      
    const totalDigitalAssetBytes = digitalAssets?.reduce((sum, asset) => {
      return sum + parseInt(asset.size, 10);
    }, 0) || 0;
    
    // Get storage for time capsules with file type
    const { data: timeCapsules } = await supabase
      .from('time_capsules')
      .select('storage_path')
      .eq('user_id', userId)
      .eq('type', 'file')
      .not('storage_path', 'is', null);
      
    // We'd need to get the size of each file, but for now we'll estimate
    const estimatedTimeCapsuleBytes = (timeCapsules?.length || 0) * (2 * 1024 * 1024); // 2MB per file
    
    const totalSizeBytes = totalDigitalAssetBytes + estimatedTimeCapsuleBytes;
    
    return {
      totalSizeBytes,
      totalFiles: (digitalAssets?.length || 0) + (timeCapsules?.length || 0),
      formattedSize: formatFileSize(totalSizeBytes)
    };
  } catch (error) {
    console.error('Error calculating storage usage:', error);
    return {
      totalSizeBytes: 0,
      totalFiles: 0,
      formattedSize: '0 Bytes'
    };
  }
}

/**
 * Calculate remaining storage for a user based on plan limit
 */
export function getRemainingStorage(usedBytes: number, planLimitMB: number = 1024): {
  remainingBytes: number;
  remainingFormatted: string;
  usagePercentage: number;
} {
  const planLimitBytes = planLimitMB * 1024 * 1024;
  const remainingBytes = Math.max(0, planLimitBytes - usedBytes);
  const usagePercentage = Math.min(100, (usedBytes / planLimitBytes) * 100);
  
  return {
    remainingBytes,
    remainingFormatted: formatFileSize(remainingBytes),
    usagePercentage
  };
}
