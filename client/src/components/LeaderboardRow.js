const SECOND_TO_MS = 1000;
const MINUTE_TO_MS = SECOND_TO_MS * 60;

export function LeaderboardRow({rank, username, score, timeMs, createdAt}) {
    const minute = `${Math.floor(timeMs / MINUTE_TO_MS)}`.padStart(2, '0');
    const second = `${Math.floor((timeMs % MINUTE_TO_MS) / SECOND_TO_MS)}`.padStart(2, '0');
    const millisecond = `${timeMs % SECOND_TO_MS}`.padStart(3, '0');

    return (
        <tr>
            <td>{rank}</td>
            <td>{username}</td>
            <td>{score}</td>
            <td>{`${minute}:${second}.${millisecond}`}</td>
            <td>{new Date(createdAt).toLocaleString()}</td>
        </tr>
    );
}
