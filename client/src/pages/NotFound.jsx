import { Link } from 'react-router-dom';
import useLanguage from '../hooks/useLanguage';

function NotFound() {
  const { language } = useLanguage();

  const t = {
    title: {
      ua: 'Сторінку не знайдено',
      en: 'Page not found',
    },
    back: {
      ua: 'Повернутись на головну',
      en: 'Back to home',
    },
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h2>404 — {t.title[language]}</h2>
      <p>
        <Link to="/">{t.back[language]}</Link>
      </p>
    </div>
  );
}

export default NotFound;
