import { SERVER_URL } from "../constants";

const url = `${SERVER_URL}/users`;


export const getUsers = async () => {

    const response = await fetch(`${url}`, {credentials: 'include'});
  
    const status = await response.json();
  
    return status;
  };