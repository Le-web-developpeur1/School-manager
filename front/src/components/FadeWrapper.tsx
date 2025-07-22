import React from 'react';

const FadeWrapper = ({ children }) => {
  return (
    <div className="transition-opacity duration-700 opacity-100 animate-fadeIn">
      {children}
    </div>
  );
};

export default FadeWrapper;
