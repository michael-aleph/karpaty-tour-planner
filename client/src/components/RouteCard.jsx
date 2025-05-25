import { Link } from 'react-router-dom';
import useLanguage from '../hooks/useLanguage';
import { getUkrainianHoursLabel, getEnglishHoursLabel } from '../utils/languageUtils';
import './RouteCard.css';

function RouteCard({ route }) {
  const { language } = useLanguage();

  const name = language === 'ua' ? route.name_ua : route.name_en;
  const description = language === 'ua' ? route.description_ua : route.description_en;

  const getHourLabel = (n) =>
    language === 'ua' ? `${n} ${getUkrainianHoursLabel(n)}` : `${n} ${getEnglishHoursLabel(n)}`;

  const getDifficultyLabel = (level) => {
    if (language === 'ua') {
      if (level === 'easy') return 'Легкий';
      if (level === 'medium') return 'Середній';
      if (level === 'hard') return 'Складний';
    } else {
      return level.charAt(0).toUpperCase() + level.slice(1);
    }
  };

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

      {route.difficulty && (
        <div className={`route-card-difficulty difficulty-${route.difficulty}`}>
          {getDifficultyLabel(route.difficulty)}
        </div>
      )}

      <p className="route-card-description">{description}</p>

      <p className="route-card-meta">
        ⏱ {getHourLabel(route.duration_hours)}
      </p>

      {route.tags?.length > 0 && (
        <div className="route-card-tags">
          {route.tags.map((tag) => (
            <span key={tag.id} className="route-tag">
              {language === 'ua' ? tag.name_ua : tag.name_en}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default RouteCard;
