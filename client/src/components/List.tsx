import {  Flex, Typography } from "antd";
type ListProps = {
    listName: string;
    list: React.ReactNode[];
  };



export const List = ({listName, list} : ListProps) => {

  
  return (
    <>
    <div className='campaign-list-item' style={{height: '650px', maxWidth: '460px'}}>
    <Flex vertical>
    <Typography.Title level={4}>{listName} list</Typography.Title>
  <div style={{height: '550px', maxWidth: '450px', overflowY: 'scroll'}}>
  <Flex vertical>
{ list.map((l) => l)}
  </Flex>

  </div>
       
      
    </Flex>
</div>
</>
  )
}