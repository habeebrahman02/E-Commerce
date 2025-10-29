import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
  InputGroup,
} from "react-bootstrap";
import {
  FaArrowLeft,
  FaTag,
  FaRupeeSign,
  FaBoxes,
  FaImage,
  FaFileAlt,
  FaSave,
} from "react-icons/fa";
import api from "../services/axios";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    stockQuantity: "",
    brand: "",
    productAvailable: true,
  });

  const [file, setFile] = useState(null);
  const [file2, setFile2] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentImage2, setCurrentImage2] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [file2Preview, setFile2Preview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
  const [errors, setErrors] = useState({});

  const categories = [
    "Shirts",
    "Pants",
    "T-shirts",
    "Hoodies",
    "Sneakers",
    "Shades",
  ];

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${id}`);
      const product = response.data;

      setFormData({
        name: product.name || "",
        description: product.description || "",
        category: product.category || "",
        price: product.price || "",
        stockQuantity: product.stockQuantity || "",
        brand: product.brand || "",
        productAvailable: product.productAvailable !== false,
      });

      // update img
      const imageSrc = getImageSrc(product);
      if (imageSrc) {
        setCurrentImage(imageSrc);
      }

      const imageSrc2 = getImageSrc2(product);
      if (imageSrc2) {
        setCurrentImage2(imageSrc2);
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      showAlert("Failed to load product details", "danger");
    } finally {
      setLoading(false);
    }
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
          console.error("Object conversion failed:", conversionError);
        }
      }

      return null;
    } catch (error) {
      console.error("Error converting second image:", error);
      return null;
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFileChange = (e, imageNumber = 1) => {
    const selectedFile = e.target.files[0];

    if (imageNumber === 1) {
      setFile(selectedFile);

      if (selectedFile) {
        const reader = new FileReader();
        reader.onload = (e) => setFilePreview(e.target.result);
        reader.readAsDataURL(selectedFile);
      } else {
        setFilePreview(null);
      }

      if (errors.file) {
        setErrors((prev) => ({ ...prev, file: "" }));
      }
    } else {
      setFile2(selectedFile);

      if (selectedFile) {
        const reader = new FileReader();
        reader.onload = (e) => setFile2Preview(e.target.result);
        reader.readAsDataURL(selectedFile);
      } else {
        setFile2Preview(null);
      }

      if (errors.file2) {
        setErrors((prev) => ({ ...prev, file2: "" }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Please select a category";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Please enter a valid price";
    if (!formData.stockQuantity || formData.stockQuantity < 0)
      newErrors.stockQuantity = "Please enter a valid stock quantity";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: "", variant: "" }), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showAlert("Please fix the errors below", "danger");
      return;
    }

    setUpdating(true);

    try {
      if (file || file2) {
        const imageFormData = new FormData();

        if (file) {
          imageFormData.append("file", file);
        }
        if (file2) {
          imageFormData.append("file2", file2);
        }

        imageFormData.append("name", formData.name.trim());
        imageFormData.append("description", formData.description.trim());
        imageFormData.append("category", formData.category);
        imageFormData.append("price", formData.price);
        imageFormData.append("stockQuantity", formData.stockQuantity);
        imageFormData.append("brand", formData.brand.trim());
        imageFormData.append("productAvailable", formData.productAvailable);

        await api.put(`/products/${id}/with-image`, imageFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        const updateData = {
          name: formData.name.trim(),
          description: formData.description.trim(),
          category: formData.category,
          price: formData.price,
          stockQuantity: formData.stockQuantity,
          brand: formData.brand.trim(),
          productAvailable: formData.productAvailable,
        };

        await api.put(`/products/${id}`, updateData);
      }

      showAlert("Product updated successfully! 🎉", "success");
      setTimeout(() => {
        navigate("/admin/products/manage");
      }, 2000);
    } catch (error) {
      console.error("Error updating product:", error);

      let errorMessage = "Failed to update product. Please try again.";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      showAlert(errorMessage, "danger");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Loading product details...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container
      className="py-4"
      style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
    >
      <Row className="justify-content-center">
        <Col lg={8}>
          <div className="mb-4">
            <Button
              variant="outline-secondary"
              onClick={() => navigate("/admin/products/manage")}
              className="mb-3"
            >
              <FaArrowLeft className="me-2" />
              Back to Manage Products
            </Button>
            <h1 className="display-6 fw-bold text-primary mb-2">
              Update Product
            </h1>
            <p className="text-muted">
              Modify product details and save changes
            </p>
          </div>

          {alert.show && (
            <Alert variant={alert.variant} className="mb-4">
              {alert.message}
            </Alert>
          )}

          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <Form onSubmit={handleSubmit}>
                <Row>
                  {/* Current Images Display */}
                  <Col md={6} className="mb-4">
                    <Form.Label className="fw-semibold">
                      <FaImage className="me-2" />
                      Current Product Image 1
                    </Form.Label>
                    <div className="mb-3">
                      {currentImage ? (
                        <div className="text-center">
                          <img
                            src={currentImage}
                            alt="Current product"
                            style={{
                              maxWidth: "200px",
                              maxHeight: "200px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              border: "1px solid #dee2e6",
                            }}
                            onError={(e) => {
                              console.error("Current image failed to load");
                              e.target.style.display = "none";
                            }}
                          />
                          <p className="text-muted mt-2 mb-0">
                            Current Image 1
                          </p>
                        </div>
                      ) : (
                        <div className="text-center py-4 bg-light rounded">
                          <FaImage size={48} className="text-muted mb-2" />
                          <p className="text-muted mb-0">No current image 1</p>
                        </div>
                      )}
                    </div>
                  </Col>

                  <Col md={6} className="mb-4">
                    <Form.Label className="fw-semibold">
                      <FaImage className="me-2" />
                      Current Product Image 2
                    </Form.Label>
                    <div className="mb-3">
                      {currentImage2 ? (
                        <div className="text-center">
                          <img
                            src={currentImage2}
                            alt="Current product 2"
                            style={{
                              maxWidth: "200px",
                              maxHeight: "200px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              border: "1px solid #dee2e6",
                            }}
                            onError={(e) => {
                              console.error("Current image 2 failed to load");
                              e.target.style.display = "none";
                            }}
                          />
                          <p className="text-muted mt-2 mb-0">
                            Current Image 2
                          </p>
                        </div>
                      ) : (
                        <div className="text-center py-4 bg-light rounded">
                          <FaImage size={48} className="text-muted mb-2" />
                          <p className="text-muted mb-0">No current image 2</p>
                        </div>
                      )}
                    </div>
                  </Col>

                  {/* New Image Upload */}
                  <Col md={6} className="mb-4">
                    <Form.Label className="fw-semibold">
                      <FaImage className="me-2" />
                      Upload New Image 1 (Optional)
                    </Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 1)}
                      isInvalid={!!errors.file}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.file}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      Leave empty to keep current image. Supported formats: JPG,
                      PNG, GIF
                    </Form.Text>

                    {filePreview && (
                      <div className="mt-3 text-center">
                        <img
                          src={filePreview}
                          alt="New preview"
                          style={{
                            maxWidth: "150px",
                            maxHeight: "150px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            border: "2px solid #007bff",
                          }}
                        />
                        <p className="text-primary mt-2 mb-0 small">
                          New Image 1 Preview
                        </p>
                      </div>
                    )}
                  </Col>

                  <Col md={6} className="mb-4">
                    <Form.Label className="fw-semibold">
                      <FaImage className="me-2" />
                      Upload New Image 2 (Optional)
                    </Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 2)}
                      isInvalid={!!errors.file2}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.file2}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      Leave empty to keep current image. Supported formats: JPG,
                      PNG, GIF
                    </Form.Text>

                    {file2Preview && (
                      <div className="mt-3 text-center">
                        <img
                          src={file2Preview}
                          alt="New preview 2"
                          style={{
                            maxWidth: "150px",
                            maxHeight: "150px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            border: "2px solid #007bff",
                          }}
                        />
                        <p className="text-primary mt-2 mb-0 small">
                          New Image 2 Preview
                        </p>
                      </div>
                    )}
                  </Col>

                  {/* Product Details */}
                  <Col md={6} className="mb-3">
                    <Form.Label className="fw-semibold">
                      <FaTag className="me-2" />
                      Product Name *
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter product name"
                      isInvalid={!!errors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label className="fw-semibold">
                      <FaTag className="me-2" />
                      Brand
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      placeholder="Enter brand name"
                    />
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label className="fw-semibold">
                      <FaTag className="me-2" />
                      Category *
                    </Form.Label>
                    <Form.Select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      isInvalid={!!errors.category}
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.category}
                    </Form.Control.Feedback>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label className="fw-semibold">
                      <FaRupeeSign className="me-2" />
                      Price *
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text>₹</InputGroup.Text>
                      <Form.Control
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        isInvalid={!!errors.price}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.price}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label className="fw-semibold">
                      <FaBoxes className="me-2" />
                      Stock Quantity *
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name="stockQuantity"
                      value={formData.stockQuantity}
                      onChange={handleInputChange}
                      placeholder="Enter stock quantity"
                      min="0"
                      isInvalid={!!errors.stockQuantity}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.stockQuantity}
                    </Form.Control.Feedback>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label className="fw-semibold">
                      Product Status
                    </Form.Label>
                    <Form.Check
                      type="checkbox"
                      name="productAvailable"
                      label="Product Available"
                      checked={formData.productAvailable}
                      onChange={handleInputChange}
                      className="mt-2"
                    />
                  </Col>

                  <Col xs={12} className="mb-4">
                    <Form.Label className="fw-semibold">
                      <FaFileAlt className="me-2" />
                      Description *
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter product description"
                      isInvalid={!!errors.description}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.description}
                    </Form.Control.Feedback>
                  </Col>
                </Row>

                <div className="d-flex gap-3 justify-content-end">
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate("/admin/products/manage")}
                    disabled={updating}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={updating}
                    className="px-4"
                  >
                    {updating ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          className="me-2"
                        />
                        Updating...
                      </>
                    ) : (
                      <>
                        <FaSave className="me-2" />
                        Update Product
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UpdateProduct;
