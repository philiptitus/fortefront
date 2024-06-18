'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Table, Dropdown, Image, FormControl, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { MoreVertical, Search } from 'react-feather';
import axios from 'axios';
import { logout, getUserDetails, removeStaffAction } from 'store/actions/userAction';


import { deleteNotice } from 'store/actions/hostelActions';


import Details from './Details';
import {  ChevronDown } from 'react-feather';
import axiosInstance from 'store/axiosinstance/axiosinstance';
import { API_URL } from 'store/constants/userConstants';



const Teams = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // New state for filter option
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState(null);
    const staffRemove = useSelector((state) => state.staffRemove);
    const { loading: loadingRemove, error: errorRemove, success:successRemove, staff } = staffRemove;
    
    const [deleting, setDeleting] = useState(false);

    const dispatch = useDispatch();
    const router = useRouter();

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    useEffect(() => {
        if (!userInfo || !("access" in userInfo)) {
            dispatch(logout());
            router.push('/authentication/sign-in');
        }
    }, [dispatch, router, userInfo]);

    const submitHandler = ({ staff }) => {
        dispatch(removeStaffAction( staff ))
      };


      const handleDeleteSatff = async ( staffId ) => {
        setDeleting(true);
        try {
            await dispatch(removeStaffAction(staffId));
            // setAlert({ type: 'success', message: 'Room deleted successfully.' });
        } catch (error) {
            console.log(error)
            // setAlert({ type: 'danger', message: 'Error deleting room.' });
        } finally {
            setDeleting(false);
        }
    };


    

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
            const response = await axiosInstance.get(`/api/users/?name=${searchTerm}&page=${page}`, config);
            setUsers(response.data.results);
            setTotalPages(response.data.total_pages);
        } catch (error) {
            setError('Error fetching users');
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

        fetchData();
    }, [page, searchTerm, successRemove]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPage(1); // Reset page when searching
        setUsers([]); // Clear current users to load new search results
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const handleLoadMore = () => {
        setPage((prevPage) => prevPage + 1);
    };

    const handleDelete = (id) => {
        dispatch(deleteNotice(id));
        setUsers(users.filter(user => user.id !== id));
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.user_type.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' || user.user_type.toLowerCase() === filter;
        return matchesSearch && matchesFilter;
    });

    const student = {
        name: 'John Doe',
        age: 20,
        email: 'john.doe@example.com',
        major: 'Computer Science',
        gpa: 3.8,
        address: '1234 Elm Street, Nairobi, Kenya'
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


    const ActionMenu = ({ onDelete , user}) => {

        return (
        <Dropdown>
                <Dropdown.Toggle as={CustomToggle}>
                <MoreVertical size="15px" className="text-muted" />

                </Dropdown.Toggle>
            <Dropdown.Menu align="end">
    
            <Dropdown.Item>
                    <Details student={user}/>
                </Dropdown.Item>
{   user?.user_type === "staff" && 
                <Dropdown.Item onClick={() => handleDeleteSatff(user.id)}>
                    Remove From Staff
                </Dropdown.Item>}
    
            </Dropdown.Menu>
        </Dropdown>
        )
    };

    return (
        <Card className="h-100">
            <Card.Header className="bg-white py-4">
                <h4 className="mb-0">Hostel Users</h4>
                <div className="d-flex align-items-center mt-3">
                    <Search size={20} className="me-2" />
                    <FormControl
                        type="text"
                        placeholder="Search..."
                        className="flex-grow-1"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <Form.Select className="ms-2" value={filter} onChange={handleFilterChange}>
                        <option value="all">All</option>
                        <option value="staff">Staff</option>
                        <option value="student">Student</option>
                    </Form.Select>
                </div>
            </Card.Header>
            <Table responsive className="text-nowrap">
                <thead className="table-light">
                    <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user, index) => (
                        <tr key={index}>
                            <td className="align-middle">
                                <div className="d-flex align-items-center">
                                    <div>
                                        <Image src={ API_URL + user?.avi} alt="" className="avatar-md avatar rounded-circle" />
                                    </div>
                                    <div className="ms-3 lh-1">
                                        <h5 className=" mb-1">{user.name}</h5>
                                        <p className="mb-0">{user.email}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="align-middle">{user.user_type}</td>
                            <td className="align-middle">
                                <ActionMenu user={user}/>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {filteredUsers.length > 5 && (
                <Card.Footer>
                    <Button variant="link" className="text-decoration-none" onClick={handleLoadMore}>
                        View More Members
                    </Button>
                </Card.Footer>
            )}
            {loading && <Spinner animation="grow" variant="primary" />}
            {error && <Alert variant="danger">{error}</Alert>}
        </Card>
    );
}

export default Teams;
