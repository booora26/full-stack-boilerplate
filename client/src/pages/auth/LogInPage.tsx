import React from 'react';
import { LogIn } from '../../components/LogIn';
import { Col, Row } from 'antd';

export const LogInPage = () => {
  return (
    <>
    <Row>
      <Col sm={{span: 24 }} lg={{span:6, offset:9 }} style={{marginTop: '50px'}}>
      <LogIn />
      </Col>
    </Row>
    </>
  )
}
