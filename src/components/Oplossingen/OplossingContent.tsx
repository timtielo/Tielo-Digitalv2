import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { ContentfulOplossing } from '../../lib/contentful/types/oplossingen';
import { RichTextRenderer } from '../blog/RichTextRenderer';
import { Author } from '../blog/Author';
import { formatDate } from '../../utils/date';

interface OplossingContentProps {
  oplossing: ContentfulOplossing;
}

export function OplossingContent({ oplossing }: OplossingContentProps) {
  const { fields } = oplossing;

  return (
    <article>
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <header className="mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-6 font-rubik">
                  {fields.title}
                </h1>
                {fields.shortDescription && (
                  <p className="text-xl text-gray-600 mb-6">
                    {fields.shortDescription}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  {fields.author && (
                    <Author author={fields.author} />
                  )}
                  <div className="text-sm text-gray-500">
                    <time dateTime={fields.publishedDate}>
                      {formatDate(fields.publishedDate)}
                    </time>
                    <span className="mx-2">•</span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {fields.readingTime} min leestijd
                    </span>
                  </div>
                </div>
              </motion.div>
            </header>

            {/* Featured Image */}
            {fields.featuredImage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
              >
                <img
                  src={`https:${fields.featuredImage.fields.file.url}`}
                  alt={fields.featuredImage.fields.title}
                  className="w-full rounded-xl"
                />
              </motion.div>
            )}

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <RichTextRenderer content={fields.content} />
            </motion.div>
          </div>
        </div>
      </div>
    </article>
  );
}