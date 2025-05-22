import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { getUkrainianDaysLabel, getEnglishDaysLabel } from '../utils/languageUtils';
import './RouteCard.css';

function RouteCard({ route }) {
  const { language } = useLanguage();

  const name = language === 'ua' ? route.name_ua : route.name_en;
  const description = language === 'ua' ? route.description_ua : route.description_en;
  const unitCurrency = language === 'ua' ? 'грн' : 'uah';

  const getDaysLabel = (n) =>
    language === 'ua' ? getUkrainianDaysLabel(n) : getEnglishDaysLabel(n);

  return (
    <div className="route-card">
      {route.image_url && (
        <img
          src={route.image_url}
          alt={name}
          className="route-card-image"
        />
      )}

      <h3 className="route-card-title">
        <Link to={`/routes/${route.id}`} className="route-card-link">
          {name}
        </Link>
      </h3>

      <p className="route-card-description">{description}</p>

      <p className="route-card-meta">
        ⏱ {route.duration_days} {getDaysLabel(route.duration_days)} — 💰 {route.budget_min}–{route.budget_max} {unitCurrency}
      </p>

      {route.tags?.length > 0 && (
        <div className="route-card-tags">
          {route.tags.map((tag) => (
            <span className="route-tag" key={tag.id}>
              {language === 'ua' ? tag.name_ua : tag.name_en}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default RouteCard;
