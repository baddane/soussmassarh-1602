
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    // TODO: Remplacer par un vrai appel API quand le backend sera prêt
    setNewsletterStatus('success');
    setNewsletterEmail('');
    setTimeout(() => setNewsletterStatus('idle'), 4000);
  };

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="space-y-6">
          <Link to="/" className="flex items-center space-x-1">
            <span className="text-2xl font-bold text-white">SoussMassa</span>
            <span className="text-2xl font-light text-blue-400">-RH</span>
          </Link>
          <p className="text-sm leading-relaxed">
            SoussMassa-RH (soussmassa-rh.com) est le portail de référence pour l'emploi et le recrutement dans la région Souss-Massa, dédié aux talents locaux et aux entreprises dynamiques.
          </p>
          <div className="flex space-x-4">
            {['facebook', 'twitter', 'linkedin', 'instagram'].map(platform => (
              <a key={platform} href={`#${platform}`} className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <span className="sr-only">{platform}</span>
                <div className="w-5 h-5 bg-gray-400 mask-repeat-none" style={{ maskImage: `url(https://cdn.simpleicons.org/${platform}/ffffff)` }}></div>
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-white font-bold uppercase text-sm tracking-wider">Talents</h3>
          <ul className="space-y-3 text-sm">
            <li><Link to="/offres" className="hover:text-white transition-colors">Toutes les offres</Link></li>
            <li><Link to="/offres?city=Agadir" className="hover:text-white transition-colors">Emploi à Agadir</Link></li>
            <li><Link to="/offres?type=Stage" className="hover:text-white transition-colors">Trouver un stage</Link></li>
            <li><Link to="/conseils" className="hover:text-white transition-colors">Conseils Carrière</Link></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h3 className="text-white font-bold uppercase text-sm tracking-wider">Entreprises</h3>
          <ul className="space-y-3 text-sm">
            <li><a href="#publier" className="hover:text-white transition-colors">Publier une offre</a></li>
            <li><a href="#cvtheque" className="hover:text-white transition-colors">Accès CVthèque</a></li>
            <li><a href="#pricing" className="hover:text-white transition-colors">Solutions de Recrutement</a></li>
            <li><a href="#partenariat" className="hover:text-white transition-colors">Partenariats Écoles</a></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h3 className="text-white font-bold uppercase text-sm tracking-wider">Newsletter</h3>
          <p className="text-sm">Restez informé des meilleures opportunités dans le Souss-Massa.</p>
          <form onSubmit={handleNewsletter} className="flex">
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="votre@email.com"
              className="bg-gray-800 border-none rounded-l-md px-4 py-2 w-full text-sm focus:ring-1 focus:ring-blue-500"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition-colors">
              Ok
            </button>
          </form>
          {newsletterStatus === 'success' && (
            <p className="text-green-400 text-xs mt-2">Merci ! Vous recevrez nos meilleures offres.</p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-gray-800 text-center text-xs text-gray-500 space-y-4">
        <p>© {new Date().getFullYear()} soussmassa-rh.com. Tous droits réservés.</p>
        <div className="flex justify-center space-x-6">
          <a href="#mentions" className="hover:text-gray-300">Mentions légales</a>
          <a href="#cookies" className="hover:text-gray-300">Gestion des cookies</a>
          <a href="#contact" className="hover:text-gray-300">Contactez-nous</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;