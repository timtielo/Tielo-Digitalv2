import { useEffect } from 'react';
import { useCompanyData } from '../hooks/useCompanyData';
import { MetselaarTemplate } from '../components/Showcase/MetselaarTemplate';
import { AannemerTemplate } from '../components/Showcase/AannemerTemplate';
import { SEO } from '../components/SEO/SEO';
import type { Company } from '../types/airtable';
import { Loader2 } from 'lucide-react';

interface ShowcaseCompanyPageProps {
  businessType?: string;
  slug?: string;
}

const TemplateSelector = ({ company }: { company: Company }) => {
  const templates: Record<string, React.ComponentType<{ company: Company }>> = {
    Metselaar: MetselaarTemplate,
    Aannemer: AannemerTemplate,
  };

  const Template = templates[company.businessType];

  if (!Template) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Template Not Found
          </h1>
          <p className="text-gray-600">
            No template available for business type: {company.businessType}
          </p>
        </div>
      </div>
    );
  }

  return <Template company={company} />;
};

const getBusinessTypeLabel = (businessType: string): string => {
  const labels: Record<string, string> = {
    Metselaar: 'Metselaar',
    Aannemer: 'Aannemer',
  };
  return labels[businessType] || businessType;
};

export const ShowcaseCompanyPage = ({ slug }: ShowcaseCompanyPageProps) => {
  const { company, loading, error } = useCompanyData(slug);

  useEffect(() => {
    if (company) {
      document.title = `${company.businessName} - ${getBusinessTypeLabel(company.businessType)} | Tielo Digital`;
    }
  }, [company]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading company showcase...</p>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Company Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            {error || 'The company you are looking for does not exist.'}
          </p>
          <a
            href="/diensten/websites"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Our Website Services
          </a>
        </div>
      </div>
    );
  }

  const businessTypeLabel = getBusinessTypeLabel(company.businessType);
  const seoTitle = `${company.businessName} - ${businessTypeLabel}`;
  const seoDescription = `Welkom bij ${company.businessName}. Professionele ${businessTypeLabel.toLowerCase()} diensten door ${company.firstName} en zijn team. Neem contact op voor een vrijblijvende offerte.`;

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        ogImage={company.logoUrl}
        keywords={[
          company.businessName,
          businessTypeLabel,
          company.firstName,
          'bouw',
          'constructie',
          'Nederland',
        ]}
        canonical={`https://tielodigital.nl/diensten/websites/${company.businessType.toLowerCase()}/${company.slug}`}
      />
      <TemplateSelector company={company} />
    </>
  );
};
