import { LeaderboardRow } from "./LeaderboardRow";

export function LeaderboardTable({ items }) {
    return (
        <table className="table table-bordered table-striped text-center mb-3">
            <thead>
                <tr className="table-dark">
                    <th>Rank</th>
                    <th className="w-50">Username</th>
                    <th>Score</th>
                    <th>Time</th>
                    <th>Submitted At</th>
                </tr>
            </thead>
            <tbody>
                {items.length === 0 ?
                    <tr>
                        <td colSpan="5"><strong>No items</strong></td>
                    </tr>
                    :
                    items.map((item) => (
                        <LeaderboardRow key={item.id} {...item} />
                    ))
                }
            </tbody>
        </table>
    );
}