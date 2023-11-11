import React from 'react'
import { getUsers } from '../api/users'
import { Link, useLoaderData } from 'react-router-dom'
import { Space, Typography } from 'antd'
import { UserList } from '../components/UserList'

export const UsersPage = () => {
    const {users} = useLoaderData()

    console.log(users)
  return (
    <>
    <UserList users={users}/>
    {/* <Typography.Title level={3}>Users page</Typography.Title>
    <Space direction='vertical'>
    {users.map((user) => <Link to={`http://localhost:4010/users/${user.id}/impersonate`} key={user.id}>{user.email}</Link>)}

    </Space> */}
    </>
  )
}

export const loader = async () => {
    const users = await getUsers()
    return {users}
}