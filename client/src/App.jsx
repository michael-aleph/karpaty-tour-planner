import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import RouteDetails from './pages/RouteDetails';
import NotFound from './pages/NotFound';
import { useLanguage } from './contexts/LanguageContext';

function App() {
  const { language } = useLanguage();
  const t = {
    home: {
      ua: 'Головна',
      en: 'Home',
    },
    routes: {
      ua: 'Маршрути',
      en: 'Routes',
    },
  };
  return (
    <>
      <nav style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #ddd',
        padding: '1rem',
        marginBottom: '1rem',
      }}>
        <Link to="/" style={{ fontWeight: 'bold' }}>
          🏕 {t.home[language]}
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/routes/:id" element={<RouteDetails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
