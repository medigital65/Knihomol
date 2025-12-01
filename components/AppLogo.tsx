
import React from 'react';

export const AppLogo = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
  >
    {/* Defs for gradients/shadows if needed, keeping it flat for now */}
    
    {/* Left Page: Book (Indigo) */}
    <path 
      d="M50 15C30 15 10 25 10 25V85C10 85 30 75 50 75V15Z" 
      className="fill-indigo-600" 
    />
    {/* Book Pages Shadow/Detail */}
    <path 
      d="M50 15C35 15 15 22 15 22V82C15 82 35 75 50 75V15Z" 
      className="fill-indigo-500" 
    />
    
    {/* Text Lines on Book */}
    <rect x="20" y="30" width="20" height="3" rx="1.5" className="fill-indigo-200 opacity-60" />
    <rect x="20" y="38" width="24" height="3" rx="1.5" className="fill-indigo-200 opacity-60" />
    <rect x="20" y="46" width="22" height="3" rx="1.5" className="fill-indigo-200 opacity-60" />
    <rect x="20" y="54" width="18" height="3" rx="1.5" className="fill-indigo-200 opacity-60" />

    {/* Right Page: Film (Purple) */}
    <path 
      d="M50 15C70 15 90 25 90 25V85C90 85 70 75 50 75V15Z" 
      className="fill-purple-600" 
    />
    {/* Film Strip Body Detail */}
    <path 
      d="M50 15C65 15 85 22 85 22V82C85 82 65 75 50 75V15Z" 
      className="fill-purple-500" 
    />

    {/* Film Sprocket Holes */}
    <rect x="78" y="28" width="5" height="4" rx="1" className="fill-purple-200 opacity-80" />
    <rect x="78" y="38" width="5" height="4" rx="1" className="fill-purple-200 opacity-80" />
    <rect x="78" y="48" width="5" height="4" rx="1" className="fill-purple-200 opacity-80" />
    <rect x="78" y="58" width="5" height="4" rx="1" className="fill-purple-200 opacity-80" />
    <rect x="78" y="68" width="5" height="4" rx="1" className="fill-purple-200 opacity-80" />

    {/* Center Spine */}
    <path d="M50 15V75" stroke="white" strokeWidth="1" strokeOpacity="0.3" />
  </svg>
);
