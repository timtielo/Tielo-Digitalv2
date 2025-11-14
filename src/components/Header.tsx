import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from './Link';
import { ConsultButton } from './common/ConsultButton';
import { motion, AnimatePresence } from 'framer-motion';

const mobileMenuItems = [
  { name: 'Website', path: '/diensten/websites' },
  { name: 'Oplossingen', path: '/oplossingen' },
  { name: 'Contact', path: '/contact' }
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleNavigation = () => {
      setIsMenuOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('popstate', handleNavigation);
    window.addEventListener('pushstate', handleNavigation);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('popstate', handleNavigation);
      window.removeEventListener('pushstate', handleNavigation);
    };
  }, []);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-4' : 'bg-transparent py-6'
    }`}>
      <div className="container mx-auto px-4 sm:px-6">
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
          <nav className="hidden md:flex items-center space-x-8" aria-label="Main navigation">
            <Link href="/diensten/websites" className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">Website</Link>
            <Link href="/oplossingen" className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">Oplossingen</Link>
            <Link href="/contact" className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">Contact</Link>
            <ConsultButton>
              Gratis opzetje
            </ConsultButton>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Sluit menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
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
              <nav className="flex flex-col divide-y divide-gray-100" aria-label="Mobile navigation">
                {mobileMenuItems.map((item) => (
                  <div key={item.name} className="py-2 px-4">
                    <Link
                      href={item.path}
                      className="block py-3 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded min-h-[44px] flex items-center"
                      onClick={handleLinkClick}
                    >
                      {item.name}
                    </Link>
                  </div>
                ))}
                <div className="py-2 px-4">
                  <ConsultButton>
                    Gratis opzetje
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