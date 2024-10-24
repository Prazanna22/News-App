import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ArticleDetails from './components/ArticleDetails';
import NewsDashboard from './components/NewsDashboard';
import { Navbar } from './components/Navbar';
import FavoritesPage from './components/Favorites';

function App() {


  return (
    <>
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<NewsDashboard />} />
          <Route path="/articles/:id" element={<ArticleDetails />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </Router>
    </>

  )
}

export default App
