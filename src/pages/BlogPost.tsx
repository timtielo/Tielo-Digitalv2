import React from 'react';
import { useBlogPost } from '../hooks/useBlogPost';
import { Loader } from 'lucide-react';
import { BlogSEO } from '../components/SEO/BlogSEO';
import { RichTextRenderer } from '../components/blog/RichTextRenderer';
import { Author } from '../components/blog/Author';
import { RelatedPosts } from '../components/blog/RelatedPosts';
import { BlogNewsletter } from '../components/blog/BlogNewsletter';

interface BlogPostProps {
  slug: string;
}

export function BlogPost({ slug }: BlogPostProps) {
  const { post, isLoading, error } = useBlogPost(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen pt-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-red-600">{error || 'Blog post niet gevonden'}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <BlogSEO post={post} />

      <article className="min-h-screen">
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <header className="mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 font-rubik">
                  {post.fields.title}
                </h1>
                {post.fields.shortDescription && (
                  <p className="text-xl text-gray-600 mb-6">
                    {post.fields.shortDescription}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  {post.fields.author && (
                    <Author author={post.fields.author} />
                  )}
                  <div className="text-sm text-gray-500">
                    <time dateTime={post.fields.publishedDate}>
                      {new Date(post.fields.publishedDate).toLocaleDateString('nl-NL')}
                    </time>
                    <span className="mx-2">•</span>
                    <span>{post.fields.readingTime || '5'} min leestijd</span>
                  </div>
                </div>
              </header>

              {/* Featured Image */}
              {post.fields.featuredImage && (
                <div className="mb-12">
                  <img
                    src={post.fields.featuredImage.fields.file.url}
                    alt={post.fields.featuredImage.fields.title}
                    className="w-full rounded-xl"
                  />
                </div>
              )}

              {/* Content */}
              <RichTextRenderer content={post.fields.content} />

              {/* Related Posts */}
              {post.fields.relatedBlogPosts && (
                <RelatedPosts posts={post.fields.relatedBlogPosts} />
              )}
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <BlogNewsletter />
      </article>
    </>
  );
}