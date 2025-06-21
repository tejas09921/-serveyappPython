import React from 'react';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
}

export function Card({ className = '', children, hover = false }: CardProps) {
  const hoverClasses = hover ? 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300' : '';
  
  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`px-6 py-4 border-b border-gray-100/50 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
}