import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import { Link } from './Link';
import { ConsultButton } from './common/ConsultButton';
import { motion, AnimatePresence } from 'framer-motion';

// Mobile menu structure
const mobileMenuItems = [
  {
    name: 'Diensten',
    submenu: [
      { name: 'Websites', path: '/diensten/websites' },
      { name: 'Klantenservice', path: '/diensten/customer-service' },
      { name: 'Alle diensten', path: '/diensten' },
    ]
  },
  { name: 'Oplossingen', path: '/oplossingen' },
  { name: 'Succesverhalen', path: '/succesverhalen' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' }
];

// Desktop menu structure
const diensten = [
  { name: 'Alle diensten', path: '/diensten' },
  { name: 'Websites', path: '/diensten/websites' },
  { name: 'Workflow', path: '/diensten/workflow' },
  { name: 'Outreach', path: '/diensten/outreach' },
  { name: 'Klantenservice', path: '/diensten/customer-service' },
  { name: 'Maatwerk', path: '/diensten/custom' }
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeMobileSubmenu, setActiveMobileSubmenu] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleNavigation = () => {
      setIsMenuOpen(false);
      setIsDropdownOpen(false);
      setActiveMobileSubmenu(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('popstate', handleNavigation);
    window.addEventListener('pushstate', handleNavigation);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('popstate', handleNavigation);
      window.removeEventListener('pushstate', handleNavigation);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
    setActiveMobileSubmenu(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-4' : 'bg-transparent py-6'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group" onClick={handleLinkClick}>
            <img 
              src="/logo/favicon-96x96.png" 
              alt="Tielo Digital Logo" 
              width="40"
              height="40"
              className="transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900 font-rubik transition-colors duration-300 group-hover:text-primary">
                Tielo Digital
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center gap-1 hover:text-primary transition-colors duration-200"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                onMouseEnter={() => setIsDropdownOpen(true)}
              >
                Diensten
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 border border-gray-100"
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    {diensten.map((dienst) => (
                      <Link
                        key={dienst.path}
                        href={dienst.path}
                        className="block px-4 py-2 hover:bg-gray-50 hover:text-primary transition-colors"
                        onClick={handleLinkClick}
                      >
                        {dienst.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/oplossingen">Oplossingen</Link>
            <Link href="/succesverhalen">Succesverhalen</Link>
            <Link href="/blog">Blog</Link>
            <ConsultButton>
              Contact
            </ConsultButton>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Sluit menu' : 'Open menu'}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden fixed top-[72px] left-0 w-full bg-white shadow-lg overflow-hidden"
            >
              <nav className="flex flex-col divide-y divide-gray-100">
                {mobileMenuItems.map((item) => (
                  <div key={item.name} className="py-2 px-4">
                    {item.submenu ? (
                      <>
                        <button
                          onClick={() => setActiveMobileSubmenu(activeMobileSubmenu === item.name ? null : item.name)}
                          className="flex items-center justify-between w-full py-2 hover:text-primary transition-colors"
                        >
                          {item.name}
                          <ChevronRight className={`w-5 h-5 transition-transform duration-200 ${
                            activeMobileSubmenu === item.name ? 'rotate-90' : ''
                          }`} />
                        </button>
                        <AnimatePresence>
                          {activeMobileSubmenu === item.name && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pl-4 space-y-2"
                            >
                              {item.submenu.map((subItem) => (
                                <Link
                                  key={subItem.path}
                                  href={subItem.path}
                                  className="block py-2 text-gray-600 hover:text-primary transition-colors"
                                  onClick={handleLinkClick}
                                >
                                  {subItem.name}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={item.path}
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={handleLinkClick}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}