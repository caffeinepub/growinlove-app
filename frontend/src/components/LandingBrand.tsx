import { useState } from 'react';

interface LandingBrandProps {
  variant?: 'default' | 'compact';
}

export function LandingBrand({ variant = 'default' }: LandingBrandProps) {
  const [imageError, setImageError] = useState(false);

  const isCompact = variant === 'compact';

  if (imageError) {
    // Text-only fallback
    return (
      <div className={`flex items-center ${isCompact ? 'gap-2' : 'gap-3'}`}>
        <div
          className={`${
            isCompact ? 'w-8 h-8 text-base' : 'w-10 h-10 text-lg'
          } rounded-full bg-gradient-to-br from-green-600 to-amber-700 flex items-center justify-center font-bold text-white shadow-md`}
        >
          GL
        </div>
        <span
          className={`${
            isCompact ? 'text-base' : 'text-xl'
          } font-bold bg-gradient-to-r from-green-700 via-amber-700 to-green-800 bg-clip-text text-transparent`}
        >
          GrowInLove
        </span>
      </div>
    );
  }

  return (
    <div className={`flex ${isCompact ? 'flex-row items-center gap-2' : 'flex-col items-center gap-1.5'}`}>
      <img
        src="/assets/generated/growinlove-tree-logo-transparent.dim_256x256.png"
        alt="GrowInLove"
        className={isCompact ? 'w-8 h-8' : 'w-12 h-12'}
        onError={() => setImageError(true)}
      />
      <span
        className={`${
          isCompact ? 'text-base' : 'text-lg'
        } font-bold bg-gradient-to-r from-green-700 via-amber-700 to-green-800 bg-clip-text text-transparent`}
      >
        GrowInLove
      </span>
    </div>
  );
}
