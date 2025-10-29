import React, { useEffect, useState } from "react";
import api from "../services/axios";
import { Table, Button, Spinner, Alert } from "react-bootstrap";
import { FaTrash, FaEdit, FaBox } from "react-icons/fa";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      showAlert("Failed to fetch products.", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: "", variant: "" }), 4000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await api.delete(`/products/${id}`);
      showAlert("Product deleted successfully!", "success");
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
      showAlert("Failed to delete product.", "danger");
    }
  };

  // Function to handle first image
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

  // Function to handle second image
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

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  return (
    <div className="product-list-container py-4">
      {alert.show && (
        <Alert variant={alert.variant} className="mb-4 text-center">
          {alert.message}
        </Alert>
      )}

      <h3 className="mb-4 text-center">All Products</h3>

      <Table responsive bordered hover className="shadow-sm">
        <thead className="table-primary">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price (₹)</th>
            <th>Stock</th>
            <th>Images</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">
                No products available.
              </td>
            </tr>
          ) : (
            products.map((product) => {
              const imageSrc = getImageSrc(product);
              const imageSrc2 = getImageSrc2(product);

              return (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.price}</td>
                  <td>{product.stockQuantity}</td>
                  <td>
                    <div className="d-flex gap-1">
                      {imageSrc ? (
                        <img
                          src={imageSrc}
                          alt={`${product.name} - Image 1`}
                          style={{
                            height: "40px",
                            width: "40px",
                            objectFit: "cover",
                            borderRadius: "5px",
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
                            borderRadius: "5px",
                            border: "1px solid #dee2e6",
                          }}
                        >
                          <FaBox className="text-muted" size={16} />
                        </div>
                      )}
                      {imageSrc2 && (
                        <img
                          src={imageSrc2}
                          alt={`${product.name} - Image 2`}
                          style={{
                            height: "40px",
                            width: "40px",
                            objectFit: "cover",
                            borderRadius: "5px",
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
                      )}
                    </div>
                  </td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      title="Edit Product"
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                      title="Delete Product"
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default ProductList;
