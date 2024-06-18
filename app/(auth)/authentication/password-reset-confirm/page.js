'use client';

// import node module libraries
import { Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useRouter } from 'next/navigation';
import { reset_password } from 'store/actions/userAction';

const ResetPassword = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const uid = searchParams.get('uid');
  const token = searchParams.get('token');

  const [newPasswords, setNewPasswords] = useState({
    password: '',
    confirm_password: '',
  });
  const { password, confirm_password } = newPasswords;

  const handleChange = (e) => {
    setNewPasswords({ ...newPasswords, [e.target.name]: e.target.value });
  };

  const data = {
    password: password,
    confirm_password: confirm_password,
    uidb64: uid,
    token: token,
  };

  const resetPasswordState = useSelector((state) => state.resetPassword);
  const { error, loading, success } = resetPasswordState;

  const handleSubmit2 = (e) => {
    e.preventDefault();

    if (password !== confirm_password) {
      alert('The Passwords Did not Match!');
      return;
    }

    dispatch(reset_password(data));
  };

  return (
    <Row className="align-items-center justify-content-center g-0 min-vh-100">
      <Col xxl={4} lg={6} md={8} xs={12} className="py-8 py-xl-0">
        <Card className="smooth-shadow-md">
          <Card.Body className="p-6">
            <div className="mb-4">
              <p className="mb-6">Enter your new password below.</p>
            </div>
            <Form onSubmit={handleSubmit2}>
              {loading && <Spinner animation="border" />}
              {error && <Alert variant="danger">{error}</Alert>}
              {success && (
                <Alert variant="success">
                  You can now log in with your new password.
                  <br />
                  <Link href="/authentication/sign-in">
                    <i style={{ color: 'black' }}>Log In</i>
                  </Link>
                </Alert>
              )}
              {!loading && !success && (
                <>
                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Enter Your New Password"
                      value={password}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="confirm_password">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirm_password"
                      placeholder="Confirm Your New Password"
                      value={confirm_password}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <div className="mb-3 d-grid">
                    <Button variant="primary" type="submit">
                      Reset Password
                    </Button>
                  </div>
                  <span>Don't have an account? <Link href="/authentication/sign-in">Sign In</Link></span>
                </>
              )}
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default ResetPassword;
