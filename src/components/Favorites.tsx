import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { removeFavorite } from '../store/newSlice';

const FavoritesPage = () => {
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.news.favorites);

  const handleRemoveFavorite = (title: string) => {
    dispatch(removeFavorite(title));
  };

  if (favorites.length === 0) {
    return <p className='mt-72 font-semibold text-center '>No favorite articles found.</p>;
  }

  return (
    <div className='mx-5 md:mx-20  my-10'>
      <h1 className='text-3xl font-bold my-5'>Your Favorite Articles</h1>

      <div className="grid grid-cols-1 md:grid-cols-2">
      {favorites.map((article) => (
        <div key={article.title} className='mb-5 p-5 '>
          <h2 className='text-2xl font-semibold'>{article.title}</h2>
          <img src={article.urlToImage} alt={article.title} className='w-full h-64'/>
          <p className='font-medium'>{article.description}</p>
          <div className="my-8">
          <button className='px-5 py-2 rounded-md bg-black text-white'>
            <a href={article.url} target="_blank" rel="noopener noreferrer">Read Full Article</a>
          </button>
          <button
            onClick={() => handleRemoveFavorite(article.title)}
            className='ml-5 px-5 py-2 rounded-md bg-red-500 text-white'>
            Remove 
          </button>
          </div>
        </div>
      ))}
      </div>
    </div>
  );
};

export default FavoritesPage;
