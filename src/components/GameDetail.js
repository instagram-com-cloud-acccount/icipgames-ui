import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, ListGroup, Alert, Spinner } from "react-bootstrap";
import { ArrowLeft, CalendarDays, Download, Gamepad2 } from "lucide-react";

export default function GameDetail() {
  const { slug } = useParams();
  const [gameDetails, setGameDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGameDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await axios.get(`http://localhost:1331/download?slug=${slug}`);
        setGameDetails(data);
      } catch (fetchError) {
        setError("Failed to fetch game details. Please try again later.");
        console.error("Failed to fetch game details", fetchError);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchGameDetails();
  }, [slug]);

  if (loading) return <div className="status-page d-flex justify-content-center align-items-center vh-100"><Spinner animation="border" variant="info" /></div>;
  if (error) return <div className="status-page d-flex justify-content-center align-items-center vh-100"><Alert variant="danger" className="text-center">{error}</Alert></div>;
  if (!gameDetails) return <p className="status-page text-center">Game details not found.</p>;

  const guide = Array.isArray(gameDetails.installationGuide) && gameDetails.installationGuide.length > 0
    ? gameDetails.installationGuide[0]
    : "No installation guide available.";

  return (
    <div className="detail-page min-vh-100 py-5">
      <Container className="detail-shell">
        <Card className="detail-card">
          <Card.Body className="p-4 p-lg-5">
            <Row className="align-items-start">
              <Col md={6} className="mb-4 mb-md-0">
                <div className="detail-cover"><Card.Img src={gameDetails.image} alt={gameDetails.title} className="detail-image" /></div>
              </Col>
              <Col md={6}>
                <span className="section-kicker"><Gamepad2 size={15} /> GAME DETAILS</span>
                <Card.Title className="detail-title">{gameDetails.title}</Card.Title>
                <Card.Subtitle className="detail-meta"><CalendarDays size={15} /> {gameDetails.releaseDate || "Release date unavailable"}</Card.Subtitle>
                <Card.Text className="detail-facts">
                  {gameDetails.developer && <><strong>Developer</strong><span>{gameDetails.developer}</span></>}
                  {gameDetails.publisher && <><strong>Publisher</strong><span>{gameDetails.publisher}</span></>}
                  {gameDetails.genre && <><strong>Genre</strong><span>{gameDetails.genre}</span></>}
                  {gameDetails.reviews && <><strong>Reviews</strong><span>{gameDetails.reviews}</span></>}
                </Card.Text>
                {gameDetails.description && <p className="detail-description">{gameDetails.description}</p>}
              </Col>
            </Row>

            <section className="detail-section">
              <h5>Installation guide</h5>
              <div className="instruction-box">{guide.split("\n").map((line, index) => <div key={index}>{line}</div>)}</div>
            </section>

            <Button href={gameDetails.downloadLinks?.[0]?.href || "#"} target="_blank" variant="primary" size="lg" className="download-button w-100" disabled={!gameDetails.downloadLinks?.length}>
              <Download size={18} /> Download now
            </Button>

            {gameDetails.systemRequirements?.length > 0 && <section className="detail-section"><h5>System requirements</h5><ListGroup>{gameDetails.systemRequirements.map((req, index) => <ListGroup.Item key={index} className="requirement-item">{req}</ListGroup.Item>)}</ListGroup></section>}
            {gameDetails.screenshots?.length > 0 && <section className="detail-section"><h5>Screenshots</h5><Row>{gameDetails.screenshots.map((src, index) => <Col key={index} xs={12} sm={6} md={4} className="mb-3"><img src={src} alt={`Screenshot ${index + 1}`} className="screenshot-image" /></Col>)}</Row></section>}
            {gameDetails.generalNote && <section className="detail-section"><h5>General note</h5><div className="instruction-box" dangerouslySetInnerHTML={{ __html: gameDetails.generalNote.replace(/\n/g, "<br />") }} /></section>}
            {gameDetails.howToInstall && <section className="detail-section"><h5>How to install</h5><div className="instruction-box" dangerouslySetInnerHTML={{ __html: gameDetails.howToInstall.replace(/\n/g, "<br />") }} /></section>}
            {gameDetails.howToPlayOnline && <section className="detail-section"><h5>How to play online</h5><div className="instruction-box" dangerouslySetInnerHTML={{ __html: gameDetails.howToPlayOnline.replace(/\n/g, "<br />") }} /></section>}
            {gameDetails.trailer && <section className="detail-section"><h5>Trailer</h5><video controls className="trailer"><source src={gameDetails.trailer} type="video/webm" />Your browser does not support the video tag.</video></section>}
          </Card.Body>
        </Card>
      </Container>
      <Button variant="outline-light" className="back-button" onClick={() => navigate(-1)}><ArrowLeft size={17} /> Back</Button>
    </div>
  );
}
