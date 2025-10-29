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
  Spinner,
  Modal,
  Form,
  InputGroup,
} from "react-bootstrap";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaBox,
  FaSearch,
  FaFilter,
  FaArrowLeft,
} from "react-icons/fa";
import api from "../services/axios";

const ManageProduct = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const categories = [
    "Shirts",
    "Pants",
    "T-shirts",
    "Hoodies",
    "Sneakers",
    "Shades",
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, categoryFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products");
      console.log("Fetched products:", response.data);
      setProducts(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(
        (product) => product.category === categoryFilter
      );
    }

    setFilteredProducts(filtered);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      await api.delete(`/products/${productToDelete.id}`);
      setProducts(products.filter((p) => p.id !== productToDelete.id));
      setShowDeleteModal(false);
      setProductToDelete(null);
      alert("Product deleted successfully!");
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product");
    }
  };

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  // handle first image
  const getImageSrc = (product) => {
    try {
      console.log("Processing image for product:", product.name, {
        hasImageData: !!product.imageData,
        imageType: product.imageType,
        imageDataType: typeof product.imageData,
      });

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

      if (product.imageData && product.imageData.constructor === Uint8Array) {
        const base64String = btoa(
          String.fromCharCode.apply(null, Array.from(product.imageData))
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

      if (product.imageData && typeof product.imageData === "object") {
        try {
          const uint8Array = new Uint8Array(Object.values(product.imageData));
          const base64String = btoa(
            String.fromCharCode.apply(null, uint8Array)
          );
          const mimeType = product.imageType || "image/jpeg";
          return `data:${mimeType};base64,${base64String}`;
        } catch (conversionError) {
          console.error("Object conversion failed:", conversionError);
        }
      }

      console.log("No valid image data found for:", product.name);
      return null;
    } catch (error) {
      console.error("Error converting image for product:", product.name, error);
      return null;
    }
  };

  // handle second image
  const getImageSrc2 = (product) => {
    try {
      console.log("Processing image 2 for product:", product.name, {
        hasImageData2: !!product.imageData2,
        imageType2: product.imageType2,
        imageData2Type: typeof product.imageData2,
      });

      if (product.imageData2 && typeof product.imageData2 === "string") {
        if (product.imageData2.startsWith("data:")) {
          return product.imageData2;
        }
        const mimeType = product.imageType2 || "image/jpeg";
        return `data:${mimeType};base64,${product.imageData2}`;
      }

      if (product.imageData2 && Array.isArray(product.imageData2)) {
        const base64String = btoa(
          String.fromCharCode.apply(null, product.imageData2)
        );
        const mimeType = product.imageType2 || "image/jpeg";
        return `data:${mimeType};base64,${base64String}`;
      }

      if (product.imageData2 && product.imageData2.constructor === Uint8Array) {
        const base64String = btoa(
          String.fromCharCode.apply(null, Array.from(product.imageData2))
        );
        const mimeType = product.imageType2 || "image/jpeg";
        return `data:${mimeType};base64,${base64String}`;
      }

      if (product.imageData2 && product.imageData2.data) {
        const base64String = btoa(
          String.fromCharCode.apply(null, product.imageData2.data)
        );
        const mimeType = product.imageType2 || "image/jpeg";
        return `data:${mimeType};base64,${base64String}`;
      }

      if (product.imageData2 && typeof product.imageData2 === "object") {
        try {
          const uint8Array = new Uint8Array(Object.values(product.imageData2));
          const base64String = btoa(
            String.fromCharCode.apply(null, uint8Array)
          );
          const mimeType = product.imageType2 || "image/jpeg";
          return `data:${mimeType};base64,${base64String}`;
        } catch (conversionError) {
          console.error(
            "Object conversion failed for image 2:",
            conversionError
          );
        }
      }

      console.log("No valid image 2 data found for:", product.name);
      return null;
    } catch (error) {
      console.error(
        "Error converting second image for product:",
        product.name,
        error
      );
      return null;
    }
  };

  return (
    <Container
      fluid
      className="py-4"
      style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
    >
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Button
                variant="outline-secondary"
                onClick={() => navigate("/admin/home")}
                className="mb-2"
              >
                <FaArrowLeft className="me-2" />
                Back to Dashboard
              </Button>
              <h1 className="display-6 fw-bold text-primary mb-0">
                Manage Products
              </h1>
              <p className="text-muted">
                Add, edit, or remove products from your inventory
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => navigate("/admin/products/add")}
              className="d-flex align-items-center"
            >
              <FaPlus className="me-2" />
              Add New Product
            </Button>
          </div>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Label>Search Products</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaSearch />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Search by name, description, or brand..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Col>
                <Col md={4}>
                  <Form.Label>Filter by Category</Form.Label>
                  <Form.Select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={2} className="d-flex align-items-end">
                  <Button
                    variant="outline-secondary"
                    onClick={() => {
                      setSearchTerm("");
                      setCategoryFilter("");
                    }}
                    className="w-100"
                  >
                    Clear Filters
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Products Table */}
      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0">
                  Products ({filteredProducts.length})
                </h5>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2 text-muted">Loading products...</p>
                </div>
              ) : error ? (
                <Alert variant="danger" className="m-3">
                  {error}
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="ms-2"
                    onClick={fetchProducts}
                  >
                    Retry
                  </Button>
                </Alert>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-5">
                  <FaBox size={48} className="text-muted mb-3" />
                  <h5 className="text-muted">
                    {products.length === 0
                      ? "No products found"
                      : "No products match your filters"}
                  </h5>
                  <p className="text-muted">
                    {products.length === 0
                      ? "Start by adding your first product"
                      : "Try adjusting your search or filter criteria"}
                  </p>
                  {products.length === 0 && (
                    <Button
                      variant="primary"
                      onClick={() => navigate("/admin/products/add")}
                    >
                      <FaPlus className="me-2" />
                      Add Product
                    </Button>
                  )}
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>Images</th>
                        <th>Product Details</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => {
                        const imageSrc = getImageSrc(product);
                        const imageSrc2 = getImageSrc2(product);

                        return (
                          <tr key={product.id}>
                            <td>
                              <div className="d-flex gap-1">
                                {imageSrc ? (
                                  <img
                                    src={imageSrc}
                                    alt={`${product.name} - Image 1`}
                                    style={{
                                      width: "50px",
                                      height: "50px",
                                      objectFit: "cover",
                                      borderRadius: "8px",
                                      border: "1px solid #dee2e6",
                                    }}
                                    onError={(e) => {
                                      console.error(
                                        "Image 1 failed to load for:",
                                        product.name
                                      );
                                      e.target.style.display = "none";
                                    }}
                                  />
                                ) : (
                                  <div
                                    className="bg-light d-flex align-items-center justify-content-center"
                                    style={{
                                      width: "50px",
                                      height: "50px",
                                      borderRadius: "8px",
                                      border: "1px solid #dee2e6",
                                    }}
                                  >
                                    <FaBox className="text-muted" />
                                  </div>
                                )}
                                {imageSrc2 && (
                                  <img
                                    src={imageSrc2}
                                    alt={`${product.name} - Image 2`}
                                    style={{
                                      width: "50px",
                                      height: "50px",
                                      objectFit: "cover",
                                      borderRadius: "8px",
                                      border: "1px solid #dee2e6",
                                    }}
                                    onError={(e) => {
                                      console.error(
                                        "Image 2 failed to load for:",
                                        product.name
                                      );
                                      e.target.style.display = "none";
                                    }}
                                  />
                                )}
                              </div>
                            </td>
                            <td>
                              <div>
                                <div className="fw-semibold">
                                  {product.name}
                                </div>
                                <small className="text-muted">
                                  {product.brand || "No brand"}
                                </small>
                                <br />
                                <small className="text-muted">
                                  ID: {product.id}
                                </small>
                              </div>
                            </td>
                            <td>
                              <Badge bg="secondary">{product.category}</Badge>
                            </td>
                            <td className="fw-semibold">₹{product.price}</td>
                            <td>
                              <Badge
                                bg={
                                  parseInt(product.stockQuantity) > 0
                                    ? "success"
                                    : "danger"
                                }
                              >
                                {product.stockQuantity} units
                              </Badge>
                            </td>
                            <td>
                              <Badge
                                bg={
                                  product.productAvailable
                                    ? "success"
                                    : "danger"
                                }
                              >
                                {product.productAvailable
                                  ? "Available"
                                  : "Unavailable"}
                              </Badge>
                            </td>
                            <td>
                              <div className="d-flex gap-1">
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() =>
                                    navigate(
                                      `/admin/products/update/${product.id}`
                                    )
                                  }
                                  title="Edit Product"
                                >
                                  <FaEdit />
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => confirmDelete(product)}
                                  title="Delete Product"
                                >
                                  <FaTrash />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete "{productToDelete?.name}"? This action
          cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteProduct}>
            Delete Product
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageProduct;
