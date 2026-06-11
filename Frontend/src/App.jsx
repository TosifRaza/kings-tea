import { AnimatePresence } from 'framer-motion';
import AppRoutes from './routes/AppRoutes';
import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <MainLayout>
      <AnimatePresence mode="wait">
        <AppRoutes />
      </AnimatePresence>
    </MainLayout>
  );
}

export default App;
