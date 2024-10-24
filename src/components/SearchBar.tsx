
import React, { useState } from 'react';

interface SearchBarProps {
    onSearch: (query: string) => void;
}
const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {

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
                className='text-[#4072db] w-3/4 py-2 pl-7 bg-[#ffffff] border-2 border-[#4072db] rounded-s-3xl outline-none'

            />
            <button type="submit" className='bg-[#4072db] text-white px-5 md:px-8 border-r-2 border-white py-2 rounded-e-3xl '>Search</button>
        </form>
    );
};

export default SearchBar;
