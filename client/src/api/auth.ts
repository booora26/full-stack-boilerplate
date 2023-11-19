import { SERVER_URL } from "../constants";

const url = `${SERVER_URL}/auth`;

export const logIn = async (value) => {
  const { email, password } = value;

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const response = await fetch(`${url}/login`, {
    method: "POST",
    headers: myHeaders,
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  const status = await response.json();

  if (status.statusCode === 401) return;

  return status;
};
export const resetPassword = async (value) => {
  const { password, newPassword1, newPassword2 } = value;

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const response = await fetch(`${url}/reset-password`, {
    method: "POST",
    headers: myHeaders,
    credentials: "include",
    body: JSON.stringify({ password, newPassword1, newPassword2 }),
  });

  const status = await response.json();

  // if (status.statusCode === 401) return;

  return status;
};
export const getCurrentUser = async () => {

  const response = await fetch(`${url}`, {credentials: 'include'});

  const status = await response.json();

  return status;
};
export const logIn2FA = async (value) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const response = await fetch(`${url}/2fa/authenticate`, {
    method: "POST",
    headers: myHeaders,
    credentials: "include",
    body: JSON.stringify(value),
  });

  try {
    const status = await response.json();
    return status;
  } catch (err) {
    console.log("err", err);
  }
};
// export const logOut = async () => {

//     const myHeaders = new Headers();
//     myHeaders.append("Content-Type", "application/json");

//     const response = await fetch (`${url}/logout`)

//     return response;
// }
