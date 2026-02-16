
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const plans = [
  {
    name: 'Starter',
    price: 'Gratuit',
    period: '',
    description: 'Idéal pour débuter votre recrutement dans le Souss-Massa.',
    features: [
      '1 offre d\'emploi active',
      'Visibilité standard',
      'Réception des candidatures par email',
      'Tableau de bord basique',
    ],
    cta: 'Commencer gratuitement',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '499',
    period: 'MAD/mois',
    description: 'Pour les entreprises qui recrutent régulièrement.',
    features: [
      '10 offres d\'emploi actives',
      'Mise en avant dans les résultats',
      'Accès à la CVthèque',
      'Statistiques détaillées',
      'Badge entreprise vérifiée',
      'Support prioritaire',
    ],
    cta: 'Passer en Pro',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: '1 499',
    period: 'MAD/mois',
    description: 'Solution complète pour les grands recruteurs.',
    features: [
      'Offres illimitées',
      'Position premium en tête de liste',
      'Accès complet à la CVthèque + filtres avancés',
      'Tableau de bord analytique avancé',
      'Marque employeur personnalisée',
      'Account manager dédié',
      'API d\'intégration',
    ],
    cta: 'Contacter l\'équipe',
    highlighted: false,
  },
];

const Pricing: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black text-gray-900 mb-4">
          Des tarifs adaptés à vos besoins
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Trouvez les meilleurs talents du Souss-Massa avec le plan qui correspond à votre entreprise.
        </p>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl p-8 flex flex-col ${
              plan.highlighted
                ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-200 scale-105'
                : 'bg-white border border-gray-200 shadow-sm'
            }`}
          >
            <h3 className={`text-lg font-black uppercase tracking-wider mb-2 ${
              plan.highlighted ? 'text-blue-100' : 'text-gray-500'
            }`}>
              {plan.name}
            </h3>

            <div className="mb-4">
              <span className="text-4xl font-black">{plan.price}</span>
              {plan.period && (
                <span className={`text-sm ml-1 ${plan.highlighted ? 'text-blue-200' : 'text-gray-400'}`}>
                  {plan.period}
                </span>
              )}
            </div>

            <p className={`text-sm mb-6 ${plan.highlighted ? 'text-blue-100' : 'text-gray-500'}`}>
              {plan.description}
            </p>

            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <svg className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.highlighted ? 'text-blue-200' : 'text-green-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              to={isAuthenticated ? '/dashboard' : '/inscription'}
              className={`text-center py-3 px-6 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${
                plan.highlighted
                  ? 'bg-white text-blue-600 hover:bg-blue-50'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-black text-gray-900 text-center mb-8">Questions fréquentes</h2>
        <div className="space-y-4">
          {[
            {
              q: 'Puis-je changer de plan à tout moment ?',
              a: 'Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. La différence sera calculée au prorata.'
            },
            {
              q: 'Y a-t-il un engagement minimum ?',
              a: 'Non, tous nos plans sont sans engagement. Vous pouvez annuler à tout moment.'
            },
            {
              q: 'Comment fonctionne le paiement ?',
              a: 'Nous acceptons les cartes bancaires et les virements. La facturation est mensuelle.'
            },
          ].map(({ q, a }, i) => (
            <details key={i} className="bg-white border border-gray-200 rounded-xl p-6 group">
              <summary className="font-bold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                {q}
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="text-gray-500 mt-3 text-sm">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
