'use client'
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { listHostelDetails } from 'store/actions/hostelActions';

import Link from 'next/link';
import { Card, Dropdown } from 'react-bootstrap';
import { MoreVertical } from 'react-feather';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const Charts = () => {
    const dispatch = useDispatch();
    const hostelDetail = useSelector((state) => state.hostelDetail);
    const { hostel } = hostelDetail;

    const [userdata, setUserdata] = useState(null);
    const [perfomanceChartSeries, setPerfomanceChartSeries] = useState([0, 0, 0]);

    useEffect(() => {
        // Retrieve the user data from localStorage
        const userPrimary = localStorage.getItem('userPrimary');

        if (userPrimary) {
            // Parse the JSON string into an object
            setUserdata(JSON.parse(userPrimary));
        }
    }, []);

    useEffect(() => {
        if (userdata?.hostel) {
            console.log('Dispatching listHostelDetails with hostel ID:', userdata.hostel); // Debugging line
            dispatch(listHostelDetails(userdata.hostel));
        }
    }, [dispatch, userdata]);

    useEffect(() => {
        if (hostel) {
            const { room_price_1, room_price_2, room_price_4 } = hostel;
            console.log('Room prices:', room_price_1, room_price_2, room_price_4); // Debugging line

            // Ensure that room prices are numbers
            const rp1 = Number(room_price_1) || 0;
            const rp2 = Number(room_price_2) || 0;
            const rp4 = Number(room_price_4) || 0;

            const total = rp1 + rp2 + rp4;
            if (total > 0) {
                const series = [
                    (rp1 / total) * 100,
                    (rp2 / total) * 100,
                    (rp4 / total) * 100
                ];
                console.log('Performance chart series:', series); // Debugging line
                setPerfomanceChartSeries(series);
            } else {
                console.log('Total room prices are zero or invalid'); // Debugging line
                setPerfomanceChartSeries([0, 0, 0]);
            }
        }
    }, [hostel]);

    const perfomanceChartOptions = {
        dataLabels: { enabled: false },
        labels: ['Single Rooms', 'Double Rooms', 'Quadruple Rooms'],
        colors: ['#28a745', '#ffc107', '#dc3545'],
        plotOptions: {
            radialBar: {
                startAngle: -168,
                endAngle: -450,
                hollow: {
                    size: '55%',
                },
                track: {
                    background: 'transparent',
                },
                dataLabels: {
                    show: false,
                }
            }
        },
        chart: { type: 'radialBar' },
        stroke: { lineCap: "round" },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        height: 300
                    }
                }
            },
            {
                breakpoint: 5000,
                options: {
                    chart: {
                        height: 320
                    }
                }
            }
        ]
    };

    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <Link
            href=""
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
            className="text-muted text-primary-hover">
            {children}
        </Link>
    ));

    CustomToggle.displayName = 'CustomToggle';

    const ActionMenu = () => {
        return (
            <Dropdown>
                <Dropdown.Toggle as={CustomToggle}>
                    <MoreVertical size="15px" className="text-muted" />
                </Dropdown.Toggle>
                <Dropdown.Menu align={'end'}>
                    <Dropdown.Item eventKey="1">
                        <Link href="/pages/adminsettings">
                            Change Prices
                        </Link>
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        );
    };

    return (
        <Card className="h-100">
            <Card.Body>
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        <h4 className="mb-0">Room Prices</h4>
                    </div>
                    <ActionMenu />
                </div>
                <div className="mb-8">
                    <Chart
                        options={perfomanceChartOptions}
                        series={perfomanceChartSeries}
                        type="radialBar"
                        width="100%"
                    />
                </div>
                {/* icon with content  */}
                <div className="d-flex align-items-center justify-content-around">
                    <div className="text-center">
                        <i className="fe fe-user text-success fs-3"></i>
                        <h6 className="mt-3 mb-1 fw-bold">$ {hostel?.room_price_1}</h6>
                        <p>Single Rooms</p>
                    </div>
                    <div className="text-center">
                        <i className="fe fe-users text-warning fs-3"></i>
                        <h6 className="mt-3 mb-1 fw-bold">$ {hostel?.room_price_2}</h6>
                        <p>Double Rooms</p>
                    </div>
                    <div className="text-center">
                        <i className="fe fe-users text-danger fs-3"></i>
                        <h6 className="mt-3 mb-1 fw-bold">$ {hostel?.room_price_4}</h6>
                        <p>Quadruple Rooms</p>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
}

export default Charts;
