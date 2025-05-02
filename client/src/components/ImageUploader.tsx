import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Upload, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface ImageUploaderProps {
  currentImageUrl: string | null;
  onImageChange: (url: string | null) => void;
  label?: string;
  description?: string;
}

const ImageUploader = ({ 
  currentImageUrl, 
  onImageChange, 
  label = "Image", 
  description = "Upload an image or provide a URL" 
}: ImageUploaderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [useDirectUrl, setUseDirectUrl] = useState(!!currentImageUrl && !currentImageUrl.startsWith('/uploads/'));
  const [directUrl, setDirectUrl] = useState(useDirectUrl && currentImageUrl ? currentImageUrl : '');
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUrlChange = (url: string) => {
    setDirectUrl(url);
    onImageChange(url);
    setPreviewUrl(url);
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Only image files are allowed",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      const imageUrl = data.url;
      
      setPreviewUrl(imageUrl);
      onImageChange(imageUrl);
      toast({
        title: "Upload successful",
        description: "Image has been uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your image",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClearImage = () => {
    setPreviewUrl(null);
    setDirectUrl('');
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleMode = (checked: boolean) => {
    setUseDirectUrl(checked);
    if (checked) {
      // Switching to URL mode
      onImageChange(directUrl || null);
    } else {
      // Switching to upload mode
      onImageChange(previewUrl || null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>{label}</Label>
        <div className="flex items-center space-x-2">
          <Label htmlFor="use-url" className="text-xs">Use URL</Label>
          <Switch 
            id="use-url" 
            checked={useDirectUrl}
            onCheckedChange={toggleMode}
          />
        </div>
      </div>

      <p className="text-sm text-muted-foreground">{description}</p>

      {useDirectUrl ? (
        <div className="mt-2">
          <div className="flex items-center">
            <LinkIcon className="h-4 w-4 mr-2 text-muted-foreground" />
            <Input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={directUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
            />
          </div>
        </div>
      ) : (
        <div className="mt-2">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex flex-col space-y-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleUploadClick}
              disabled={isLoading}
              className="flex items-center"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isLoading ? 'Uploading...' : 'Upload Image'}
            </Button>
          </div>
        </div>
      )}

      {previewUrl && (
        <div className="mt-4 relative">
          <div className="relative aspect-video w-full rounded-lg overflow-hidden border bg-muted">
            <img
              src={previewUrl}
              alt="Preview"
              className="h-full w-full object-contain"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleClearImage}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}

      {!previewUrl && (
        <div className="flex items-center justify-center h-32 border border-dashed rounded-lg">
          <div className="flex flex-col items-center text-muted-foreground">
            <ImageIcon className="h-8 w-8 mb-2" />
            <span className="text-sm">No image selected</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;