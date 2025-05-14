import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import { getUkrainianDaysLabel, getEnglishDaysLabel } from '../utils/languageUtils';

function RouteDetails() {
  const { id } = useParams();
  const { language } = useLanguage();
  const [route, setRoute] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/routes/${id}`)
      .then((res) => setRoute(res.data))
      .catch((err) => {
        if (err.response?.status === 404) setNotFound(true);
        else console.error('Помилка при завантаженні маршруту:', err);
      });
  }, [id]);

  if (notFound) {
    return (
      <div className="container">
        <h2>404 — {language === 'ua' ? 'Маршрут не знайдено' : 'Route not found'}</h2>
        <Link to="/">{language === 'ua' ? 'Повернутись на головну' : 'Back to home'}</Link>
      </div>
    );
  }

  if (!route) {
    return <div className="container">{language === 'ua' ? 'Завантаження...' : 'Loading...'}</div>;
  }

  const getDaysLabel = (n) =>
    language === 'ua' ? getUkrainianDaysLabel(n) : getEnglishDaysLabel(n);
  const unitCurrency = language === 'ua' ? 'грн' : 'uah';

  return (
    <div className="container">
      {route.image_url && (
        <img
          src={route.image_url}
          alt={route.name_ua}
          style={{
            width: '100%',
            height: '300px',
            objectFit: 'cover',
            borderRadius: '8px',
            marginBottom: '1rem',
          }}
        />
      )}

      <h2 style={{ marginBottom: '0.5rem' }}>
        {language === 'ua' ? route.name_ua : route.name_en}
      </h2>

      <p style={{ fontSize: '0.95rem', marginBottom: '1rem' }}>
        {language === 'ua' ? route.description_ua : route.description_en}
      </p>

      <p style={{ fontSize: '0.9rem', color: '#555' }}>
        ⏱ {route.duration_days} {getDaysLabel(route.duration_days)} — 💰 {route.budget_min}–{route.budget_max} {unitCurrency}
      </p>

      {route.tags?.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <strong>{language === 'ua' ? 'Теги:' : 'Tags:'}</strong>
          <div style={{ marginTop: '0.5rem' }}>
            {route.tags.map(tag => (
              <span key={tag.id} style={{
                display: 'inline-block',
                padding: '0.2rem 0.6rem',
                marginRight: '0.5rem',
                fontSize: '0.75rem',
                backgroundColor: '#e0f0f3',
                color: '#007B8F',
                borderRadius: '999px',
              }}>
                {language === 'ua' ? tag.name_ua : tag.name_en}
              </span>
            ))}
          </div>
        </div>
      )}

      {route.places?.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <strong>{language === 'ua' ? 'Місця маршруту:' : 'Route places:'}</strong>
          <ol style={{ marginTop: '0.5rem', paddingLeft: '1.2rem' }}>
            {route.places.map(place => (
              <li key={place.id} style={{ marginBottom: '0.4rem' }}>
                {language === 'ua' ? place.name_ua : place.name_en}
              </li>
            ))}
          </ol>
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <Link to="/">
          <button>{language === 'ua' ? '← Назад' : '← Back'}</button>
        </Link>
      </div>
    </div>
  );
}

export default RouteDetails;

