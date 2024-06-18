import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button, InputGroup, Alert, Spinner } from 'react-bootstrap';
import { CheckCircle, CloudUpload } from 'react-bootstrap-icons';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { editHostel, listHostelDetails } from 'store/actions/hostelActions';
import axiosInstance from 'store/axiosinstance/axiosinstance';

const FileUpload = ({ onChange }) => {
  const handleButtonClick = () => {
    document.getElementById('image').click();
  };

  return (
    <div>
      <input
        type="file"
        id="image"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={onChange}
      />
      <Button variant="outline-primary" onClick={handleButtonClick}>
        <CloudUpload className="me-2" />
        Upload Image
      </Button>
    </div>
  );
};

const HostelForm = ({ defaultValue }) => {
  const router = useRouter();
  const dispatch = useDispatch();


  const [userdata, setUserdata] = useState(null);

  useEffect(() => {
      // Retrieve the user data from localStorage
      const userPrimary = localStorage.getItem('userPrimary');

      if (userPrimary) {
          // Parse the JSON string into an object
          setUserdata(JSON.parse(userPrimary));
      }
  }, []);

  const hostelDetail = useSelector((state) => state.hostelDetail);
  const {  loading:loadingHostel, hostel } = hostelDetail;

  useEffect(() => {
    if (userdata) {
      dispatch(listHostelDetails(userdata?.hostel));

    }

}, [dispatch, userdata]);

  const [hostel_name, setHostelName] = useState(hostel?.hostel_name);
  const [stripe_key, setStripeKey] = useState('');
  const [address, setAddress] = useState(hostel?.address);
  const [room_price_1, setRoomPrice1] = useState(hostel?.room_price_1);
  const [room_price_2, setRoomPrice2] = useState(hostel?.room_price_2);
  const [room_price_4, setRoomPrice4] = useState(hostel?.room_price_4);
  const [phone, setPhone] = useState(hostel?.phone);
  const [email, setEmail] = useState(hostel?.email);
  const [imag1, setImag1] = useState(hostel?.imag1);
  const [imag2, setImag2] = useState(hostel?.imag2);
  const [imag3, setImag3] = useState(hostel?.imag3);
  const [imag4, setImag4] = useState(hostel?.imag4);
  const [imag5, setImag5] = useState(hostel?.imag5);
  const [imag6, setImag6] = useState(hostel?.imag6);
  const [imag7, setImag7] = useState(hostel?.imag7);
  const [imag8, setImag8] = useState(hostel?.imag8);
  const [imag9, setImag9] = useState(hostel?.imag9);
  const [imag10, setImag10] = useState(hostel?.imag10);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState('Image 1');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const hostelEdit = useSelector((state) => state.hostelEdit);
  const { loading } = hostelEdit;

  useEffect(() => {
    if (hostelEdit.error) {
      setError(hostelEdit.error);
    } else if (hostelEdit.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  }, [hostelEdit]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      editHostel({
        hostel_name,
        stripe_key,
        address,
        room_price_1,
        room_price_2,
        room_price_4,
        phone,
        email,
      })
    );
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    const imageField = `imag${selectedImage.split(' ')[1]}`;

    formData.append(imageField, file);
    const imageSetter = {
      'Image 1': setImag1,
      'Image 2': setImag2,
      'Image 3': setImag3,
      'Image 4': setImag4,
      'Image 5': setImag5,
      'Image 6': setImag6,
      'Image 7': setImag7,
      'Image 8': setImag8,
      'Image 9': setImag9,
      'Image 10': setImag10,
    }[selectedImage];

    imageSetter(URL.createObjectURL(e.target.files[0]));

    setUploading(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };
      await axiosInstance.post(`/api/hostels/upload/`, formData, config);
      setUploading(false);
    } catch (error) {
      setUploading(false);
    }
  };

  return (
    <div>
 <Row className="align-items-center justify-content-center text-center">
        <h3>Update Hostel Info</h3>
        <Col xs={12} md={8}>
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="hostel_name" className="mb-3">
              <Form.Label>Hostel Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter hostel name"
                value={hostel_name}
                onChange={(e) => setHostelName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="email" className="mb-3">
              <Form.Label>Official Hostel Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                // Removed required attribute
              />
            </Form.Group>

            <Form.Group controlId="phone" className="mb-3">
              <Form.Label>Official Hostel Contact Number</Form.Label>
              <InputGroup>
                <InputGroup.Text>+254</InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  // Removed required attribute
                />
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="stripe_key" className="mb-3">
              <Form.Label>Stripe Key</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Stripe key"
                value={stripe_key}
                onChange={(e) => setStripeKey(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="address" className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="room_price_1" className="mb-3">
              <Form.Label>Price for Room with 1 capacity (USD)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={room_price_1}
                onChange={(e) => setRoomPrice1(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="room_price_2" className="mb-3">
              <Form.Label>Price for Room with 2 capacity (USD)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={room_price_2}
                onChange={(e) => setRoomPrice2(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="room_price_4" className="mb-3">
              <Form.Label>Price for Room with 4 capacity (USD)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={room_price_4}
                onChange={(e) => setRoomPrice4(e.target.value)}
              />
            </Form.Group>
            {loading && <Spinner animation="grow" variant="danger" className="me-2" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Hostel Information Update Success</Alert>}
     

            <Button variant="primary" type="submit">
              <CheckCircle className="me-2" />
              Save Changes
            </Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default HostelForm;
