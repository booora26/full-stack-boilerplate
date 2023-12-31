import { useOutletContext, useParams } from 'react-router-dom'

export const UserDetails = () => {
    const {userId} = useParams()

    console.log(userId)
    const data = useOutletContext()
    
    const item = data.find((i) => i.id == userId)
  return (
    <>
    <p>Id: {item.id}</p>
    <p>Email: {item.email}</p>
    </>
  )
}
