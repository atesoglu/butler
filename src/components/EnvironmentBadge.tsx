import React from 'react';
import { Tag } from '@carbon/react';
import { getEnvironmentBadge, getEnvironmentColor } from '../constants/environment';

interface EnvironmentBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const EnvironmentBadge: React.FC<EnvironmentBadgeProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const environment = getEnvironmentBadge();
  const color = getEnvironmentColor();
  
  // Map environment colors to valid Carbon Tag types
  const getTagType = (color: string) => {
    switch (color) {
      case 'green':
        return 'green';
      case 'orange':
        return 'warm-gray';
      case 'red':
        return 'red';
      default:
        return 'gray';
    }
  };
  
  return (
    <Tag
      type={getTagType(color)}
      size={size}
      className={`environment-badge ${className}`}
    >
      {environment}
    </Tag>
  );
};

export default EnvironmentBadge; 