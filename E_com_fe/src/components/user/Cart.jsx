import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Table,
  Badge,
  Alert,
  Modal,
  Form,
  InputGroup
} from "react-bootstrap";
import { 
  FaArrowLeft,
  FaTrash,
  FaPlus,
  FaMinus,
  FaShoppingCart,
  FaBox,
  FaCreditCard,
  FaHeart
} from "react-icons/fa";

const Cart = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  
  const [cart, setCart] = useState([]);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadCartFromStorage();
  }, []);

  const loadCartFromStorage = () => {
    const savedCart = localStorage.getItem(`cart_${user?.id}`);
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const saveCartToStorage = (cartData) => {
    localStorage.setItem(`cart_${user?.id}`, JSON.stringify(cartData));
  };

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

      return null;
    } catch (error) {
      console.error('Error converting image:', error);
      return null;
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = cart.find(item => item.id === productId);
    if (newQuantity > product.stockQuantity) {
      alert(`Cannot add more items. Only ${product.stockQuantity} in stock.`);
      return;
    }

    const updatedCart = cart.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    );

    setCart(updatedCart);
    saveCartToStorage(updatedCart);
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
    saveCartToStorage(updatedCart);
  };

  const clearCart = () => {
    setCart([]);
    saveCartToStorage([]);
    setShowClearModal(false);
  };

  const moveToWishlist = (product) => {
    removeFromCart(product.id);
    
    // Add to wishlist
    const savedWishlist = localStorage.getItem(`wishlist_${user?.id}`);
    const wishlist = savedWishlist ? JSON.parse(savedWishlist) : [];
    
    if (!wishlist.some(item => item.id === product.id)) {
      const updatedWishlist = [...wishlist, product];
      localStorage.setItem(`wishlist_${user?.id}`, JSON.stringify(updatedWishlist));
      alert(`${product.name} moved to wishlist!`);
    }
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  };

  const calculateTax = (subtotal) => {
    return subtotal * 0.08; 
  };

  const calculateShipping = (subtotal) => {
    return subtotal > 50 ? 0 : 5.99; 
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const shipping = calculateShipping(subtotal);
    return subtotal + tax + shipping;
  };

  const handleCheckout = () => {
    alert("Checkout functionality would be implemented here!");
    setShowCheckoutModal(false);
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
                  className="mb-2"
                >
                  <FaArrowLeft className="me-2" />
                  Continue Shopping
                </Button>
                <h1 className="display-6 fw-bold text-primary mb-0">
                  Shopping Cart
                </h1>
                <p className="text-muted">
                  {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
                </p>
              </div>
              {cart.length > 0 && (
                <Button
                  variant="outline-danger"
                  onClick={() => setShowClearModal(true)}
                >
                  <FaTrash className="me-2" />
                  Clear Cart
                </Button>
              )}
            </div>
          </Col>
                  </Row>

        {cart.length === 0 ? (
          <Row className="justify-content-center">
            <Col md={6} className="text-center">
              <Card className="border-0 shadow-sm">
                <Card.Body className="py-5">
                  <FaShoppingCart size={64} className="text-muted mb-3" />
                  <h4 className="text-muted mb-3">Your cart is empty</h4>
                  <p className="text-muted mb-4">
                    Looks like you haven't added any items to your cart yet.
                  </p>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => navigate("/user/home")}
                    // onClick={() => window.location.href = "/user/home"}
                  >
                    Start Shopping
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ) : (
          <Row>
            {/* Cart Items */}
            <Col lg={8}>
              <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-white">
                  <h5 className="mb-0">Cart Items</h5>
                </Card.Header>
                <Card.Body className="p-0">
                  <Table responsive className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((item) => {
                        const imageSrc = getImageSrc(item);
                        const itemTotal = parseFloat(item.price) * item.quantity;
                        
                        return (
                          <tr key={item.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="me-3">
                                  {imageSrc ? (
                                    <img
                                      src={imageSrc}
                                      alt={item.name}
                                      style={{
                                        width: "60px",
                                        height: "60px",
                                        objectFit: "cover",
                                        borderRadius: "8px"
                                      }}
                                    />
                                  ) : (
                                    <div
                                      className="bg-light d-flex align-items-center justify-content-center rounded"
                                      style={{ width: "60px", height: "60px" }}
                                    >
                                      <FaBox className="text-muted" />
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <h6 className="mb-1">{item.name}</h6>
                                  <small className="text-muted">{item.category}</small>
                                  {item.brand && (
                                    <div>
                                      <small className="text-muted">Brand: {item.brand}</small>
                                    </div>
                                  )}
                                  <Badge bg="secondary" className="mt-1">
                                    {item.stockQuantity} in stock
                                  </Badge>
                                </div>
                              </div>
                            </td>
                            <td className="align-middle">
                              <strong>₹{parseFloat(item.price).toFixed(2)}</strong>
                            </td>
                            <td className="align-middle">
                              <InputGroup style={{ width: "120px" }}>
                                <Button
                                  variant="outline-secondary"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <FaMinus />
                                </Button>
                                <Form.Control
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => {
                                    const newQuantity = parseInt(e.target.value) || 1;
                                    updateQuantity(item.id, newQuantity);
                                  }}
                                  min="1"
                                  max={item.stockQuantity}
                                  className="text-center"
                                  style={{ maxWidth: "60px" }}
                                />
                                <Button
                                  variant="outline-secondary"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  disabled={item.quantity >= item.stockQuantity}
                                >
                                  <FaPlus />
                                </Button>
                              </InputGroup>
                            </td>
                            <td className="align-middle">
                              <strong className="text-primary">
                                ₹{itemTotal.toFixed(2)}
                              </strong>
                            </td>
                            <td className="align-middle">
                              <div className="d-flex gap-2">
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => removeFromCart(item.id)}
                                  title="Remove from cart"
                                >
                                  <FaTrash />
                                </Button>
                                <Button
                                  variant="outline-secondary"
                                  size="sm"
                                  onClick={() => moveToWishlist(item)}
                                  title="Move to wishlist"
                                >
                                  <FaHeart />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>

            {/* Order Summary */}
            <Col lg={4}>
              <Card className="border-0 shadow-sm sticky-top" style={{ top: "20px" }}>
                <Card.Header className="bg-white">
                  <h5 className="mb-0">Order Summary</h5>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items):</span>
                      <span>₹{calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Shipping:</span>
                      <span>
                        {calculateShipping(calculateSubtotal()) === 0 ? (
                          <span className="text-success">FREE</span>
                        ) : (
                          `₹${calculateShipping(calculateSubtotal()).toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Tax (8%):</span>
                      <span>₹{calculateTax(calculateSubtotal()).toFixed(2)}</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between mb-3">
                      <strong>Total:</strong>
                      <strong className="text-primary fs-5">
                        ₹{calculateTotal().toFixed(2)}
                      </strong>
                    </div>
                  </div>

                  {calculateShipping(calculateSubtotal()) > 0 && (
                    <Alert variant="info" className="small mb-3">
                      Add ₹{(50 - calculateSubtotal()).toFixed(2)} more for FREE shipping!
                    </Alert>
                  )}

                  <div className="d-grid gap-2">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => setShowCheckoutModal(true)}
                    >
                      <FaCreditCard className="me-2" />
                      Proceed to Checkout
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() => navigate("/user/home")}
                     // onClick={() => window.location.href = "/user/home"}
                    >
                      Continue Shopping
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>

      {/* Clear Cart Confirmation Modal */}
      <Modal show={showClearModal} onHide={() => setShowClearModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Clear Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to remove all items from your cart?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowClearModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={clearCart}>
            Clear Cart
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Checkout Modal */}
      <Modal show={showCheckoutModal} onHide={() => setShowCheckoutModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Checkout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <h6>Order Summary</h6>
              <div className="bg-light p-3 rounded mb-3">
                {cart.map((item) => (
                  <div key={item.id} className="d-flex justify-content-between mb-2">
                    <span>{item.name} × {item.quantity}</span>
                    <span>₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <hr />
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total:</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <h6>Payment Information</h6>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Card Number</Form.Label>
                  <Form.Control type="text" placeholder="1234 5678 9012 3456" />
                </Form.Group>
                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Expiry Date</Form.Label>
                      <Form.Control type="text" placeholder="MM/YY" />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>CVV</Form.Label>
                      <Form.Control type="text" placeholder="123" />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Cardholder Name</Form.Label>
                  <Form.Control type="text" placeholder="John Doe" />
                </Form.Group>
              </Form>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCheckoutModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCheckout}>
            Place Order - ₹{calculateTotal().toFixed(2)}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Cart;

