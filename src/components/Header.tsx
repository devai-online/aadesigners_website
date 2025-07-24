import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Who We Are', href: '/who-we-are' },
    { name: 'What We Do', href: '/what-we-do' },
    { name: 'Projects', href: '/projects' },
    { name: 'Blog', href: '/blog' },
    { name: 'Testimonials', href: '#testimonials' }
  ];

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      const sectionId = href.substring(1);
      if (location.pathname === '/') {
        // Already on home page, just scroll
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Navigate to home page first, then scroll after navigation
        sessionStorage.setItem('scrollToSection', sectionId);
        window.location.href = '/';
      }
    }
  };

  // Handle scrolling after navigation to home page
  useEffect(() => {
    if (location.pathname === '/') {
      const sectionToScroll = sessionStorage.getItem('scrollToSection');
      if (sectionToScroll) {
        sessionStorage.removeItem('scrollToSection');
        // Small delay to ensure the page has loaded
        setTimeout(() => {
          const section = document.getElementById(sectionToScroll);
          if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
  }, [location.pathname]);

  const scrollToContact = () => {
    if (location.pathname === '/') {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      sessionStorage.setItem('scrollToSection', 'contact');
      window.location.href = '/';
    }
    setIsMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white/90'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center">
            <img 
              src="/image.png" 
              alt="AA Designer Studio" 
              className="h-20 w-auto"
            />
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              item.href.startsWith('#') ? (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className={`font-medium tracking-wide transition-colors duration-300 ${
                    location.pathname === '/' && location.hash === item.href
                      ? 'text-amber-900 border-b-2 border-amber-900 pb-1' 
                      : 'text-gray-700 hover:text-amber-900'
                  }`}
                >
                  {item.name}
                </button>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`font-medium tracking-wide transition-colors duration-300 ${
                    location.pathname === item.href 
                      ? 'text-amber-900 border-b-2 border-amber-900 pb-1' 
                      : 'text-gray-700 hover:text-amber-900'
                  }`}
                >
                  {item.name}
                </Link>
              )
            ))}
            <button 
              onClick={scrollToContact}
              className="bg-amber-800 text-white px-5 py-2.5 rounded-full font-medium tracking-wide hover:bg-amber-700 transition-colors duration-300"
            >
              Contact
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-900" />
            ) : (
              <Menu className="h-6 w-6 text-gray-900" />
            )}
          </button>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-white rounded-lg mt-2 py-4 shadow-lg border">
              {navItems.map((item) => (
                item.href.startsWith('#') ? (
                  <button
                    key={item.name}
                    onClick={() => {
                      handleNavClick(item.href);
                      setIsMenuOpen(false);
                    }}
                    className={`block w-full text-left px-6 py-3 font-medium transition-colors duration-300 ${
                      location.pathname === '/' && location.hash === item.href
                        ? 'text-amber-900 bg-amber-50' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-amber-900'
                    }`}
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-6 py-3 font-medium transition-colors duration-300 ${
                      location.pathname === item.href 
                        ? 'text-amber-900 bg-amber-50' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-amber-900'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              ))}
              <div className="px-6 pt-3">
                <button 
                  onClick={scrollToContact}
                  className="w-full bg-amber-800 text-white px-5 py-2.5 rounded-full font-medium"
                >
                  Contact
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;