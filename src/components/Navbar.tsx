import { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchArticles } from "../store/newSlice";
import { AppDispatch } from "../store/store";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  function handleCategory(category: string) {
    if (category) {
      dispatch(fetchArticles(category));
      navigate("/");
      setIsOpen(false);
    }
  }

  return (
    <div className="bg-[#4072db] text-white">
      <div className="flex justify-between items-center px-5 py-4">
        <h1
          className="font-bold text-2xl md:text-3xl cursor-pointer"
          onClick={() => { navigate("/") }}
        >
          NEWS <span className="">24/7</span>
        </h1>
        <div className="hidden md:flex space-x-8">
          <ul className="flex items-center space-x-8 cursor-pointer">
            <li onClick={() => { handleCategory("business") }}>Business</li>
            <li onClick={() => { handleCategory("technology") }}>Technology</li>
            <li onClick={() => { handleCategory("education") }}>Education</li>
            <li onClick={() => { handleCategory("sports") }}>Sports</li>
            <li onClick={() => { handleCategory("fashion") }}>Fashion</li>
            <li onClick={() => {navigate("/favorites"),setIsOpen(false)}} >Favorites</li>
          </ul>
        </div>
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden bg-[#4072db]">
          <ul className="flex flex-col   pb-4 bg-white text-black  text-center font-medium">
            <li className="border-b-2 py-3" onClick={() => { handleCategory("business") }}>Business</li>
            <li className="border-b-2 py-3" onClick={() => { handleCategory("technology") }}>Technology</li>
            <li className="border-b-2 py-3" onClick={() => { handleCategory("education") }}>Education</li>
            <li className="border-b-2 py-3" onClick={() => { handleCategory("sports") }}>Sports</li>
            <li className="border-b-2 py-3" onClick={() => { handleCategory("fashion") }}>Fashion</li>
            <li className="border-b-2 py-3" onClick={() => {navigate("/favorites"),setIsOpen(false)}} >Favorites</li>

          </ul>
        </div>
      )}
    </div>
  );
}
