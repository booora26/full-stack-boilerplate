import React from 'react'
import { List } from './List';
import { UsersListItem } from './UsersListItem';

export const UserList = ({users}) => {

    
    const usersList = users.map((c) => <UsersListItem email={c.email} image={c.image} id={c.id} key={c.id}/>)

      const name = 'Users';
       return <List listName={name} list={usersList}/>
}
