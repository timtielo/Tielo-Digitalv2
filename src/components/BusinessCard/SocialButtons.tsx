import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, MessageCircle, Calendar, Linkedin } from 'lucide-react';

interface SocialButtonProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  onClick?: () => void;
  delay?: number;
}

function SocialButton({ icon, label, href, onClick, delay = 0 }: SocialButtonProps) {
  return (
    <motion.a
      href={href}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex items-center justify-center gap-3 w-full bg-white px-6 py-4 rounded-xl 
                 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
    >
      {icon}
      <span className="font-medium">{label}</span>
    </motion.a>
  );
}

export function SocialButtons() {
  const downloadVCard = () => {
    const link = document.createElement('a');
    link.href = '/utils/TimTielkemeijer.vcf';
    link.download = 'TimTielkemeijer.vcf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 max-w-sm mx-auto">
      <SocialButton
        icon={<UserPlus className="w-5 h-5 text-primary" />}
        label="Voeg toe aan contacten"
        href="#"
        onClick={downloadVCard}
        delay={0.1}
      />
      <SocialButton
        icon={<MessageCircle className="w-5 h-5 text-[#0088cc]" />}
        label="Telegram"
        href="https://t.me/Talismantim"
        delay={0.2}
      />
      <SocialButton
        icon={<Calendar className="w-5 h-5 text-green-600" />}
        label="Plan een gesprek"
        href="https://calendar.app.google/zq9PDJBdFE3rBy7fA"
        delay={0.3}
      />
      <SocialButton
        icon={<Linkedin className="w-5 h-5 text-[#0077b5]" />}
        label="LinkedIn"
        href="https://www.linkedin.com/in/tim-tielkemeijer/"
        delay={0.4}
      />
    </div>
  );
}