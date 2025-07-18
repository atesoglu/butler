import React from 'react';
import { Breadcrumb, BreadcrumbItem } from '@carbon/react';
import { Link } from 'react-router-dom';

interface AppBreadcrumbProps {
  breadcrumb: string[];
}

export const AppBreadcrumb: React.FC<AppBreadcrumbProps> = ({ breadcrumb }) => {
  return (
    <div className="breadcrumb-container">
      <Breadcrumb>
        <BreadcrumbItem>
          <Link to="/">Home</Link>
        </BreadcrumbItem>
        {breadcrumb.map((item, idx) => (
          <BreadcrumbItem key={idx}>{item}</BreadcrumbItem>
        ))}
      </Breadcrumb>
    </div>
  );
}; 