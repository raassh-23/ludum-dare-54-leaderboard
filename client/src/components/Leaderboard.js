import { useEffect, useState } from 'react';
import { LeaderboardTable } from "./LeaderboardTable";
import { TextInput } from './TextInput';
import ReactPaginate from 'react-paginate';

export function Leaderboard() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [maxPage, setMaxPage] = useState(1);
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const constroller = new AbortController();

        setLoading(true);

        const url = new URL("/leaderboard", window.location.origin);
        url.searchParams.set("page", page);
        url.searchParams.set("pageSize", pageSize);
        url.searchParams.set("search", search);

        fetch(url, {
            signal: constroller.signal,
        }).then(res => {
            if (!res.ok) {
                throw new Error("Failed to fetch leaderboard");
            }

            return res.json();
        }).then(json => {
            setLoading(false);
            setError(null);

            const { items: newItems, maxPage: newMaxPage } = json.data;
            setItems(newItems);
            setMaxPage(newMaxPage);

            console.log(json);
        }).catch(err => {
            if (err.name !== "AbortError") {
                setLoading(false);
                setError(err);
            }

            console.error(err);
        })

        return (() => constroller.abort());
    }, [page, pageSize, search]);

    return (
        <>
            <TextInput
                label="Page Size"
                name="page-size"
                type="number"
                value={pageSize}
                onChange={({ target }) => {setPageSize(target.value); setPage(1)}}
            />
            <TextInput
                label="Search"
                name="search"
                type="text"
                value={search}
                onChange={({ target }) => {setSearch(target.value); setPage(1)}}
            />
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error?.message}</p>
            ) : (
                <>
                    <LeaderboardTable items={items} />
                    <ReactPaginate
                        breakLabel="..."
                        nextLabel="next >"
                        onPageChange={({ selected }) => setPage(selected + 1)}
                        pageRangeDisplayed={3}
                        pageCount={maxPage}
                        previousLabel="< previous"
                        renderOnZeroPageCount={null}
                    />
                </>
            )}
        </>
    );
}
