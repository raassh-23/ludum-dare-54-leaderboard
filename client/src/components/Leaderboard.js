import { useEffect, useState } from 'react';
import { LeaderboardTable } from "./LeaderboardTable";
import ReactPaginate from 'react-paginate';

export function Leaderboard() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [maxPage, setMaxPage] = useState(1);
    const [items, setItems] = useState([]);

    useEffect(() => {
        setLoading(true);

        const url = new URL("/leaderboard", window.location.origin);
        url.searchParams.set("page", page);
        url.searchParams.set("pageSize", pageSize);

        fetch(url)
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to fetch leaderboard");
                }

                return res.json();
            })
            .then(json => {
                setLoading(false);
                setError(null);

                const { items: newItems, maxPage: newMaxPage } = json.data;
                setItems(newItems);
                setMaxPage(newMaxPage);

                console.log(json);
            })
            .catch(err => {
                setLoading(false);
                setError(err);
                console.error(err);
            })
    }, [page, pageSize]);

    const handlePageClick = ({selected}) => {
        setPage(selected + 1);
    }

    return (
        (loading && <p>Loading...</p>) ||
        (error && <p>Error: {error.message}</p>) ||
        <>
            <LeaderboardTable items={items} offset={(page-1) * pageSize} />
            <ReactPaginate
                breakLabel="..."
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                pageCount={maxPage}
                previousLabel="< previous"
                renderOnZeroPageCount={null}
            />
        </>
    );
}
