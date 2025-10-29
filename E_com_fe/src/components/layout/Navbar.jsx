import React, { useState, useEffect, useCallback } from "react";
import { FaHeart, FaShoppingCart, FaSignOutAlt, FaSearch, FaTimes } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Dropdown, Button, Form, InputGroup } from "react-bootstrap";
import Badge from "react-bootstrap/Badge";
import api from "../services/axios";
import "./css/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const loadCartAndWishlist = useCallback(() => {
    if (user) {
      const savedCart = localStorage.getItem(`cart_${user.id}`);
      const savedWishlist = localStorage.getItem(`wishlist_${user.id}`);

      setCart(savedCart ? JSON.parse(savedCart) : []);
      setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadCartAndWishlist();
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      if (user) {
        loadCartAndWishlist();
      }
    };

    window.addEventListener("cartUpdated", handleStorageChange);
    window.addEventListener("wishlistUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("cartUpdated", handleStorageChange);
      window.removeEventListener("wishlistUpdated", handleStorageChange);
    };
  }, [user, loadCartAndWishlist]);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await api.get("/products");
      const uniqueCategories = [...new Set(response.data.map(product => product.category))];
      setCategories(uniqueCategories.filter(category => category)); // Remove empty categories
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Search functionality
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await api.get("/products");
      const filteredProducts = response.data.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        (product.brand && product.brand.toLowerCase().includes(query.toLowerCase()))
      );
      setSearchResults(filteredProducts.slice(0, 5));
      setShowSearchResults(true);
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchResults(false);
      if (user) {
        navigate(`/user/search?q=${encodeURIComponent(searchQuery)}`);
      } else {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  const handleProductClick = (productId) => {
    setShowSearchResults(false);
    setSearchQuery("");
    if (user) {
      navigate(`/user/product/${productId}`);
    } else {
      navigate(`/product/${productId}`);
    }
  };

  const handleCategoryClick = (category) => {
    if (user) {
      navigate(`/user/category/${encodeURIComponent(category)}`);
    } else {
      navigate(`/category/${encodeURIComponent(category)}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("authChange"));
    navigate("/");
  };

  // Get image source for search results
  const getImageSrc = (product) => {
    try {
      if (product.imageData && typeof product.imageData === 'string') {
        if (product.imageData.startsWith('data:')) {
          return product.imageData;
        }
        const mimeType = product.imageType || 'image/jpeg';
        return `data:${mimeType};base64,${product.imageData}`;
      }
      return null;
    } catch (error) {
      console.error('Error converting image:', error);
      return null;
    }
  };

  return (
    <nav className="navbar navbar-expand-lg px-3 px-md-4">
      <div className="container-fluid">
        {/* Brand */}
        <Link to="/" className="navbar-brand fw-light text-dark me-3">
          <span className="h4">A</span>
          <span className="h6">MATER</span>
          <span className="h4">RA</span>
        </Link>

        {/* Navbar Toggler for Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Nav Links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link 
                className={`nav-link text-dark fw-bold ${location.pathname === '/' ? 'active' : ''}`} 
                to="/"
              >
                Home
              </Link>
            </li>
            
            {/* Categories Dropdown */}
            <li className="nav-item dropdown">
              <Dropdown>
                <Dropdown.Toggle 
                  as="a" 
                  className="nav-link text-dark dropdown-toggle-custom"
                  style={{ cursor: 'pointer', textDecoration: 'none' }}
                >
                  Categories
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {categories.length > 0 ? (
                    categories.map((category, index) => (
                      <Dropdown.Item 
                        key={index}
                        onClick={() => handleCategoryClick(category)}
                      >
                        {category}
                      </Dropdown.Item>
                    ))
                  ) : (
                    <Dropdown.Item disabled>No categories available</Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </li>

            <li className="nav-item">
              <Link className="nav-link text-dark" to="/new-arrivals">
                New Arrivals
              </Link>
            </li>
          </ul>

          {/* Search Bar */}
          <div className="search-container position-relative me-3 d-none d-md-block">
            <Form onSubmit={handleSearchSubmit}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
                  className="search-input"
                  style={{ minWidth: '250px' }}
                />
                {searchQuery && (
                  <Button
                    variant="outline-secondary"
                    onClick={clearSearch}
                    className="clear-search-btn"
                  >
                    <FaTimes />
                  </Button>
                )}
                <Button variant="outline-primary" type="submit">
                  <FaSearch />
                </Button>
              </InputGroup>
            </Form>

            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="search-results">
                {isSearching ? (
                  <div className="search-result-item text-center">
                    <small>Searching...</small>
                  </div>
                ) : (
                  <>
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        className="search-result-item"
                        onClick={() => handleProductClick(product.id)}
                      >
                        <div className="d-flex align-items-center">
                          {getImageSrc(product) ? (
                            <img
                              src={getImageSrc(product)}
                              alt={product.name}
                              className="search-result-image"
                            />
                          ) : (
                            <div className="search-result-image bg-light d-flex align-items-center justify-content-center">
                              <FaSearch className="text-muted" />
                            </div>
                          )}
                          <div className="ms-2 flex-grow-1">
                            <div className="fw-semibold">{product.name}</div>
                            <small className="text-muted">{product.category}</small>
                            <div className="text-primary fw-bold">₹{product.price}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="search-result-item text-center border-top">
                      <small className="text-primary" style={{ cursor: 'pointer' }}>
                        View all results for "{searchQuery}"
                      </small>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Search */}
          <div className="d-md-none w-100 mb-2">
            <Form onSubmit={handleSearchSubmit}>
              <InputGroup size="sm">
                <Form.Control
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="outline-primary" type="submit" size="sm">
                  <FaSearch />
                </Button>
              </InputGroup>
            </Form>
          </div>

          {/* Right Side */}
          <div className="d-flex align-items-center gap-2 gap-md-3 flex-wrap">
            {user ? (
              <>
                <span className="fw-semibold text-dark d-none d-md-inline">
                  Welcome, {user.name ? user.name : user.email}!
                </span>
                <span className="fw-semibold text-dark d-md-none">
                  {user.name
                    ? user.name.split(" ")[0]
                    : user.email.split("@")[0]}
                </span>

                {/* USER only Wishlist & Cart */}
                {user.role !== "ADMIN" && (
                  <>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => navigate("/user/cart")}
                      className="position-relative"
                    >
                      <FaShoppingCart />
                      {cart.length > 0 && (
                        <Badge
                          bg="danger"
                          pill
                          className="position-absolute top-0 start-100 translate-middle"
                        >
                          {cart.reduce((sum, item) => sum + item.quantity, 0)}
                        </Badge>
                      )}
                    </Button>

                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => navigate("/user/wishlist")}
                      className="position-relative"
                    >
                      <FaHeart />
                      {wishlist.length > 0 && (
                        <Badge
                          bg="danger"
                          pill
                          className="position-absolute top-0 start-100 translate-middle"
                        >
                          {wishlist.length}
                        </Badge>
                      )}
                    </Button>
                  </>
                )}

                {/* Logout */}
                <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                  <FaSignOutAlt className="me-1 d-none d-md-inline" />
                  <span className="d-none d-md-inline">Logout</span>
                  <FaSignOutAlt className="d-md-none" />
                </Button>
              </>
            ) : (
              <>
                <Dropdown align="end">
                  <Dropdown.Toggle as={Button} variant="outline-primary" size="sm">
                    <span className="d-none d-md-inline">Login</span>
                    <span className="d-md-none">Login</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => navigate("/login")}>
                      User Login
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => navigate("/admin/login")}>
                      Admin Login
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate("/signup")}
                >
                  <span className="d-none d-md-inline">Register</span>
                  <span className="d-md-none">Sign Up</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close search results */}
      {showSearchResults && (
        <div
          className="search-overlay"
          onClick={() => setShowSearchResults(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;



