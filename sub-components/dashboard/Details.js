'use client';

import React from 'react';
import { OverlayTrigger, Popover, Button } from 'react-bootstrap';

const Details = ({ student }) => {
    const { name, age, email, major, gpa, address, user_type, Id_number, hostel_name, date_of_birth, gender, contact_number, guardian_name, guardian2_name, guardian_contact, guardian2_contact } = student;

    return (
        <OverlayTrigger
            placement="left"
            overlay={
                <Popover id="popover-basic">
                    <Popover.Header as="h3">{name}'s Details</Popover.Header>
                    <Popover.Body>
                        <p><strong>ID NUMBER:</strong> {Id_number}</p>
                        <p><strong>Email:</strong> @{email}</p>
                        <p><strong>Account Type:</strong> {user_type}</p>
                        <p><strong>HOSTEL:</strong> {hostel_name}</p>
                        {user_type === "student"  && 
                        <div>

                        <p><strong>Address:</strong> {address}</p>
                        <p><strong>DOB:</strong> {date_of_birth}</p>
                        <p><strong>GENDER:</strong> {gender}</p>
                        <p><strong>PHONE:</strong> {contact_number}</p>
                        <p><strong>Parent/Guardian Name:</strong> {guardian_name}</p>
                        <p><strong>Parent/Guardian Contact:</strong> {guardian_contact}</p>
                        <p><strong>Second Parent/Guardian Name:</strong> {guardian2_name}</p>
                        <p><strong>Parent/Guardian Contact:</strong> {guardian2_contact}</p>
                        </div>

                        }
                    </Popover.Body>
                </Popover>
            }
        >
            <Button variant="success">User Information</Button>
        </OverlayTrigger>
    );
};

export default Details;
