import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';
import RouteCard from '../components/RouteCard';
import './RouteList.css';

function RouteList() {
  const { language } = useLanguage();
  const [routes, setRoutes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  // const [duration, setDuration] = useState('');
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [error, setError] = useState('');
  const [durationMin, setDurationMin] = useState('');
  const [durationMax, setDurationMax] = useState('');

  const t = {
    title: {
      ua: 'Список маршрутів',
      en: 'List of routes',
    },
    searchPlaceholder: {
      ua: 'Пошук маршруту...',
      en: 'Search route...',
    },
    budgetMinPlaceholder: {
      ua: 'Бюджет від',
      en: 'Budget from',
    },
    budgetMaxPlaceholder: {
      ua: 'Бюджет до',
      en: 'Budget to',
    },
    durationLabel: {
      ua: 'до годин',
      en: 'up to hours'
    },
    submit: {
      ua: 'Знайти',
      en: 'Search',
    },
    noResults: {
      ua: 'Маршрутів не знайдено.',
      en: 'No routes found.',
    },
    
  };  

  // функція для завантаження маршрутів з бекенду
  const fetchRoutes = async (search = '', minHours = '', maxHours = '') => {
    try {
      const params = {};
      if (search) params.search = search;
      if (minHours) params.duration_min = minHours;
      if (maxHours) params.duration_max = maxHours;
      if (selectedTags.length > 0) {
        params.tags = selectedTags.join(',');
      }
  
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/routes`, { params });
      setRoutes(response.data);
    } catch (error) {
      console.error('Помилка при отриманні маршрутів:', error);
    }
  };   

  // завантаження при першому рендері
  useEffect(() => {
    fetchRoutes();
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/tags`)
      .then((res) => setAvailableTags(res.data))
      .catch((err) => console.error('Помилка при отриманні тегів:', err));
  }, []);

  // обробка сабміту форми
  const handleSearch = (e) => {
    e.preventDefault();
    setError('');
  
    if (durationMin && durationMax && parseInt(durationMin) > parseInt(durationMax)) {
      setError(language === 'ua'
        ? 'Мінімальна тривалість не може бути більшою за максимальну.'
        : 'Minimum duration cannot be greater than maximum.');
      return;
    }
  
    fetchRoutes(searchTerm.trim(), durationMin, durationMax);
  };  
  
  const handleTagChange = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <div className="route-list">
      <h2>{t.title[language]}</h2>
  
      <form onSubmit={handleSearch} className="route-list-form">
        {/* 🔍 Пошук */}
        <div className="form-field">
          <label htmlFor="search-input">
            {language === 'ua' ? 'Пошук маршруту' : 'Search route'}
          </label>
          <input
            id="search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === 'ua' ? 'Напр., Довбуш' : 'e.g., Dovbush'}
          />
        </div>
  
        {/* ⏱ Тривалість */}
        <div className="form-field">
          <label>{language === 'ua' ? 'Від (год)' : 'Min (hours)'}</label>
          <input
            type="number"
            min="1"
            value={durationMin}
            onChange={(e) => setDurationMin(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>{language === 'ua' ? 'До (год)' : 'Max (hours)'}</label>
          <input
            type="number"
            min="1"
            value={durationMax}
            onChange={(e) => setDurationMax(e.target.value)}
          />
        </div>

        {/* 🏷 Теги */}
        <div className="form-field">
          <span style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>
            {language === 'ua' ? 'Фільтр за тегами:' : 'Filter by tags:'}
          </span>
          <div className="tag-filter-group">
            {availableTags.map((tag) => (
              <label key={tag.id}>
                <input
                  type="checkbox"
                  value={tag.id}
                  checked={selectedTags.includes(tag.id)}
                  onChange={() => handleTagChange(tag.id)}
                />
                {language === 'ua' ? tag.name_ua : tag.name_en}
              </label>
            ))}
          </div>
        </div>
  
        <button type="submit">{t.submit[language]}</button>
      </form>
  
      {error && <p className="error-message">{error}</p>}
      {routes.length === 0 && <p className="no-results">{t.noResults[language]}</p>}
      
      {routes.length > 0 && routes[0].isFallback && (
        <div className="fallback-message">
          {language === 'ua'
            ? 'Точних збігів не знайдено. Тому ми підібрали найбільш схожі варіанти:'
            : 'No exact match found. Here is the most relevant result:'}
        </div>
      )}
      <div className="route-list-grid">
        {routes.map(route => (
          <RouteCard key={route.id} route={route} />
        ))}
      </div>
    </div>
  );  
}

export default RouteList;
