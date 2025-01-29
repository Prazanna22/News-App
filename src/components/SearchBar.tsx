
import React, { useState } from 'react';

interface SearchBarProps {
    onSearch: (query: string) => void;
}
const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {//passing interface into function

    const [query, setQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
            setQuery('');
        }
    };

    return (
        <form onSubmit={handleSearch} className='flex justify-center'>
            <input
                type="text"
                placeholder="Search articles..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className=' w-3/4 py-2 pl-7 bg-[#ffffff] border-2 border-[#315cb9] rounded-s-3xl outline-none'

            />
            <button type="submit" className='bg-[#315cb9] text-white px-5 md:px-8 border-r-2 border-white py-2 rounded-e-3xl '>Search</button>
        </form>
    );
};

export default SearchBar;
