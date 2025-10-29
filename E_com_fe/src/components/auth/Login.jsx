import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, InputGroup, Alert } from "react-bootstrap";
import { FaEnvelope, FaLock } from "react-icons/fa";
import api from "../services/axios";

const Login = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleUserLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });
      const loggedInUser = res.data;

      if (loggedInUser.role !== "CUSTOMER") {
        setError("This account is not authorized for user access");
        return;
      }
      
      localStorage.setItem("user", JSON.stringify({
        id: loggedInUser.id,
        name: loggedInUser.name,
        email: loggedInUser.email,
        role: loggedInUser.role,
        token: loggedInUser.token
      }));

      if (loggedInUser.token) {
        localStorage.setItem("token", loggedInUser.token);
      }

      alert("Login successful! Welcome back! 🎉");
      onClose?.();
      navigate("/user/home"); 
      window.location.reload(); 
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || err.response?.data || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-2">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={5}>
          <Card className="shadow-lg border-0 rounded-4">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4 fw-bold text-success">User Login</h2>
              
              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleUserLogin}>
                {/* Email */}
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaEnvelope />
                    </InputGroup.Text>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
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
                      placeholder="Enter password"
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
                    variant="success" 
                    size="lg" 
                    className="fw-semibold"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </div>
              </Form>

              <p className="text-center mt-4 mb-0">
                Don't have an account?{" "}
                <Link to="/signup" onClick={() => onClose?.()} className="fw-semibold">
                  Signup
                </Link>
              </p>
            </Card.Body>
            <Card.Footer className="text-center small text-muted">
              © {new Date().getFullYear()} Amaterra — User Portal
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;





