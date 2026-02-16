-- Migration: Ajouter les tables companies, schools, articles
-- Pour alimenter les pages Entreprises, Écoles et Conseils Carrière

-- ============================================================
-- TABLE: companies (Entreprises qui recrutent dans le Souss-Massa)
-- ============================================================
CREATE TABLE IF NOT EXISTS companies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE,
  logo_url TEXT,
  cover_image_url TEXT,
  sector VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  address TEXT,
  description TEXT,
  website_url TEXT,
  phone VARCHAR(30),
  email VARCHAR(255),
  company_size VARCHAR(50), -- 'TPE (1-10)', 'PME (11-50)', 'ETI (51-250)', 'Grande (250+)'
  founded_year INTEGER,
  linkedin_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  active_offers_count INTEGER DEFAULT 0,
  total_hires INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour la recherche et les filtres
CREATE INDEX IF NOT EXISTS idx_companies_city ON companies(city);
CREATE INDEX IF NOT EXISTS idx_companies_sector ON companies(sector);
CREATE INDEX IF NOT EXISTS idx_companies_is_active ON companies(is_active);
CREATE INDEX IF NOT EXISTS idx_companies_slug ON companies(slug);

-- Trigger updated_at
DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active companies" ON companies;
CREATE POLICY "Public can read active companies" ON companies
FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admin can manage companies" ON companies;
CREATE POLICY "Admin can manage companies" ON companies
FOR ALL TO service_role USING (true);

