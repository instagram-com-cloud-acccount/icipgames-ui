import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, Button, Container, Row, Col, Spinner, Pagination } from "react-bootstrap";
import GameSearch from "./GameSearch";
import { CalendarDays, ChevronLeft, ChevronRight, Radio, Sparkles } from "lucide-react";

export default function OnlineGameList() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchGames();
  }, [page]);

  const fetchGames = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`http://localhost:1331/onlinegame?page=${page}`);
      setGames(data);
    } catch (error) {
      console.error("Failed to fetch online games", error);
    }
    setLoading(false);
  };

  const extractSlug = (url) => {
    const parts = url.split("/");
    return parts[parts.length - 2];
  };
  const formatDate = (value) => {
    if (!value) return "Release date unavailable";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };
  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };
  return (
    <div className="min-vh-100 listing-page d-flex flex-column">
      <Container className="listing-search">
        <GameSearch search={search} setSearch={setSearch} />
      </Container>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center flex-grow-1">
          <Spinner animation="border" variant="info" />
          <span className="ml-2 text-white">Loading...</span>
        </div>
      ) : (
        <Container className="listing-content flex-grow-1">
          <div className="catalog-heading">
            <div>
              <span className="section-kicker"><Radio size={15} /> MULTIPLAYER</span>
              <h2>Online games</h2>
              <p>Jump into games made for playing together.</p>
            </div>
            <span className="result-count"><Sparkles size={14} /> {games.length} titles</span>
          </div>
          <Row className="g-4 listing-grid">
            {games.filter((game) => game.title.toLowerCase().includes(search.toLowerCase())).map((game, index) => (
              <Col xs={12} sm={6} md={4} key={index} className="d-flex">
                <Card className="game-card flex-grow-1">
                  <div className="game-poster"><Card.Img variant="top" src={game.image} alt={game.title} className="game-image" /></div>
                  <Card.Body className="game-card-body d-flex flex-column">
                    <Card.Title className="game-title">{game.title}</Card.Title>
                    <Card.Text className="release-date"><CalendarDays size={15} />{formatDate(game.releaseDate)}</Card.Text>
                    <Button
                      variant="primary"
                      onClick={() => navigate(`/game/${extractSlug(game.link)}`)}
                      className="game-action mt-auto w-100"
                    >
                      View details <ChevronRight size={17} />
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      )}

      {/* Pagination */}
      <Container className="d-flex justify-content-center mt-4 pb-4">
        <Pagination>
          <Pagination.Prev onClick={() => setPage(page - 1)} disabled={page === 1} />
          <Pagination.Item>{page}</Pagination.Item>
          <Pagination.Next onClick={() => setPage(page + 1)} />
        </Pagination>
      </Container>
      <Button
        variant="outline-light"
        className="back-button"
        onClick={handleBack}
      >
        <ChevronLeft size={17} /> Back
      </Button>
    </div>
  );
}
