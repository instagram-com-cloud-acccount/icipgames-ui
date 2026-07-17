import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Spinner,
  Pagination,
} from "react-bootstrap";
import GameSearch from "./GameSearch";

export default function GameList() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGames();
  }, [page]);

  const fetchGames = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `http://localhost:1331/scrape`
      );
      setGames(data); // Set the fetched games data
    } catch (error) {
      console.error("Failed to fetch games", error);
    }
    setLoading(false);
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
        <Container className="listing-content flex-1">
          <Row>
            {/* Main Content Column */}
            <Col md={12}>
              <Row className="g-4">
                {games
                  .filter((game) =>
                    game.title.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((game, index) => (
                    <Col xs={12} sm={6} md={4} key={index} className="d-flex">
                      <Card className="game-card flex-grow-1">
                        <div
                          className="game-poster"
                        >
                          <Card.Img
                            variant="top"
                            src={game.image}
                            alt={game.title}
                            className="game-image"
                          />
                        </div>
                        <Card.Body className="game-card-body d-flex flex-column">
                          <Card.Title className="game-title">{game.title}</Card.Title>
                          <Button
                            variant="primary"
                            onClick={() =>
                              navigate(`/cheats-detail/${game.link.split('/').slice(-2).join('/')}`)
                            }
                            className="game-action mt-auto w-100"
                          >
                            View details
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
              </Row>
            </Col>
          </Row>
        </Container>
      )}

      {/* Pagination */}
      <Container className="d-flex justify-content-center mt-4 pb-4">
        <Pagination>
          <Pagination.Prev
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          />
          <Pagination.Item>{page}</Pagination.Item>
          <Pagination.Next onClick={() => setPage(page + 1)} />
        </Pagination>
      </Container>
      
      {/* Back Button */}
      <Button
        variant="outline-light"
        className="back-button"
        onClick={handleBack}
      >
        Back
      </Button>
    </div>
  );
}
