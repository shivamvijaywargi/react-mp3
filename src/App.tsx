import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/home';
import Register from './pages/register';
import Login from './pages/login';
import Upload from './pages/upload';
import CSVFileImport from './pages/CSVFileImport';
import NotRequireAuth from './components/auth/NotRequireAuth';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <div>Error</div>,
    loader: () => <h1>Loading...</h1>,
  },
  {
    element: <NotRequireAuth />,
    children: [
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'login',
        element: <Login />,
      },
    ],
  },
  {
    path: 'upload',
    element: <Upload />,
  },
  {
    path: 'csv-import',
    element: <CSVFileImport />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
