import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_KEY = 'pub_58205e6aad791e30c2c84f9bec8c343c4e07d';
const BASE_URL = 'https://newsdata.io/api/1/latest?';

interface Article {
    title: string;
    image_url: string;
    description: string;
    link: string;
    source: { name: string }
    content:String;
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
        const response = await axios.get(BASE_URL, {
            params: { apiKey: API_KEY, q: query, language: 'en' },
        });
        return response.data.results || [];
    }
);

export const fetchHeadlines = createAsyncThunk(
    'news/fetchHeadlines',
    async () => {
        const response = await axios.get(BASE_URL, {
            params: { apiKey: API_KEY, language: 'en' },
        });
        return response.data.results;
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
