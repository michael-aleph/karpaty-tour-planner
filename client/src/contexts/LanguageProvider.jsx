import { useEffect, useState } from 'react';
import { LanguageContext } from './LanguageContext';

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedLang = localStorage.getItem('language') || 'ua';
    setLanguage(storedLang);
    setIsLoaded(true);
  }, []);

  const toggleLanguage = () => {
    const newLang = language === 'ua' ? 'en' : 'ua';
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {isLoaded ? children : null}
    </LanguageContext.Provider>
  );
};
