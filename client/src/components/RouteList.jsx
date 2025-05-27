import { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import useLanguage from '../hooks/useLanguage';
import RouteCard from '../components/RouteCard';
import './RouteList.css';
import { motion as Motion, AnimatePresence } from 'framer-motion';

function RouteList() {
  const { language } = useLanguage();
  const [routes, setRoutes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [error, setError] = useState('');
  const [durationMin, setDurationMin] = useState('');
  const [durationMax, setDurationMax] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [sortOption, setSortOption] = useState('');

  const searchRef = useRef('');
  const durationMinRef = useRef('');
  const durationMaxRef = useRef('');
  const difficultyRef = useRef('');

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
  const fetchRoutes = useCallback(async (search = '', minHours = '', maxHours = '', difficulty = '') => {
    try {
      const params = {};
      if (search) params.search = search;
      if (minHours) params.duration_min = minHours;
      if (maxHours) params.duration_max = maxHours;
      if (difficulty) params.difficulty = difficulty;
      if (sortOption) params.sort = sortOption;
      if (selectedTags.length > 0) {
        params.tags = selectedTags.join(',');
      }
  
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/routes`, { params });
      let sorted = response.data;

      if (sortOption === 'name') {
        sorted = [...sorted].sort((a, b) =>
          language === 'ua'
            ? a.name_ua.localeCompare(b.name_ua, 'uk')
            : a.name_en.localeCompare(b.name_en, 'en')
        );
      } else if (sortOption === 'duration') {
        sorted = [...sorted].sort((a, b) => a.duration_hours - b.duration_hours);
      } else if (sortOption === 'difficulty') {
        const order = { easy: 1, medium: 2, hard: 3 };
        sorted = [...sorted].sort((a, b) => order[a.difficulty] - order[b.difficulty]);
      }

      setRoutes(sorted);

    } catch (error) {
      console.error('Помилка при отриманні маршрутів:', error);
    }
  }, [selectedTags, sortOption, language]);
  
  const fetchInitialRoutes = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/routes`);
      setRoutes(response.data);
    } catch (error) {
      console.error('Помилка при отриманні маршрутів:', error);
    }
  };

  // завантаження при першому рендері
  useEffect(() => {
    fetchInitialRoutes();
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/tags`)
      .then((res) => setAvailableTags(res.data))
      .catch((err) => console.error('Помилка при отриманні тегів:', err));
  }, []);

  const areFiltersActive =
  searchTerm.trim() !== '' ||
  durationMin !== '' ||
  durationMax !== '' ||
  difficulty !== '' ||
  selectedTags.length > 0;

  useEffect(() => {
    if (sortOption) {
      fetchRoutes(
        searchRef.current,
        durationMinRef.current,
        durationMaxRef.current,
        difficultyRef.current
      );
    }
  }, [sortOption, fetchRoutes]);
  
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

    searchRef.current = searchTerm.trim();
    durationMinRef.current = durationMin;
    durationMaxRef.current = durationMax;
    difficultyRef.current = difficulty;
  
    fetchRoutes(searchTerm.trim(), durationMin, durationMax, difficulty);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setDurationMin('');
    setDurationMax('');
    setDifficulty('');
    setSelectedTags([]);
    setError('');
    fetchInitialRoutes();

    searchRef.current = '';
    durationMinRef.current = '';
    durationMaxRef.current = '';
    difficultyRef.current = '';

    fetchRoutes('', '', '', '');
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
        <div className="form-field tag-filter-wrapper">
          <div className="tag-filter-label">
            {language === 'ua' ? 'Фільтр за тегами:' : 'Filter by tags:'}
          </div>
          <div className="tag-filter-group">
            {availableTags.map((tag) => (
              <label key={tag.id} className="custom-checkbox">
                <input
                  type="checkbox"
                  value={tag.id}
                  checked={selectedTags.includes(tag.id)}
                  onChange={() => handleTagChange(tag.id)}
                />
                <span className="checkmark-container">
                  <svg
                    className="checkmark"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <circle className="checkmark__fill" cx="12" cy="12" r="13" />
                    <path
                      className="checkmark__check"
                      d="M5 13l4 4L19 7"
                      fill="none"
                    />
                  </svg>
                </span>
                <span className="checkbox-label">
                  {language === 'ua' ? tag.name_ua : tag.name_en}
                </span>
              </label>            
            ))}
          </div>
        </div>


        <div className="form-field">
          <label htmlFor="difficulty-select">
            {language === 'ua' ? 'Складність' : 'Difficulty'}
          </label>
          <select
            id="difficulty-select"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="">{language === 'ua' ? 'Усі' : 'All'}</option>
            <option value="easy">{language === 'ua' ? 'Легкий' : 'Easy'}</option>
            <option value="medium">{language === 'ua' ? 'Середній' : 'Medium'}</option>
            <option value="hard">{language === 'ua' ? 'Складний' : 'Hard'}</option>
          </select>
        </div>

        <div className="form-buttons">
          <button type="submit">{t.submit[language]}</button>
          <button
            type="button"
            onClick={handleResetFilters}
            className="reset-btn"
            disabled={!areFiltersActive}
          >
            {language === 'ua' ? 'Скинути фільтри' : 'Reset filters'}
          </button>
        </div>
      </form>
      
      <div className="sort-controls">
        <label htmlFor="sort-select">
          {language === 'ua' ? 'Сортувати за:' : 'Sort by:'}
        </label>
        <select
          id="sort-select"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="">{language === 'ua' ? 'Без сортування' : 'No sorting'}</option>
          <option value="name">{language === 'ua' ? 'Назвою (А → Я)' : 'Name (A → Z)'}</option>
          <option value="duration">{language === 'ua' ? 'Тривалістю' : 'Duration'}</option>
          <option value="difficulty">{language === 'ua' ? 'Складністю' : 'Difficulty'}</option>
        </select>
      </div>

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
        <AnimatePresence mode="popLayout">
          {routes.map((route) => (
            <Motion.div
              key={route.id}
              layout
              className="route-card-grid-item"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <RouteCard route={route} />
            </Motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );  
}

export default RouteList;
