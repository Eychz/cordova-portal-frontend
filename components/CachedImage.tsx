'use client';

import React, { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { getCachedImageBlob, cacheImageFromUrl } from '@/lib/imageStore';

interface CachedImageProps extends ImageProps {
  fallbackSrc?: string;
}

const CachedImage: React.FC<CachedImageProps> = ({
  src,
  alt,
  fallbackSrc = '/municipal-logo.jpg',
  onError,
  ...props
}) => {
  const rawSrc = typeof src === 'string' ? src : (src as any)?.src || '';
  const [imageSrc, setImageSrc] = useState<string>(rawSrc);

  useEffect(() => {
    if (!rawSrc || rawSrc.startsWith('data:') || rawSrc.startsWith('blob:')) {
      setImageSrc(rawSrc);
      return;
    }

    let isMounted = true;

    // Check IndexedDB cache first
    getCachedImageBlob(rawSrc).then((cachedBlobUrl) => {
      if (!isMounted) return;

      if (cachedBlobUrl) {
        setImageSrc(cachedBlobUrl);
      } else {
        // Fallback to network URL, and asynchronously cache blob into IndexedDB
        setImageSrc(rawSrc);
        cacheImageFromUrl(rawSrc);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [rawSrc]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (fallbackSrc && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
    }
    if (onError) {
      onError(e);
    }
  };

  return (
    <Image
      {...props}
      src={imageSrc || fallbackSrc}
      alt={alt || 'Image'}
      onError={handleError}
    />
  );
};

export default CachedImage;
