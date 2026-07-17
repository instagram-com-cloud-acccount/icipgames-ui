import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GameList from "./components/GameList"; // Pastikan path sesuai
import GameDetail from "./components/GameDetail";
import GameDetailID from "./components/GameDetailID";
import OnlineGameList from "./components/OnlineGameList";
import Cheats from "./components/Cheats"; 
import CheatsDetail from "./components/CheatsDetail"; 
// Pastikan path sesuai
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GameList />} /> {/* Tambahkan daftar game di halaman utama */}
        <Route path="/game/:slug" element={<GameDetail />} /> {/* Rute detail game */}
        <Route path="/gameid/:slug" element={<GameDetailID />} /> {/* Rute detail game */}
        <Route path="/onlinegames" element={<OnlineGameList />} />
        <Route path="/cheats-detail/:path" element={<CheatsDetail />} />
        <Route path="/cheats" element={<Cheats />} />
      </Routes>
    </Router>
  );
}

export default App;
