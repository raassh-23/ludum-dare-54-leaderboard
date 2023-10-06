import { LeaderboardRow } from "./LeaderboardRow";

export function LeaderboardTable({ items }) {
    return (
        <table>
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Username</th>
                    <th>Score</th>
                    <th>Time</th>
                    <th>Submitted At</th>
                </tr>
            </thead>
            <tbody>
                {items.length === 0 ?
                    <tr>
                        <td colSpan="5">No items</td>
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