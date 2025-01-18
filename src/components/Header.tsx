import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link } from './Link';
import { ConsultButton } from './common/ConsultButton';
import { motion, AnimatePresence } from 'framer-motion';

const diensten = [
  { name: 'Alle diensten', path: '/diensten' },
  { name: 'Websites', path: '/diensten/websites' },
  { name: 'Workflow', path: '/diensten/workflow' },
  { name: 'Outreach', path: '/diensten/outreach' },
  { name: 'Emails beantwoorden', path: '/diensten/email-handling' },
  { name: 'Klantenservice', path: '/diensten/customer-service' },
  { name: 'Content maken', path: '/diensten/content-creation' }
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleNavigation = () => {
      setIsMenuOpen(false);
      setIsDropdownOpen(false);
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

          <nav className="hidden md:flex items-center space-x-8">
            {/* Diensten Dropdown */}
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
              className="md:hidden fixed top-[72px] left-0 w-full bg-white shadow-lg py-4 overflow-hidden"
            >
              <nav className="flex flex-col space-y-1 px-4">
                {diensten.map((dienst) => (
                  <Link
                    key={dienst.path}
                    href={dienst.path}
                    className="py-2 hover:text-primary transition-colors"
                    onClick={handleLinkClick}
                  >
                    {dienst.name}
                  </Link>
                ))}
                <div className="border-t border-gray-100 my-2" />
                <Link href="/oplossingen" onClick={handleLinkClick}>Oplossingen</Link>
                <Link href="/succesverhalen" onClick={handleLinkClick}>Succesverhalen</Link>
                <Link href="/blog" onClick={handleLinkClick}>Blog</Link>
                <div className="pt-2">
                  <ConsultButton onClick={handleLinkClick} className="w-full justify-center">
                    Contact
                  </ConsultButton>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}