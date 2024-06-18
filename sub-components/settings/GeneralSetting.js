import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row, Form, Card, Button, Alert, Spinner, Image } from 'react-bootstrap';
import { useRouter } from 'next/navigation'; // Adjust based on your setup
import { CloudUpload } from 'react-bootstrap-icons';
import { API_URL, USER_UPDATE_PROFILE_RESET } from 'store/constants/userConstants';
import { getUserDetails, resetAvi, updateUserProfile } from 'store/actions/userAction';
import axiosInstance from 'store/axiosinstance/axiosinstance';

const FileUpload = ({ onChange }) => {
  
  const handleButtonClick = () => {
    document.getElementById('image').click();
  };
  
  return (
    <label htmlFor="image">
      <input type="file" id="image" onChange={onChange} style={{ display: 'none' }} />
      <Button onClick={handleButtonClick} variant="primary">
        <CloudUpload />
      </Button>
    </label>
  );
};

const GeneralSetting = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const userDetails = useSelector((state) => state.userDetails);
  const { error, loading, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success: successUpdate, error: errorUpdate, loading: loadingUpdate } = userUpdateProfile;
  const aviReset = useSelector((state) => state.aviReset);
  const { error: Avierror, loading: Aviloading, success: Avisuccess } = aviReset;


  const [userdata, setUserdata] = useState(null);

  useEffect(() => {
      // Retrieve the user data from localStorage
      const userPrimary = localStorage.getItem('userPrimary');

      if (userPrimary) {
          // Parse the JSON string into an object
          setUserdata(JSON.parse(userPrimary));
      }
  }, []);


  const [email, setEmail] = useState(userInfo?.email);
  const [name, setName] = useState(userInfo?.name);
  const [bio, setBio] = useState(userInfo?.bio);
  const [avi, setAvi] = useState('');
  const [contact_number, setContactNumber] = useState(userInfo?.contact_number);
  const [address, setAddress] = useState(userInfo?.address);
  const [guardianName, setGuardianName] = useState(userInfo?.guardian_name);
  const [guardianContact, setGuardianContact] = useState(userInfo?.guardian_contact);
  const [guardian2Name, setGuardian2Name] = useState(userInfo?.guardian2_name);
  const [guardian2Contact, setGuardian2Contact] = useState(userInfo?.guardian2_contact);
  const [uploading, setUploading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [aviAlert, setAviAlert] = useState(null);
  const [uploadAlert, setUploadAlert] = useState(null);




  const resetAviHandler = () => {
    dispatch(resetAvi());
  };

  useEffect(() => {
    if (Avisuccess) {
      setAviAlert({ message: "Profile Photo Removed!", variant: 'success' });
    } else if (Avierror) {
      setAviAlert({ message: "Something went wrong!", variant: 'danger' });
    }
  }, [Avisuccess, Avierror]);

  useEffect(() => {
    if (!userInfo) {
      router.push('/authentication/sign-in');
    } else {
      if (!user || !user.name || successUpdate || userInfo._id !== user._id) {
        dispatch({ type: USER_UPDATE_PROFILE_RESET });
        dispatch(getUserDetails('profile'));
      } else {
        setName(user.name || '');
        setEmail(user.email || '');
        setBio(user.bio || '');
        setAvi(user.avi || '');
        setContactNumber(user.contact_number || '');
        setAddress(user.address || '');
        setGuardianName(user.guardian_name || '');
        setGuardian2Name(user.guardian2_name || '');
        setGuardianContact(user.guardian_contact || '');
        setGuardian2Contact(user.guardian2_contact || '');
      }
    }
  }, [dispatch, router, userInfo, user, successUpdate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log("They are pressing me...")
    if (password && password !== confirmPassword) {
      alert("The Passwords Did not Match!");
    } else {
      dispatch(updateUserProfile({
        'id': userdata._id,
        'name': name,
        'email': email,
        'password': password,
        'contact_number': contact_number,
        'address': address,
        'guardian_name': guardianName,
        'guardian_contact': guardianContact,
        'guardian2_name': guardian2Name,
        'guardian2_contact': guardian2Contact,
        'bio': bio,
        'avi': avi,
      }));
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('avi', file);
    formData.append('user_id', userInfo.id);

    setUploading(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };
      const response = await axiosInstance.post(`/api/users/upload/`, formData, config);
      setAvi(response.data.avi);
      setUploading(false);
      setUploadAlert({ message: "Profile Photo Uploaded Successfully your changes should reflect in a few minutes!", variant: 'success' });
    } catch (error) {
      setUploading(false);
      setUploadAlert({ message: "Failed to Upload Photo!", variant: 'danger' });
    }
  };

  return (
    <Row className="mb-8">
      <Row className="align-items-center mb-8">
        <Col md={3} className="mb-3 mb-md-0">
          <h5 className="mb-0">Avatar</h5>
        </Col>
        <Col md={9}>
          <div className="d-flex align-items-center">
            <div className="me-3">
              <Image src={API_URL + userdata?.avi} className="rounded-circle avatar avatar-lg" alt="" />
            </div>
            <div>
              <Button variant="outline-white" className="me-2" type="submit">
                <Form.Group controlId="image">
                  <FileUpload onChange={uploadFileHandler} />
                  {uploading && <Spinner animation="grow" variant="danger" className="me-2" />}
                </Form.Group>
                Change
              </Button>
              <Button variant="outline-white" type="submit" onClick={resetAviHandler}>Remove</Button>
            </div>
          </div>
          {aviAlert && (
            <Alert variant={aviAlert.variant} className="mt-3">
              {aviAlert.message}
            </Alert>
          )}
          {uploadAlert && (
            <Alert variant={uploadAlert.variant} className="mt-3">
              {uploadAlert.message}
            </Alert>
          )}
        </Col>
      </Row>
      <Col xl={3} lg={4} md={12} xs={12}>
        <div className="mb-4 mb-lg-0">
          <h4 className="mb-1">General Setting</h4>
          <p className="mb-0 fs-5 text-muted">Profile configuration settings</p>
        </div>
      </Col>
      <Col xl={9} lg={8} md={12} xs={12}>
        <Card>
          <Card.Body>
            <div className="mb-6">
              <h4 className="mb-1">General Settings</h4>
            </div>
            {loadingUpdate || uploading ? (
              <Row className="justify-content-center align-items-center">
                <Spinner animation="grow" variant="danger" className="me-2" />
              </Row>
            ) : (
              <Form onSubmit={submitHandler}>
                <Row className="mb-3">
                  <Form.Label className="col-sm-4 col-form-label form-label" htmlFor="fullName">Username</Form.Label>
                  <Col sm={4} className="mb-3 mb-lg-0">
                    <Form.Control type="text" placeholder="Username" id="fullName" value={name} onChange={(e) => setName(e.target.value)} />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Form.Label className="col-sm-4 col-form-label form-label" htmlFor="email">Email</Form.Label>
                  <Col md={8} xs={12}>
                    <Form.Control type="email" placeholder="Email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Form.Label className="col-sm-4" htmlFor="phone">Phone <span className="text-muted">(Optional)</span></Form.Label>
                  <Col md={8} xs={12}>
                    <Form.Control type="text" placeholder="Enter Phone" id="phone" value={contact_number} onChange={(e) => setContactNumber(e.target.value)} />
                  </Col>
                </Row>
                {userdata?.user_type === "student" && 

<div>
                <Row className="mb-3">
                  <Form.Label className="col-sm-4" htmlFor="guardianName">Guardian/Parent Name</Form.Label>
                  <Col md={8} xs={12}>
                    <Form.Control type="text" placeholder="Enter Guardian/Parent Name" id="guardianName" value={guardianName} onChange={(e) => setGuardianName(e.target.value)} />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Form.Label className="col-sm-4" htmlFor="guardianContact">Guardian/Parent Phone Number</Form.Label>
                  <Col md={8} xs={12}>
                    <Form.Control type="text" placeholder="Enter Guardian/Parent Phone Number" id="guardianContact" value={guardianContact} onChange={(e) => setGuardianContact(e.target.value)} />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Form.Label className="col-sm-4" htmlFor="guardian2Name">Any Other Guardian/Parent Name</Form.Label>
                  <Col md={8} xs={12}>
                    <Form.Control type="text" placeholder="Enter Other Guardian/Parent Name" id="guardian2Name" value={guardian2Name} onChange={(e) => setGuardian2Name(e.target.value)} />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Form.Label className="col-sm-4" htmlFor="guardian2Contact">Other Guardian/Parent Phone Number</Form.Label>
                  <Col md={8} xs={12}>
                    <Form.Control type="text" placeholder="Enter Other Guardian/Parent Phone Number" id="guardian2Contact" value={guardian2Contact} onChange={(e) => setGuardian2Contact(e.target.value)} />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Form.Label className="col-sm-4" htmlFor="address">Address</Form.Label>
                  <Col md={8} xs={12}>
                    <Form.Control type="text" placeholder="Enter Address" id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
                  </Col>
                </Row>


                </div>

}

                <div className="mb-6">
                  <h4 className="mb-1">Security</h4>
                </div>

                <Row className="mb-3">
                  <Form.Label className="col-sm-4 col-form-label form-label" htmlFor="newPassword">New Password</Form.Label>
                  <Col md={8} xs={12}>
                    <Form.Control type="password" placeholder="Enter New Password" id="newPassword" value={password} onChange={(e) => setPassword(e.target.value)} />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Form.Label className="col-sm-4 col-form-label form-label" htmlFor="confirmPassword">Confirm New Password</Form.Label>
                  <Col md={8} xs={12}>
                    <Form.Control type="password" placeholder="Confirm New Password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  </Col>
                </Row>
                <div className="d-md-flex justify-content-end">
                {errorUpdate && <Alert variant="danger">{errorUpdate}</Alert>}
                {successUpdate && <Alert variant="success">Profile Information Updated!</Alert>}

                  <Button variant="primary" type="submit">
                    Update Profile
                  </Button>
                </div>
              </Form>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default GeneralSetting;
