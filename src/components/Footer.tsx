import React from 'react';
import { MapPin, Phone, Mail, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      const sectionId = href.substring(1);
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Our Studio */}
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent mb-6">Our Studio</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">AA Designer Studio</h4>
                <div className="flex items-start space-x-3 text-gray-300">
                  <MapPin className="h-5 w-5 mt-1 flex-shrink-0" />
                  <div>
                    <p>Kondapur, Hyderabad,</p>
                    <p>Telangana, 500084.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent mb-6">Quick Links</h3>
            <div className="space-y-3">
              <Link 
                to="/who-we-are" 
                className="block text-gray-300 hover:text-amber-400 transition-colors duration-300"
              >
                Who We Are
              </Link>
              <Link 
                to="/what-we-do" 
                className="block text-gray-300 hover:text-amber-400 transition-colors duration-300"
              >
                What We Do
              </Link>
              <button
                onClick={() => handleNavClick('#testimonials')}
                className="block text-gray-300 hover:text-amber-400 transition-colors duration-300 text-left"
              >
                Testimonials
              </button>
              <button
                onClick={scrollToContact}
                className="block text-gray-300 hover:text-amber-400 transition-colors duration-300 text-left"
              >
                Contact
              </button>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent mb-6">Services</h3>
            <div className="space-y-3 text-gray-300">
              <p>Residential Design</p>
              <p>Commercial Spaces</p>
              <p>Hospitality Design</p>
              <p>Interior Architecture</p>
              <p>Space Planning</p>
              <p>3D Visualization</p>
            </div>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent mb-6">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <div>
                  <a 
                    href="tel:+917993547958" 
                    className="hover:text-amber-400 transition-colors duration-300 block"
                  >
                    (+91) 79935 47958
                  </a>
                  <a 
                    href="tel:+918099754478" 
                    className="hover:text-amber-400 transition-colors duration-300 block"
                  >
                    (+91) 80997 54478
                  </a>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <a 
                  href="mailto:reachus@aadesignerstudio.com" 
                  className="hover:text-amber-400 transition-colors duration-300"
                >
                  reachus@aadesignerstudio.com
                </a>
              </div>
              
              <div className="flex items-center space-x-3 text-gray-300">
                <Instagram className="h-5 w-5 flex-shrink-0" />
                <a 
                  href="https://www.instagram.com/aa_designer_studio" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors duration-300"
                >
                  aa_designer_studio
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <img 
                src="/FINAL LOGO PSD - R1.png" 
                alt="AA Designer Studio" 
                className="h-12 w-auto mr-4"
              />
              <div>
                <h3 className="text-xl font-bold text-white">AA Designer Studio</h3>
                <p className="text-gray-400">Transforming Spaces with Precision</p>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-400 mb-2">
                © 2024 AA Designer Studio. All rights reserved.
              </p>
              <p className="text-gray-500">
                Designed with love ♥ and maintained by{' '}
                <a 
                  href="https://devai.online" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 transition-colors duration-300"
                >
                  DevAI
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;