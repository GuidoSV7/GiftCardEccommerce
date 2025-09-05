import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <Link to="/" className={`flex items-center ${className}`}>
      <span className="text-white font-bold text-xl">VEMPERGAMES</span>
    </Link>
  );
};

export default Logo;
