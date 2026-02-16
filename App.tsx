
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
    </Routes>
  );
};

const App: React.FC = () => {
  return (
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
  );
};

export default App;
