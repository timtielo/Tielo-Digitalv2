import React from 'react';
import { motion } from 'framer-motion';
import { ContentfulOplossing } from '../../lib/contentful/types/oplossingen';
import { OplossingCard } from './OplossingCard';
import { Pagination } from '../blog/Pagination';

interface OplossingenGridProps {
  oplossingen: ContentfulOplossing[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function OplossingenGrid({ 
  oplossingen, 
  currentPage, 
  totalPages, 
  onPageChange 
}: OplossingenGridProps) {
  if (!oplossingen.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">
          Geen oplossingen gevonden. Voeg eerst wat oplossingen toe in Contentful.
        </p>
      </div>
    );
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="grid md:grid-cols-2 gap-8">
            {oplossingen.map((oplossing) => (
              <motion.div
                key={oplossing.sys.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <OplossingCard
                  title={oplossing.fields.title}
                  description={oplossing.fields.shortDescription || ''}
                  image={`https:${oplossing.fields.featuredImage.fields.file.url}`}
                  slug={oplossing.fields.slug}
                  date={oplossing.fields.publishedDate}
                  readTime={oplossing.fields.readingTime}
                />
              </motion.div>
            ))}
          </div>
          
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          )}
        </div>
      </div>
    </section>
  );
}