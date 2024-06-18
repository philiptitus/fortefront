import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { CloudUpload } from 'react-bootstrap-icons';
import axiosInstance from 'store/axiosinstance/axiosinstance';
import { useDispatch, useSelector } from 'react-redux';
import { listHostelDetails } from 'store/actions/hostelActions';

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

const HostelImage = ({ defaultValue }) => {
  const [selectedImage, setSelectedImage] = useState('Image 1');
  const hostelDetail = useSelector((state) => state.hostelDetail);
  const {  loading:loadingHostel, hostel } = hostelDetail;

  const [images, setImages] = useState({
    imag1: hostel?.imag1,
    imag2: hostel?.imag2,
    imag3: hostel?.imag3,
    imag4: hostel?.imag4,
    imag5: hostel?.imag5,
    imag6: hostel?.imag6,
    imag7: hostel?.imag7,
    imag8: hostel?.imag8,
    imag9: hostel?.imag9,
    imag10: hostel?.imag10,
  });
  const [imag1, setimag1] = useState(hostel?.imag1);
  const [imag2, setimag2] = useState(hostel?.imag2);
  const [imag3, setimag3] = useState(hostel?.imag3);
  const [imag4, setimag4] = useState(hostel?.imag4);
  const [imag5, setimag5] = useState(hostel?.imag5);
  const [imag6, setimag6] = useState(hostel?.imag6);
  const [imag7, setimag7] = useState(hostel?.imag7);
  const [imag8, setimag8] = useState(hostel?.imag8);
  const [imag9, setimag9] = useState(hostel?.imag9);
  const [imag10, setimag10] = useState(hostel?.imag10);
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState(null);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

const dispatch = useDispatch()

  const [userdata, setUserdata] = useState(null);

  useEffect(() => {
      // Retrieve the user data from localStorage
      const userPrimary = localStorage.getItem('userPrimary');

      if (userPrimary) {
          // Parse the JSON string into an object
          setUserdata(JSON.parse(userPrimary));
      }
  }, []);


  useEffect(() => {
    if (userdata) {
      dispatch(listHostelDetails(userdata?.hostel));

    }

}, [dispatch, userdata]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    const imageFieldName = selectedImage.toLowerCase().replace(' ', '');

    if (selectedImage === 'Image 2') {
      formData.append('imag2', file);
      setimag2(URL.createObjectURL(e.target.files[0]));
    } else if (selectedImage === 'Image 3') {
      formData.append('imag3', file);
      setimag3(URL.createObjectURL(e.target.files[0]));
    } else if (selectedImage === 'Image 1') {
      formData.append('imag1', file);
      setimag1(URL.createObjectURL(e.target.files[0]));
    } else if (selectedImage === 'Image 4') {
      formData.append('imag4', file);
      setimag4(URL.createObjectURL(e.target.files[0]));
    } else if (selectedImage === 'Image 5') {
      formData.append('imag5', file);
      setimag5(URL.createObjectURL(e.target.files[0]));
    } else if (selectedImage === 'Image 6') {
      formData.append('imag6', file);
      setimag6(URL.createObjectURL(e.target.files[0]));
    } else if (selectedImage === 'Image 7') {
      formData.append('imag7', file);
      setimag7(URL.createObjectURL(e.target.files[0]));
    } else if (selectedImage === 'Image 8') {
      formData.append('imag8', file);
      setimag8(URL.createObjectURL(e.target.files[0]));
    } else if (selectedImage === 'Image 9') {
      formData.append('imag9', file);
      setimag9(URL.createObjectURL(e.target.files[0]));
    } else {
      formData.append('imag10', file);
      setimag10(URL.createObjectURL(e.target.files[0]));
    }
  

    // formData.append(imageFieldName, file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };

      const { data } = await axiosInstance.post('/api/hostels/upload/', formData, config);

      setImages({ ...images, [imageFieldName]: URL.createObjectURL(file) });
      setAlert({ variant: 'success', message: `${selectedImage} Updated` });
      setUploading(false);
    } catch (error) {
      setAlert({ variant: 'danger', message: 'Failed to upload image' });
      setUploading(false);
    }
  };

  return (
    <Row className="mb-8">
      <Col xl={3} lg={4} md={12} xs={12}>
        <div className="mb-4 mb-lg-0">
          <h4 className="mb-1">Change Hostel Preview Images</h4>
          <p className="mb-0 fs-5 text-muted">You Can Upload Up To 10 Images</p>
        </div>
      </Col>
      <Col xl={9} lg={8} md={12} xs={12}>
        <Card id="preferences">
          <Card.Body>
            <div className="mb-6">
              <h4 className="mb-1">Add/Change Images</h4>
            </div>
            {alert && <Alert variant={alert.variant}>{alert.message}</Alert>}
            <Form>
              <Row className="mb-3">
                <Col md={8} xs={12}>
                  <img
                    src={images[selectedImage.toLowerCase().replace(' ', '')]}
                    alt={`Uploaded ${selectedImage}`}
                    style={{ maxWidth: '100%', marginTop: '10px' }}
                  />
                  <div className="mb-3">
                    <FileUpload onChange={uploadFileHandler} />
                    {uploading && <Spinner animation="grow" variant="danger" className="me-2" />}
                  </div>
                </Col>
              </Row>

              <Row className="mb-3">
                <Form.Label className="col-md-4" htmlFor="image-selector">Select Image</Form.Label>
                <Col md={8} xs={12}>
                  <Form.Select
                    id="image-selector"
                    value={selectedImage}
                    onChange={(e) => setSelectedImage(e.target.value)}
                  >
                    {[...Array(10)].map((_, index) => (
                      <option key={index} value={`Image ${index + 1}`}>{`Image ${index + 1}`}</option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default HostelImage;
