import React, { useState, useEffect, Fragment } from 'react';
import { Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { updateAccomodation } from 'store/actions/studentActions';
import axiosInstance from 'store/axiosinstance/axiosinstance';

const ChangeRoom = ({ id, roomNumber,  accomStatus, isStudent = false, isDelayed = false, isActive = false }) => {
  const [show, setShow] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(roomNumber || '');
  const [status, setStatus] = useState(accomStatus);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [rooms, setRooms] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [room, setroom] = useState("");


  const accomodationUpdate = useSelector((state) => state.accomodationUpdate);
  const {  error: errorAccomodation, success: successAccomodation, accomodation } = accomodationUpdate;


  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const statuses = [{ value: accomStatus, label: 'Active' } ,{ value: 'Cancelled', label: 'Cancel' }];
  const delayedstatuses = [{ value: accomStatus, label: 'Active' } ,{ value: 'Cancelled', label: 'Cancel' }];
  const statusesforstudents = [{ value: accomStatus, label: 'Active' } ,{ value: 'Cancelled', label: 'Cancel' }];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${userInfo?.token}`,
          },
        };
        setLoading(true);
        const response = await axiosInstance.get(`/api/hostels/rooms/?name=${searchText}&page=${page}`, config);
        setRooms(response.data.results);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error('Error fetching Rooms:', error);
        setError('Error fetching rooms');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, searchText]);

  // const handleSubmit = async () => {
  //   try {
  //     await dispatch(updateAccomodation({ room: selectedRoom, status }, id));
  //     setSuccess(true);
  //     setTimeout(() => setSuccess(false), 3000);
  //   } catch (err) {
  //     setError('Failed to update accommodation');
  //     setTimeout(() => setError(null), 3000);
  //   }
  //   handleClose();
  // };


  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      updateAccomodation(
        {
          room,
          status,
        },
        id
      )
    );

  };

  const [userdata, setUserdata] = useState(null);

  useEffect(() => {
      // Retrieve the user data from localStorage
      const userPrimary = localStorage.getItem('userPrimary');

      if (userPrimary) {
          // Parse the JSON string into an object
          setUserdata(JSON.parse(userPrimary));
      }
  }, []);


  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    setPage(1); // Reset page when searching
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleRoomChange = (e) => {
    setSelectedRoom(e.target.value);
  };
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  return (
    <Fragment>
      <Button variant="info" onClick={handleShow}>
        Change Accomodation
      </Button>


      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Change Accomodation  </Modal.Title>
        </Modal.Header>
        {isActive ? 
        <Modal.Body>
          {errorAccomodation && <Alert variant="danger">{errorAccomodation}</Alert>}
          {successAccomodation && <Alert variant="success">Accommodation Information Updated</Alert>}
          <Form>
{userdata?.user_type === "admin"  && 

            <Form.Group controlId="roomSelect">

              <Form.Control
                type="search"
                placeholder="Search For Rooms"
                value={searchText}
                onChange={handleSearch}
              />
              <Form.Label>Select Room:</Form.Label>
              <Form.Control as="select" 
              value={room}
              //  onChange={handleRoomChange}
              onChange={(e) => setroom(e.target.value)}

               
               
               
               >
                <option value="">Select...</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.id} - Capacity: {room.capacity}
                  </option>
                  
                ))}

              </Form.Control>
              
              {rooms.length > 9 && (
                <div className="d-flex justify-content-center">
                  <Button onClick={handleLoadMore} disabled={loading || page >= totalPages}>
                    {loading ? <Spinner animation="border" size="sm" /> : 'Load More'}
                  </Button>
                </div>
              )}
            </Form.Group>

}

{userdata?.user_type === "staff"    && 

<Form.Group controlId="roomSelect">
  <Form.Label>Search for Rooms:</Form.Label>
  <Form.Control
    type="search"
    placeholder="Search For Rooms"
    value={searchText}
    onChange={handleSearch}
  />
  <Form.Label>Select Room:</Form.Label>
  <Form.Control as="select" value={selectedRoom}
  //  onChange={handleRoomChange}
  onChange={(e) => setroom(e.target.value)}

   
   
   
   >
    <option value="">Select...</option>
    {rooms.map((room) => (
      <option key={room.id} value={room.id}>
        {room.id} - Capacity: {room.capacity}
      </option>
      
    ))}

  </Form.Control>
  
  {rooms.length > 9 && (
    <div className="d-flex justify-content-center">
      <Button onClick={handleLoadMore} disabled={loading || page >= totalPages}>
        {loading ? <Spinner animation="border" size="sm" /> : 'Load More'}
      </Button>
    </div>
  )}
</Form.Group>

}


            <Form.Group controlId="statusSelect">
              <Form.Label>Select Status:</Form.Label>
              <Form.Control as="select" value={status} 
              // onChange={handleStatusChange}
              
              
              onChange={(e) => setStatus(e.target.value)}

              
              >
                {isStudent ? (
                  statusesforstudents.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))
                ) : isActive ? (
                  statuses.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))
                ) : (
                  delayedstatuses.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))
                )}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
:
<h6>This Accomodation Is Not Active Can't Change It</h6>
              }
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>

{isActive &&          <Button variant="primary" onClick={handleSubmit}>
            Update Accomodation
          </Button>}
        </Modal.Footer>
      </Modal>


      
    </Fragment>

  );
};

export default ChangeRoom;
