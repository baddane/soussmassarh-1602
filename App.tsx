
import React, { Component, ErrorInfo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Offers from './pages/Offers';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfileSetup from './pages/ProfileSetup';
import Dashboard from './pages/Dashboard';
import CareerAssistant from './components/CareerAssistant';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Page 404
const NotFound: React.FC = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
    <h1 className="text-6xl font-black text-gray-200 mb-4">404</h1>
    <h2 className="text-2xl font-bold text-gray-900 mb-2">Page introuvable</h2>
    <p className="text-gray-500 mb-8 max-w-md">
      La page que vous recherchez n'existe pas ou a été déplacée.
    </p>
    <div className="flex gap-4">
      <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors">
        Retour à l'accueil
      </Link>
      <Link to="/offres" className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors">
        Voir les offres
      </Link>
    </div>
  </div>
);

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/connexion" />;
  // On ne redirige plus vers finaliser-profil s'il est déjà complet (ce qui est le cas après Register)
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/offres" element={<Offers />} />
      <Route path="/connexion" element={<Login />} />
      <Route path="/inscription" element={<Register />} />
      
      {/* Routes protégées */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      {/* Profil détaillé et édition */}
      <Route path="/profil" element={
        <ProtectedRoute>
          <ProfileSetup />
        </ProtectedRoute>
      } />
      
      {/* Fallbacks pour les pages en construction */}
      <Route path="/entreprises" element={<div className="p-12 text-center text-gray-500 min-h-[50vh] flex items-center justify-center">Liste des entreprises en cours de chargement...</div>} />
      <Route path="/ecoles" element={<div className="p-12 text-center text-gray-500 min-h-[50vh] flex items-center justify-center">Liste des écoles partenaires...</div>} />
      <Route path="/conseils" element={<div className="p-12 text-center text-gray-500 min-h-[50vh] flex items-center justify-center">Nos articles et conseils carrière...</div>} />
      
      {/* Legacy / redirection fallback */}
      <Route path="/finaliser-profil" element={<Navigate to="/dashboard" replace />} />

      {/* 404 catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// Error Boundary pour capturer les erreurs React runtime
class ErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('React Error Boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="text-center max-w-md">
            <h1 className="text-4xl font-black text-gray-200 mb-4">Oops</h1>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Une erreur est survenue</h2>
            <p className="text-gray-500 mb-6">
              L'application a rencontré un problème inattendu. Veuillez rafraîchir la page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
            >
              Rafraîchir la page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const App: React.FC = () => {
  return (
    <ErrorBoundary>
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header />
          <main className="flex-grow">
            <AppRoutes />
          </main>
          <Footer />
          <CareerAssistant />
        </div>
      </Router>
    </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
