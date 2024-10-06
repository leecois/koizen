import * as React from 'react';
import * as AvatarPrimitive from '@/components/primitives/avatar';
import { cn } from '@/lib/utils';
import { supabase } from '@/config/supabase';
import { ActivityIndicator } from 'react-native';

// Existing Avatar components
const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-muted',
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

interface SupabaseAvatarImageProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image> {
  storageUrl?: string;
  bucket: string;
}

const SupabaseAvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  SupabaseAvatarImageProps
>(({ className, storageUrl, bucket, ...props }, ref) => {
  const [imageUri, setImageUri] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function downloadImage() {
      if (!storageUrl) {
        setLoading(false);
        setError(null);
        setImageUri(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase.storage.from(bucket).download(storageUrl);

        if (error) throw error;

        const fr = new FileReader();
        fr.readAsDataURL(data);
        fr.onload = () => {
          setImageUri(fr.result as string);
          setLoading(false);
        };
      } catch (error) {
        console.error(
          'Error downloading image: ',
          error instanceof Error ? error.message : String(error),
        );
        setError('Failed to load image');
        setLoading(false);
      }
    }

    downloadImage();
  }, [storageUrl, bucket]);

  if (loading) {
    return <ActivityIndicator size="small" color="#000" />;
  }

  if (error || !imageUri) {
    return null; // This will trigger the Fallback to be displayed
  }

  return (
    <AvatarPrimitive.Image
      ref={ref}
      className={cn('aspect-square h-full w-full', className)}
      source={{ uri: imageUri }}
      {...props}
    />
  );
});
SupabaseAvatarImage.displayName = 'SupabaseAvatarImage';

export { Avatar, AvatarFallback, SupabaseAvatarImage };
