import React from 'react';
import { Linkedin, Facebook, Instagram, Mail } from 'lucide-react';

interface SocialButtonProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

function SocialButton({ href, icon, label }: SocialButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
      aria-label={label}
    >
      {icon}
    </a>
  );
}

export function SocialButtons() {
  return (
    <div className="flex gap-4">
      <SocialButton
        href="https://www.linkedin.com/in/tim-tielkemeijer/"
        icon={<Linkedin className="w-6 h-6 text-white" />}
        label="LinkedIn"
      />
      <SocialButton
        href="https://www.facebook.com/tielodigital/"
        icon={<Facebook className="w-6 h-6 text-white" />}
        label="Facebook"
      />
      <SocialButton
        href="https://www.instagram.com/tielodigital/"
        icon={<Instagram className="w-6 h-6 text-white" />}
        label="Instagram"
      />
      <SocialButton
        href="mailto:info@tielo-digital.nl"
        icon={<Mail className="w-6 h-6 text-white" />}
        label="Email"
      />
    </div>
  );
}