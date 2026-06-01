import { IconPencil } from '@tabler/icons-react';
import { getAirport } from '../../data/airports';
import { useAppState } from '../../context/AppStateContext';
import styles from './DepartureChip.module.css';

export function DepartureChip() {
  const { departureAirport, openDrawer } = useAppState();
  const airport = getAirport(departureAirport);

  return (
    <button
      className={styles.chip}
      onClick={openDrawer}
      aria-label="Change departure airport"
    >
      <span>{airport.code}</span>
      <span className={styles.sep}>—</span>
      <span>{airport.city}</span>
      <IconPencil size={12} stroke={1.5} className={styles.icon} />
    </button>
  );
}
