'use client';

import type { ImgHTMLAttributes, ReactNode } from 'react';
import { useEffect, useState } from 'react';

const brokenImageSources = new Set<string>();

type ResilientImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fallback?: ReactNode;
};

export function ResilientImage({ src, fallback = null, onError, ...props }: ResilientImageProps) {
  const normalizedSrc = typeof src === 'string' ? src : '';
  const [failed, setFailed] = useState(() => !normalizedSrc || brokenImageSources.has(normalizedSrc));

  useEffect(() => {
    setFailed(!normalizedSrc || brokenImageSources.has(normalizedSrc));
  }, [normalizedSrc]);

  if (failed) {
    return <>{fallback}</>;
  }

  return (
    <img
      {...props}
      src={normalizedSrc}
      onError={(event) => {
        brokenImageSources.add(normalizedSrc);
        setFailed(true);
        onError?.(event);
      }}
    />
  );
}
