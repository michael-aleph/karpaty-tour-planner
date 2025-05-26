import RouteList from '../components/RouteList';
import usePageTitle from '../hooks/usePageTitle';

function RoutesPage() {
  usePageTitle('Маршрути', 'Routes');
  return (
    <div className="routes-container">
      <RouteList />
    </div>
  );
}

export default RoutesPage;
