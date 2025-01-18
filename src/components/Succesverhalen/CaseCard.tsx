import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CaseCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconBgColor?: string;
  iconColor?: string;
}

export function CaseCard({ 
  icon: Icon, 
  title, 
  description, 
  iconBgColor = "bg-primary/10",
  iconColor = "text-primary" 
}: CaseCardProps) {
  return (
    <div className="flex items-start gap-4">
      <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <div>
        <h4 className="font-semibold mb-2">{title}</h4>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}