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

    const rolesCanEnter = to.meta.rolesCanEnter;
    const hasPermission = rolesCanEnter.some(roleCanEnter => token.role == roleCanEnter);

    if (isNotProtected || !hasPermission) {
      switch(token.role) {
        case 'admin':
          next('/admin');
        break;
        case 'advisor':
          next('/adviser');
        break;
        case 'student':
          next('/');
        break;
        default:
          next('/');
      }

    } else {
      next();
    }
  } catch (error) {
    localStorage.removeItem(_TOKEN);

    isNotProtected
      ? next()
      : next({ name: 'login' });
  }
};
