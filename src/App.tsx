import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MobileWrapper } from './components/common/MobileWrapper';
import { SplashScreen } from './components/common/SplashScreen';
import { LoginView } from './components/auth/LoginView';
import { StudentSignUpFlow } from './components/auth/StudentSignUpFlow';
import { StaffSignUpFlow } from './components/auth/StaffSignUpFlow';
import { WardenDashboardShell } from './components/dashboard/WardenDashboardShell';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { CCDashboard } from './components/dashboard/CCDashboard';
import { SecurityDashboard } from './components/dashboard/SecurityDashboard';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { StudentProfileModal } from './components/registry/StudentProfileModal';
import { FilterModal } from './components/registry/FilterModal';

const MainAppContent: React.FC = () => {
  const { role, isAuthenticated, activeView, setActiveView } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  // 1. Initial Logo Splash Screen
  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  const renderActiveView = () => {
    // 2. Unauthenticated / Sign-Up Views (Before Login)
    if (!isAuthenticated && activeView !== 'signup' && activeView !== 'staff_signup') {
      return (
        <LoginView 
          onGoToSignUp={() => setActiveView('signup')} 
          onGoToStaffSignUp={() => setActiveView('staff_signup')}
        />
      );
    }

    if (activeView === 'signup') {
      return <StudentSignUpFlow onBackToLogin={() => setActiveView('login')} />;
    }

    if (activeView === 'staff_signup') {
      return <StaffSignUpFlow onBackToLogin={() => setActiveView('login')} />;
    }

    // 3. Post-Login Options Page By Role
    switch (role) {
      case 'Student':
        return <StudentDashboard />;
      case 'CC':
        return <CCDashboard />;
      case 'Security':
        return <SecurityDashboard />;
      case 'Admin':
        return <AdminDashboard />;
      case 'Warden':
      default:
        return <WardenDashboardShell />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-neutral-900 relative selection:bg-navy-700 selection:text-white overflow-x-hidden">
      
      {/* Active View Container */}
      <main className="min-h-screen relative z-10">
        {renderActiveView()}
      </main>

      {/* Global Modals */}
      <StudentProfileModal />
      <FilterModal />

    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MobileWrapper>
        <MainAppContent />
      </MobileWrapper>
    </AuthProvider>
  );
}

export default App;
