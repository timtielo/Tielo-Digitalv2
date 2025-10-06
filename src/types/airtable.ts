export interface AirtableAttachment {
  id: string;
  url: string;
  filename: string;
  size: number;
  type: string;
  thumbnails?: {
    small?: { url: string; width: number; height: number };
    large?: { url: string; width: number; height: number };
    full?: { url: string; width: number; height: number };
  };
}

export interface AirtableCompanyRecord {
  id: string;
  fields: {
    Voornaam?: string;
    Slug?: string;
    'Business type'?: string;
    Bedrijfsnaam?: string;
    Logo?: AirtableAttachment[];
  };
  createdTime: string;
}

export interface Company {
  id: string;
  firstName: string;
  slug: string;
  businessType: string;
  businessName: string;
  logoUrl?: string;
  createdTime: string;
}

export type BusinessType = 'Metselaar' | 'Aannemer';
