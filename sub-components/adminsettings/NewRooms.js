import React, { useState, useEffect } from 'react';
import { Col, Row, Form, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { getUserDetails, logout } from 'store/actions/userAction';
import { createRoom } from 'store/actions/hostelActions';


const NewRooms = () => {
  const [capacity_1, setCapacity_1] = useState(0);
  const [capacity_2, setCapacity_2] = useState(0);
  const [capacity_4, setCapacity_4] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const dispatch = useDispatch();
  const router = useRouter();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const roomCreate = useSelector((state) => state.roomCreate);
  const { loading: loadingroom, error: errorroom, success: successroom } = roomCreate;



  useEffect(() => {
    if (successroom) {
      setSuccess('Rooms Created! You Can View Them Under Room Management on Your Profile');
    }
    if (errorroom) {
      setError(errorroom);
    }
  }, [successroom, errorroom, router, userInfo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const capacity1 = parseInt(capacity_1);
    const capacity2 = parseInt(capacity_2);
    const capacity4 = parseInt(capacity_4);
    dispatch(
      createRoom({
        capacity_1: capacity1,
        capacity_2: capacity2,
        capacity_4: capacity4,
      })
    );
    setLoading(false);
  };

  return (
    <Row className="mb-8">
      <Col xl={3} lg={4} md={12} xs={12}>
        <div className="mb-4 mb-lg-0">
          <h4 className="mb-1">New Rooms</h4>
          <p className="mb-0 fs-5 text-muted">Add new Rooms To Your Hostel</p>
        </div>
      </Col>
      <Col xl={9} lg={8} md={12} xs={12}>
        {/* card */}
        <Card id="edit">
          {/* card body */}
          <Card.Body>
            <div className="mb-6">
              <h4 className="mb-1">Room Management</h4>
            </div>
            <Form onSubmit={handleSubmit}>
              {/* New email */}
              <Row className="mb-3">
                <Form.Label className="col-sm-4" htmlFor="capacity_1">Add single Rooms</Form.Label>
                <Col md={8} xs={12}>
                  <Form.Control type="number" placeholder="Enter the number" value={capacity_1} onChange={(e) => setCapacity_1(e.target.value)} min="0" required />
                </Col>
              </Row>

              <Row className="mb-3">
                <Form.Label className="col-sm-4" htmlFor="capacity_2">Add new double Rooms</Form.Label>
                <Col md={8} xs={12}>
                  <Form.Control type="number" placeholder="Enter the number" value={capacity_2} onChange={(e) => setCapacity_2(e.target.value)} min="0" required />
                </Col>
              </Row>

              <Row className="mb-3">
                <Form.Label className="col-sm-4" htmlFor="capacity_4">Add new Quadruple Rooms</Form.Label>
                <Col md={8} xs={12}>
                  <Form.Control type="number" placeholder="Enter the number" value={capacity_4} onChange={(e) => setCapacity_4(e.target.value)} min="0" required />
                </Col>
              </Row>

              {loading && (
                <div className="text-center">
                  <Spinner animation="grow" variant="danger" className="me-2" />
                </div>
              )}

              {success && (
                <Alert variant="success" className="mt-3">
                  {success}
                </Alert>
              )}

              {error && (
                <Alert variant="danger" className="mt-3">
                  {error}
                </Alert>
              )}

              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create Rooms'}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default NewRooms;
