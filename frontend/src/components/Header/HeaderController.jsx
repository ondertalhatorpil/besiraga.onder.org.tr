import React, { useState, useEffect } from 'react';
import WebHeader from './WebHeader';
import MobileHeader from './MobileHeader';

const HeaderController = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 950);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 950);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      {isMobile ? <MobileHeader /> : <WebHeader />}
    </>
  );
};

export default HeaderController;