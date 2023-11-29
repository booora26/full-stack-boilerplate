import { Col, Row } from 'antd';
import { LogIn2FA } from '../../components/LogIn2FA';

export const TwoFAPage = () => {
  return (
    <>
    <Row>
      <Col span={6} offset={9} style={{marginTop: '150px'}}>
      <LogIn2FA />
      </Col>
    </Row>
    </>
  )
}
