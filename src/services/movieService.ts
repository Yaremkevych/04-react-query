import axios from "axios";
import { type Movie } from "../types/movie";

interface MovieArray {
    results: Movie[];
    page: number;
    total_pages: number;
}

export default async function fetchMovies(query: string): Promise<Movie[]> {
    const token: string = import.meta.env.VITE_TMDB_TOKEN;

    const response = await axios.get<MovieArray>(
        `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );
    return response.data.results;
}
