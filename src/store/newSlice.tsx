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



export const fetchHeadlines = createAsyncThunk<Article[], string>(
    'news/fetchHeadlines',
    async () => {
        try {
            const response = await axios.get(`${BASE_URL}/top-headlines`, {
                params: { category: '', apiKey: API_KEY, country: 'us' },
            });
            return response.data.articles;
        } catch (error) {

            return error;
        }
    }
);

export const fetchArticles = createAsyncThunk(
    'news/fetchArticles',
    async (query: string) => {
        try {
            const response = await axios.get(`${BASE_URL}/everything`,
                { params: { q: query, apiKey: API_KEY } });

            return response.data.articles;
        } catch (error) {
            return error;
        }
    }
);

const loadFavorites = (): Article[] => {
    try {
        const serializedFavorites = localStorage.getItem('favorites');
        if (serializedFavorites === null) {
            return [];
        }
        return JSON.parse(serializedFavorites) as Article[];
    } catch (error) {
        console.log(error);

        return [];

    }
}
const saveFavorites = (favorites: Article[]) => {
    try {
        const serializedFavorites = JSON.stringify(favorites);
        localStorage.setItem('favorites', serializedFavorites);
    } catch (error) {
        console.error(error);
    }
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
                saveFavorites(state.favorites)
            }
        },
        removeFavorite: (state, action: PayloadAction<string>) => {
            state.favorites = state.favorites.filter(fav => fav.title !== action.payload);
            saveFavorites(state.favorites)
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
            .addCase(fetchHeadlines.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch headlines';
            })
            .addCase(fetchArticles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchArticles.fulfilled, (state, action: PayloadAction<Article[]>) => {
                state.articles = action.payload;
                state.loading = false;
            })
            .addCase(fetchArticles.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to fetch articles';
                state.loading = false;
            });

    }
});



export const { addFavorite, removeFavorite } = newsSlice.actions;
export default newsSlice.reducer;
