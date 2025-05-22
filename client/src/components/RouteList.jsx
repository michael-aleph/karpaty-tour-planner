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
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [duration, setDuration] = useState('');
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [error, setError] = useState('');

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
      ua: 'Всі тривалості',
      en: 'All durations',
    },
    durationOptions: {
      ua: ['1 день', '2 дні', '3 дні', '4 дні', '5 днів'],
      en: ['1 day', '2 days', '3 days', '4 days', '5 days'],
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
  const fetchRoutes = async (search = '', min = '', max = '', duration = '') => {
    try {
      const params = {};
  
      if (search) params.search = search;
      if (min) params.budget_min = min;
      if (max) params.budget_max = max;
      if (duration) params.duration = duration;
      if (selectedTags.length > 0) {
        params.tags = selectedTags.join(',');
      }
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/routes`,
        { params }
      );
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
  
    if (minBudget && maxBudget && parseInt(minBudget) > parseInt(maxBudget)) {
      const message =
        language === 'ua'
          ? 'Мінімальний бюджет не може бути більшим за максимальний.'
          : 'Minimum budget cannot be greater than maximum budget.';
      setError(message);
      return;
    }
  
    fetchRoutes(searchTerm.trim(), minBudget.trim(), maxBudget.trim(), duration);
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
        <input
          type="text"
          placeholder={t.searchPlaceholder[language]}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="number"
          placeholder={t.budgetMinPlaceholder[language]}
          value={minBudget}
          onChange={(e) => setMinBudget(e.target.value)}
          min="0"
        />
        <input
          type="number"
          placeholder={t.budgetMaxPlaceholder[language]}
          value={maxBudget}
          onChange={(e) => setMaxBudget(e.target.value)}
          min="0"
        />
  
        <select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        >
          <option value="">{t.durationLabel[language]}</option>
          {t.durationOptions[language].map((label, idx) => (
            <option key={idx} value={idx + 1}>{label}</option>
          ))}
        </select>
  
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
  
        <button type="submit">{t.submit[language]}</button>
      </form>
  
      {error && (
        <p className="error-message">{error}</p>
      )}
  
      {routes.length === 0 && (
        <p className="no-results">{t.noResults[language]}</p>
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
