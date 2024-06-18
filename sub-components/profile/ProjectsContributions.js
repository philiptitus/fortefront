// import node module libraries
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Col, Card, Dropdown, Image } from 'react-bootstrap';
import { MoreVertical , ChevronDown} from 'react-feather';
import axiosInstance from 'store/axiosinstance/axiosinstance';
import { useSelector, useDispatch } from 'react-redux';

// import required data files
import ComplainForm from "./ComplainForm";
import EditComplain from "./EditComplain";
import NewComplaint from "./NewComplaint";
import EditComplaintForm from './EditComplain';

const ProjectsContributions = () => {

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;
    const complaintCreate = useSelector((state) => state.complaintCreate);
    const { loading: loadingComplaint, error: errorComplaint, success: successComplaint } = complaintCreate;
  

    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [searchText] = useState(""); // Assuming searchText is needed
    const dispatch = useDispatch();
    const complaintUpdate = useSelector((state) => state.complaintUpdate);
    const { success:successComplain } = complaintUpdate;


    const [userdata, setUserdata] = useState(null);

    useEffect(() => {
        // Retrieve the user data from localStorage
        const userPrimary = localStorage.getItem('userPrimary');
  
        if (userPrimary) {
            // Parse the JSON string into an object
            setUserdata(JSON.parse(userPrimary));
        }
    }, []);
  


    useEffect(() => {
        if (userInfo && userInfo?.token) {
            const fetchData = async () => {
                try {
                    const config = {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${userInfo?.token}`,
                        },
                    };

                    setLoading(true);

                    const response = await axiosInstance.get(`/api/students/complaints/?name=${searchText}&page=${page}`, config);

                    setPosts(response.data.results);
                    setTotalPages(response.data.total_pages);
                } catch (error) {
                    console.error('Error fetching complains:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }
    }, [page, userInfo?.token, successComplain, successComplaint]);

    const handleLoadMore = () => {
        setPage((prevPage) => prevPage + 1);
      };


    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        (<Link
            href=""
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
            className="text-muted text-primary-hover">
            {children}
        </Link>)
    ));

    CustomToggle.displayName = 'CustomToggle';

    const ActionMenu = ({ complain }) => {
        return (
            <Dropdown>
                <Dropdown.Toggle as={CustomToggle}>
                    <MoreVertical size="15px" className="text-muted" />
                </Dropdown.Toggle>
                <Dropdown.Menu align={'end'}>
                    <Dropdown.Item eventKey="1">
                        <EditComplaintForm id={complain.id}/>
                    </Dropdown.Item>

                </Dropdown.Menu>
            </Dropdown>
        );
    };

    return (
        <Col xl={6} lg={12} md={12} xs={12} className="mb-6">
            <Card>
                <Card.Body>
                    <Card.Title as="h4">Recent Complaints   </Card.Title>
                    {userdata?.user_type === "student" && userdata?.hostel &&

                    <NewComplaint/>}
                    {posts.map((item, index) => {
                        return (
                            <div className="d-md-flex justify-content-between align-items-center mb-4" key={index}>
                                <div className="d-flex align-items-center">
                                    <div>
                                        <div className={`icon-shape icon-md border p-4 rounded-1 ${item.brandLogoBg}`}>
                                            <Image src={item.brandLogo} alt="" />
                                        </div>
                                    </div>
                                    {/* text */}
                                    <div className="ms-3 ">
                                        <h5 className="mb-1">
                                            <Link href="#" className="text-inherit">{item.projectName}</Link>
                                        </h5>
                                        <p className="mb-0 fs-5 text-muted">{item.description}</p>
                                        <p className="mb-0 fs-5 text-muted">Resolved : {item.resolved ? "YES" : "NO"}</p>
                                        <p className="mb-0 fs-5 text-muted">Satus : {item?.status}</p>
                                        <p className="mb-0 fs-5 text-muted">Student ID : {item?.student_name}</p>


                                        <p className="mb-0 fs-5 text-muted">Date Raised : {item?.date_raised}</p>


                                    </div>
                                </div>
                                <div className="d-flex align-items-center ms-10 ms-md-0 mt-3">
                                    {/* avatar group */}
                                    {/* <div className="avatar-group me-2">
                                        {item.members.map((avatar, avatarIndex) => {
                                            return (
                                                <span className="avatar avatar-sm" key={avatarIndex}>
                                                    <Image alt="avatar" src={avatar.image} className="rounded-circle" />
                                                </span>
                                            )
                                        })}
                                    </div> */}
                                    <div>
                                        {/* dropdown */}
                                        {userdata?.user_type === "admin" && userdata?.hostel &&

                                        <ActionMenu complain={item}/>
                                        }
                                                                                {userdata?.user_type === "staff" && userdata?.hostel &&

<ActionMenu complain={item}/>
}
                                        </div>
                                </div>
                            </div>
                        )
                    })}

{posts.length > 9 &&                                        <div className="d-flex justify-content-center mt-4">
                        <ChevronDown onClick={handleLoadMore} size="24px" className="text-muted" />
                    </div>}
                </Card.Body>
            </Card>
        </Col>
    )
}

export default ProjectsContributions