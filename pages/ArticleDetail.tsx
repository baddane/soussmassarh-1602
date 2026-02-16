
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articlesService, Article } from '../services/articlesService';

const ArticleDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const load = async () => {
      try {
        setLoading(true);
        const data = await articlesService.getArticleBySlug(slug);
        if (data) {
          setArticle(data);
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-32 mb-8" />
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
        <div className="h-10 bg-gray-200 rounded w-3/4 mb-4" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />
        <div className="h-64 bg-gray-200 rounded-2xl mb-8" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-4/6" />
        </div>
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">📰</div>
        <h1 className="text-2xl font-black text-gray-900 mb-4">Article introuvable</h1>
        <p className="text-gray-500 mb-8">Cet article n'existe pas ou a été supprimé.</p>
        <Link
          to="/conseils"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
        >
          Retour aux articles
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link
        to="/conseils"
        className="text-blue-600 hover:text-blue-800 font-medium mb-8 flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Retour aux articles
      </Link>

      <article>
        <div className="mb-6">
          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {article.category}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 leading-tight">
          {article.title}
        </h1>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-200">
          <span className="font-medium">{article.author_name}</span>
          <span>
            {new Date(article.published_at).toLocaleDateString('fr-FR', {
              year: 'numeric', month: 'long', day: 'numeric'
            })}
          </span>
          <span>{article.read_time_minutes} min de lecture</span>
          <span>{article.views_count} vues</span>
        </div>

        {article.cover_image_url && (
          <img
            src={article.cover_image_url}
            alt={article.title}
            className="w-full h-64 md:h-96 object-cover rounded-2xl mb-8"
          />
        )}

        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
          {article.content}
        </div>

        {article.tags && article.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-gray-200">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Tags</p>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, i) => (
                <span key={i} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
};

export default ArticleDetail;
