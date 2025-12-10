'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsLoading(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [pathname, children]);

  return (
    <div className="relative min-h-screen">
      {/* Loading Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-gradient-to-br from-warm-white to-cream transition-opacity duration-300 ${
          isLoading ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-brown-600 font-medium">Loading...</p>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div
        className={`transition-all duration-600 ${
          isLoading 
            ? 'opacity-0 transform scale-95 blur-sm' 
            : 'opacity-100 transform scale-100 page-content'
        }`}
        style={{ 
          transitionTimingFunction: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
          willChange: 'transform, opacity, filter'
        }}
      >
        {displayChildren}
      </div>
    </div>
  );
}