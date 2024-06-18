// import node module libraries
import Link from 'next/link';
import { Col, Row, Card } from 'react-bootstrap';
import DeleteScreen from './Delete';

const DeleteAccount = () => {
  return (
    <Row>
      <Col xl={3} lg={4} md={12} xs={12}>
        <div className="mb-4 mb-lg-0">
          <h4 className="mb-1">Delete Account</h4>
          <p className="mb-0 fs-5 text-muted">Easily Close Your Account Below</p>
        </div>
      </Col>
      <Col xl={9} lg={8} md={12} xs={12}>
        <Card className="mb-6">
          <Card.Body>
            <div className="mb-6">
              <h4 className="mb-1">Account Deletion </h4>
            </div>
            <div>
              <p>You Are About To Close Your Account NOte That This Action May Not Be Reversed !!!. Are You Sure? .</p>
             
             <DeleteScreen/>
              <p className="small mb-0 mt-3">Feel free to contact with any <Link href="https://mrphilip.pythonanywhere.com/">Philip Titus</Link> for any Feedback.</p>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default DeleteAccount