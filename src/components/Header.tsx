import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, LogIn, ChevronDown } from 'lucide-react';
import { Link } from './Link';
import { motion, AnimatePresence } from 'framer-motion';

const mainNavItems = [
  { name: 'Websites', path: '/diensten/websites' },
  { name: 'Over ons', path: '/over-ons' },
  { name: 'Contact', path: '/contact' },
];

const moreNavItems = [
  { name: 'Cases', path: '/cases' },
  { name: 'Blog', path: '/blog' },
  { name: 'Diensten', path: '/diensten' },
  { name: 'Maatwerk', path: '/diensten/maatwerk' },
];

const allMobileItems = [
  ...mainNavItems,
  ...moreNavItems,
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleNavigation = () => {
      setIsMenuOpen(false);
      setIsMoreOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setIsMoreOpen(false);
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
    setIsMoreOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-sharp py-4' : 'bg-transparent py-6'
    }`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group" onClick={handleLinkClick}>
            <img
              src="/logo/favicon-96x96.png"
              alt="Tielo Digital Logo"
              width="40"
              height="40"
              className="transition-transform duration-200 group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-tielo-navy transition-colors duration-200 group-hover:text-tielo-orange">
                Tielo Digital
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8" aria-label="Main navigation">
            {mainNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className="text-tielo-navy font-medium hover:text-tielo-orange transition-colors focus:outline-none focus:ring-2 focus:ring-tielo-orange focus:ring-offset-2 rounded"
              >
                {item.name}
              </Link>
            ))}

            <Link
              href="/login"
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-tielo-orange transition-colors focus:outline-none focus:ring-2 focus:ring-tielo-orange focus:ring-offset-2 rounded"
              onClick={handleLinkClick}
            >
              <LogIn size={16} />
              Login
            </Link>

            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className="flex items-center gap-1 text-tielo-navy font-medium hover:text-tielo-orange transition-colors focus:outline-none focus:ring-2 focus:ring-tielo-orange focus:ring-offset-2 rounded px-1 py-1"
                aria-expanded={isMoreOpen}
                aria-haspopup="true"
              >
                Meer
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${isMoreOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {isMoreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50"
                  >
                    {moreNavItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.path}
                        className="block px-4 py-2.5 text-tielo-navy hover:bg-gray-50 hover:text-tielo-orange transition-colors text-sm font-medium"
                        onClick={handleLinkClick}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          <button
            className="md:hidden p-2 hover:bg-gray-100 rounded-td transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Sluit menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden fixed top-[72px] left-0 w-full bg-white shadow-sharp overflow-hidden"
            >
              <nav className="flex flex-col divide-y divide-gray-100" aria-label="Mobile navigation">
                {allMobileItems.map((item) => (
                  <div key={item.name} className="py-2 px-4">
                    <Link
                      href={item.path}
                      className="block py-3 text-tielo-navy font-medium hover:text-tielo-orange transition-colors focus:outline-none focus:ring-2 focus:ring-tielo-orange focus:ring-offset-2 rounded min-h-[44px] flex items-center"
                      onClick={handleLinkClick}
                    >
                      {item.name}
                    </Link>
                  </div>
                ))}
                <div className="py-2 px-4">
                  <Link
                    href="/login"
                    className="flex items-center gap-2 py-3 text-gray-500 hover:text-tielo-orange transition-colors focus:outline-none focus:ring-2 focus:ring-tielo-orange focus:ring-offset-2 rounded min-h-[44px]"
                    onClick={handleLinkClick}
                  >
                    <LogIn size={20} />
                    Login
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
