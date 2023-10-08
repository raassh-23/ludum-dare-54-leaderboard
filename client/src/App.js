import { Leaderboard } from './components/Leaderboard';
import './App.css';

function App() {
  return (
    <div className="App container-fluid">
      <header className="App-header text-center mt-5 mb-4">
        <h1 className='fw-bold'>Boxed In Leaderboard</h1>
      </header>
      <Leaderboard/>
    </div>
  );
}

export default App;
