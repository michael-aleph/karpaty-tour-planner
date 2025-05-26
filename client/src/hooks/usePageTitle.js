import { useEffect } from 'react';
import useLanguage from '../hooks/useLanguage';

/**
 * @param {string} uaTitle - Заголовок українською
 * @param {string} enTitle - Заголовок англійською
 */
function usePageTitle(uaTitle, enTitle) {
  const { language } = useLanguage();

  useEffect(() => {
    document.title =
      language === 'ua'
        ? `${uaTitle} | Путівник Карпатами`
        : `${enTitle} | Carpathian Guide`;
  }, [language, uaTitle, enTitle]);
}

export default usePageTitle;
