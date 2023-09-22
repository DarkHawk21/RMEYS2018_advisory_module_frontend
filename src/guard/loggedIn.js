import { inject } from "vue";
import jwtDecode from 'jwt-decode';
import { _TOKEN } from '../config';

const moment = inject("moment");

export default (to, from, next) => {
  const isNotProtected = ['login'].includes(to.name);

  try {
    const token = jwtDecode(localStorage.getItem(_TOKEN));

    if (moment.unix(token.exp) < moment()) {
      throw new Error('Auth token expired');
    }

    // const hasPermission = [
    //   to.meta.permission,
    //   '*'
    // ].some(permission => token.permissions.includes(permission));

    // const isAllowed = to.meta.permission === '*';

    if (!isAllowed && (isNotProtected || !hasPermission)) {
      next('/');
    } else {
      next();
    }
  } catch (error) {
    localStorage.removeItem(_TOKEN);
    const loginpath = window.location.pathname;
    console.log('Path', window.location);
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
