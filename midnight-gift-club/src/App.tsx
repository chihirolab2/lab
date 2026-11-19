import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { CelebrationOverlay } from './components/Celebration';
import { AppProvider } from './store';
import { History } from './pages/History';
import { Home } from './pages/Home';
import { Menu } from './pages/Menu';
import { Notifications } from './pages/Notifications';
import { Request, RequestDetail } from './pages/Request';
import { Stamp } from './pages/Stamp';
import { TicketDetail } from './pages/TicketDetail';
import { TicketForm } from './pages/TicketForm';
import { Tickets } from './pages/Tickets';

export function App() {
  return (
    <AppProvider>
      <HashRouter>
        <div className="shell">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/tickets/new" element={<TicketForm />} />
            <Route path="/tickets/:id" element={<TicketDetail />} />
            <Route path="/tickets/:id/edit" element={<TicketForm />} />
            <Route path="/request" element={<Request />} />
            <Route path="/request/:id" element={<RequestDetail />} />
            <Route path="/stamp" element={<Stamp />} />
            <Route path="/history" element={<History />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <CelebrationOverlay />
        </div>
      </HashRouter>
    </AppProvider>
  );
}
