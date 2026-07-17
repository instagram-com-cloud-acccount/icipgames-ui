import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Button, Card, Row, Col, Spinner, InputGroup } from "react-bootstrap";
import { CalendarDays, ChevronRight, Search, Sparkles, Wifi } from "lucide-react";

function SearchCard({ game, source, onOpen }) {
  const formatDate = (value) => {
    if (!value) return source;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <Col sm={12} md={6} lg={4} className="d-flex mb-4">
      <Card className="game-card search-game-card flex-grow-1">
        <div className="game-poster"><Card.Img variant="top" src={game.image} alt={game.title} className="game-image" /></div>
        <Card.Body className="game-card-body d-flex flex-column">
          <span className="search-source">{source}</span>
          <Card.Title className="game-title">{game.title}</Card.Title>
          <Card.Text className="release-date"><CalendarDays size={15} />{formatDate(game.releaseDate)}</Card.Text>
          <Button variant="primary" onClick={onOpen} className="game-action mt-auto w-100">View details <ChevronRight size={17} /></Button>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default function GameSearch() {
  const [query, setQuery] = useState("");
  const [localGames, setLocalGames] = useState([]);
  const [externalGames, setExternalGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const hasResults = localGames.length > 0 || externalGames.length > 0;

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const [localResponse, externalResponse] = await Promise.all([
        axios.get(`https://resapi-icip.vercel.app/gameturah?search=${query}`),
        axios.get(`https://resapi-icip.vercel.app/search?q=${query}`),
      ]);
      setLocalGames(localResponse.data);
      setExternalGames(externalResponse.data);
    } catch (searchError) {
      setError("Failed to fetch search results");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="game-search">
      <Form onSubmit={handleSearch} className="search-form">
        <InputGroup>
          <Form.Control type="search" placeholder="Search for games..." value={query} onChange={(event) => setQuery(event.target.value)} className="search-input" />
          <Button className="search-button" type="submit" aria-label="Search games"><Search size={18} /> <span>Search</span></Button>
          <Button className="online-button" onClick={() => navigate("/onlinegames")}><Wifi size={17} /> <span>Online Games</span></Button>
        </InputGroup>
      </Form>

      {loading && <div className="search-state"><Spinner animation="border" variant="info" /> Searching games…</div>}
      {error && <p className="search-error">{error}</p>}
      {hasResults && <div className="search-results-wrap">
        <div className="search-results-heading"><span className="section-kicker"><Sparkles size={15} /> SEARCH RESULTS</span><span>{localGames.length + externalGames.length} titles found</span></div>
        {localGames.length > 0 && <><h3 className="search-group-title">Library matches</h3><Row className="search-results">{localGames.map((game, index) => <SearchCard key={`local-${index}`} game={game} source="Library" onOpen={() => navigate(`/gameid/${game.link.split("/").filter(Boolean).pop()}`)} />)}</Row></>}
        {externalGames.length > 0 && <><h3 className="search-group-title">Latest matches</h3><Row className="search-results">{externalGames.map((game, index) => <SearchCard key={`external-${index}`} game={game} source="New release" onOpen={() => navigate(`/game/${game.slug}`)} />)}</Row></>}
      </div>}
    </div>
  );
}
