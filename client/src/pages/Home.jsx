// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import useLanguage from '../hooks/useLanguage';
import './Home.css';
import usePageTitle from '../hooks/usePageTitle';


function Home() {
  const { language } = useLanguage();
  usePageTitle('Головна', 'Home');

  const t = {
    heroTitle: {
      ua: 'Путівник Українськими Карпатами',
      en: 'Guide to the Ukrainian Carpathians',
    },
    heroSubtitle: {
      ua: 'Відкрийте для себе найкращі маршрути, вершини та природу Західної України',
      en: 'Discover the best trails, peaks, and nature of Western Ukraine',
    },
    cta: {
      ua: 'Перейти до маршрутів',
      en: 'Explore Routes',
    },
    introTitle: {
      ua: 'Карпати — перлина України',
      en: 'The Carpathians — The Jewel of Ukraine',
    },
    introText: {
      ua: `Карпати — це унікальний гірський масив на заході України, який простягається більш ніж на 280 км. Тут поєднуються величні вершини, густі ліси, стрімкі річки, традиційні дерев’яні церкви та гостинна культура гуцулів, бойків і лемків. 
      Це місце, де можна втекти від метушні та відчути єднання з природою, побачити бурих ведмедів, почути шум водоспадів і доторкнутись до автентичної України.`,
      en: `The Carpathians are a unique mountain range in western Ukraine stretching over 280 km. Here, majestic peaks blend with dense forests, fast rivers, traditional wooden churches, and the welcoming culture of the Hutsuls, Boykos, and Lemkos. 
      It’s a place to escape the bustle, reconnect with nature, encounter brown bears, hear waterfalls, and feel the authentic soul of Ukraine.`,
    },
    factsTitle: {
      ua: 'Цікаві факти про Карпати',
      en: 'Interesting Facts About the Carpathians',
    },
    facts: [
      {
        ua: 'Карпати мають багаті мінеральні джерела, зокрема лікувальні води Трускавця, Моршина та Східниці',
        en: 'The Carpathians are rich in mineral springs, including the therapeutic waters of Truskavets, Morshyn, and Skhidnytsia',
      },
      {
        ua: 'Карпати — одна з найдовших гірських систем Європи, що простягається через 7 країн на 1500 км',
        en: 'The Carpathians are one of Europe’s longest mountain ranges, stretching 1500 km across 7 countries',
      },
      {
        ua: 'Українські Карпати займають понад 50 000 км² — близько 8% площі України',
        en: 'Ukrainian Carpathians cover over 50,000 km² — nearly 8% of Ukraine’s territory',
      },
      {
        ua: 'У Карпатах зосереджено понад 40% лісового покриву України',
        en: 'Over 40% of Ukraine’s forest cover is concentrated in the Carpathians',
      },
      {
        ua: 'Найвища точка — гора Говерла (2061 м), популярна серед туристів',
        en: 'The highest point — Mount Hoverla (2061 m) — is a popular hiking destination',
      },
      {
        ua: 'У Карпатах збереглись унікальні деревʼяні церкви, включені до списку ЮНЕСКО',
        en: 'Unique wooden churches in the Carpathians are listed as UNESCO World Heritage Sites',
      },
      {
        ua: 'Гуцульські традиції, ремесла та музика мають міжнародне культурне значення',
        en: 'Hutsul traditions, crafts, and music hold international cultural significance',
      },
      {
        ua: 'Тут знаходиться найдовший залізничний тунель України — Бескидський (1747 м)',
        en: 'The Beskydy railway tunnel here is the longest in Ukraine (1747 m)',
      },
      {
        ua: 'Карпати — популярний напрям для зимового відпочинку: гірськолижні курорти Буковель, Славське, Драгобрат',
        en: 'The Carpathians are a top winter getaway with ski resorts like Bukovel, Slavske, and Dragobrat',
      },
    ],
    smartSearch: {
      title: {
        ua: 'Розумний пошук маршрутів',
        en: 'Smart Route Search',
      },
      description: {
        ua: 'Фільтруйте за тегами, тривалістю, складністю — і знаходьте саме ті маршрути, які вам підходять. Якщо точного збігу не знайдено, наша система порекомендує найбільш схожі варіанти відповідно до ваших вподобань.',
        en: 'Filter routes by tags, duration, and difficulty — and find exactly what fits your needs. If no exact match is found, our system will suggest the most relevant alternatives based on your preferences.',
      },
    },
  };

  return (
    <div className="home">
      {/* Hero */}
      <section className="home-hero">
        <div className="hero-content">
          <h1>{t.heroTitle[language]}</h1>
          <p>{t.heroSubtitle[language]}</p>
          <Link to="/routes" className="home-cta-btn">
            {t.cta[language]}
          </Link>
        </div>
      </section>
      <section className="home-description-wrapper">
        <div className="home-description-row">
          {/* LEFT: Карпати */}
          <div className="description-side-card">
            <div className="description-icon">🏔️</div>
            <h2>{language === 'ua' ? 'Карпати — перлина України' : 'The Carpathians — The Jewel of Ukraine'}</h2>
            <div className="description-content">
              <p>
                {language === 'ua'
                  ? 'Українські Карпати — це справжня скарбниця незайманої природи та самобутньої культури, що велично розкинулась на заході нашої країни. Цей гірський масив чарує різноманіттям ландшафтів: від густих пралісів і квітучих полонин до стрімких ущелин, кришталевих водоспадів і дзвінких гірських річок.'
                  : 'The Ukrainian Carpathians are a true treasure of unspoiled nature and authentic culture, stretching majestically across western Ukraine. This mountain range enchants with its diverse landscapes — from ancient forests and blooming alpine meadows to steep gorges, crystal waterfalls, and rushing mountain rivers.'}
              </p>
              <p>
                {language === 'ua'
                  ? 'Вершини Карпат відкривають захоплюючі панорами, а повітря насичене ароматами трав і прохолодою джерел. Серед цієї дикої краси зберігається унікальна культурна спадщина гуцулів, бойків та лемків — народів, які впродовж століть гармонійно співіснують із природою.'
                  : 'The peaks of the Carpathians reveal breathtaking vistas, while the air is filled with the scent of herbs and the freshness of springs. Amidst this wild beauty lives the rich cultural heritage of the Hutsuls, Boykos, and Lemkos — peoples who have coexisted harmoniously with nature for centuries.'}
              </p>
              <p>
                {language === 'ua'
                  ? 'Ви побачите витончену деревʼяну архітектуру старовинних церков і хат, почуєте трембіти, що линуть над полонинами, та відчуєте щиру гостинність місцевих жителів. Карпати — це не просто гори. Це місце сили, натхнення і глибокої автентики, де кожна стежка веде до нових відкриттів.'
                  : 'You’ll encounter refined wooden churches and traditional homes, hear the long echo of trembitas over the meadows, and experience the warm hospitality of the locals. The Carpathians are not just mountains — they are a place of strength, inspiration, and cultural depth, where every trail leads to new discoveries.'}
              </p>
            </div>
          </div>

          {/* CENTER: Плануйте вашу подорож */}
          <div className="description-main-card">
            <div className="description-icon">🧳</div>
            <div className="description-content">
              <h2>{language === 'ua' ? 'Плануйте вашу подорож' : 'Plan Your Journey'}</h2>
              <p className="description-lead">
                {language === 'ua'
                  ? 'Декілька порад, щоб ваша мандрівка Карпатами була безпечною, комфортною та незабутньою.'
                  : 'A few tips to make your Carpathian adventure safe, comfortable, and memorable.'}
              </p>
              <ul className="travel-tips">
                <li>
                  <span className="tip-icon">📅</span>
                  <strong>{language === 'ua' ? 'Оберіть правильний сезон:' : 'Choose the right season:'}</strong>{' '}
                  {language === 'ua'
                    ? 'Карпати чарівні будь-коли! Літо – для хайкінгу, зима – для снігових пригод, весна й осінь – для природи та кольорів.'
                    : 'Carpathians are magical all year round — summer for hiking, winter for snow, spring and autumn for vibrant nature.'}
                </li>
                <li>
                  <span className="tip-icon">🎒</span>
                  <strong>{language === 'ua' ? 'Спорядження – ваш комфорт:' : 'Gear up for comfort:'}</strong>{' '}
                  {language === 'ua'
                    ? 'Зручне взуття, дощовик, багатошаровий одяг — основа комфортного походу.'
                    : 'Comfortable shoes, rain gear, layered clothing — essentials for a smooth hike.'}
                </li>
                <li>
                  <span className="tip-icon">⚠️</span>
                  <strong>{language === 'ua' ? 'Безпека понад усе:' : 'Safety first:'}</strong>{' '}
                  {language === 'ua'
                    ? 'Повідомляйте маршрут близьким, майте заряджений телефон, карту та аптечку.'
                    : 'Tell someone your route, carry a charged phone, map, and first-aid kit.'}
                </li>
                <li>
                  <span className="tip-icon">💧</span>
                  <strong>{language === 'ua' ? 'Вода та перекуси:' : 'Water and snacks:'}</strong>{' '}
                  {language === 'ua'
                    ? 'Візьміть запас води або фільтр, горіхи, сухофрукти, енергетичні батончики.'
                    : 'Bring water or filter, nuts, dried fruits, and energy bars.'}
                </li>
                <li>
                  <span className="tip-icon">🌱</span>
                  <strong>{language === 'ua' ? 'Бережіть природу:' : 'Respect nature:'}</strong>{' '}
                  {language === 'ua'
                    ? 'Не залишайте сміття, не руйнуйте рослини, не лякайте тварин.'
                    : 'Leave no trace — take only memories, leave only footprints.'}
                </li>
              </ul>
            </div>
          </div>

          {/* RIGHT: Розумний пошук */}
          <div className="description-side-card">
            <div className="description-icon">🧭</div>
            <h2>{language === 'ua' ? 'Розумний пошук маршрутів' : 'Smart Route Search'}</h2>
            <div className="description-content">
              <p>
                {language === 'ua'
                  ? 'Сплануйте свою мандрівку Карпатами легко та швидко з нашим розумним пошуком! Система враховує ваші вподобання — від бажаної тривалості подорожі до рівня складності та тематики маршруту.'
                  : 'Plan your Carpathian journey easily with our smart search! The system tailors route suggestions based on your preferences — from desired duration and difficulty level to thematic interests.'}
              </p>
              <p>
                {language === 'ua'
                  ? 'Серед доступних тегів ви знайдете як "водоспади", "панорамні краєвиди" чи "лісові стежки", так і специфічні — "для новачків", "з дітьми", "до історичних місць" або "в мальовничу самоту". Оберіть маршрути від коротких прогулянок до справжніх експедицій.'
                  : 'You can choose from a variety of tags — such as "waterfalls", "panoramic views", or "forest trails" — as well as more specific ones like "beginner-friendly", "with kids", "historical paths", or "secluded escapes". Routes range from short walks to full expeditions.'}
              </p>
              <p>
                {language === 'ua'
                  ? 'Наша система аналізує ваш запит і знаходить найбільш релевантні варіанти. Якщо точного збігу не знайдено, ви отримаєте пропозиції максимально близькі до запиту — часто навіть цікавіші, ніж очікували.'
                  : 'Our system analyzes your input and finds the most relevant results. If there’s no exact match, you’ll get suggested alternatives that often exceed expectations — and might lead to hidden gems.'}
              </p>
              <p>
                {language === 'ua'
                  ? 'Розпочніть пошук уже зараз — і нехай перша знайдена стежка стане початком незабутньої пригоди!'
                  : 'Start your search now — and let the first path you find become the start of an unforgettable adventure!'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Facts */}
      <section className="home-facts">
        <h2>{t.factsTitle[language]}</h2>
        <div className="fact-grid">
          {t.facts.map((fact, index) => (
            <div className="fact-card" key={index}>
              <p>{fact[language]}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
