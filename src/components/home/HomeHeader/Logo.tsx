import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="text-white font-bold text-xl">GIFCARDS</span>
    </div>
  );
};

export default Logo;
