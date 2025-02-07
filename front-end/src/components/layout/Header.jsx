// components/layout/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Menu, X } from 'lucide-react';
import { Button } from '../ui/button';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  const navItems = [
    { name: 'Profile', path: '/profile' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'About', path: '/about' },
    { name: 'Login', path: '/login' }
  ];

  return (
    <nav className="bg-[#0066CC] text-white shadow-md transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2 hover:opacity-90 transition-opacity duration-200"
            >
              <BookOpen className="h-8 w-8" />
              <span className="font-bold text-xl">HUDC IRS</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="px-3 py-2 rounded-md hover:bg-[#0052A3] transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            className="md:hidden text-white hover:bg-[#0052A3] transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden animate-slideDown">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-[#0066CC] border-t border-[#0052A3]">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="block px-3 py-2 rounded-md hover:bg-[#0052A3] transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}