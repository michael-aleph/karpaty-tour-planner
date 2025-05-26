import { Link } from 'react-router-dom';
import useLanguage from '../hooks/useLanguage';
import './Footer.css';

function Footer() {
  const { language } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-left">
          <h4>{language === 'ua' ? 'Про проєкт' : 'About the project'}</h4>
          <p className="footer-author">
            {language === 'ua'
              ? <>Виконавець проєкту: <strong>Момотюк Михайло</strong></>
              : <>Project author: <strong>Mykhailo Momotiuk</strong></>}
          </p>
        </div>

        <div className="footer-links">
          <h4>{language === 'ua' ? 'Навігація' : 'Navigation'}</h4>
          <ul>
            <li>
              <Link to="/">{language === 'ua' ? 'Головна' : 'Home'}</Link>
            </li>
            <li>
              <Link to="/routes">{language === 'ua' ? 'Маршрути' : 'Routes'}</Link>
            </li>
          </ul>
        </div>

        <div className="footer-contacts">
          <h4>{language === 'ua' ? 'Контакти' : 'Contacts'}</h4>
          <p>Email: <a href="mailto:michaelpost1984@gmail.com">michaelpost1984@gmail.com</a></p>
          <p>{language === 'ua' ? 'Телефон' : 'Phone'}: <a href="tel:+380501234567">+380501234567</a></p>
          <p>
            GitHub: <a href="https://github.com/michael-aleph/karpaty-tour-planner" target="_blank" rel="noopener noreferrer">
              karpaty-tour-planner
            </a>
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Karpaty Tour Planner. {language === 'ua'
          ? 'Усі права захищені.'
          : 'All rights reserved.'}
      </div>
    </footer>
  );
}

export default Footer;
