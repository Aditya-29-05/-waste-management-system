import React from 'react';

const StatusBadge = ({ status }) => {
  if (!status) return null;

  const normalized = status.toLowerCase();
  const className = `status-badge status-${normalized}`;

  return (
    <span className={className}>
      <span style={{ fontSize: '10px' }}>●</span> {status.replace('_', ' ')}
    </span>
  );
};

export default StatusBadge;
