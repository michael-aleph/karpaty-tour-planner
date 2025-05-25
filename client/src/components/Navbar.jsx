import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import useTheme from '../contexts/useTheme';
import { Moon, Sun } from 'lucide-react';
import './Navbar.css';

function Navbar() {
  const { language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        🏕 {language === 'ua' ? 'Головна' : 'Home'}
      </Link>

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
