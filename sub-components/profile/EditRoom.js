import React, { useState, useEffect, Fragment } from 'react';
import { Button, Modal, Form, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { editRoom } from 'store/actions/hostelActions';

const EditRoom = ({ id, roomNumber, roomAvailable }) => {
    const [show, setShow] = useState(false);
    const [room_number, setRoomNumber] = useState(roomNumber);
    const [isAvailable, setIsAvailable] = useState(roomAvailable);
    const [alert, setAlert] = useState(null);
    const dispatch = useDispatch();
    const router = useRouter();

    const roomEdit = useSelector((state) => state.roomEdit);
    const { loading, error, success } = roomEdit;

    useEffect(() => {
        if (success) {
            setAlert(<Alert variant="success">Room Info Updated</Alert>);
            setTimeout(() => {
                handleClose()
                // router.push('/rooms'); // Navigate to rooms page after success
            }, 3000);
        }
        if (error) {
            setAlert(<Alert variant="danger">{error}</Alert>);
        }
    }, [success, error, router]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("editing your room"); // This should print to console if the form is submitted
        dispatch(editRoom({ room_number, isAvailable }, id));
    };

    const handleStatusChange = (e) => {
        setIsAvailable(e.target.value);
    };

    return (
        <Fragment>
            <Button variant="primary" onClick={handleShow}>
                Edit Room
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Room</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {alert}
                    {loading && <Spinner animation="grow" variant="danger" />}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formRoomStatus">
                            <Form.Label>Status</Form.Label>
                            <Form.Control as="select" value={isAvailable} onChange={handleStatusChange}>
                                <option value="True">Available</option>
                                <option value="False">Not Available</option>
                            </Form.Control>
                        </Form.Group>
                        {/* <Form.Group controlId="formRoomNumber">
                            <Form.Label>Room Number</Form.Label>
                            <Form.Control
                                type="text"
                                value={room_number}
                                onChange={(e) => setRoomNumber(e.target.value)}
                                required
                            />
                        </Form.Group> */}
                        <Button variant="primary" type="submit" onClick={handleSubmit}>
                            Update Room
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
}

export default EditRoom;
