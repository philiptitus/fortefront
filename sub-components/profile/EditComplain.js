import React, { useState, useEffect, Fragment } from 'react';
import { Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { updateComplaint } from 'store/actions/studentActions';


const statuses = [
    { value: 'In Progress', label: 'Working On It' },
    { value: 'Resolved', label: 'Resolved' },
];

const EditComplaintForm = ({ id }) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState("In Progress");
  const [alert, setAlert] = useState({ variant: '', message: '', show: false });

  const complaintUpdate = useSelector((state) => state.complaintUpdate);
  const { loading, error, success } = complaintUpdate;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateComplaint({ status }, id));
  };

  useEffect(() => {
    if (success) {
      setAlert({ variant: 'success', message: 'Complaint Info Updated', show: true });
      handleClose();
    }
    if (error) {
      setAlert({ variant: 'danger', message: error, show: true });
    }
  }, [success, error]);

  return (
    <Fragment>
      <Button variant="primary" onClick={handleShow}>
        Edit Complaint
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Complaint</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading && <Spinner animation="border" />}
          {alert.show && <Alert variant={alert.variant}>{alert.message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formComplaintStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control as="select" value={status} onChange={(e) => setStatus(e.target.value)}>
                {statuses.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Row>
              <Col>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
              </Col>
              <Col>
                <Button type="submit" variant="primary" onClick={handleSubmit}>
                  Update Complaint ID {id}
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </Fragment>
  );
};

export default EditComplaintForm;
