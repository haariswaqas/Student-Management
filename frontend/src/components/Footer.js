import React from 'react';

const Footer = () => {
  return (
    <footer className="footer mt-auto py-3 bg-dark text-white">
      <div className="container text-center">
        <p>&copy; {new Date().getFullYear()} Student Management System. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
