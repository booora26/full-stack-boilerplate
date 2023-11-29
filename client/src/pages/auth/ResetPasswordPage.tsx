import { Row, Col } from 'antd'
import { ResetPassword } from '../../components/ResetPassword'

export const ResetPasswordPage = () => {
  return (
    <>
    <Row>
      <Col span={9} offset={9} style={{marginTop: '50px'}}>
      <ResetPassword />
      </Col>
    </Row>
    </>  )
}
