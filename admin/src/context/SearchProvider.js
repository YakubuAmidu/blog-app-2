import React, { createContext, useState, useContext } from 'react';

// React router dom
import { useNavigate } from "react-router-dom";

// Imported components
import { searchPost } from '../api/post';
import { useNotification } from '../context/NotificationProvider';

const SearchContext = createContext();

export default function SearchProvider({ children }){
    const [searchResult, setSearchResult] = useState([]);

    const { updateNotification } = useNotification();

    const navigate = useNavigate();

    const handleSearch = async (query) => {
        const { error, posts } = await searchPost(query);

        if(error) return updateNotification("error", error);

        setSearchResult(posts);
        navigate("/");
    };

    const resetSearch = () => {
        setSearchResult([]);
    }

    return (
        <SearchContext.Provider 
        value={{ searchResult, handleSearch, resetSearch }}>
            {
                children
            }
        </SearchContext.Provider>
    )
}

export const useSearch = () => useContext(SearchContext);

