import { Link, useLocation } from 'react-router-dom'; // додано useLocation
import useLanguage from '../hooks/useLanguage';
import useTheme from '../hooks/useTheme';
import { Moon, Sun } from 'lucide-react';
import './Navbar.css';
import logo from '../assets/logo.png';

function Navbar() {
  const { language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation(); // визначає активну вкладку

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link
          to="/"
          className={`navbar-logo ${location.pathname === '/' ? 'active' : ''}`}
        >
          <span className="navbar-logo-content">
            <img src={logo} alt="Karpaty Logo" className="navbar-logo-icon" />
            <span>{language === 'ua' ? 'Головна' : 'Home'}</span>
          </span>
        </Link>
        <Link
          to="/routes"
          className={`navbar-link ${location.pathname.startsWith('/routes') ? 'active' : ''}`}
        >
          {language === 'ua' ? 'Маршрути' : 'Routes'}
        </Link>
      </div>

      <div className="navbar-controls">
        <div className="lang-switch">
          <button
            onClick={language === 'ua' ? () => {} : toggleLanguage}
            className={`lang-option ${language === 'ua' ? 'active' : ''}`}
          >
            UA
          </button>
          <span className="lang-separator">|</span>
          <button
            onClick={language === 'en' ? () => {} : toggleLanguage}
            className={`lang-option ${language === 'en' ? 'active' : ''}`}
          >
            EN
          </button>
        </div>

        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          <Moon size={20} className={`theme-icon ${theme === 'light' ? 'visible' : 'hidden'}`} />
          <Sun size={20} className={`theme-icon ${theme === 'dark' ? 'visible' : 'hidden'}`} />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