-- ============================================================
-- TABLE: schools (Écoles et universités partenaires)
-- ============================================================
CREATE TABLE IF NOT EXISTS schools (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE,
  logo_url TEXT,
  cover_image_url TEXT,
  type VARCHAR(100) NOT NULL, -- 'Université', 'École d''ingénieur', 'École de commerce', 'Institut', 'Centre de formation'
  city VARCHAR(100) NOT NULL,
  address TEXT,
  description TEXT,
  website_url TEXT,
  phone VARCHAR(30),
  email VARCHAR(255),
  programs TEXT[], -- Liste des filières: ['Informatique', 'Marketing', 'Finance']
  student_count INTEGER,
  is_partner BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_schools_city ON schools(city);
CREATE INDEX IF NOT EXISTS idx_schools_type ON schools(type);
CREATE INDEX IF NOT EXISTS idx_schools_is_partner ON schools(is_partner);
CREATE INDEX IF NOT EXISTS idx_schools_slug ON schools(slug);

-- Trigger updated_at
DROP TRIGGER IF EXISTS update_schools_updated_at ON schools;
CREATE TRIGGER update_schools_updated_at
    BEFORE UPDATE ON schools
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active schools" ON schools;
CREATE POLICY "Public can read active schools" ON schools
FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admin can manage schools" ON schools;
CREATE POLICY "Admin can manage schools" ON schools
FOR ALL TO service_role USING (true);

-- ============================================================
-- TABLE: articles (Conseils carrière et actualités)
-- ============================================================
CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(300) NOT NULL,
  slug VARCHAR(300) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  category VARCHAR(100) NOT NULL, -- 'Conseils CV', 'Entretien', 'Marché emploi', 'Formation', 'Droit du travail'
  tags TEXT[],
  author_name VARCHAR(200) DEFAULT 'SoussMassa-RH',
  author_avatar_url TEXT,
  read_time_minutes INTEGER DEFAULT 5,
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  views_count INTEGER DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_is_published ON articles(is_published);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_is_featured ON articles(is_featured);

-- Trigger updated_at
DROP TRIGGER IF EXISTS update_articles_updated_at ON articles;
CREATE TRIGGER update_articles_updated_at
    BEFORE UPDATE ON articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published articles" ON articles;
CREATE POLICY "Public can read published articles" ON articles
FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Admin can manage articles" ON articles;
CREATE POLICY "Admin can manage articles" ON articles
FOR ALL TO service_role USING (true);

-- ============================================================
-- DONNÉES DE TEST (Seed data)
-- ============================================================

-- Entreprises
INSERT INTO companies (name, slug, sector, city, description, company_size, founded_year, is_verified, active_offers_count, website_url) VALUES
('Tech Solutions Maroc', 'tech-solutions-maroc', 'Informatique', 'Agadir', 'Entreprise spécialisée dans le développement web et mobile, au service des entreprises du Souss-Massa depuis 2015.', 'PME (11-50)', 2015, true, 3, 'https://techsolutions.ma'),
('Supermarché Atlas', 'supermarche-atlas', 'Commerce & Distribution', 'Marrakech', 'Chaîne de supermarchés régionale avec plus de 15 points de vente dans le Souss-Massa.', 'ETI (51-250)', 2008, true, 5, NULL),
('Clinique Al Amal', 'clinique-al-amal', 'Santé', 'Essaouira', 'Clinique privée multidisciplinaire offrant des soins de qualité depuis 2010.', 'PME (11-50)', 2010, true, 2, NULL),
('Agence Digitale Souss', 'agence-digitale-souss', 'Marketing & Communication', 'Agadir', 'Agence de marketing digital spécialisée en SEO, réseaux sociaux et création de contenu pour les entreprises locales.', 'TPE (1-10)', 2019, false, 1, 'https://digitalsouss.ma'),
('Industrie Souss', 'industrie-souss', 'Industrie & Production', 'Taroudant', 'Groupe industriel spécialisé dans la transformation agroalimentaire et l''export.', 'Grande (250+)', 1995, true, 4, NULL),
('Startup Innov', 'startup-innov', 'Informatique', 'Inezgane', 'Incubateur et startup studio focalisé sur l''innovation technologique au Maroc.', 'TPE (1-10)', 2021, false, 2, 'https://startupinnov.ma'),
('Hôtel Sofitel Agadir', 'hotel-sofitel-agadir', 'Hôtellerie & Tourisme', 'Agadir', 'Hôtel 5 étoiles situé sur la baie d''Agadir, offrant une expérience luxueuse.', 'ETI (51-250)', 2005, true, 6, NULL),
('Cabinet Juridique Souss', 'cabinet-juridique-souss', 'Juridique & Conseil', 'Agadir', 'Cabinet d''avocats et de conseil juridique spécialisé en droit des affaires et droit du travail.', 'TPE (1-10)', 2012, true, 1, NULL),
('AgriSouss Export', 'agrisouss-export', 'Agriculture & Agroalimentaire', 'Taroudant', 'Leader régional de l''export d''agrumes et de légumes vers l''Europe et le Moyen-Orient.', 'Grande (250+)', 1988, true, 3, NULL),
('Banque Régionale du Souss', 'banque-regionale-souss', 'Banque & Finance', 'Agadir', 'Institution financière dédiée au développement économique de la région Souss-Massa.', 'Grande (250+)', 2001, true, 7, NULL);

-- Écoles
INSERT INTO schools (name, slug, type, city, description, programs, student_count, is_partner, website_url) VALUES
('Université Ibn Zohr', 'universite-ibn-zohr', 'Université', 'Agadir', 'La principale université publique de la région Souss-Massa, avec plus de 100 000 étudiants répartis sur plusieurs campus.', ARRAY['Informatique', 'Droit', 'Économie', 'Sciences', 'Lettres', 'Médecine'], 100000, true, 'https://www.uiz.ac.ma'),
('ENSA Agadir', 'ensa-agadir', 'École d''ingénieur', 'Agadir', 'École Nationale des Sciences Appliquées d''Agadir, formant des ingénieurs d''état dans divers domaines techniques.', ARRAY['Génie Informatique', 'Génie Industriel', 'Génie Civil', 'Génie Électrique'], 2500, true, 'https://www.ensa-agadir.ac.ma'),
('ENCG Agadir', 'encg-agadir', 'École de commerce', 'Agadir', 'École Nationale de Commerce et de Gestion d''Agadir, référence en management et gestion dans le Sud du Maroc.', ARRAY['Marketing', 'Finance', 'Management', 'Commerce International', 'Audit'], 3000, true, NULL),
('EST Agadir', 'est-agadir', 'Institut', 'Agadir', 'École Supérieure de Technologie d''Agadir, formant des techniciens supérieurs spécialisés.', ARRAY['Informatique', 'Génie Électrique', 'Techniques de Management'], 1500, true, NULL),
('OFPPT Agadir', 'ofppt-agadir', 'Centre de formation', 'Agadir', 'Centre de formation professionnelle offrant des diplômes de technicien et technicien spécialisé dans divers secteurs.', ARRAY['Développement Digital', 'Comptabilité', 'Commerce', 'Hôtellerie', 'Électricité'], 5000, true, 'https://www.ofppt.ma'),
('Sup de Co Marrakech', 'supco-marrakech', 'École de commerce', 'Marrakech', 'Grande école de commerce privée avec campus à Marrakech, reconnue pour ses programmes en alternance.', ARRAY['Marketing Digital', 'Finance', 'Entrepreneuriat', 'Ressources Humaines'], 1200, false, NULL),
('ISTA NTIC Agadir', 'ista-ntic-agadir', 'Centre de formation', 'Agadir', 'Institut spécialisé dans les nouvelles technologies de l''information et de la communication.', ARRAY['Développement Web', 'Réseaux', 'Bases de données', 'Cybersécurité'], 800, true, NULL),
('Faculté des Sciences Agadir', 'fac-sciences-agadir', 'Université', 'Agadir', 'Faculté des Sciences de l''Université Ibn Zohr, offrant des formations en licence, master et doctorat.', ARRAY['Mathématiques', 'Physique', 'Chimie', 'Biologie', 'Informatique'], 8000, true, NULL);

-- Articles
INSERT INTO articles (title, slug, excerpt, content, category, tags, author_name, read_time_minutes, is_published, is_featured, views_count, published_at) VALUES
(
  'Comment réussir son premier entretien d''embauche au Maroc ?',
  'reussir-premier-entretien-embauche-maroc',
  'Les 10 conseils essentiels pour faire bonne impression lors de votre premier entretien avec un recruteur marocain.',
  E'## Préparez-vous en amont\n\nAvant l''entretien, renseignez-vous sur l''entreprise : son secteur d''activité, ses valeurs, ses projets récents. Au Maroc, les recruteurs apprécient particulièrement les candidats qui montrent un intérêt sincère pour l''entreprise.\n\n## Soignez votre présentation\n\nLa première impression compte énormément. Optez pour une tenue professionnelle adaptée au secteur. Dans le Souss-Massa, même les startups tech apprécient une présentation soignée.\n\n## Préparez vos réponses\n\nAnticipez les questions classiques :\n- Parlez-moi de vous\n- Pourquoi notre entreprise ?\n- Quels sont vos points forts / axes d''amélioration ?\n- Où vous voyez-vous dans 5 ans ?\n\n## Mettez en avant vos compétences régionales\n\nSi vous postulez dans le Souss-Massa, valorisez votre connaissance du tissu économique local : tourisme, agriculture, pêche, nouvelles technologies.\n\n## Posez des questions pertinentes\n\nÀ la fin de l''entretien, posez des questions sur le poste, l''équipe, les perspectives d''évolution. Cela montre votre motivation.\n\n## Le suivi post-entretien\n\nEnvoyez un email de remerciement dans les 24h suivant l''entretien. C''est un geste simple mais qui fait la différence.',
  'Entretien',
  ARRAY['entretien', 'premier emploi', 'conseils', 'recrutement maroc'],
  'Équipe SoussMassa-RH',
  8,
  true, true, 1245,
  NOW() - INTERVAL '3 days'
),
(
  'Le guide du CV parfait pour le marché marocain en 2025',
  'guide-cv-parfait-maroc-2025',
  'Apprenez à structurer votre CV pour passer les filtres ATS et attirer l''attention des recruteurs au Maroc.',
  E'## La structure idéale d''un CV marocain\n\nUn CV au Maroc doit être clair, concis et ne pas dépasser 2 pages. Voici la structure recommandée :\n\n1. **Informations personnelles** : Nom, prénom, téléphone, email, ville\n2. **Titre / Objectif professionnel** : Un résumé en 2 lignes de votre profil\n3. **Expériences professionnelles** : De la plus récente à la plus ancienne\n4. **Formation** : Diplômes et certifications\n5. **Compétences** : Techniques et linguistiques\n\n## Les erreurs à éviter\n\n- Ne pas mettre de photo (sauf si demandé)\n- Éviter les fautes d''orthographe en français ET en arabe\n- Ne pas lister toutes vos expériences : ciblez celles pertinentes pour le poste\n- Éviter les adresses email non professionnelles\n\n## Adapter son CV au Souss-Massa\n\nMentionnez vos compétences linguistiques (amazigh, arabe, français, anglais), votre mobilité géographique, et vos connaissances des secteurs clés de la région.\n\n## L''importance des mots-clés\n\nDe plus en plus d''entreprises marocaines utilisent des systèmes ATS. Incluez les mots-clés du poste visé dans votre CV.',
  'Conseils CV',
  ARRAY['cv', 'candidature', 'conseils', 'ats', 'maroc'],
  'Équipe SoussMassa-RH',
  6,
  true, true, 2103,
  NOW() - INTERVAL '7 days'
),
(
  'Les secteurs qui recrutent le plus dans le Souss-Massa en 2025',
  'secteurs-recrutent-souss-massa-2025',
  'Découvrez les secteurs d''activité les plus dynamiques en termes de recrutement dans la région Souss-Massa.',
  E'## Le tourisme et l''hôtellerie\n\nAvec Agadir comme hub touristique majeur, le secteur de l''hôtellerie reste le premier employeur de la région. Les postes les plus demandés : réceptionnistes, chefs cuisiniers, managers d''hôtels, guides touristiques.\n\n## L''agriculture et l''agroalimentaire\n\nLe Souss-Massa est le grenier du Maroc. La zone de Taroudant et la vallée du Souss emploient des milliers de personnes dans l''agriculture moderne, l''export d''agrumes et de légumes.\n\n## Les technologies de l''information\n\nAgadir se positionne comme un hub tech émergent. De nombreuses startups et ESN s''installent dans la région, créant une demande forte pour les développeurs, data analysts et spécialistes en cybersécurité.\n\n## La pêche et l''industrie maritime\n\nAvec le port d''Agadir, l''industrie de la pêche et de la conserve emploie un nombre significatif de travailleurs.\n\n## Le BTP et l''immobilier\n\nLes grands projets d''infrastructure dans la région (nouvelle gare, extension du port) génèrent de nombreuses opportunités dans le BTP.',
  'Marché emploi',
  ARRAY['marché emploi', 'souss-massa', 'agadir', 'secteurs', 'recrutement'],
  'Équipe SoussMassa-RH',
  7,
  true, false, 876,
  NOW() - INTERVAL '14 days'
),
(
  'Droits et obligations du stagiaire au Maroc : tout savoir',
  'droits-obligations-stagiaire-maroc',
  'Le cadre légal du stage au Maroc : durée, indemnités, assurance et obligations pour les stagiaires et les entreprises.',
  E'## Le cadre juridique du stage\n\nAu Maroc, le stage est encadré par la loi 16-93 relative à la formation professionnelle. Voici les points essentiels à connaître.\n\n## Durée du stage\n\n- Stage d''observation : 1 à 4 semaines\n- Stage d''application : 1 à 6 mois\n- Stage de fin d''études : 2 à 6 mois\n- La durée totale ne peut excéder 12 mois dans la même entreprise\n\n## L''indemnité de stage\n\nL''indemnité n''est pas obligatoire pour les stages de moins de 3 mois. Au-delà, une gratification est recommandée. Dans le Souss-Massa, les indemnités varient généralement entre 1 500 et 3 000 MAD par mois.\n\n## La convention de stage\n\nElle est obligatoire et doit être signée par trois parties : le stagiaire, l''entreprise d''accueil et l''établissement de formation.\n\n## Assurance\n\nL''entreprise est tenue de souscrire une assurance accident de travail pour ses stagiaires.\n\n## Vos droits en tant que stagiaire\n\n- Être encadré par un tuteur\n- Recevoir des missions en lien avec votre formation\n- Ne pas remplacer un salarié permanent\n- Bénéficier des mêmes conditions d''hygiène et sécurité que les salariés',
  'Droit du travail',
  ARRAY['stage', 'droits', 'loi', 'maroc', 'convention stage'],
  'Équipe SoussMassa-RH',
  10,
  true, false, 654,
  NOW() - INTERVAL '21 days'
),
(
  '5 formations en ligne gratuites pour booster votre carrière',
  'formations-en-ligne-gratuites-carriere',
  'Sélection de 5 plateformes de formation gratuite accessibles depuis le Maroc pour développer vos compétences.',
  E'## 1. Coursera (avec aide financière)\n\nCoursera propose des milliers de cours des meilleures universités mondiales. Les étudiants marocains peuvent demander une aide financière pour accéder gratuitement aux certifications.\n\n## 2. OpenClassrooms\n\nPlateforme francophone idéale pour les Marocains. Des parcours complets en développement web, data, marketing digital. Certains parcours sont gratuits.\n\n## 3. Google Digital Garage\n\nFormation gratuite de Google sur le marketing digital, avec certification reconnue. Parfait pour les débutants.\n\n## 4. FreeCodeCamp\n\nPour les développeurs, FreeCodeCamp offre un parcours complet et gratuit : HTML, CSS, JavaScript, React, Node.js, bases de données.\n\n## 5. LinkedIn Learning (via université)\n\nDe nombreuses universités marocaines offrent un accès gratuit à LinkedIn Learning. Renseignez-vous auprès de votre établissement.\n\n## Conseil bonus\n\nSur SoussMassa-RH, les recruteurs valorisent de plus en plus les certifications en ligne. N''hésitez pas à les ajouter à votre profil !',
  'Formation',
  ARRAY['formation', 'en ligne', 'gratuit', 'compétences', 'carrière'],
  'Équipe SoussMassa-RH',
  5,
  true, false, 432,
  NOW() - INTERVAL '30 days'
);
