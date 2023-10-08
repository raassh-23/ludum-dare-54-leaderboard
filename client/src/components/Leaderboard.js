import { useEffect, useState, useReducer } from 'react';
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
    const [increment, forceUpdate] = useReducer(x => x + 1, 0);

    useEffect(() => {
        const constroller = new AbortController();

        setLoading(true);
        setError(null);

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
    }, [page, pageSize, search, type, increment]);

    return (
        <>
            <div className="row g-2 mb-3">
                <div className='col-md-9'>
                    <div className='row g-2'>
                        <div className='col-md-3'>
                            <Dropdown
                                label="Played on"
                                name="played-on"
                                value={type}
                                onChange={({ target }) => { setType(target.value); setPage(1) }}
                                items={["All", "Desktop", "Mobile"]}
                            />
                        </div>
                        <div className='col-md-3'>
                            <TextInput
                                label="Page Size"
                                name="page-size"
                                type="number"
                                value={pageSize}
                                onChange={({ target }) => { setPageSize(target.value); setPage(1) }}
                            />
                        </div>
                    </div>
                </div>
                <div className='col-md-3'>
                    <TextInput
                        label="Search"
                        name="search"
                        type="text"
                        value={search}
                        onChange={({ target }) => { setSearch(target.value); setPage(1) }}
                    />
                </div>
            </div>
            {loading ? (
                <div class="text-center">
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : error ? (
                <div className='text-center'>
                    <div class="alert alert-danger" role="alert">
                        <strong> Something went wrong. Please try again.</strong>
                    </div>
                    <button type="button" class="btn btn-primary btn-sm ms-2" onClick={() => { forceUpdate(); }}>Try Again</button>
                </div>
            ) : (
                <>
                    <LeaderboardTable items={items} />
                    <ReactPaginate
                        onPageChange={({ selected }) => setPage(selected + 1)}
                        pageRangeDisplayed={3}
                        pageCount={maxPage}
                        forcePage={page - 1}
                        previousLabel="«"
                        breakLabel="..."
                        nextLabel="»"
                        renderOnZeroPageCount={null}
                        containerClassName='pagination justify-content-center text-dark'
                        pageClassName='page-item'
                        pageLinkClassName='page-link'
                        breakClassName='page-item'
                        breakLinkClassName='page-link'
                        activeClassName='active'
                        disabledClassName='disabled'
                        previousClassName='page-item'
                        previousLinkClassName='page-link'
                        nextClassName='page-item'
                        nextLinkClassName='page-link'
                    />
                </>
            )}
        </>
    );
}
