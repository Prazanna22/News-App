import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_KEY = '578072c2dcbc433291d3d7ff5b894af4';
const BASE_URL = 'https://newsapi.org/v2';

interface Article {
    title: string;
    urlToImage: string;
    description: string;
    url: string;
    source: { name: string }
}

interface NewsState {
    articles: Article[];
    favorites: Article[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    loading: boolean;
}

export const fetchArticles = createAsyncThunk(
    'news/fetchArticles',
    async (query: string) => {
        const response = await axios.get(`${BASE_URL}/everything`, {
            params: { apiKey: API_KEY, q: query, language: 'en' },
        });
        return response.data.articles;
    }
);

export const fetchHeadlines = createAsyncThunk(
    'news/fetchHeadlines',
    async () => {
        const response = await axios.get(`${BASE_URL}/top-headlines`, {
            params: { apiKey: API_KEY, language: 'en' },
        });
        return response.data.articles;
    }
);

const loadFavorites = (): Article[] => {
    const serializedFavorites = localStorage.getItem('favorites');
    if (serializedFavorites === null) {
        return [];
    }
    return JSON.parse(serializedFavorites) as Article[];
};

const saveFavorites = (favorites: Article[]) => {
    const serializedFavorites = JSON.stringify(favorites);
    localStorage.setItem('favorites', serializedFavorites);
};

const initialState: NewsState = {
    articles: [],
    status: 'idle',
    favorites: loadFavorites(),
    error: null,
    loading: false
};

const newsSlice = createSlice({
    name: "news",
    initialState,
    reducers: {
        addFavorite: (state, action: PayloadAction<Article>) => {
            const existingFavorite = state.favorites.find(fav => fav.title === action.payload.title);
            if (!existingFavorite) {
                state.favorites.push(action.payload);
                saveFavorites(state.favorites);
            }
        },
        removeFavorite: (state, action: PayloadAction<string>) => {
            state.favorites = state.favorites.filter(fav => fav.title !== action.payload);
            saveFavorites(state.favorites);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHeadlines.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchHeadlines.fulfilled, (state, action: PayloadAction<Article[]>) => {
                state.status = 'succeeded';
                state.articles = action.payload;
            })
            .addCase(fetchHeadlines.rejected, (state) => {
                state.status = 'failed';
                state.error = 'Failed to fetch headlines';
            })
            .addCase(fetchArticles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchArticles.fulfilled, (state, action: PayloadAction<Article[]>) => {
                state.articles = action.payload;
                state.loading = false;
            })
            .addCase(fetchArticles.rejected, (state) => {
                state.error = 'Failed to fetch articles';
                state.loading = false;
            });
    }
});

export const { addFavorite, removeFavorite } = newsSlice.actions;
export default newsSlice.reducer;
