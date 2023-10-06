import { useEffect, useState } from 'react';
import { LeaderboardTable } from "./LeaderboardTable";
import { TextInput } from './TextInput';
import ReactPaginate from 'react-paginate';
import { Dropdown } from './Dropdown';

export function Leaderboard() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [maxPage, setMaxPage] = useState(1);
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState("");
    const [type, setType] = useState("all");

    useEffect(() => {
        const constroller = new AbortController();

        setLoading(true);

        const url = new URL("/leaderboard", window.location.origin);
        url.searchParams.set("page", page);
        url.searchParams.set("pageSize", pageSize);
        url.searchParams.set("search", search);
        url.searchParams.set("type", type);

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
    }, [page, pageSize, search, type]);

    return (
        <>
            <Dropdown
                label="Played on"
                name="played-on"
                value="all"
                onChange={({ target }) => {setType(target.value); setPage(1)}}
                items={["all", "desktop", "mobile"]}
            />
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
