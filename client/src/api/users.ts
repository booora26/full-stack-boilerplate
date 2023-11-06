const url = "http://localhost:4010/users";

export const getUsers = async () => {

    const response = await fetch(`${url}`, {credentials: 'include'});
  
    const status = await response.json();
  
    return status;
  };