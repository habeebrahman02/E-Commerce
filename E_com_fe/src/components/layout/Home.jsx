import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';
import { FaHeart, FaRegHeart, FaShoppingCart, FaBox, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import HeroCarousel from './HeroCarousel';
import SummerSaleSection from './SummerSaleSection';
import NewCollection from './NewArrival';
import api from '../services/axios';
import './css/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
  
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products");
      // Get first 8 available products for featured section
      const availableProducts = response.data
        .filter(product => product.productAvailable)
        .slice(0, 8);
      setProducts(availableProducts);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced image conversion function for first image
  const getImageSrc = (product) => {
    try {
      if (product.imageData && typeof product.imageData === 'string') {
        if (product.imageData.startsWith('data:')) {
          return product.imageData;
        }
        const mimeType = product.imageType || 'image/jpeg';
        return `data:${mimeType};base64,${product.imageData}`;
      }

      if (product.imageData && Array.isArray(product.imageData)) {
        const base64String = btoa(String.fromCharCode.apply(null, product.imageData));
        const mimeType = product.imageType || 'image/jpeg';
        return `data:${mimeType};base64,${base64String}`;
      }

      if (product.imageData && product.imageData.data) {
        const base64String = btoa(String.fromCharCode.apply(null, product.imageData.data));
        const mimeType = product.imageType || 'image/jpeg';
        return `data:${mimeType};base64,${base64String}`;
      }

      if (product.imageData && typeof product.imageData === 'object') {
        try {
          const uint8Array = new Uint8Array(Object.values(product.imageData));
          const base64String = btoa(String.fromCharCode.apply(null, uint8Array));
          const mimeType = product.imageType || 'image/jpeg';
          return `data:${mimeType};base64,${base64String}`;
        } catch (conversionError) {
          console.error('Object conversion failed:', conversionError);
        }
      }

      return null;
    } catch (error) {
      console.error('Error converting image:', error);
      return null;
    }
  };

  // Enhanced image conversion function for second image
  const getImageSrc2 = (product) => {
    try {
      if (product.imageData2 && typeof product.imageData2 === 'string') {
        if (product.imageData2.startsWith('data:')) {
          return product.imageData2;
        }
        const mimeType = product.imageType2 || 'image/jpeg';
        return `data:${mimeType};base64,${product.imageData2}`;
      }
      
      if (product.imageData2 && Array.isArray(product.imageData2)) {
        const base64String = btoa(String.fromCharCode.apply(null, product.imageData2));
        const mimeType = product.imageType2 || 'image/jpeg';
        return `data:${mimeType};base64,${base64String}`;
      }
      
      if (product.imageData2 && product.imageData2.data) {
        const base64String = btoa(String.fromCharCode.apply(null, product.imageData2.data));
        const mimeType = product.imageType2 || 'image/jpeg';
        return `data:${mimeType};base64,${base64String}`;
      }

      if (product.imageData2 && typeof product.imageData2 === 'object') {
        try {
          const uint8Array = new Uint8Array(Object.values(product.imageData2));
          const base64String = btoa(String.fromCharCode.apply(null, uint8Array));
          const mimeType = product.imageType2 || 'image/jpeg';
          return `data:${mimeType};base64,${base64String}`;
        } catch (conversionError) {
          console.error('Object conversion failed:', conversionError);
        }
      }

      return null;
    } catch (error) {
      console.error('Error converting second image:', error);
      return null;
    }
  };

  // Get all available images for a product
  const getProductImages = (product) => {
    const images = [];
    const image1 = getImageSrc(product);
    const image2 = getImageSrc2(product);
    
    if (image1) images.push(image1);
    if (image2) images.push(image2);
    
    return images;
  };

  // Handle image navigation
  const handleImageNavigation = (productId, direction) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const images = getProductImages(product);
    if (images.length <= 1) return;

    const currentIndex = currentImageIndex[productId] || 0;
    let newIndex;

    if (direction === 'next') {
      newIndex = currentIndex >= images.length - 1 ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex <= 0 ? images.length - 1 : currentIndex - 1;
    }

    setCurrentImageIndex(prev => ({
      ...prev,
      [productId]: newIndex
    }));
  };

  // Get current image for display
  const getCurrentImage = (product) => {
    const images = getProductImages(product);
    if (images.length === 0) return null;
    
    const currentIndex = currentImageIndex[product.id] || 0;
    return images[currentIndex] || images[0];
  };

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: "", variant: "" }), 3000);
  };

  const handleAddToCart = (product) => {
    if (!user) {
      showAlert("Please login to add items to cart", "warning");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }
    navigate("/user/home");
  };

  const handleAddToWishlist = (product) => {
    if (!user) {
      showAlert("Please login to add items to wishlist", "warning");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }
    navigate("/user/home");
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa' }}>
      <HeroCarousel />
      {/* Featured Products Section */}
      <Container className="py-5">
        <Row className="mb-4">
          <Col>
            <h2 className="text-center mb-4 fw-bold">Featured Products</h2>
            {alert.show && (
              <Alert variant={alert.variant} className="mb-4">
                {alert.message}
              </Alert>
            )}
          </Col>
        </Row>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <Row className="g-4">
            {products.map((product) => {
              const currentImage = getCurrentImage(product);
              const productImages = getProductImages(product);
              const currentIndex = currentImageIndex[product.id] || 0;

              return (
                <Col key={product.id} xs={6} sm={6} md={4} lg={3}>
                  <Card className="h-100 border-0 shadow-sm product-card">
                    <div className="position-relative">
                      {currentImage ? (
                        <Card.Img
                          variant="top"
                          className="zoom-img"
                          src={currentImage}
                          alt={product.name}
                          style={{
                            height: "200px",
                            objectFit: "cover",
                            cursor: "pointer"
                          }}
                          onClick={() => user ? navigate("/user/home") : navigate("/login")}
                        />
                      ) : (
                        <div
                          className="bg-light d-flex align-items-center justify-content-center"
                          style={{ height: "200px", cursor: "pointer" }}
                          onClick={() => user ? navigate("/user/home") : navigate("/login")}
                        >
                          <FaBox size={48} className="text-muted" />
                        </div>
                      )}

                      {/* Image Navigation Arrows - Only show if multiple images */}
                      {productImages.length > 1 && (
                        <>
                          <Button
                            variant="light"
                            size="sm"
                            className="position-absolute top-50 start-0 translate-middle-y ms-2 opacity-75"
                            style={{ 
                              borderRadius: "50%", 
                              width: "30px", 
                              height: "30px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              zIndex: 2
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImageNavigation(product.id, 'prev');
                            }}
                          >
                            <FaChevronLeft size={10} />
                          </Button>
                          <Button
                            variant="light"
                            size="sm"
                            className="position-absolute top-50 end-0 translate-middle-y me-2 opacity-75"
                            style={{ 
                              borderRadius: "50%", 
                              width: "30px", 
                              height: "30px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              zIndex: 2
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImageNavigation(product.id, 'next');
                            }}
                          >
                            <FaChevronRight size={10} />
                          </Button>
                          
                          {/* Image Indicators */}
                          <div className="position-absolute bottom-0 start-50 translate-middle-x mb-2" style={{ zIndex: 2 }}>
                            <div className="d-flex gap-1">
                              {productImages.map((_, index) => (
                                <div
                                  key={index}
                                  className={`rounded-circle ${
                                    index === currentIndex ? 'bg-primary' : 'bg-light opacity-50'
                                  }`}
                                  style={{ width: "6px", height: "6px" }}
                                />
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      {/* Wishlist Button */}
                      <Button
                        variant="outline-light"
                        size="sm"
                        className="position-absolute top-0 end-0 m-2"
                        style={{ zIndex: 3 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToWishlist(product);
                        }}
                      >
                        <FaRegHeart />
                      </Button>

                      {/* Stock Badge */}
                      {product.stockQuantity <= 5 && (
                        <Badge
                          bg="warning"
                          className="position-absolute top-0 start-0 m-2"
                          style={{ zIndex: 3 }}
                        >
                          Only {product.stockQuantity} left!
                        </Badge>
                      )}
                    </div>

                    <Card.Body className="d-flex flex-column">
                      <div className="mb-2">
                        <Badge bg="secondary" className="mb-2">
                          {product.category}
                        </Badge>
                        <Card.Title className="h6 mb-1">{product.name}</Card.Title>
                        {product.brand && (
                          <small className="text-muted">{product.brand}</small>
                        )}
                      </div>

                      <Card.Text className="text-muted small flex-grow-1">
                        {product.description.length > 60
                          ? `${product.description.substring(0, 60)}...`
                          : product.description
                        }
                      </Card.Text>

                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="text-primary fw-bold mb-0">
                            ₹{product.price}
                          </h6>
                          <small className="text-muted d-none d-sm-inline">
                            {product.stockQuantity} in stock
                          </small>
                        </div>

                        <div className="d-grid">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stockQuantity === 0}
                          >
                            <FaShoppingCart className="me-1" />
                            <span className="d-none d-sm-inline">
                              {product.stockQuantity === 0 ? "Out of Stock" : "Add to Cart"}
                            </span>
                            <span className="d-sm-none">
                              {product.stockQuantity === 0 ? "Out" : "Add"}
                            </span>
                          </Button>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}

        <Row className="mt-4">
          <Col className="text-center">
            <Button
              variant="outline-primary"
              size="lg"
              onClick={() => user ? navigate("/user/home") : navigate("/login")}
            >
              View All Products
            </Button>
          </Col>
        </Row>
      </Container>
      <SummerSaleSection />
      <NewCollection />
    </div>
  );
};

export default Home;
