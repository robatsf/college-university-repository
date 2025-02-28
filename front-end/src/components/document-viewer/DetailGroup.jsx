import React from 'react';
import { preventCopy } from '../../uites/security';

export const DetailGroup = ({ title, children }) => (
  <div 
    className="border-b border-gray-200 pb-4 mb-4 select-none" 
    onCopy={preventCopy}
    onDragStart={preventCopy}
  >
    <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
      {title}
    </h3>
    <div className="space-y-2">{children}</div>
  </div>
);
