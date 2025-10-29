import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, InputGroup, Alert } from "react-bootstrap";
import { FaEnvelope, FaLock } from "react-icons/fa";
import api from "../services/axios";

const AdminLogin = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });
      const loggedInAdmin = res.data;

      if (loggedInAdmin.role !== "ADMIN") {
        setError("This account is not authorized for admin access");
        return;
      }

      localStorage.setItem("user", JSON.stringify({
        id: loggedInAdmin.id,
        name: loggedInAdmin.name || "Admin",
        email: loggedInAdmin.email,
        role: "ADMIN",
        token: loggedInAdmin.token
      }));

      if (loggedInAdmin.token) {
        localStorage.setItem("token", loggedInAdmin.token);
      }

      alert("Admin login successful! Welcome! 🎉");
      onClose?.();
      navigate("/admin/home"); 
      window.location.reload(); 
    } catch (err) {
      console.error("Admin login error:", err);
      setError(err.response?.data?.message || err.response?.data || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={5}>
          <Card className="shadow-lg border-0 rounded-4">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4 fw-bold text-primary">Admin Login</h2>
              
              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleAdminLogin}>
                {/* Email */}
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaEnvelope />
                    </InputGroup.Text>
                    <Form.Control
                      type="email"
                      placeholder="Enter admin email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </InputGroup>
                </Form.Group>

                {/* Password */}
                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaLock />
                    </InputGroup.Text>
                    <Form.Control
                      type="password"
                      placeholder="Enter admin password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </InputGroup>
                </Form.Group>

                {/* Button */}
                <div className="d-grid">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg" 
                    className="fw-semibold"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
            <Card.Footer className="text-center small text-muted">
              © {new Date().getFullYear()} Amaterra — Admin Portal
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminLogin;




