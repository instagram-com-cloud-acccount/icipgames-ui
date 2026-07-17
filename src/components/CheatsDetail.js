import { useEffect, useState } from "react"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"
import { Container, Row, Col, Card, Button, Alert, Spinner } from "react-bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"

export default function CheatsDetail() {
  const { path } = useParams()
  const [cheatDetails, setCheatDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    if (path) {
      fetchCheatDetails()
    }
  }, [path])

  const fetchCheatDetails = async () => {
    setLoading(true)
    setError("")
    try {
      const { data } = await axios.get(`http://localhost:1331/show?path=${path}`)
      setCheatDetails(data)
    } catch (error) {
      setError("Failed to fetch cheat details. Please try again later.")
      console.error("Failed to fetch cheat details", error)
    }
    setLoading(false)
  }

  const handleBack = () => {
    navigate(-1)
  }

  const renderContent = (content) => {
    if (!content) return null

    // Filter out unwanted parts like "Bagikan ini", "Terkait", etc.
    const filteredContent = content
      .replace(/Bagikan ini:.*|Suka Memuat.*|Terkait/gi, "") // Removing unnecessary parts
      .trim()

    return filteredContent.split("\n").map((line, index) => {
      if (line.includes("–")) {
        return (
          <ul key={index} className="text-light">
            {line.split("–").map((item, idx) => (
              <li key={idx}>{item.trim()}</li>
            ))}
          </ul>
        )
      }
      return (
        <p key={index} className="mb-2 text-light">
          {line}
        </p>
      )
    })
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
        <Spinner animation="border" variant="light" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      </div>
    )
  }

  if (!cheatDetails) {
    return <p className="text-center text-light">Cheat details not found.</p>
  }

  const { title, date, content, features, platforms, links, image } = cheatDetails

  return (
    <div className="detail-page min-vh-100 py-5">
      <Container className="detail-shell">
        <Card className="detail-card">
          <div className="position-relative" style={{ height: "300px" }}>
            <Card.Img src={image || "/placeholder.svg"} alt={title} className="w-100 h-100 object-fit-cover" />
            <div className="position-absolute bottom-0 start-0 w-100 p-3 bg-dark bg-opacity-75">
              <Card.Title className="h3 mb-1 text-light">{title}</Card.Title>
              <Card.Subtitle className="mb-2 text-light">Date: {date}</Card.Subtitle>
            </div>
          </div>
          <Card.Body className="p-4 p-lg-5">
            <Row className="mb-4">
              <Col>
                <h4 className="text-light">Description</h4>
                <div className="text-light">{renderContent(content)}</div>
              </Col>
            </Row>
            {features && (
              <Row className="mb-4">
                <Col>
                  <h4 className="text-light">Features and Keybinds</h4>
                  <div className="text-light">{renderContent(features)}</div>
                </Col>
              </Row>
            )}
            {platforms && platforms.length > 0 && (
              <Row className="mb-4">
                <Col>
                  <h4 className="text-light">Supported Platforms</h4>
                  <div className="d-flex flex-wrap gap-2">
                    {platforms.map((platform, index) => (
                      <span key={index} className="badge bg-secondary text-light">
                        {platform}
                      </span>
                    ))}
                  </div>
                </Col>
              </Row>
            )}
            {links && links.length > 0 && (
              <Row className="mb-4">
                <Col>
                  <h4 className="text-light">Links</h4>
                  <div className="d-flex flex-wrap gap-2">
                    {links.map((link, index) => (
                      <Button key={index} href={link.url} target="_blank" variant="outline-light" size="sm">
                        {link.text}
                      </Button>
                    ))}
                  </div>
                </Col>
              </Row>
            )}
            <Button variant="primary" className="download-button w-100 mt-3" onClick={handleBack}>
              <i className="bi bi-arrow-left me-2"></i> Back
            </Button>
          </Card.Body>
        </Card>
      </Container>
    </div>
  )
}
