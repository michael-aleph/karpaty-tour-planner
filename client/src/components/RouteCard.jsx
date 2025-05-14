import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { getUkrainianDaysLabel, getEnglishDaysLabel } from '../utils/languageUtils';

function RouteCard({ route }) {
  const { language } = useLanguage();

  const name = language === 'ua' ? route.name_ua : route.name_en;
  const description = language === 'ua' ? route.description_ua : route.description_en;
  const unitCurrency = language === 'ua' ? 'грн' : 'uah';

  const getDaysLabel = (n) =>
    language === 'ua' ? getUkrainianDaysLabel(n) : getEnglishDaysLabel(n);

  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '1rem',
      marginBottom: '1rem',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }}>
      {route.image_url && (
        <img
          src={route.image_url}
          alt={name}
          style={{
            width: '100%',
            height: '180px',
            objectFit: 'cover',
            borderRadius: '6px',
            marginBottom: '0.5rem',
          }}
        />
      )}

      <h3 style={{ marginTop: 0 }}>
        <Link to={`/routes/${route.id}`} style={{ textDecoration: 'none', color: '#007B8F' }}>
          {name}
        </Link>
      </h3>

      <p style={{ marginBottom: '0.5rem' }}>{description}</p>

      <p style={{ fontSize: '0.9rem', color: '#555' }}>
        ⏱ {route.duration_days} {getDaysLabel(route.duration_days)} — 💰 {route.budget_min}–{route.budget_max} {unitCurrency}
      </p>

      {route.tags?.length > 0 && (
        <div style={{ marginTop: '0.5rem' }}>
          {route.tags.map((tag) => (
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
      )}
    </div>
  );
}

export default RouteCard;
