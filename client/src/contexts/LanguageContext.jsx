import { createContext, useContext, useEffect, useState } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(null); // ← на старті null
  const [isLoaded, setIsLoaded] = useState(false); // ← чи вже підвантажено

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

export const useLanguage = () => useContext(LanguageContext);
