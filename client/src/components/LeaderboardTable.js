import { LeaderboardRow } from "./LeaderboardRow";

export function LeaderboardTable({items, offset}) {
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
                {items.map((item, index) => (
                    <LeaderboardRow key={item.id} rank={offset + index + 1} {...item} />
                ))}
            </tbody>
        </table>
    );
}