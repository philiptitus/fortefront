// import node module libraries
import Link from 'next/link';
import { Col, Row, Card } from 'react-bootstrap';
import OtpScreen from './OtpScreen';

const VerifyAccount = () => {
  return (
    <Row>
      <Col xl={3} lg={4} md={12} xs={12}>
        <div className="mb-4 mb-lg-0">
          <h4 className="mb-1">Verify Account</h4>
          <p className="mb-0 fs-5 text-muted">Verify Your Account To Recover When You Forget Your Password</p>
        </div>
      </Col>
      <Col xl={9} lg={8} md={12} xs={12}>
        <Card className="mb-6">
          <Card.Body>
            <div className="mb-6">
              <h4 className="mb-1">Verify</h4>
            </div>
            <div>
              <p>Click The Button Below To Verify.</p>

              <OtpScreen/>
              {/* <Link href="#" className="btn btn-success">Verify Account</Link> */}
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default VerifyAccount