'use client'

// import node module libraries
import { Row, Col, Card, Form, Button, Image } from 'react-bootstrap';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircleFill, ExclamationTriangleFill } from 'react-bootstrap-icons';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import { register } from 'store/actions/userAction';

const SignUp = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [user_type, setuser_Type] = useState('');
  const [Id_number, setId_number] = useState('');
  const [errorer, setError] = useState('');


  const userLogin = useSelector((state) => state.userLogin);
  const { error: errorLogin, loading: loadingLogin, userInfo: userInfoLogin } = userLogin;


  const userRegister = useSelector((state) => state.userRegister);
  const { error, loading, userInfo, success } = userRegister;

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("The Passwords Did not Match!");
    } else {
      try {
        await dispatch(register(name, email, password, gender, user_type, Id_number));
      } catch (error) {
        setError(error);
      }
    }
  };




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
              <h5>Forte</h5>
              <p className="mb-6">Please enter your user information.</p>
            </div>
            {loading ? (
              <Row className='justify-content-center align-items-center'>
                <Spinner animation="grow" variant="primary" className="me-2" />
              </Row>
            ) : (
              <Form onSubmit={submitHandler}>
                {error && 
                  <Alert variant="warning">
                    <ExclamationTriangleFill size={25} className="me-1" />
                    {error}
                  </Alert>
                }
                {success &&
                  <Alert variant="success">
                    <CheckCircleFill size={25} className="me-1" />
                    "You Can Now Click On Log In"
                  </Alert>
                }
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label>Username</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="User Name" 
                    required 
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Enter address here" 
                    required 
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="idNumber">
                  <Form.Label>ID Number</Form.Label>
                  <Form.Control 
                    type="number" 
                    value={Id_number}
                    onChange={(e) => {
                      let input = e.target.value.replace(/^0+/, '').replace(/\D/g, '').slice(0, 8);
                      setId_number(input);
                      const errorMessage = input.length !== 8 ? 'ID number must be exactly 8 digits' : '';
                      setError(errorMessage);
                    }} 
                    placeholder="Enter Your ID NO" 
                    required 
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="userType">
                  <Form.Label>Account Type</Form.Label>
                  <Form.Control 
                    as="select"
                    value={user_type}
                    onChange={(e) => setuser_Type(e.target.value)}
                    required
                  >
                    <option value="">Select Account Type</option>
                    <option value="admin">Admin</option>
                    <option value="student">Student</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3" controlId="gender">
                  <Form.Label>Gender</Form.Label>
                  <Form.Control 
                    as="select"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="**************" 
                    required 
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="confirm-password">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    placeholder="**************" 
                    required 
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button variant="primary" type="submit">Create Free Account</Button>
                </div>

                <div className="d-md-flex justify-content-between mt-4">
                  <div className="mb-2 mb-md-0">
                    <Link href="/authentication/sign-in" className="fs-5">Already member? Login</Link>
                  </div>
                  <div>
                    <Link href="/authentication/forget-password" className="text-inherit fs-5">Forgot your password?</Link>
                  </div>
                </div>
              </Form>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default SignUp;
