'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Spinner, Button, OverlayTrigger, Popover, ListGroup } from 'react-bootstrap';
import { listRoomDetails, logout } from 'store/actions/hostelActions';
import { API_URL } from 'store/constants/userConstants';

const RoomDetails = ( {roomId}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const roomDetail = useSelector((state) => state.roomDetail);
  const { error, loading: loadingRoom, room } = roomDetail;

  const roomEdit = useSelector((state) => state.roomEdit);
  const { success } = roomEdit;

  const [alertMessage, setAlertMessage] = useState(null);



  useEffect(() => {
    if (userInfo) {
      dispatch(listRoomDetails(roomId));
    }
  }, [dispatch, userInfo, id, success, roomId]);

  useEffect(() => {
    if (success) {
      setAlertMessage({ type: 'success', message: 'Room Info Updated' });
    }
    if (error) {
      setAlertMessage({ type: 'danger', message: error });
    }
  }, [success, error]);



  if (loadingRoom) {
    return <Spinner animation="grow" variant="danger" className="me-2" />;
  }

  if (!room) {
    return <h1>The Item You Are Looking For Does Not Exist</h1>;
  }

  const { roomNumber, capacity, current_occupancy, isAvailable, damages, cost_of_damage, students } = room;

  const renderStudents = () => {
    if (!students || students.length === 0) {
      return <p>No users found</p>;
    }

    return (
      <ListGroup variant="flush">
        {students.map((student) => (
          <ListGroup.Item key={student.id}>
            <img
              src={API_URL +  student?.avi}
              alt={`Avatar for ${student.name}`}
              style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }}
            />
            <a href={`/user/${student.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              {student.name}
            </a>
          </ListGroup.Item>
        ))}
      </ListGroup>
    );
  };

  return (
    <div style={{ marginTop: '20px' }}>
      {alertMessage && (
        <Alert variant={alertMessage.type} onClose={() => setAlertMessage(null)} dismissible>
          {alertMessage.message}
        </Alert>
      )}
      <OverlayTrigger
        placement="right"
        overlay={
          <Popover id="popover-basic">
            <Popover.Header as="h3">Room {roomNumber} Details</Popover.Header>
            <Popover.Body>
              <p><strong>Capacity:</strong> {capacity}</p>
              <p><strong>Occupancy:</strong> {current_occupancy}</p>
              <p><strong>Status:</strong> <span className={isAvailable ? 'text-success' : 'text-danger'}>{isAvailable ? 'Available' : 'Not Available'}</span></p>
              <p><strong>Damages:</strong> {damages ? 'Yes' : 'No'}</p>
              {damages && <p><strong>Cost of Damage:</strong> ${cost_of_damage}</p>}
              <h5>Current Occupants:</h5>
              {renderStudents()}
            </Popover.Body>
          </Popover>
        }
      >
        <Button variant="primary">Room {roomNumber}</Button>
      </OverlayTrigger>
    </div>
  );
};

export default RoomDetails;
