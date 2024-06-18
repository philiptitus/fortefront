"use client"; // Add this line at the top

import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Spinner, Alert } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { createHostel } from 'store/actions/hostelActions';
import { logout } from 'store/actions/userAction';
const CreateHostel = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
	const [tokenExpired, setTokenExpired] = useState(false);

  const hostelCreate = useSelector((state) => state.hostelCreate);
  const { loading: loadingHostel, error: errorHostel, success } = hostelCreate;

  const [formData, setFormData] = useState({
    hostel_name: '',
    stripe_key: '',
    address: '',
    gender: '',
    phone: '',
    email: '',
    demo_secret: false,
  });




  const [hasExpired, setHasExpired] = useState(false);
	const [currentTime, setCurrentTime] = useState(new Date());
    const expirationTime = userInfo?.expiration_time


    

	useEffect(() => {
		if (!userInfo || !("access" in userInfo)) {
		  dispatch(logout());
	
		}
	  }, [dispatch, userInfo]);

	  useEffect(() => {
		if (!userInfo) {
		  router.push('/authentication/sign-in')
		}
		  }, [router,userInfo]);


		  const logoutHandler = () => {
			dispatch(logout())
			router.push('/authentication/sign-in')
			window.location.reload();
			
		  };


      		  
          useEffect(() => {
            if (userInfo) {
              // Parse the expiration time string into components
              const [, year, month, day, hour, minute, second] = expirationTime.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
        
              // Create a Date object with the parsed components
              const expirationDateTime = new Date(year, month - 1, day, hour, minute, second);
        
              // Calculate the remaining time in milliseconds
              const timeRemaining = expirationDateTime - new Date();
        
              if (timeRemaining > 0) {
                // Set up a timeout to update the state when the expiration time is reached
                const timeout = setTimeout(() => setHasExpired(true), timeRemaining);
        
                // Clean up the timeout on component unmount or when expirationTime changes
                return () => clearTimeout(timeout);
              } else {
                // If the expiration time has already passed, update the state immediately
                setHasExpired(true);
              }
            }
          }, [expirationTime, userInfo]);
        

  useEffect(() => {
	if (hasExpired) {
	  logoutHandler()
	}
	  }, [hasExpired]);
	





  useEffect(() => {
    if (success) {
      router.push('/pages/adminsettings');
    }
  }, [router, success]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createHostel(formData));
  };

  return (
    <Container>
      <div style={styles.root}>
        <h1 style={{ marginBottom: '2rem', color: '#333' }}>Create Hostel</h1>
        <Form onSubmit={handleSubmit} style={styles.form}>
          <Form.Group controlId="hostel_name">
            <Form.Label>Hostel Name</Form.Label>
            <Form.Control
              type="text"
              name="hostel_name"
              value={formData.hostel_name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="phone">
            <Form.Label>Official Hostel Contact Number</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              title="Please enter a valid phone number with 10 digits"
            />
          </Form.Group>

          <Form.Group controlId="email">
            <Form.Label>Official Hostel Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="gender">
            <Form.Label>Select Gender</Form.Label>
            <Form.Control
              as="select"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male Hostel</option>
              <option value="female">Female Hostel</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="demo_secret">
            <Form.Check
              type="radio"
              name="demo_secret"
              value={false}
              checked={!formData.demo_secret}
              onChange={() => setFormData((prev) => ({ ...prev, demo_secret: false }))}
              label="I want to use my own Stripe account"
            />
            <Form.Check
              type="radio"
              name="demo_secret"
              value={true}
              checked={formData.demo_secret}
              onChange={() => setFormData((prev) => ({ ...prev, demo_secret: true }))}
              label="Use demo Stripe account"
            />
          </Form.Group>

          {!formData.demo_secret && (
            <Form.Group controlId="stripe_key">
              <Form.Label>Stripe Key</Form.Label>
              <Form.Control
                type="password"
                name="stripe_key"
                value={formData.stripe_key}
                onChange={handleChange}
                required
              />
            </Form.Group>
          )}

          <Form.Group controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {loadingHostel && <Spinner animation="grow" variant="danger" className="me-2" />}
          {errorHostel && <Alert variant="danger">{errorHostel}</Alert>}
          {success && <Alert variant="success">Hostel created successfully!</Alert>}

          <Button type="submit" style={styles.submitButton} disabled={loadingHostel}>
            {loadingHostel ? 'Creating...' : 'Create Hostel'}
          </Button>
        </Form>
      </div>
    </Container>
  );
};

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '2rem',
    backgroundColor: '#f9f9f9',
    padding: '2rem',
    borderRadius: '1rem',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
  },
  form: {
    width: '100%',
    marginTop: '1rem',
  },
  submitButton: {
    marginTop: '2rem',
    width: '50%',
    borderRadius: '25px',
    padding: '1.5rem',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    background: 'linear-gradient(to right, #5FCC9C, #78FF5B)',
    border: 0,
    color: 'white',
    transition: 'background 0.3s, transform 0.3s',
    '&:hover': {
      background: 'linear-gradient(to right, #78FF5B, #5FCC9C)',
      transform: 'scale(1.05)',
    },
  },
};

export default CreateHostel;
