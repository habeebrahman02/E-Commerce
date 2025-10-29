import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Badge,
  Modal,
  Alert
} from "react-bootstrap";
import { 
  FaArrowLeft,
  FaTrash,
  FaShoppingCart,
  FaHeart,
  FaBox,
  FaEye
} from "react-icons/fa";

const Wishlist = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadWishlistFromStorage();
    loadCartFromStorage();
  }, []); 

  const dispatchStorageEvent = (eventType) => {
    window.dispatchEvent(new Event(eventType));
  };

  const loadCartFromStorage = () => {
    const savedCart =
      JSON.parse(localStorage.getItem(`cart_${user?.id}`)) || [];
    setCart((prev) => {
      if (JSON.stringify(prev) === JSON.stringify(savedCart)) return prev;
      return savedCart;
    });
  };

  const loadWishlistFromStorage = () => {
    const savedWishlist =
      JSON.parse(localStorage.getItem(`wishlist_${user?.id}`)) || [];
    setWishlist((prev) => {
      if (JSON.stringify(prev) === JSON.stringify(savedWishlist)) return prev;
      return savedWishlist;
    });
  };

  const saveWishlistToStorage = (wishlistData) => {
    localStorage.setItem(`wishlist_${user?.id}`, JSON.stringify(wishlistData));
    dispatchStorageEvent("wishlistUpdated"); 
  };

  const saveCartToStorage = (cartData) => {
    localStorage.setItem(`cart_${user?.id}`, JSON.stringify(cartData));
    dispatchStorageEvent("cartUpdated"); 
  };

  const getImageSrc = (product) => {
    try {
      if (product.imageData && typeof product.imageData === "string") {
        if (product.imageData.startsWith("data:")) {
          return product.imageData;
        }
        const mimeType = product.imageType || "image/jpeg";
        return `data:${mimeType};base64,${product.imageData}`;
      }

      if (product.imageData && Array.isArray(product.imageData)) {
        const base64String = btoa(
          String.fromCharCode.apply(null, product.imageData)
        );
        const mimeType = product.imageType || "image/jpeg";
        return `data:${mimeType};base64,${base64String}`;
      }

      if (product.imageData && product.imageData.data) {
        const base64String = btoa(
          String.fromCharCode.apply(null, product.imageData.data)
        );
        const mimeType = product.imageType || "image/jpeg";
        return `data:${mimeType};base64,${base64String}`;
      }

      return null;
    } catch (error) {
      console.error("Error converting image:", error);
      return null;
    }
  };

  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlist.filter((item) => item.id !== productId);
    setWishlist(updatedWishlist);
    saveWishlistToStorage(updatedWishlist);
    showAlert("Item removed from wishlist", "info");
  };

  const clearWishlist = () => {
    setWishlist([]);
    saveWishlistToStorage([]);
    setShowClearModal(false);
    showAlert("Wishlist cleared", "info");
  };

  const addToCart = (product) => {
    if (product.stockQuantity === 0) {
      showAlert("This item is out of stock", "warning");
      return;
    }

    const existingItem = cart.find((item) => item.id === product.id);
    let newCart;

    if (existingItem) {
      if (existingItem.quantity >= product.stockQuantity) {
        showAlert("Cannot add more items. Stock limit reached!", "warning");
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
    showAlert(`${product.name} added to cart!`, "success");
  };

  const moveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: "", variant: "" }), 3000);
  };

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  if (!user) {
    return null;
  }

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Container className="py-4">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <Button
                  variant="outline-secondary"
                     onClick={() => navigate("/user/home")}
                  // onClick={() => (window.location.href = "/user/home")}
                  className="mb-2"
                >
                  <FaArrowLeft className="me-2" />
                  Back to Shopping
                </Button>
                <h1 className="display-6 fw-bold text-primary mb-0">
                  <FaHeart className="me-2 text-danger" />
                  My Wishlist
                </h1>
                <p className="text-muted">
                  {wishlist.length} {wishlist.length === 1 ? "item" : "items"}{" "}
                  saved for later
                </p>
              </div>
              {wishlist.length > 0 && (
                <Button
                  variant="outline-danger"
                  onClick={() => setShowClearModal(true)}
                >
                  <FaTrash className="me-2" />
                  Clear Wishlist
                </Button>
              )}
            </div>
          </Col>
        </Row>

        {/* Alert */}
        {alert.show && (
          <Alert variant={alert.variant} className="mb-4">
            {alert.message}
          </Alert>
        )}

        {wishlist.length === 0 ? (
          <Row className="justify-content-center">
            <Col md={6} className="text-center">
              <Card className="border-0 shadow-sm">
                <Card.Body className="py-5">
                  <FaHeart size={64} className="text-muted mb-3" />
                  <h4 className="text-muted mb-3">Your wishlist is empty</h4>
                  <p className="text-muted mb-4">
                    Save items you love to your wishlist and shop them later.
                  </p>
                  <Button
                    variant="primary"
                    size="lg"
                      onClick={() => navigate("/user/home")}
                    // onClick={() => (window.location.href = "/user/home")}
                  >
                    Start Shopping
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ) : (
          <Row className="g-4">
            {wishlist.map((product) => {
              const imageSrc = getImageSrc(product);

              return (
                <Col key={product.id} sm={6} md={4} lg={3}>
                  <Card className="h-100 border-0 shadow-sm wishlist-card">
                    <div className="position-relative">
                      {imageSrc ? (
                        <Card.Img
                          variant="top"
                          src={imageSrc}
                          alt={product.name}
                          style={{
                            height: "250px",
                            objectFit: "cover",
                            cursor: "pointer",
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

                      {/* Remove Button */}
                      <Button
                        variant="danger"
                        size="sm"
                        className="position-absolute top-0 end-0 m-2"
                        onClick={() => removeFromWishlist(product.id)}
                      >
                        <FaTrash />
                      </Button>

                      {/* Stock Badge */}
                      {product.stockQuantity <= 5 &&
                        product.stockQuantity > 0 && (
                          <Badge
                            bg="warning"
                            className="position-absolute top-0 start-0 m-2"
                          >
                            Only {product.stockQuantity} left!
                          </Badge>
                        )}

                      {product.stockQuantity === 0 && (
                        <Badge
                          bg="danger"
                          className="position-absolute top-0 start-0 m-2"
                        >
                          Out of Stock
                        </Badge>
                      )}
                    </div>

                    <Card.Body className="d-flex flex-column">
                      <div className="mb-2">
                        <Badge bg="secondary" className="mb-2">
                          {product.category}
                        </Badge>
                        <Card.Title className="h6 mb-1">
                          {product.name}
                        </Card.Title>
                        {product.brand && (
                          <small className="text-muted">{product.brand}</small>
                        )}
                      </div>

                      <Card.Text className="text-muted small flex-grow-1">
                        {product.description.length > 80
                          ? `${product.description.substring(0, 80)}...`
                          : product.description}
                      </Card.Text>

                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center mb-3">
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
                            onClick={() => moveToCart(product)}
                            disabled={product.stockQuantity === 0}
                          >
                            <FaShoppingCart className="me-2" />
                            {product.stockQuantity === 0
                              ? "Out of Stock"
                              : "Move to Cart"}
                          </Button>
                          <div className="d-flex gap-2">
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => openProductModal(product)}
                              className="flex-grow-1"
                            >
                              <FaEye className="me-1" />
                              View
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => removeFromWishlist(product.id)}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}

        {/* Quick Actions */}
        {wishlist.length > 0 && (
          <Row className="mt-4">
            <Col className="text-center">
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <h5 className="mb-3">Quick Actions</h5>
                  <div className="d-flex gap-3 justify-content-center flex-wrap">
                    <Button
                      variant="primary"
                      onClick={() => {
                        wishlist.forEach((product) => {
                          if (product.stockQuantity > 0) {
                            addToCart(product);
                          }
                        });
                      }}
                    >
                      <FaShoppingCart className="me-2" />
                      Add All to Cart
                    </Button>
                    <Button
                      variant="outline-secondary"
                        onClick={() => navigate("/user/home")}
                      //onClick={() => (window.location.href = "/user/home")}
                    >
                      Continue Shopping
                    </Button>
                    <Button
                      variant="outline-primary"
                      onClick={() => navigate("/user/cart")}
                    >
                      View Cart (
                      {cart.reduce((sum, item) => sum + item.quantity, 0)})
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>

      {/* Clear Wishlist Confirmation Modal */}
      <Modal
        show={showClearModal}
        onHide={() => setShowClearModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Clear Wishlist</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to remove all items from your wishlist?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowClearModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={clearWishlist}>
            Clear Wishlist
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Product Detail Modal */}
      <Modal
        show={showProductModal}
        onHide={() => setShowProductModal(false)}
        size="lg"
        centered
      >
        {selectedProduct && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedProduct.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  {getImageSrc(selectedProduct) ? (
                    <img
                      src={getImageSrc(selectedProduct)}
                      alt={selectedProduct.name}
                      className="img-fluid rounded"
                      style={{
                        width: "100%",
                        maxHeight: "400px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      className="bg-light d-flex align-items-center justify-content-center rounded"
                      style={{ height: "400px" }}
                    >
                      <FaBox size={64} className="text-muted" />
                    </div>
                  )}
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Badge bg="secondary" className="mb-2">
                      {selectedProduct.category}
                    </Badge>
                    <h4>{selectedProduct.name}</h4>
                    {selectedProduct.brand && (
                      <p className="text-muted mb-2">
                        Brand: {selectedProduct.brand}
                      </p>
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
                        moveToCart(selectedProduct);
                        setShowProductModal(false);
                      }}
                      disabled={selectedProduct.stockQuantity === 0}
                    >
                      <FaShoppingCart className="me-2" />
                      Move to Cart
                    </Button>
                    <Button
                      variant="outline-danger"
                      onClick={() => {
                        removeFromWishlist(selectedProduct.id);
                        setShowProductModal(false);
                      }}
                    >
                      <FaTrash className="me-2" />
                      Remove from Wishlist
                    </Button>
                  </div>
                </Col>
              </Row>
            </Modal.Body>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Wishlist;


