import { AppStateProvider } from './context/AppStateContext';
import { TopBar } from './components/layout/TopBar';
import { StatsRow } from './components/layout/StatsRow';
import { DestinationTable } from './components/table/DestinationTable';
import { BottomPanels } from './components/layout/BottomPanels';
import { SettingsDrawer } from './components/drawer/SettingsDrawer';
import { DestinationModal } from './components/modal/DestinationModal';
import styles from './App.module.css';

function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <TopBar />
      <StatsRow />
      <DestinationTable />
      <BottomPanels />
      <SettingsDrawer />
      <DestinationModal />
    </div>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <Dashboard />
    </AppStateProvider>
  );
}
