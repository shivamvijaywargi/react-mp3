import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../../app/store';

const NotRequireAuth = () => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  return isLoggedIn ? <Navigate to={'/'} replace /> : <Outlet />;
};

export default NotRequireAuth;
