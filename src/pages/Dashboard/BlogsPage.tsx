import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy,
  Filter,
  Calendar,
  Tag,
  MoreVertical,
  Loader2
} from 'lucide-react';
import { ProtectedRoute } from '../../components/Dashboard/ProtectedRoute';
import { DashboardLayout } from '../../components/Dashboard/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { supabase } from '../../lib/supabase/client';
import { BlogEditorDialog } from '../../components/Dashboard/BlogEditorDialog';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: any;
  featured_image_url: string | null;
  status: 'draft' | 'published';
  categories: string[];
  reading_time: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface Stats {
  total: number;
  published: number;
  drafts: number;
  categories: number;
}

function BlogsContent() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, published: 0, drafts: 0, categories: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [allCategories, setAllCategories] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      fetchPosts();
      fetchCategories();
    }
  }, [user]);

  useEffect(() => {
    filterAndSortPosts();
  }, [posts, searchTerm, statusFilter, categoryFilter, sortBy]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPosts(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      showToast('Fout bij laden van berichten', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('name')
        .eq('user_id', user?.id);

      if (error) throw error;

      const uniqueCategories = Array.from(new Set(data?.map(c => c.name) || []));
      setAllCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const calculateStats = (postsData: BlogPost[]) => {
    const published = postsData.filter(p => p.status === 'published').length;
    const drafts = postsData.filter(p => p.status === 'draft').length;
    const categories = new Set(postsData.flatMap(p => p.categories)).size;

    setStats({
      total: postsData.length,
      published,
      drafts,
      categories
    });
  };

  const filterAndSortPosts = () => {
    let filtered = [...posts];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(search) ||
        post.excerpt?.toLowerCase().includes(search)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(post => post.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(post => post.categories.includes(categoryFilter));
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredPosts(filtered);
  };

  const handleCreatePost = () => {
    setEditingPost(null);
    setIsEditorOpen(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setIsEditorOpen(true);
  };

  const handleDuplicatePost = async (post: BlogPost) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([{
          user_id: user?.id,
          title: `${post.title} (Copy)`,
          slug: `${post.slug}-copy-${Date.now()}`,
          excerpt: post.excerpt,
          content: post.content,
          featured_image_url: post.featured_image_url,
          status: 'draft',
          categories: post.categories,
          reading_time: post.reading_time,
        }])
        .select()
        .single();

      if (error) throw error;

      showToast('Bericht gedupliceerd', 'success');
      fetchPosts();
    } catch (error) {
      console.error('Error duplicating post:', error);
      showToast('Fout bij dupliceren', 'error');
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Weet je zeker dat je dit bericht wilt verwijderen?')) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      showToast('Bericht verwijderd', 'success');
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      showToast('Fout bij verwijderen', 'error');
    }
  };

  const handleSavePost = () => {
    setIsEditorOpen(false);
    fetchPosts();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-tielo-orange" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="td-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-tielo-navy/50 mb-1">Totaal</p>
                <p className="text-3xl font-bold font-rubik text-tielo-navy">{stats.total}</p>
              </div>
              <div className="p-2.5 bg-tielo-orange/10 rounded-td">
                <FileText className="h-5 w-5 text-tielo-orange" />
              </div>
            </div>
          </Card>

          <Card className="td-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-tielo-navy/50 mb-1">Gepubliceerd</p>
                <p className="text-3xl font-bold font-rubik text-tielo-navy">{stats.published}</p>
              </div>
              <div className="p-2.5 bg-green-100 rounded-td">
                <Eye className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="td-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-tielo-navy/50 mb-1">Concepten</p>
                <p className="text-3xl font-bold font-rubik text-tielo-navy">{stats.drafts}</p>
              </div>
              <div className="p-2.5 bg-amber-100 rounded-td">
                <Edit className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </Card>

          <Card className="td-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-tielo-navy/50 mb-1">Categorieën</p>
                <p className="text-3xl font-bold font-rubik text-tielo-navy">{stats.categories}</p>
              </div>
              <div className="p-2.5 bg-tielo-navy/10 rounded-td">
                <Tag className="h-5 w-5 text-tielo-navy" />
              </div>
            </div>
          </Card>
        </div>

        <Card className="td-card p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Zoek berichten..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full md:w-40"
            >
              <option value="all">Alle statussen</option>
              <option value="published">Gepubliceerd</option>
              <option value="draft">Concept</option>
            </Select>

            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full md:w-40"
            >
              <option value="all">Alle categorieën</option>
              {allCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Select>

            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full md:w-40"
            >
              <option value="newest">Nieuwste eerst</option>
              <option value="oldest">Oudste eerst</option>
              <option value="title">Op titel</option>
            </Select>

            <Button
              onClick={handleCreatePost}
              className="whitespace-nowrap"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nieuw bericht
            </Button>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Geen berichten gevonden
              </h3>
              <p className="text-gray-600 mb-4">
                Maak je eerste blogpost om te beginnen
              </p>
              <Button onClick={handleCreatePost}>
                <Plus className="h-4 w-4 mr-2" />
                Nieuw bericht
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group"
                >
                  <Card className="td-card overflow-hidden hover:shadow-lg transition-shadow">
                    {post.featured_image_url && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={post.featured_image_url}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          post.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {post.status === 'published' ? 'Gepubliceerd' : 'Concept'}
                        </span>
                        {post.categories.length > 0 && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                            {post.categories[0]}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold font-rubik text-tielo-navy text-base mb-2 line-clamp-2">
                        {post.title}
                      </h3>

                      {post.excerpt && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.created_at).toLocaleDateString('nl-NL')}
                        </span>
                        <span>{post.reading_time} min</span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditPost(post)}
                          className="flex-1"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Bewerken
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDuplicatePost(post)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePost(post.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {isEditorOpen && (
        <BlogEditorDialog
          post={editingPost}
          onClose={() => setIsEditorOpen(false)}
          onSave={handleSavePost}
        />
      )}
    </>
  );
}

export function BlogsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout currentPage="blogs">
        <BlogsContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
