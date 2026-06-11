import { BrowserRouter } from 'react-router-dom';
import AdminRoutes from './routes/AdminRoutes';

const App = () => {
  return (
    <BrowserRouter>
      <AdminRoutes />
    </BrowserRouter>
  );
};

export default App;
