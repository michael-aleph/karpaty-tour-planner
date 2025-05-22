import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import './Navbar.css';

function Navbar() {
  const { language } = useLanguage();
  const { theme, toggleTheme } = useTheme();

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
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        🏕 {t.home[language]}
      </Link>

      <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </button>
    </nav>
  );
}

export default Navbar;
