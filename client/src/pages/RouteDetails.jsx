import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import ModalImage from 'react-modal-image';
import axios from 'axios';
import useLanguage from '../hooks/useLanguage';
import './RouteDetails.css';

const renderers = {
  img: ({ src, alt }) => (
    <ModalImage
      small={src}
      large={src}
      alt={alt}
      hideDownload={true}
      hideZoom={true}
    />
  ),
};

function RouteDetails() {
  const { id } = useParams();
  const { language } = useLanguage();
  const [route, setRoute] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(0);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/routes/${id}`)
      .then((res) => setRoute(res.data))
      .catch((err) => {
        if (err.response?.status === 404) setNotFound(true);
        else console.error('Помилка при завантаженні маршруту:', err);
      });
  }, [id]);

  // Плавне затемнення при скролі
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = 300;
      const opacity = Math.min(scrollY / maxScroll, 0.4); // до 40% затемнення
      setOverlayOpacity(opacity);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  return (
    <>
      <div
        className="route-hero-wrapper"
        style={{ '--overlay-opacity': overlayOpacity }}
      >
        {route.image_url && (
          <img
            src={route.image_url}
            alt={route.name_ua}
            className="route-hero-image"
          />
        )}
      </div>
      <div className="container">
        <div className="route-content-wrapper">
          <div className="route-content">
            <ReactMarkdown
              components={renderers}
              rehypePlugins={[rehypeRaw]}
            >
              {language === 'ua' ? route.content_ua : route.content_en}
            </ReactMarkdown>
          </div>
        </div>
        
        <div className="route-tags">
          <strong>{language === 'ua' ? 'Теги:' : 'Tags:'}</strong>
          <div className="route-tag-list">
            {route.difficulty && (
              <span className={`route-tag difficulty-${route.difficulty}`}>
                {language === 'ua'
                  ? route.difficulty === 'easy' ? 'Легкий маршрут'
                    : route.difficulty === 'medium' ? 'Середній маршрут'
                    : 'Складний маршрут'
                  : route.difficulty === 'easy' ? 'Easy'
                    : route.difficulty === 'medium' ? 'Medium'
                    : 'Hard'}
              </span>
            )}
            {route.tags.map(tag => (
              <span className="route-tag" key={tag.id}>
                {language === 'ua' ? tag.name_ua : tag.name_en}
              </span>
            ))}
          </div>
        </div>
  
        {route.places?.length > 0 && (
          <div className="route-places">
            <strong>{language === 'ua' ? 'Місця маршруту:' : 'Route places:'}</strong>
            <ol className="route-place-list">
              {route.places.map(place => (
                <li key={place.id}>{language === 'ua' ? place.name_ua : place.name_en}</li>
              ))}
            </ol>
          </div>
        )}
  
        <div className="route-back">
          <Link to="/">
            <button>{language === 'ua' ? '← Назад' : '← Back'}</button>
          </Link>
        </div>
      </div>
    </>
  );  
}

export default RouteDetails;

