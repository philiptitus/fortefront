import React, { useEffect, useState } from 'react';
import { Col, Row, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { registerStaff, logout } from 'store/actions/userAction';

const RegisterStaff = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    user_type: 'staff',
    Id_number: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [idNumberError, setIdNumberError] = useState('');

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userRegister = useSelector((state) => state.userRegister);
  const { error: errorRegister, loading: loadingRegister, success: registerSuccess } = userRegister;

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleIdNumberChange = (e) => {
    let input = e.target.value.replace(/^0+/, '').replace(/\D/g, '');
    input = input.slice(0, 8);
    setFormData({ ...formData, Id_number: input });

    const errorMessage = input.length !== 8 ? 'ID number must be exactly 8 digits' : '';
    setIdNumberError(errorMessage);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const { name, email, password, confirmPassword, user_type, gender, Id_number } = formData;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (Id_number.length !== 8) {
      setIdNumberError('ID number must be exactly 8 digits');
      return;
    }

    setLoading(true);
    await dispatch(registerStaff(name, email, password, gender, user_type, Id_number));

    if (errorRegister) {
      setError(errorRegister);
      setLoading(false);
    } else if (registerSuccess) {
      setLoading(false);
      setSuccess(true);
    }
  };

  return (
    <Row className="mb-8">
      <Col xl={3} lg={4} md={12} xs={12}>
        <div className="mb-4 mb-lg-0">
          <h4 className="mb-1">Register Staff</h4>
          <p className="mb-0 fs-5 text-muted">Fill out the form below to register a new staff member</p>
        </div>
      </Col>
      <Col xl={9} lg={8} md={12} xs={12}>
        <Card>
          <Card.Body>
            <form onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="Id_number">
                  <Form.Label>ID NUMBER</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter ID number"
                    name="Id_number"
                    value={formData.Id_number}
                    onChange={handleIdNumberChange}
                    required
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="confirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Row>
              {loadingRegister && <Spinner animation="grow" variant="danger" className="me-2" />}
              {errorRegister && <Alert variant="danger">{errorRegister}</Alert>}

              {error && <Alert variant="danger">{error}</Alert>}
              {idNumberError && <Alert variant="danger">{idNumberError}</Alert>}
              {registerSuccess && <Alert variant="success">Registration successful! Your staff member will receive an email.</Alert>}
              <Button variant="primary" type="submit" disabled={loading}>
                Register
              </Button>
            </form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default RegisterStaff;
