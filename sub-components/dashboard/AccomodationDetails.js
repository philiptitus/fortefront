import React from 'react';
import { OverlayTrigger, Popover, Button } from 'react-bootstrap';

const AccomodationDetails = ({ accomodation }) => {
    const { id, student, room, hostel, check_in_date, check_out_date, duration, price, paid, status } = accomodation;

    return (
        <OverlayTrigger
            placement="left"
            overlay={
                <Popover id="popover-basic">
                    <Popover.Header as="h3">Accomodation Details</Popover.Header>
                    <Popover.Body>
                        <p><strong>ID:</strong> {id}</p>
                        <p><strong>Student ID:</strong> {student}</p>
                        <p><strong>Room:</strong> {room}</p>
                        <p><strong>Check-in Date:</strong> {check_in_date}</p>
                        <p><strong>Check-out Date:</strong> {check_out_date}</p>
                        <p><strong>Duration:</strong> {duration} Month(s)</p>
                        <p><strong>Price:</strong> ${price}</p>
                        <p><strong>Paid:</strong> {paid ? 'Yes' : 'No'}</p>
                        <p><strong>Status:</strong> {status}</p>
                    </Popover.Body>
                </Popover>
            }
        >
            <Button variant="primary">Accomodation {id}</Button>
        </OverlayTrigger>
    );
};

export default AccomodationDetails;
