import Link from 'next/link';
import { Col, Row, Image, Spinner } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { getUserDetails } from 'store/actions/userAction';
import { API_URL } from 'store/constants/userConstants';

const ProfileHeader = () => {
  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  const dispatch = useDispatch()

  const userDetails = useSelector((state) => state.userDetails);
  const { user, loading: userLoading, success: userSuccess } = userDetails;

  useEffect(() => {
    dispatch(getUserDetails('profile'));
  }, [dispatch]);

  const [userdata, setUserdata] = useState(null);

  useEffect(() => {
      // Retrieve the user data from localStorage
      const userPrimary = localStorage.getItem('userPrimary');

      if (userPrimary) {
          // Parse the JSON string into an object
          setUserdata(JSON.parse(userPrimary));
      }
  }, []);



  if (userLoading) {
    // Return loading spinner if data is still loading
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Row className="align-items-center">
      <Col xl={12} lg={12} md={12} xs={12}>
        {/* Bg */}
        <div className="pt-20 rounded-top" style={{ background: 'url(/images/background/profile-cover.jpg) no-repeat', backgroundSize: 'cover' }}>
        </div>
        <div className="bg-white rounded-bottom smooth-shadow-sm ">
          <div className="d-flex align-items-center justify-content-between pt-4 pb-6 px-4">
            <div className="d-flex align-items-center">
              {/* avatar */}
              <div className="avatar-xxl avatar-indicators avatar-online me-2 position-relative d-flex justify-content-end align-items-end mt-n10">
                <Image src={API_URL + userdata?.avi} className="avatar-xxl rounded-circle border border-4 border-white-color-40" alt="" />
                <Link href="#!" className="position-absolute top-0 right-0 me-2" data-bs-toggle="tooltip" data-placement="top" title="" data-original-title="Verified">
                  { userdata?.is_verified &&  <Image src="/images/svg/checked-mark.svg" alt="" height="30" width="30" />}
                </Link>
              </div>
              {/* text */}
              <div className="lh-1">
                <h2 className="mb-0">{userInfo?.name}
                  <Link href="#!" className="text-decoration-none" data-bs-toggle="tooltip" data-placement="top" title="" data-original-title="Beginner">
                  </Link>
                </h2>
                <p className="mb-0 d-block">@{userInfo?.email}</p>
                <Link href="/pages/settings" className="btn btn-outline-primary d-block d-md-none">
  Edit Profile
</Link>


              </div>
            </div>
            <div>
              <Link href="/pages/settings" className="btn btn-outline-primary d-none d-md-block">Edit Profile</Link>
            </div>
          </div>
          {/* nav */}
          <ul className="nav nav-lt-tab px-4" id="pills-tab" role="tablist">
            <li className="nav-item">
              <Link className="nav-link active" href="#">Overview</Link>
            </li>
            {/* <li className="nav-item">
              <Link className="nav-link" href="#">Project</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="#">Files</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="#">Teams</Link>
            </li> */}
            {/* <li className="nav-item">
              <Link className="nav-link" href="#">
                Followers
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="#">Activity</Link>
            </li> */}
          </ul>
        </div>
      </Col>
    </Row>
  );
};

export default ProfileHeader;
