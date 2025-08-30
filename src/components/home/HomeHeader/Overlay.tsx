import React from 'react';

interface OverlayProps {
  show: boolean;
  onClick: () => void;
}

const Overlay: React.FC<OverlayProps> = ({ show, onClick }) => (
  show ? (
    <div 
      className="fixed inset-0 bg-black/50 z-40 md:hidden" 
      onClick={onClick}
    />
  ) : null
);

export default Overlay;
