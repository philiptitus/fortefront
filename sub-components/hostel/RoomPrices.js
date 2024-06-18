import React from 'react';
import { Table } from 'react-bootstrap';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

const RoomPrices = ({hostel}) => {



    return (
        <Table striped className="text-nowrap">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Room Type</th>
                    <th scope="col">Price (USD)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row">1</th>
                    <td>Single Room</td>
                    <td>${hostel?.room_price_1}</td>
                </tr>
                <tr>
                    <th scope="row">2</th>
                    <td>Double Room</td>
                    <td>${hostel?.room_price_2}</td>
                </tr>
                <tr>
                    <th scope="row">3</th>
                    <td>Quadruple Room</td>
                    <td>${hostel?.room_price_4}</td>
                </tr>
            </tbody>
        </Table>
    );
};

export default RoomPrices;
