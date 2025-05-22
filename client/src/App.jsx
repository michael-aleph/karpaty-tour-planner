import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RouteDetails from './pages/RouteDetails';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/routes/:id" element={<RouteDetails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
