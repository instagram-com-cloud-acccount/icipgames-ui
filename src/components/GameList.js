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
  ListGroup,
} from "react-bootstrap";
import { CalendarDays, ChevronRight, Compass, Sparkles } from "lucide-react";
import GameSearch from "./GameSearch";
import Slideshow from "./Slideshow"; // Import the Slideshow component

const categories = [
  "action",
  "gore",
  "rpg",
  "violent",
  "adventure",
  "horror",
  "simulation",
  "vr",
  "casual",
  "indie",
  "sports",
  "nostalgia-games",
  "early-access",
  "racing",
  "strategy",
  "cheat-games",
  "online-games",
];

export default function GameList() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("action");
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedCategory !== "cheat-games" && selectedCategory !== "online-games") {
      fetchGames();
    }
  }, [page, selectedCategory]);

  const fetchGames = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://www.icipgames.site/category?category=${selectedCategory}&page=${page}`
      );
      setGames(data);
    } catch (error) {
      console.error("Failed to fetch games", error);
    }
    setLoading(false);
  };

  const extractSlug = (url) => {
    const parts = url.split("/");
    return parts[parts.length - 2];
  };

  const handleCategoryClick = (category) => {
    if (category === "cheat-games") {
      navigate("/cheats");
    } else if (category === "online-games") {
      navigate("/onlinegames");
    } else {
      setSelectedCategory(category);
      setPage(1);
    }
  };

  return (
    <div className="min-vh-100 app-shell d-flex flex-column">
      {/* Slideshow in the header */}
      <Slideshow />

      <Container className="search-zone">
        <GameSearch search={search} setSearch={setSearch} />
      </Container>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center flex-grow-1">
          <Spinner animation="border" variant="info" />
          <span className="ml-2 text-white">Loading...</span>
        </div>
      ) : (
        <Container className="catalog-zone flex-1">
          <div className="catalog-heading">
            <div>
              <span className="section-kicker"><Sparkles size={15} /> FRESH PICKS</span>
              <h2>Recently added games</h2>
              <p>Browse the latest titles in the <strong>{selectedCategory}</strong> collection.</p>
            </div>
            <span className="result-count">{games.length} titles</span>
          </div>
          <Row className="align-items-start">
            <Col lg={9}>
              <Row className="g-4">
                {games
                  .filter((game) =>
                    game.title.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((game, index) => (
                    <Col xs={12} sm={6} md={4} key={index} className="d-flex">
                      <Card className="game-card flex-grow-1">
                        <div className="game-poster">
                          <Card.Img
                            variant="top"
                            src={game.image}
                            alt={game.title}
                            className="game-image"
                          />
                        </div>
                        <Card.Body className="game-card-body d-flex flex-column">
                          <Card.Title className="game-title">{game.title}</Card.Title>
                          <Card.Text className="release-date">
                            <CalendarDays size={15} />
                            {game.releaseDate
                              ? new Date(game.releaseDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )
                              : "Release Date Unavailable"}
                          </Card.Text>
                          <Button
                            variant="primary"
                            onClick={() =>
                              navigate(`/game/${extractSlug(game.link)}`)
                            }
                            className="game-action mt-auto w-100"
                          >
                            View details <ChevronRight size={17} />
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
              </Row>
            </Col>

            <Col lg={3} className="genre-column">
              <Card className="genre-card">
                <Card.Header>
                  <Compass size={18} /> Browse genres
                </Card.Header>
                <Card.Body className="p-3">
                  <ListGroup variant="flush" className="genre-grid">
                    {categories.map((category) => (
                      <ListGroup.Item
                        action
                        className="genre-item"
                        active={selectedCategory === category}
                        onClick={() => handleCategoryClick(category)}
                        key={category}
                      >
                        <div className="d-flex align-items-center">
                          <span className="me-auto">{category.replace(/-/g, " ")}</span>
                          {selectedCategory === category && (
                            <ChevronRight size={17} className="ms-2" />
                          )}
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
              {/* Poster image remains intact */}
<div className="download-help">
                <span>BUTUH BANTUAN?</span>
                <h3>Cara download</h3>
                <p>Panduan singkat sebelum kamu mulai instalasi game berikutnya.</p>
                <iframe title="How to download guide" src="https://player.vimeo.com/video/1052633774" width="300" height="180" frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
              </div>
              <div className="download-help">
                <span>PENTING!</span>
                <h3>ICIP Games</h3>
                <p>Kami sama sekali gak nge-crack software apa pun. Kami cuma ngebagiin ulang file terverifikasi yang dikumpulin dari forum publik, blog, dan website luar yang tepercaya.</p>
               </div>
              <div className="download-help">
                <span>PENTING!</span>
                <p>Semua game di website ini bukan rilis resmi dari pihak developer. Harap beli game originalnya buat dapetin pengalaman terbaik.</p>
              </div>
              <div className="download-help">
                <span>PENTING!</span>
                <p>Semua game di website ini cuma buat tujuan testing aja (buat nyari bug, bantu developer, dan biar pemain bisa nyoba dulu sebelum mutusin buat beli).</p>
              </div>
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
    </div>
  );
}
