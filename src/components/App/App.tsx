import SearchBar from "../SearchBar/SearchBar.tsx";
import Loader from "../Loader/Loader.tsx";
import ErrorMessage from "../ErrorMessage/ErrorMessage.tsx";
import MovieGrid from "../MovieGrid/MovieGrid.tsx";
import MovieModal from "../MovieModal/MovieModal.tsx";
import fetchMovies from "../../services/movieService.ts";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { type Movie } from "../../types/movie.ts";

export default function App() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isError, setIsError] = useState(false);
    const [isLoad, setIsLoad] = useState(false);
    const [modal, setModal] = useState<Movie | null>(null);

    function onClickCard(movie: Movie): void {
        setModal(movie);
    }

    function closeModal() {
        setModal(null);
    }

    async function findFilms(query: string): Promise<void> {
        setIsLoad(true);
        setIsError(false);
        try {
            const arr: Movie[] = (await fetchMovies(query)) as Movie[];
            if (arr.length === 0) {
                toast("No movies found for your request.", {
                    style: {
                        borderRadius: "25px",
                        background: "#333",
                        color: "#fff",
                    },
                });
                setMovies([]);
                setIsLoad(false);
            } else {
                setIsLoad(false);
                setMovies(arr);
            }
        } catch {
            setMovies([]);
            setIsError(true);
            setIsLoad(false);
        }
    }

    return (
        <>
            <Toaster />
            <SearchBar onSubmit={findFilms} />
            {movies.length > 0 && (
                <MovieGrid movies={movies} onSelect={onClickCard} />
            )}
            {isError && <ErrorMessage />}
            {isLoad && <Loader />}
            {modal && <MovieModal movie={modal} onClose={closeModal} />}
        </>
    );
}
