import { useLanguage } from '../contexts/LanguageContext';

function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <div style={{ marginBottom: '1rem' }}>
      <button
        onClick={() => toggleLanguage('ua')}
        disabled={language === 'ua'}
      >
        🇺🇦 UA
      </button>
      <button
        onClick={() => toggleLanguage('en')}
        disabled={language === 'en'}
        style={{ marginLeft: '0.5rem' }}
      >
        🇬🇧 EN
      </button>
    </div>
  );
}

export default LanguageSwitcher;
