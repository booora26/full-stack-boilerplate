// import { Flex, Row, Space, Typography, theme } from 'antd'
import { List } from './List'
import { CampaignListItem } from './campaign/CampaignListItem'


const campaigns = [
    {name:'Lav Pivo Summer I flight Jan-Dec 2023 v2 (winter campaign)', client: 'Carlsberg', period: '01.10.2023.-31.10.2023.', plannedBDG: 20000, actualBDG: 12000, status: 'finished'},
    {name:'Lav Pivo Summer', client: 'Carlsberg', period: '01.10.2023.-31.10.2023.', plannedBDG: 20000, actualBDG: 4000, status: 'planned'},
    {name:'Lav Pivo Summer', client: 'Carlsberg', period: '01.10.2023.-31.10.2023.', plannedBDG: 20000, actualBDG: 2000, status: 'ongoing'},
    {name:'Lav Pivo Summer', client: 'Carlsberg', period: '01.10.2023.-31.10.2023.', plannedBDG: 20000, actualBDG: 16000, status: 'ongoing'},
    {name:'Lav Pivo Summer', client: 'Carlsberg', period: '01.10.2023.-31.10.2023.', plannedBDG: 20000, actualBDG: 8000, status: 'planned'},
    {name:'Lav Pivo Summer', client: 'Carlsberg', period: '01.10.2023.-31.10.2023.', plannedBDG: 20000, actualBDG: 18000, status: 'finished'},
    {name:'Lav Pivo Summer', client: 'Carlsberg', period: '01.10.2023.-31.10.2023.', plannedBDG: 20000, actualBDG: 12000, status: 'planned'},
    {name:'Lav Pivo Summer', client: 'Carlsberg', period: '01.10.2023.-31.10.2023.', plannedBDG: 20000, actualBDG: 12000, status: 'planned'},
    {name:'Lav Pivo Summer', client: 'Carlsberg', period: '01.10.2023.-31.10.2023.', plannedBDG: 20000, actualBDG: 12000, status: 'finished'},
    {name:'Lav Pivo Summer', client: 'Carlsberg', period: '01.10.2023.-31.10.2023.', plannedBDG: 20000, actualBDG: 12000, status: 'planned'},
    {name:'Lav Pivo Summer', client: 'Carlsberg', period: '01.10.2023.-31.10.2023.', plannedBDG: 20000, actualBDG: 12000, status: 'ongoing'},
 
]

// export const Campaign = () => {
//     const {
//         token: { colorBgContainer },
//       } = theme.useToken();
//   return (
//     <>
//     <div className='campaign-list-item' style={{height: '650px', minWidth: '460px'}}>
//     <Flex vertical>
//     <Typography.Title level={4}>Campaign list</Typography.Title>
//   <div style={{height: '550px', minWidth: '450px', overflowY: 'scroll'}}>
//   <Flex vertical>
//   {campaigns.map((c, i) => <CampaignListItem name={c.name} period={c.period} actual={c.actualBDG} plan={c.plannedBDG} status={c.status} key={i}/>)}

//   </Flex>

//   </div>
       
      
//     </Flex>
// </div>
// </>
//   )
// }
export const Campaign = () => {

const campaignsList = campaigns.map((c, i) => <CampaignListItem name={c.name} period={c.period} actual={c.actualBDG} plan={c.plannedBDG} status={c.status} key={i}/>)

console.log('campaign component')
  const name = 'Campaign';
   return <List listName={name} list={campaignsList}/>
}
