import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Building, PersonFill, Bullseye } from 'react-bootstrap-icons';
import { listHostelDetails } from 'store/actions/hostelActions';
import { getUserDetails } from 'store/actions/userAction';

const useProjectsStats = () => {
    const dispatch = useDispatch();
    const hostelDetail = useSelector((state) => state.hostelDetail);
    const { hostel } = hostelDetail;

    const [userdata, setUserdata] = useState(null);

    useEffect(() => {
        // Retrieve the user data from localStorage
        const userPrimary = localStorage.getItem('userPrimary');

        if (userPrimary) {
            // Parse the JSON string into an object
            setUserdata(JSON.parse(userPrimary));
        }
    }, []);

    const userDetails = useSelector((state) => state.userDetails);
    const { hostel: hostelID } = userDetails;

    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userdata) {
            dispatch(listHostelDetails(userdata.hostel));
        }
    }, [dispatch, userdata]);

    useEffect(() => {
        if (hostel && userdata) {
            setStats([
                {
                    id: 1,
                    title: "Hostel Total Capacity",
                    value: hostel.capacity,
                    icon: <Building size={18} />,
                },
                {
                    id: 2,
                    title: "Occupied Share",
                    value: hostel.count,
                    icon: <PersonFill size={18} />,
                },
                {
                    id: 3,
                    title: "Productivity",
                    value: `${((hostel.count / hostel.capacity) * 100).toFixed(1)}%`,
                    icon: <Bullseye size={18} />,
                }
            ]);
            setLoading(false);
        }
    }, [hostel, userdata]);

    return { stats, loading };
};

export default useProjectsStats;
