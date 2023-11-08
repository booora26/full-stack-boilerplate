import { Col, Progress, Row, Typography } from 'antd'
import React from 'react'


export const CampaignListItem = (props) => {

    const {name, plan, actual, period, status} = props;

    const statusColors = {finished: '#ff4d4f', ongoing: '#52c41a', planned: '#1677ff'}
    const statusColor = statusColors[status]
  return (
    <div className='campaign-list-item' style={{borderLeftColor: statusColor, borderLeftWidth: '10px'}}>
    {/* <div style={{minWidth: '380px', borderStyle:"solid", borderWidth: '0.5px', margin: "5px", padding: "5px"}}> */}
    <Row>
<Typography.Title level={5} copyable ellipsis={{rows: 2}} style={{maxWidth: '350px', margin: '2px'}}>{name}</Typography.Title>
    </Row>
    <Row>
        <span style={{color: 'rgba(0, 0, 0, 0.88)'}}>{period}</span>
    </Row>
    <Row>
        <Col span={16}>
        <Progress percent={(actual / plan * 100) } />
        </Col>
        
    </Row>
</div>
  )
}
