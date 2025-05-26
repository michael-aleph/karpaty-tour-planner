import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RoutesPage from './pages/RoutesPage'; // додано
import RouteDetails from './pages/RouteDetails';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/routes" element={<RoutesPage />} />
        <Route path="/routes/:id" element={<RouteDetails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
