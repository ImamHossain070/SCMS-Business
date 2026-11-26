import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import DetectionShowcase from './components/DetectionShowcase';
import ArchitectureSection from './components/ArchitectureSection';
import BusinessImpactSection from './components/BusinessImpactSection';
import BookingSection from './components/BookingSection';
import BookingModal from './components/BookingModal';
import AdminPanelModal from './components/AdminPanelModal';
import ContactAndFaqSection from './components/ContactAndFaqSection';
import Footer from './components/Footer';
import { useTelemetryStream } from './hooks/useTelemetryStream';

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const stored = localStorage.getItem('scms_dark_mode');
      if (stored !== null) return stored === 'true';
    } catch (e) {}
    return false;
  });
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState('');
  const { telemetry, history, wsConnected } = useTelemetryStream();

  useEffect(() => {
    if (window.location.hash === '#admin') {
      setAdminModalOpen(true);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('scms_dark_mode', String(darkMode));
    } catch (e) {}
  }, [darkMode]);

  const handleOpenModuleBooking = (moduleShortTitle) => {
    setSelectedModule(moduleShortTitle);
    setBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenBooking={() => setBookingModalOpen(true)}
        onOpenAdmin={() => setAdminModalOpen(true)}
        wsConnected={wsConnected}
      />

      <main className="flex-1">
        <HeroSection
          telemetry={telemetry}
          history={history}
          onOpenBooking={() => setBookingModalOpen(true)}
        />
        <DetectionShowcase onSelectModuleForBooking={handleOpenModuleBooking} />
        <ArchitectureSection fedavgRound={telemetry.fedavg_round} />
        <BusinessImpactSection onOpenBooking={() => setBookingModalOpen(true)} />
        <BookingSection selectedModule={selectedModule} />
        <ContactAndFaqSection />
      </main>

      <Footer onOpenAdmin={() => setAdminModalOpen(true)} />

      <BookingModal
        open={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        initialModule={selectedModule}
      />

      <AdminPanelModal
        open={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
      />
    </div>
  );
}
