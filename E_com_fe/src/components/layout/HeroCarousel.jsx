import "./css/Navbar.css";

function HeroCarousel() {
  return (
    <div className="container text-center my-2 position-relative hero-carousel">
      <img
        className="d-block w-100 img-fluid h-100"
        src="/HeroCarousel.PNG"
        alt="Hero Carousel"
        style={{ height: "auto", objectFit: "cover" }}
      />
    </div>
  );
}

export default HeroCarousel;