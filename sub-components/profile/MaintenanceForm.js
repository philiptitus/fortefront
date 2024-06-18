import React, { useState } from 'react';
import { OverlayTrigger, Popover, Button, Form } from 'react-bootstrap';

const  MaintenanceForm = () => {
    const [isAvailable, setIsAvailable] = useState(true);

    const handleAvailableChange = () => {
        setIsAvailable(!isAvailable);
    };

    return (
        <OverlayTrigger
            trigger="click"
            placement="right"
            overlay={
                <Popover id="popover-basic">
                    <Popover.Header as="h3">Room Status</Popover.Header>
                    <Popover.Body>
                        <Form>
                            <Form.Check
                                type="checkbox"
                                label="Available"
                                checked={isAvailable}
                                onChange={handleAvailableChange}
                            />
                            <Form.Check
                                type="checkbox"
                                label="Not Available"
                                checked={!isAvailable}
                                onChange={handleAvailableChange}
                            />
                        </Form>
                    </Popover.Body>
                </Popover>
            }
        >
            <Button variant="danger">Click to toggle room status</Button>
        </OverlayTrigger>
    );
};

export default  MaintenanceForm;
