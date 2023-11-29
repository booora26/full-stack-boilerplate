import { SERVER_DEV_URL, SERVER_PROD_URL } from "../constants";

const serverURL =
process.env.NODE_ENV === 'DEVELOPMENT'
  ? SERVER_DEV_URL
  : SERVER_PROD_URL;



export const getUsers = async () => {

    const response = await fetch(`${serverURL}/users`, {credentials: 'include'});
  
    const status = await response.json();
  
    return status;
  };