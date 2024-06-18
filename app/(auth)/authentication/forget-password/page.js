'use client'

// import node module libraries
import { Row, Col, Card, Form, Button, Image, Alert, Spinner } from 'react-bootstrap';
import Link from 'next/link';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forgot_password } from 'store/actions/userAction';

// import hooks
import useMounted from 'hooks/useMounted';

const ForgetPassword = () => {
  const hasMounted = useMounted();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');

  const forgotPasswordState = useSelector((state) => state.forgotPassword);
  const { error, loading, success } = forgotPasswordState;

  const handleSubmit2 = (e) => {
    e.preventDefault();
    dispatch(forgot_password(email));
  };

  return (
    <Row className="align-items-center justify-content-center g-0 min-vh-100">
      <Col xxl={4} lg={6} md={8} xs={12} className="py-8 py-xl-0">
        <Card className="smooth-shadow-md">
          <Card.Body className="p-6">
            <div className="mb-4">
              <p className="mb-6">Don&apos;t worry, we&apos;ll send you an email to reset your password. But You Have To Make Sure Your Account Was Verified Earlier.</p>
            </div>
            {hasMounted &&
              <Form onSubmit={handleSubmit2}>
                {loading && <Spinner animation="border" />}
                {error && <Alert variant="danger">Invalid Email Or Account Not Activated</Alert>}
                {success && (
                  <Alert variant="success">
                    Password Reset Link Sent To Your Email. Please check your email.
                    <br />
                    <Link href="/authentication/sign-in">
                      <i style={{ color: "black" }}>Back To Log IN</i>
                    </Link>
                  </Alert>
                )}
                {!loading && !success && (
                  <>
                    <Form.Group className="mb-3" controlId="email">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Enter Your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <div className="mb-3 d-grid">
                      <Button variant="primary" type="submit">
                        Reset Password
                      </Button>
                    </div>
                    <span>Don&apos;t have an account? <Link href="/authentication/sign-in">Sign In</Link></span>
                  </>
                )}
              </Form>
            }
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default ForgetPassword;
