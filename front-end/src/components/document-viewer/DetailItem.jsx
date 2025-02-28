import React from 'react';
import { preventCopy } from '../../uites/security';
export const DetailItem = ({ icon, label, value }) => (
    <div 
      className="flex items-center space-x-3 text-sm select-none"
      onCopy={preventCopy}
      onDragStart={preventCopy}
    >
      <div className="text-gray-500">{icon}</div>
      <div className="flex-1">
        <span className="text-gray-600">{label}:</span>{" "}
        <span className="font-medium text-gray-800">{value}</span>
      </div>
    </div>
  );