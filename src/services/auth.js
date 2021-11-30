import decode from 'jwt-decode';

export const TOKEN_KEY = '@DISCovery/token';

export const isAuthenticated = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token !== null) {
    return !isTokenExpired(token);
  }
  return false;
};

export const login = (data) => {
  const { token, user } = data;
  localStorage.setItem(TOKEN_KEY, token.token);
  if (user) {
    localStorage.setItem('userData', JSON.stringify(user));
  }
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem('_email');
  localStorage.removeItem('_password');
  localStorage.removeItem('_remember');
  window.location.href = '/';
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const isTokenExpired = (token) => {
  try {
    const decoded = decode(token);
    if (decoded.exp < Date.now() / 1000) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const getUserData = () => JSON.parse(localStorage.getItem('userData'));
