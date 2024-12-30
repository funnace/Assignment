import { jwtDecode } from "jwt-decode";

const checkTokenExpiry = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return false;
  }

  try {
    const decodedToken: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token', error);
    return true;
  }
};

export default checkTokenExpiry;