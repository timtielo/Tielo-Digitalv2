import React from 'react';
import { BlogCard } from './BlogCard';
import { Search } from 'lucide-react';

const categories = ['AI', 'Automatisering', 'Chatbots', 'Data Analyse', 'Innovatie'];

const blogPosts = [
  {
    title: 'Hoe AI uw klantenservice kan transformeren',
    excerpt: 'Ontdek hoe moderne AI-technologie uw klantenservice naar een hoger niveau kan tillen.',
    category: 'AI',
    author: 'Thomas Berg',
    date: '15 maart 2024',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&h=400',
    readTime: '5 min'
  },
  {
    title: 'De toekomst van procesautomatisering',
    excerpt: 'Een diepgaande analyse van de laatste trends in bedrijfsprocessen automatisering.',
    category: 'Automatisering',
    author: 'Emma de Vries',
    date: '10 maart 2024',
    image: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=800&h=400',
    readTime: '7 min'
  },
  {
    title: 'Succesvol implementeren van chatbots',
    excerpt: 'Praktische tips voor een succesvolle chatbot implementatie in uw organisatie.',
    category: 'Chatbots',
    author: 'Lisa van Dijk',
    date: '5 maart 2024',
    image: 'https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=800&h=400',
    readTime: '4 min'
  }
];

export function BlogList() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h1 className="text-4xl font-bold mb-4 font-rubik">Blog</h1>
              <p className="text-xl text-gray-600">
                Inzichten en nieuws over AI en automatisering
              </p>
            </div>
            <div className="mt-6 md:mt-0 relative">
              <input
                type="text"
                placeholder="Zoeken..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 rounded-full bg-white border border-gray-200 hover:border-blue-500 hover:text-blue-600 transition-colors"
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <BlogCard key={index} {...post} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}