import './component/customComponents/InputFieldStyle.scss';
import './pages/RegisterPage/RegisterStyle.scss';
import './component/layouts/SidebarStyle.scss'
import './component/layouts/DashboardLayoutStyle.scss'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoutes from './component/authentication/ProtectedRoutes';
import PublicRoutes from './component/authentication/PublicRoutes';
import { ToastContainer } from 'react-toastify';
import AuthLayout from './component/layouts/AuthLayout';
import DashboardLayout from './component/layouts/DashboardLayout';
import { privateRoutes, publicRoutes } from './component/navigation/navigation';
import { ApolloProvider } from '@apollo/client';
import client from './ApolloClient';

function App() {
  return (
    <>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicRoutes />}>
            <Route element={<AuthLayout />}>
              {publicRoutes.map(({ path, element }, index) => (
                  <Route key={index} path={path} element={element} />
              ))}
            </Route>
          </Route>  
          <Route element={<ProtectedRoutes />}>
            <Route element={<DashboardLayout />}>
              {privateRoutes.map(({ path, element }, index) => (
                  <Route key={index} path={path} element={element} />
              ))}
            </Route>  
          </Route>
        </Routes>
        <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} draggable pauseOnHover/>
      </BrowserRouter>
      </ApolloProvider>
    </>
  );
}

export default App;
