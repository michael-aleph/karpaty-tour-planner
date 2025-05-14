import RouteList from '../components/RouteList';
import LanguageSwitcher from '../components/LanguageSwitcher';

function Home() {
  return (
    <div className="container">
      <LanguageSwitcher />
      <RouteList />
    </div>
  );
}

export default Home;
