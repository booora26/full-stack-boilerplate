import { Button, Col, Row, Typography } from 'antd'
import React from 'react'

export const BP = () => {
  return (
    <>
        <div className='campaign-list-item' style={{height: '200px', minWidth: '400px'}}>
       <Row><Typography.Title level={5} style={{color: 'rgba(0, 0, 0, 0.45)'}}>Business Plan</Typography.Title></Row>
       <Row>
       <Typography.Title level={1}>2023</Typography.Title>
       </Row>
       <Row>
        <Col span={8} offset={16}>
            <Button type="primary">Open</Button>
        </Col>
       </Row>
    </div>
    </>
  )
}
