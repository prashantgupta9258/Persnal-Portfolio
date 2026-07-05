/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import Admin from './pages/Admin';
import ScrollToTop from './components/layout/ScrollToTop';
import LoadingScreen from './components/layout/LoadingScreen';
import CustomCursor from './components/layout/CustomCursor';
import ScrollProgress from './components/layout/ScrollProgress';
import { LanguageProvider } from './lib/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <HelmetProvider>
        <Helmet>
          <title>Prashant Gupta | Creative Developer</title>
          <meta name="description" content="A premium portfolio showcasing creative development, UI/UX design, and full-stack engineering." />
          <meta property="og:title" content="Prashant Gupta | Creative Developer" />
          <meta property="og:description" content="A premium portfolio showcasing creative development, UI/UX design, and full-stack engineering." />
          <meta property="og:type" content="website" />
        </Helmet>
        <Router>
          <LoadingScreen />
          <ScrollProgress />
          <CustomCursor />
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Router>
      </HelmetProvider>
    </LanguageProvider>
  );
}
