import React, { useState, useEffect } from 'react';
import { Button, Form, Spinner, Alert, Row, Col, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { createComplaintAction } from 'store/actions/studentActions';

const ComplaintForm = () => {
  const dispatch = useDispatch();

  const [description, setDescription] = useState('');
  const [show, setShow] = useState(false);

  const complaintCreate = useSelector((state) => state.complaintCreate);
  const { loading: loadingComplaint, error: errorComplaint, success: successComplaint } = complaintCreate;

  useEffect(() => {
    if (successComplaint) {
      setDescription('');
      setShow(false); // Close the modal on successful submission
    }
  }, [successComplaint]);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createComplaintAction({ description }));
  };

  return (
    <div>
      <Button variant="primary" onClick={handleShow}>
        New Complaint
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>New Complaint</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="justify-content-center">
            {loadingComplaint && <Spinner animation="border" />}
            {successComplaint && <Alert variant="success">Your complaint was sent to the Hostel Manager</Alert>}
            {errorComplaint && <Alert variant="danger">{errorComplaint}</Alert>}

            <Col xs={12}>
              <Form onSubmit={submitHandler}>
                <Form.Group controlId="formComplaint">
                  <Form.Label>Enter your complaint</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your complaint here..."
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-2">
                  Submit Complaint
                </Button>
              </Form>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ComplaintForm;
