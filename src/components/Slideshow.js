import { useState, useEffect } from "react"
import { Carousel } from "react-bootstrap"
import { Gamepad2 } from "lucide-react"

const Slideshow = () => {
  const [index, setIndex] = useState(0)
  const images = [
    "https://images.squarespace-cdn.com/content/v1/56d5457d8259b57a20245e80/5454c37b-19f8-499a-bc6b-4ae4d59ae934/20230510005209_1.jpg",
    "https://images.squarespace-cdn.com/content/v1/56d5457d8259b57a20245e80/5454c37b-19f8-499a-bc6b-4ae4d59ae934/20230510005209_1.jpg",
    "https://www.slashgear.com/img/gallery/darkest-dungeon-2-gets-a-may-release-date-for-its-1-0-launch-on-steam/intro-1675715354.jpg",
    "https://www.slashgear.com/img/gallery/darkest-dungeon-2-gets-a-may-release-date-for-its-1-0-launch-on-steam/intro-1675715354.jpg",
  ]

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [images.length])

  return (
    <Carousel activeIndex={index} onSelect={handleSelect} fade className="site-hero">
      {images.map((image, idx) => (
        <Carousel.Item key={idx}>
          <img
            className="d-block w-100"
            src={image || "/placeholder.svg"}
            alt={`Slide ${idx + 1}`}
            style={{
              maxHeight: "250px",
              objectFit: "cover",
            }}
          />
          {/* Perubahan ada di className di bawah ini */}
          <Carousel.Caption 
  className="hero-copy" 
  style={{
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    textAlign: "center",
    bottom: "auto"
  }}
>
  {/* Tambahkan style mx-auto (margin-left & right auto) di span */}
  <span className="hero-eyebrow mx-auto mb-2">
    <Gamepad2 size={16} /> PC GAME LIBRARY
  </span>
  <h1>Find your next <span>adventure.</span></h1>
</Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  )
}

export default Slideshow