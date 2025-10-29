import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Badge,
  Form,
  InputGroup,
  Modal,
  Spinner,
  Alert,
  Offcanvas,
  Toast,
  ToastContainer
} from "react-bootstrap";
import { 
  FaSearch,
  FaFilter,
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
  FaEye,
  FaStar,
  FaRegStar,
  FaBox,
  FaUser,
  FaSignOutAlt,
  FaTimes,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";
import api from "../services/axios";

const UserHome = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const dispatchStorageEvent = (eventType) => {
      window.dispatchEvent(new Event(eventType));
  };
  
  // State management
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("name");
  
  // Modal states
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Cart and Wishlist states
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  
  // Image carousel state - track current image for each product
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  
  // Toast notifications
  const [toasts, setToasts] = useState([]);
  
  const categories = ["Shirts", "Pants", "T-shirts", "Hoodies", "Sneakers", "Shades"];

  useEffect(() => {
    fetchProducts();
    loadCartFromStorage();
    loadWishlistFromStorage();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, selectedCategory, priceRange, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products");
      const availableProducts = response.data.filter(product => product.productAvailable);
      setProducts(availableProducts);
      setError("");
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Price range filter
    if (priceRange.min) {
      filtered = filtered.filter(product => parseFloat(product.price) >= parseFloat(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter(product => parseFloat(product.price) <= parseFloat(priceRange.max));
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return parseFloat(a.price) - parseFloat(b.price);
        case "price-high":
          return parseFloat(b.price) - parseFloat(a.price);
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
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

  // Cart functions
  const loadCartFromStorage = () => {
    const savedCart = localStorage.getItem(`cart_${user?.id}`);
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const saveCartToStorage = (cartData) => {
    localStorage.setItem(`cart_${user?.id}`, JSON.stringify(cartData));
  };

  const addToCart = (product) => {
    if (!user) {
      showToast("Please login to add items to cart", "warning");
      navigate("/login");
      return;
    }

    const existingItem = cart.find((item) => item.id === product.id);
    let newCart;

    if (existingItem) {
      if (existingItem.quantity >= product.stockQuantity) {
        showToast("Cannot add more items. Stock limit reached!", "warning");
        return;
      }
      newCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(newCart);
    saveCartToStorage(newCart);
    dispatchStorageEvent("cartUpdated"); 
    showToast(`${product.name} added to cart!`, "success");
  };

  // Wishlist functions
  const loadWishlistFromStorage = () => {
    const savedWishlist = localStorage.getItem(`wishlist_${user?.id}`);
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  };

  const saveWishlistToStorage = (wishlistData) => {
    localStorage.setItem(`wishlist_${user?.id}`, JSON.stringify(wishlistData));
  };

  const toggleWishlist = (product) => {
    if (!user) {
      showToast("Please login to add items to wishlist", "warning");
      navigate("/login");
      return;
    }

    const isInWishlist = wishlist.some(item => item.id === product.id);
    let newWishlist;

    if (isInWishlist) {
      newWishlist = wishlist.filter(item => item.id !== product.id);
      showToast(`${product.name} removed from wishlist`, "info");
    } else {
      newWishlist = [...wishlist, product];
      showToast(`${product.name} added to wishlist!`, "success");
    }

    setWishlist(newWishlist);
    saveWishlistToStorage(newWishlist);
    dispatchStorageEvent("wishlistUpdated"); 
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  // Toast notification
  const showToast = (message, variant) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setPriceRange({ min: "", max: "" });
    setSortBy("name");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Container className="py-4">
        {/* Search and Filter Bar */}
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <Row className="g-3 align-items-end">
                  <Col md={4}>
                    <Form.Label>Search Products</Form.Label>
                    <InputGroup>
                      <InputGroup.Text><FaSearch /></InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>
                  </Col>
                  <Col md={2}>
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={2}>
                    <Form.Label>Sort By</Form.Label>
                    <Form.Select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="name">Name A-Z</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </Form.Select>
                  </Col>
                  <Col md={2}>
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowFilters(true)}
                      className="w-100"
                    >
                      <FaFilter className="me-2" />
                      More Filters
                    </Button>
                  </Col>
                  <Col md={2}>
                    <Button
                      variant="outline-danger"
                      onClick={clearFilters}
                      className="w-100"
                    >
                      Clear All
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Loading products...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">
            {error}
            <Button variant="outline-danger" size="sm" className="ms-2" onClick={fetchProducts}>
              Retry
            </Button>
          </Alert>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-5">
            <FaBox size={48} className="text-muted mb-3" />
            <h5 className="text-muted">No products found</h5>
            <p className="text-muted">Try adjusting your search or filter criteria</p>
            <Button variant="primary" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-3">
              <span className="text-muted">
                Showing {filteredProducts.length} of {products.length} products
              </span>
            </div>
            <Row className="g-4">
              {filteredProducts.map((product) => {
                const currentImage = getCurrentImage(product);
                const productImages = getProductImages(product);
                const inWishlist = isInWishlist(product.id);
                const currentIndex = currentImageIndex[product.id] || 0;
                
                return (
                  <Col key={product.id} sm={6} md={4} lg={3}>
                    <Card className="h-100 border-0 shadow-sm product-card">
                      <div className="position-relative">
                        {currentImage ? (
                          <Card.Img
                            variant="top"
                            src={currentImage}
                            alt={product.name}
                            style={{
                              height: "250px",
                              objectFit: "cover",
                              cursor: "pointer"
                            }}
                            onClick={() => openProductModal(product)}
                          />
                        ) : (
                          <div
                            className="bg-light d-flex align-items-center justify-content-center"
                            style={{ height: "250px", cursor: "pointer" }}
                            onClick={() => openProductModal(product)}
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
                                width: "35px", 
                                height: "35px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleImageNavigation(product.id, 'prev');
                              }}
                            >
                              <FaChevronLeft size={12} />
                            </Button>
                            <Button
                              variant="light"
                              size="sm"
                              className="position-absolute top-50 end-0 translate-middle-y me-2 opacity-75"
                              style={{ 
                                borderRadius: "50%", 
                                width: "35px", 
                                height: "35px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleImageNavigation(product.id, 'next');
                              }}
                            >
                              <FaChevronRight size={12} />
                            </Button>
                            
                            {/* Image Indicators */}
                            <div className="position-absolute bottom-0 start-50 translate-middle-x mb-2">
                              <div className="d-flex gap-1">
                                {productImages.map((_, index) => (
                                  <div
                                    key={index}
                                    className={`rounded-circle ${
                                      index === currentIndex ? 'bg-primary' : 'bg-light opacity-50'
                                    }`}
                                    style={{ width: "8px", height: "8px" }}
                                  />
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                        
                        {/* Wishlist Button */}
                        <Button
                          variant={inWishlist ? "danger" : "outline-light"}
                          size="sm"
                          className="position-absolute top-0 end-0 m-2"
                          onClick={() => toggleWishlist(product)}
                        >
                          {inWishlist ? <FaHeart /> : <FaRegHeart />}
                        </Button>

                        {/* Stock Badge */}
                        {product.stockQuantity <= 5 && (
                          <Badge
                            bg="warning"
                            className="position-absolute top-0 start-0 m-2"
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
                          {product.description.length > 80
                            ? `${product.description.substring(0, 80)}...`
                            : product.description
                          }
                        </Card.Text>

                        <div className="mt-auto">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h5 className="text-primary fw-bold mb-0">
                              ₹{product.price}
                            </h5>
                            <small className="text-muted">
                              {product.stockQuantity} in stock
                            </small>
                          </div>

                          <div className="d-grid gap-2">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => addToCart(product)}
                              disabled={product.stockQuantity === 0}
                            >
                              <FaShoppingCart className="me-2" />
                              {product.stockQuantity === 0 ? "Out of Stock" : "Add to Cart"}
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => openProductModal(product)}
                            >
                              <FaEye className="me-2" />
                              Quick View
                            </Button>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </>
        )}
      </Container>

      {/* Advanced Filters Offcanvas */}
      <Offcanvas show={showFilters} onHide={() => setShowFilters(false)} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Advanced Filters</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form>
            <div className="mb-4">
              <Form.Label className="fw-semibold">Price Range</Form.Label>
              <Row>
                <Col>
                  <Form.Control
                    type="number"
                    placeholder="Min Price"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="number"
                    placeholder="Max Price"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  />
                </Col>
              </Row>
            </div>

            <div className="d-grid gap-2">
              <Button variant="primary" onClick={() => setShowFilters(false)}>
                Apply Filters
              </Button>
              <Button variant="outline-secondary" onClick={clearFilters}>
                Clear All Filters
              </Button>
            </div>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Product Detail Modal with Image Carousel */}
      <Modal show={showProductModal} onHide={() => setShowProductModal(false)} size="lg" centered>
        {selectedProduct && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedProduct.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <div className="position-relative">
                    {getCurrentImage(selectedProduct) ? (
                      <img
                        src={getCurrentImage(selectedProduct)}
                        alt={selectedProduct.name}
                        className="img-fluid rounded"
                        style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        className="bg-light d-flex align-items-center justify-content-center rounded"
                        style={{ height: "400px" }}
                      >
                        <FaBox size={64} className="text-muted" />
                      </div>
                    )}
                    
                    {/* Modal Image Navigation */}
                    {getProductImages(selectedProduct).length > 1 && (
                      <>
                        <Button
                          variant="light"
                          className="position-absolute top-50 start-0 translate-middle-y ms-2"
                          onClick={() => handleImageNavigation(selectedProduct.id, 'prev')}
                        >
                          <FaChevronLeft />
                        </Button>
                        <Button
                          variant="light"
                          className="position-absolute top-50 end-0 translate-middle-y me-2"
                          onClick={() => handleImageNavigation(selectedProduct.id, 'next')}
                        >
                          <FaChevronRight />
                        </Button>
                      </>
                    )}
                  </div>
                  
                  {/* Image Thumbnails */}
                  {getProductImages(selectedProduct).length > 1 && (
                    <div className="d-flex gap-2 mt-3">
                      {getProductImages(selectedProduct).map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${selectedProduct.name} ${index + 1}`}
                          className={`img-thumbnail ${
                            (currentImageIndex[selectedProduct.id] || 0) === index ? 'border-primary' : ''
                          }`}
                          style={{ 
                            width: "60px", 
                            height: "60px", 
                            objectFit: "cover", 
                            cursor: "pointer" 
                          }}
                          onClick={() => setCurrentImageIndex(prev => ({
                            ...prev,
                            [selectedProduct.id]: index
                          }))}
                        />
                      ))}
                    </div>
                  )}
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Badge bg="secondary" className="mb-2">{selectedProduct.category}</Badge>
                    <h4>{selectedProduct.name}</h4>
                    {selectedProduct.brand && (
                      <p className="text-muted mb-2">Brand: {selectedProduct.brand}</p>
                    )}
                    <h3 className="text-primary">₹{selectedProduct.price}</h3>
                  </div>
                  
                  <div className="mb-3">
                    <h6>Description:</h6>
                    <p className="text-muted">{selectedProduct.description}</p>
                  </div>

                  <div className="mb-3">
                    <small className="text-muted">
                      Stock: {selectedProduct.stockQuantity} units available
                    </small>
                  </div>

                  <div className="d-grid gap-2">
                    <Button
                      variant="primary"
                      onClick={() => {
                        addToCart(selectedProduct);
                        setShowProductModal(false);
                      }}
                      disabled={selectedProduct.stockQuantity === 0}
                    >
                      <FaShoppingCart className="me-2" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline-danger"
                      onClick={() => {
                        toggleWishlist(selectedProduct);
                        setShowProductModal(false);
                      }}
                    >
                      {isInWishlist(selectedProduct.id) ? (
                        <>
                          <FaHeart className="me-2" />
                          Remove from Wishlist
                        </>
                      ) : (
                        <>
                          <FaRegHeart className="me-2" />
                          Add to Wishlist
                        </>
                      )}
                    </Button>
                  </div>
                </Col>
              </Row>
            </Modal.Body>
          </>
        )}
      </Modal>

      {/* Toast Notifications */}
      <ToastContainer position="bottom-end" className="p-3">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            show={true}
            onClose={() => removeToast(toast.id)}
            bg={toast.variant}
            delay={3000}
            autohide
          >
            <Toast.Header>
              <strong className="me-auto">Notification</strong>
            </Toast.Header>
            <Toast.Body className="text-white">
              {toast.message}
            </Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </div>
  );
};

export default UserHome;



