import React, { useState } from 'react';
import { OverlayTrigger, Popover, Button, Form } from 'react-bootstrap';

const CancelAccomodation = () => {
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
            <Button variant="danger">Cancel This Accomodation</Button>
        </OverlayTrigger>
    );
};

export default CancelAccomodation;
