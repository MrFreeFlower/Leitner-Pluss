import React from 'react';

interface ShiningStarIconProps {
  size?: number | string;
  className?: string;
  strokeWidth?: number | string;
}

export const ShiningStarIcon: React.FC<ShiningStarIconProps> = ({ size = 20, className, strokeWidth = 1.5 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" transform="scale(0.8) translate(3, 3)" />
    </svg>
  );
};
