import React, { useState, useEffect, Fragment } from 'react';
import { Button, Modal, Form, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import axiosInstance from 'store/axiosinstance/axiosinstance';
import { createMaintenanceAction } from 'store/actions/studentActions';


const NewMaintenance = () => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);


  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  const [facility_id, setFacilityId] = useState(1);
  const [facilities, setFacilities] = useState([]);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const maintenanceCreate = useSelector(state => state.maintenanceCreate);
  const { loading: loadingMaintenance, error: errorMaintenance, success: successMaintenance } = maintenanceCreate;

  useEffect(() => {
    if (successMaintenance) {
      setFacilityId('');
      setShow(false); // Close the modal on successful submission
    }
  }, [successMaintenance]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };
      const response = await axiosInstance.get(`/api/hostels/facilities/?name=${searchText}&page=${page}`, config);
      setFacilities((prevFacilities) => [...prevFacilities, ...response.data.results]);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error('Error fetching facilities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, [page, searchText]);

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createMaintenanceAction({ facility_id }));
  };

  return (
    <Fragment>
      <Button variant="primary" onClick={handleShow}>
        New Maintenance Request
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>New Maintenance Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingMaintenance && <Spinner animation="border" />}
          {successMaintenance && <Alert variant="success">Your maintenance request was sent to the Hostel Manager</Alert>}
          {errorMaintenance && <Alert variant="danger">{errorMaintenance}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formFacility">
              <Form.Label>Select  A Facility You Need Fixed By The Hostel</Form.Label>
              <br/>
              <i>If you cant find a specific one write a complaint</i>
              <Form.Control
                as="select"
                value={facility_id}
                onChange={(e) => setFacilityId(e.target.value)}
                required
              >
                <option value="">Select...</option>
                {facilities.map((facility) => (
                  <option key={facility.id} value={facility.id}>
                    {facility.facility_type}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            {/* {facilities.length > 9 && (
              <Row className='justify-content-center'>
                <Button onClick={handleLoadMore} disabled={loading || page >= totalPages}>
                  Load More
                </Button>
              </Row>
            )} */}
            <Button variant="primary" type="submit" className="mt-2">
              Submit Maintenance Request
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default NewMaintenance;
