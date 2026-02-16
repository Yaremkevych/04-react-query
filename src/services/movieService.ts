import axios from "axios";
import { type Movie } from "../types/movie";

export interface MovieArray {
    results: Movie[];
    page: number;
    total_pages: number;
    total_results: number;
}

export default async function fetchMovies(
    query: string,
    page: number,
): Promise<MovieArray> {
    const API_TOKEN: string = import.meta.env.VITE_TMDB_TOKEN;

    const response = await axios.get<MovieArray>(
        `https://api.themoviedb.org/3/search/movie`,
        {
            params: {
                query: query,
                language: "en-US",
                page,
            },
            headers: {
                Authorization: `Bearer ${API_TOKEN}`,
            },
        },
    );
    return response.data;
}
