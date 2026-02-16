import SearchBar from "../SearchBar/SearchBar.tsx";
import Loader from "../Loader/Loader.tsx";
import ErrorMessage from "../ErrorMessage/ErrorMessage.tsx";
import MovieGrid from "../MovieGrid/MovieGrid.tsx";
import MovieModal from "../MovieModal/MovieModal.tsx";
import fetchMovies, { type MovieArray } from "../../services/movieService.ts";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { type Movie } from "../../types/movie.ts";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import css from "./App.module.css";

export default function App() {
    const [topic, setTopic] = useState("");
    const [page, setPage] = useState(1);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const { data, isLoading, isError } = useQuery<MovieArray, Error>({
        queryKey: ["movies", topic, page],
        queryFn: () => fetchMovies(topic, page),
        enabled: topic !== "",
        placeholderData: keepPreviousData,
    });

    useEffect(() => {
        if (data && data.results.length === 0) {
            toast.error("No movies found for your request");
        }
    }, [data]);

    const handleSearch = (searchQuery: string) => {
        setTopic(searchQuery);
        setPage(1);
    };
    return (
        <>
            <Toaster position="top-center" />

            <SearchBar onSubmit={handleSearch} />
            {data && data.total_pages > 1 && (
                <ReactPaginate
                    pageCount={data.total_pages}
                    pageRangeDisplayed={5}
                    marginPagesDisplayed={1}
                    onPageChange={({ selected }) => setPage(selected + 1)}
                    forcePage={page - 1}
                    containerClassName={css.pagination}
                    activeClassName={css.active}
                    nextLabel="→"
                    previousLabel="←"
                />
            )}

            {isLoading && <Loader />}
            {isError && <ErrorMessage />}

            {data && data.results.length > 0 && (
                <MovieGrid movies={data.results} onSelect={setSelectedMovie} />
            )}

            {selectedMovie && (
                <MovieModal
                    movie={selectedMovie}
                    onClose={() => setSelectedMovie(null)}
                />
            )}
        </>
    );
}
