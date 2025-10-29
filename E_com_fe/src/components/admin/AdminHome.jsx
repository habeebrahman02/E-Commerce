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
} from "react-bootstrap";
import {
  FaPlus,
  FaEdit,
  FaCog,
  FaTrash,
  FaEye,
  FaUsers,
  FaBox,
  FaRupeeSign,
  FaChartLine,
} from "react-icons/fa";
import api from "../services/axios";

const AdminHome = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products");
      setProducts(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
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

  // Updated function to handle first image
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

      return null;
    } catch (error) {
      console.error("Error converting image:", error);
      return null;
    }
  };

  // New function to handle second image
  const getImageSrc2 = (product) => {
    try {
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

      return null;
    } catch (error) {
      console.error("Error converting second image:", error);
      return null;
    }
  };

  return (
    <div
      className="admin-home-container"
      style={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      <Container fluid className="py-4">
        {/* Header Section */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="display-5 fw-bold text-primary mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-muted mb-0">
                  Welcome back, {user?.name || "Admin"}! Manage your store
                  efficiently.
                </p>
              </div>
            </div>
          </Col>
        </Row>

        {/* Quick Stats Cards */}
        <Row className="mb-4 g-3">
          <Col md={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="text-center">
                <FaBox size={32} className="text-primary mb-2" />
                <h4 className="fw-bold">{products.length}</h4>
                <p className="text-muted mb-0">Total Products</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="text-center">
                <FaUsers size={32} className="text-success mb-2" />
                <h4 className="fw-bold">0</h4>
                <p className="text-muted mb-0">Total Users</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="text-center">
                <FaRupeeSign size={32} className="text-warning mb-2" />
                <h4 className="fw-bold">₹0</h4>
                <p className="text-muted mb-0">Total Revenue</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="text-center">
                <FaChartLine size={32} className="text-info mb-2" />
                <h4 className="fw-bold">0</h4>
                <p className="text-muted mb-0">Orders Today</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Quick Actions */}
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h5 className="fw-bold mb-3">Quick Actions</h5>
                <div className="d-flex flex-wrap gap-2">
                  <Button
                    variant="primary"
                    onClick={() => navigate("/admin/products/add")}
                    className="d-flex align-items-center"
                  >
                    <FaPlus className="me-2" />
                    Add Product
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate("/admin/products/manage")}
                    className="d-flex align-items-center"
                  >
                    <FaCog className="me-2" />
                    Manage Products
                  </Button>
                </div>
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
                  <h5 className="fw-bold mb-0">All Products</h5>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate("/admin/products/add")}
                  >
                    <FaPlus className="me-1" />
                    Add New
                  </Button>
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
                ) : products.length === 0 ? (
                  <div className="text-center py-5">
                    <FaBox size={48} className="text-muted mb-3" />
                    <h5 className="text-muted">No products found</h5>
                    <p className="text-muted">
                      Start by adding your first product
                    </p>
                    <Button
                      variant="primary"
                      onClick={() => navigate("/admin/products/add")}
                    >
                      <FaPlus className="me-2" />
                      Add Product
                    </Button>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <Table hover className="mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th>Images</th>
                          <th>Name</th>
                          <th>Category</th>
                          <th>Price</th>
                          <th>Stock</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => {
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
                                        width: "40px",
                                        height: "40px",
                                        objectFit: "cover",
                                        borderRadius: "6px",
                                        border: "1px solid #dee2e6",
                                      }}
                                      onError={(e) => {
                                        console.error(
                                          "Image 1 failed to load:",
                                          product.name
                                        );
                                        e.target.style.display = "none";
                                      }}
                                    />
                                  ) : (
                                    <div
                                      className="bg-light d-flex align-items-center justify-content-center"
                                      style={{
                                        width: "40px",
                                        height: "40px",
                                        borderRadius: "6px",
                                        border: "1px solid #dee2e6",
                                      }}
                                    >
                                      <FaBox className="text-muted" size={16} />
                                    </div>
                                  )}
                                  {imageSrc2 ? (
                                    <img
                                      src={imageSrc2}
                                      alt={`${product.name} - Image 2`}
                                      style={{
                                        width: "40px",
                                        height: "40px",
                                        objectFit: "cover",
                                        borderRadius: "6px",
                                        border: "1px solid #dee2e6",
                                      }}
                                      onError={(e) => {
                                        console.error(
                                          "Image 2 failed to load:",
                                          product.name
                                        );
                                        e.target.style.display = "none";
                                      }}
                                    />
                                  ) : null}
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
      </Container>

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
    </div>
  );
};

export default AdminHome;
