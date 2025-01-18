import React from 'react';

interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}

export function Link({ href, children, className = '', target, rel }: LinkProps) {
  const isExternal = href.startsWith('http') || href.startsWith('mailto:');
  const isAnchor = href.startsWith('#');

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Allow default behavior for external links, mailto links, and anchor links
    if (isExternal || isAnchor) {
      return;
    }

    e.preventDefault();
    
    // For internal navigation, use relative paths
    const url = new URL(href, window.location.origin);
    const relativePath = url.pathname + url.search + url.hash;
    
    // Update the URL
    window.history.pushState({}, '', relativePath);
    
    // Create and dispatch a custom pushstate event
    const pushStateEvent = new Event('pushstate');
    window.dispatchEvent(pushStateEvent);
    
    // Scroll to top for internal navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add active state for current page
  const isActive = !isExternal && window.location.pathname === href;
  const activeClass = isActive ? 'text-primary' : '';

  // External link props
  const externalProps = isExternal ? {
    target: target || '_blank',
    rel: rel || 'noopener noreferrer'
  } : {};

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`hover:text-primary transition-colors duration-200 ${activeClass} ${className}`}
      {...externalProps}
    >
      {children}
    </a>
  );
}