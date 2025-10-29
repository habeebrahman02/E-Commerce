import React, { useState } from "react";
import api from "../services/axios";
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Form, 
  Button, 
  Alert, 
  Spinner,
  InputGroup
} from "react-bootstrap";
import { 
  FaUpload, 
  FaPlus, 
  FaTag, 
  FaDollarSign, 
  FaBoxes,
  FaImage,
  FaFileAlt
} from "react-icons/fa";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    stockQuantity: "",
    brand: "",
  });
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [file1Preview, setFile1Preview] = useState(null);
  const [file2Preview, setFile2Preview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
  const [errors, setErrors] = useState({});

  const categories = [
    "Shirts", 
    "Pants", 
    "T-shirts", 
    "Hoodies", 
    "Sneakers", 
    "Shades"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleFileChange = (e, imageNumber) => {
    const selectedFile = e.target.files[0];
    
    if (imageNumber === 1) {
      setFile1(selectedFile);
      
      if (selectedFile) {
        const reader = new FileReader();
        reader.onload = (e) => setFile1Preview(e.target.result);
        reader.readAsDataURL(selectedFile);
      } else {
        setFile1Preview(null);
      }
      
      if (errors.file1) {
        setErrors(prev => ({ ...prev, file1: "" }));
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
        setErrors(prev => ({ ...prev, file2: "" }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Please select a category";
    if (!formData.price || formData.price <= 0) newErrors.price = "Please enter a valid price";
    if (!formData.stockQuantity || formData.stockQuantity < 0) newErrors.stockQuantity = "Please enter a valid stock quantity";
    if (!file1) newErrors.file1 = "Please select at least the first image";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: "", variant: "" }), 5000);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      price: "",
      stockQuantity: "",
      brand: "",
    });
    setFile1(null);
    setFile2(null);
    setFile1Preview(null);
    setFile2Preview(null);
    setErrors({});
    document.getElementById('fileInput1').value = '';
    document.getElementById('fileInput2').value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showAlert("Please fix the errors below", "danger");
      return;
    }

    setLoading(true);

    const submitData = new FormData();
    
    // add first img req
    submitData.append("file", file1);
    
    // add sec img optional
    if (file2) {
      submitData.append("file2", file2);
    }
    
    submitData.append("name", formData.name.trim());
    submitData.append("description", formData.description.trim());
    submitData.append("category", formData.category);
    submitData.append("price", formData.price);
    submitData.append("stockQuantity", formData.stockQuantity);
    submitData.append("brand", formData.brand.trim());

    try {
      const response = await api.post("/products/with-image", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Product added:", response.data);
      showAlert("Product added successfully! 🎉", "success");
      resetForm();
    } catch (error) {
      console.error("Error adding product:", error);
      
      let errorMessage = "Failed to add product. Please try again.";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      showAlert(errorMessage, "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8} xl={6}>
          <Card className="shadow-lg border-0">
            <Card.Header className="bg-primary text-white text-center py-4">
              <h2 className="mb-0">
                <FaPlus className="me-2" />
                Add New Product
              </h2>
            </Card.Header>
            
            <Card.Body className="p-4">
              {alert.show && (
                <Alert variant={alert.variant} className="mb-4">
                  {alert.message}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaTag className="me-2 text-primary" />
                        Product Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter product name"
                        isInvalid={!!errors.name}
                        className="form-control-lg"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.name}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Brand</Form.Label>
                      <Form.Control
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        placeholder="Enter brand name"
                        className="form-control-lg"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Form.Select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        isInvalid={!!errors.category}
                        className="form-control-lg"
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
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaDollarSign className="me-2 text-success" />
                        Price
                      </Form.Label>
                      <InputGroup>
                        <InputGroup.Text>₹</InputGroup.Text>
                        <Form.Control
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          placeholder="00"
                          min="0"
                          step="0.01"
                          isInvalid={!!errors.price}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.price}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaBoxes className="me-2 text-info" />
                        Stock Quantity
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="stockQuantity"
                        value={formData.stockQuantity}
                        onChange={handleInputChange}
                        placeholder="Enter quantity"
                        min="0"
                        isInvalid={!!errors.stockQuantity}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.stockQuantity}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaFileAlt className="me-2 text-primary" />
                    Description
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter product description"
                    isInvalid={!!errors.description}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.description}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* First Product Image */}
                <Form.Group className="mb-4">
                  <Form.Label>
                    <FaImage className="me-2 text-warning" />
                    Product Image 1 (Required)
                  </Form.Label>
                  <Form.Control
                    type="file"
                    id="fileInput1"
                    onChange={(e) => handleFileChange(e, 1)}
                    accept="image/*"
                    isInvalid={!!errors.file1}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.file1}
                  </Form.Control.Feedback>
                  
                  {file1Preview && (
                    <div className="mt-3 text-center">
                      <img
                        src={file1Preview}
                        alt="Preview 1"
                        className="img-thumbnail"
                        style={{ maxHeight: "200px", maxWidth: "100%" }}
                      />
                      <p className="text-muted mt-2 mb-0">Image 1 Preview</p>
                    </div>
                  )}
                </Form.Group>

                {/* Second Product Image */}
                <Form.Group className="mb-4">
                  <Form.Label>
                    <FaImage className="me-2 text-warning" />
                    Product Image 2 (Optional)
                  </Form.Label>
                  <Form.Control
                    type="file"
                    id="fileInput2"
                    onChange={(e) => handleFileChange(e, 2)}
                    accept="image/*"
                    isInvalid={!!errors.file2}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.file2}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    You can add a second image to showcase your product better
                  </Form.Text>
                  
                  {file2Preview && (
                    <div className="mt-3 text-center">
                      <img
                        src={file2Preview}
                        alt="Preview 2"
                        className="img-thumbnail"
                        style={{ maxHeight: "200px", maxWidth: "100%" }}
                      />
                      <p className="text-muted mt-2 mb-0">Image 2 Preview</p>
                    </div>
                  )}
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    size="lg"
                    type="submit"
                    disabled={loading}
                    className="py-3"
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          className="me-2"
                        />
                        Adding Product...
                      </>
                    ) : (
                      <>
                        <FaUpload className="me-2" />
                        Add Product
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

export default AddProduct;
