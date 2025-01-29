import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Link } from 'react-router-dom';
import newsimage from '../assets/newsimage.jpg'
import SearchBar from "./SearchBar"
import { fetchArticles, fetchHeadlines } from '../store/newSlice';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { AppDispatch } from '../store/store';

const NewsDashboard = () => {

  const articles = useSelector((state: RootState) => state.news.articles);
  const newsStatus = useSelector((state: RootState) => state.news.status);


  const dispatch: AppDispatch = useDispatch();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!query) {
      dispatch(fetchHeadlines());
    }
  }, [dispatch, query]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    dispatch(fetchArticles(searchQuery))
  }

  return (
    <div className="px-5 py-10 ">
      <div className="my-10 w-full">
        <SearchBar onSearch={handleSearch} />
      </div>

      {newsStatus === 'loading' ? (
        <div className="flex items-center justify-center min-h-[50vh] font-semibold">
          <p>Loading...</p>
        </div>
      ) : null}


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {newsStatus === 'succeeded' && articles && articles.length > 0 ? (
          articles.map((article, index) => (
            <div key={`${article.link}-${index}`} className="bg-white rounded-md">
              <Link to={`/articles/${encodeURIComponent(article.title)}`}>
                <div className="p-8 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                  <h2 className="font-semibold text-lg line-clamp-1">{article.title}</h2>
                  {article.image_url === null ? (
                    <img src={newsimage} alt="" className="w-full h-60 my-4" />
                  ) : (
                    <img src={article.image_url} alt={article.title} className="w-full h-60 my-4" />
                  )}
                  <p className="line-clamp-2">{article.description}</p>

                </div>
              </Link>
            </div>
          ))
        ) : newsStatus === 'succeeded' && (!articles || articles.length === 0) ? (
          <div className="flex justify-center items-center min-h-[50vh] col-span-full">
            <p>No articles found.</p>
          </div>
        ) : null}
      </div>
    </div>

  );
};

export default NewsDashboard;
