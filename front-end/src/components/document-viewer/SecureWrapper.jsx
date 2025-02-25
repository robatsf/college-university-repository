import React from 'react';
import { FaLock } from 'react-icons/fa';
import { preventCopy } from '../../uites/security';
export const SecureWrapper = ({ children }) => (
    <div 
      className="h-full relative"
      onContextMenu={preventCopy}
      onCopy={preventCopy}
      onPaste={preventCopy}
      onCut={preventCopy}
    >
      {children}
    </div>
  );