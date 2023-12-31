import { SERVER_DEV_URL, SERVER_PROD_URL } from "../constants";

const serverURL =
process.env.NODE_ENV === 'DEVELOPMENT'
  ? SERVER_DEV_URL
  : SERVER_PROD_URL;



export const getFreeAppointmentByEmployee = async () => {

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const response = await fetch(`${serverURL}/appointment/free-by-emp`, {method: 'POST',     headers: myHeaders,
    credentials: 'include', body: JSON.stringify({shop: {"id": 1}, employee: {"id": 1}, date: '2023-12-01', service: {"id": 1}})});
    const status = await response.json();

    console.log('fetch', status);
  
    return status;
  };