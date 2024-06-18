
'use client'
import { useEffect, useState } from 'react';
import { Row, Col, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { register, login } from 'store/actions/userAction';
import { useClient } from 'next/client';

const useIsClient = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
};

const SignIn = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const userRegister = useSelector((state) => state.userRegister);
  const { loading, userInfo, success } = userRegister;

  const userLogin = useSelector((state) => state.userLogin);
  const { error: errorLogin, loading: loadingLogin, userInfo: userInfoLogin } = userLogin;

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("The Passwords Did not Match !");
    } else {
      try {
        await dispatch(register(name, email, password));
        if (success) {
          router.push('/authentication/sign-in');
        }
      } catch (error) {
        setError(error);
      }
    }
  };

  const LoginHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  useEffect(() => {
    if (userInfo) {
      router.push('/authentication/sign-in');
    }
  }, [dispatch, router, userInfo]);

  useEffect(() => {
    if (userInfoLogin) {
      router.push('/');
    }
  }, [dispatch, router, userInfoLogin]);



  return (
    <Row className="align-items-center justify-content-center g-0 min-vh-100">
      <Col xxl={4} lg={6} md={8} xs={12} className="py-8 py-xl-0">
        <Card className="smooth-shadow-md">
          <Card.Body className="p-6">
            <div className="mb-4">
              <h4 className="mb-6">FORTE.</h4>
              <p className="mb-6">Please enter your user information.</p>
            </div>
              <Form onSubmit={LoginHandler}>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control 
                    type="email" 
                    placeholder="Enter email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="**************" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button variant="primary" type="submit">Sign In</Button>
                </div>
                <div className="d-md-flex justify-content-between mt-4">
                  <div className="mb-2 mb-md-0">
                    <Link href="/authentication/sign-up" className="fs-5">Create An Account </Link>
                  </div>
                  <div>
                    <Link href="/authentication/forget-password" className="text-inherit fs-5">Forgot your password?</Link>
                  </div>
                </div>
              </Form>
            {(loading || loadingLogin) && (
              <div className="d-flex justify-content-center mt-4">
                <Spinner animation="grow" variant="primary" />
              </div>
            )}
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">You Can Now Log In</Alert>}
            {errorLogin && <Alert variant="danger">{errorLogin}</Alert>}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
};

export default SignIn;
