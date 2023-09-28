import moment from 'moment';
import jwtDecode from 'jwt-decode';
import { _TOKEN } from '../config';

export default (to, from, next) => {
  const isNotProtected = ['login'].includes(to.name);

  try {
    const token = jwtDecode(localStorage.getItem(_TOKEN));

    if (token.exp < moment().unix()) {
      throw new Error('Auth token expired');
    }

    // const hasPermission = [
    //   to.meta.permission,
    //   '*'
    // ].some(permission => token.permissions.includes(permission));

    // const isAllowed = to.meta.permission === '*';
    if (isNotProtected) {
    // if (!isAllowed && (isNotProtected || !hasPermission)) {
      next('/');
    } else {
      next();
    }
  } catch (error) {
    localStorage.removeItem(_TOKEN);
    const loginpath = window.location.pathname;

    isNotProtected
      ? next()
      : next({
        name: 'login',
        query: {
          from: loginpath
        }
      });
  }
};
