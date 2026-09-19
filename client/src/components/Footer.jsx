import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© 2026 Waste Management System — Academic DevOps Project</p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          Stack: Node.js • Express • MongoDB • React • REST API
        </p>
      </div>
    </footer>
  );
};

export default Footer;
