import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import unlike from '../assets/unlike.png'
import like from '../assets/like.png'
import { addFavorite, removeFavorite } from '../store/newSlice';
const ArticleDetails = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const articles = useSelector((state: RootState) => state.news.articles);
  const favorites = useSelector((state: RootState) => state.news.favorites);
  const article = articles.find(article => article.title === id);
  const isFavorite = favorites.some(fav => fav.title === article?.title);


  if (!article) {
    return <p>Article not found.</p>;
  }

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      dispatch(removeFavorite(article.title));
    } else {
      dispatch(addFavorite(article));
    }
  };


  return (
    <div className='mx-5 md:mx-20 lg:mx-40 my-10'>
      <img src={article.urlToImage} alt={article.title} className='w-full h-96' />
      <h1 className='text-2xl md:text-4xl font-bold  my-10'>{article.title}</h1>
      <p className='font-medium'>{article.description}</p>
      <div className="flex  items-center my-10">
        <button className=' px-5 py-2 rounded-md hover:bg-white border-2 border-black hover:border-2 hover:border-[#4072db] hover:text-[#4072db] font-medium  bg-black text-white'><a href={article.url} target="_blank" rel="noopener noreferrer" >Read Full Article</a></button>
        <button onClick={() => handleFavoriteToggle()}><img src={isFavorite ? like : unlike} alt={isFavorite ? 'Liked' : 'Unliked'} className='w-8 mx-6' /></button>
      </div>
    </div>
  );
};

export default ArticleDetails;
