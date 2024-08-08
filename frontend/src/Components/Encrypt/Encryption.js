const base64 = require("base-64");
// const args = process.argv;

// This Code Make Encryption For Email And Password When User Is Login
export const getBasicAuthHeader = (email, password) => {
  const credentials = `${email}:${password}`;
  const encodedCredentials = base64.encode(credentials);
  return `Basic ${encodedCredentials}`;
};

// console.log(
//   getBasicAuthHeader("mohammedshakokah123@gmail.com", "12345678Moh!@#")
// );
