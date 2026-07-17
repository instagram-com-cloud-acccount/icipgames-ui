import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Alert, Spinner } from "react-bootstrap";
import { ArrowLeft, Download, Gamepad2, Play } from "lucide-react";

export default function GameDetailID() {
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
        const { data } = await axios.get(`http://localhost:1331/gamesturah?url=https://triahgames.com/${slug}`);
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

  return (
    <div className="detail-page min-vh-100 py-5">
      <Container className="detail-shell">
        <Card className="detail-card">
          <Card.Body className="p-4 p-lg-5">
            <Row className="align-items-start">
              <Col md={6} className="mb-4 mb-md-0"><div className="detail-cover"><Card.Img src={gameDetails.postImage} alt={gameDetails.title} className="detail-image" /></div></Col>
              <Col md={6}>
                <span className="section-kicker"><Gamepad2 size={15} /> GAME DETAILS</span>
                <Card.Title className="detail-title">{gameDetails.title}</Card.Title>
                <section className="detail-section compact"><h5>System requirements</h5><div className="instruction-box">{gameDetails.systemRequirements?.minimum?.map((req, index) => <div key={index}>• {req}</div>) || "Not available"}</div></section>
              </Col>
            </Row>
            <section className="detail-section"><h5>Download links</h5><div className="d-flex flex-column gap-2">{gameDetails.downloadLinks?.map((link, index) => <Button key={index} href={link.link} target="_blank" variant="primary" className="download-button"><Download size={17} /> {link.text}</Button>)}</div></section>
            {gameDetails.screenshots?.length > 0 && <section className="detail-section"><h5>Screenshots</h5><Row>{gameDetails.screenshots.map((src, index) => <Col key={index} xs={12} sm={6} md={4} className="mb-3"><img src={src} alt={`Screenshot ${index + 1}`} className="screenshot-image" /></Col>)}</Row></section>}
            {gameDetails.videoLinks?.length > 0 && <section className="detail-section"><h5><Play size={17} /> Gameplay video</h5><iframe className="trailer" src={gameDetails.videoLinks[0]} title="Gameplay Video" frameBorder="0" allowFullScreen /></section>}
          </Card.Body>
        </Card>
      </Container>
      <Button variant="outline-light" className="back-button" onClick={() => navigate(-1)}><ArrowLeft size={17} /> Back</Button>
    </div>
  );
}
