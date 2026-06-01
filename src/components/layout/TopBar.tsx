import { IconPlus, IconRefresh, IconSettings } from '@tabler/icons-react';
import { useAppState } from '../../context/AppStateContext';
import { DepartureChip } from './DepartureChip';
import styles from './TopBar.module.css';

export function TopBar() {
  const { refreshPrices, openDrawer, openModal } = useAppState();

  return (
    <header className={styles.topBar}>
      <div className={styles.left}>
        <h1 className={styles.title}>Bucket List Travel</h1>
        <div className={styles.subtitle}>
          <span>Departing from</span>
          <DepartureChip />
        </div>
      </div>

      <div className={styles.right}>
        <button className={styles.btn} onClick={refreshPrices} aria-label="Refresh prices">
          <IconRefresh size={14} stroke={1.5} />
          Refresh prices
        </button>
        <button className={styles.btn} onClick={openDrawer} aria-label="Open settings">
          <IconSettings size={14} stroke={1.5} />
          Settings
        </button>
        <button
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={() => openModal()}
          aria-label="Add destination"
        >
          <IconPlus size={14} stroke={1.5} />
          Add destination
        </button>
      </div>
    </header>
  );
}
