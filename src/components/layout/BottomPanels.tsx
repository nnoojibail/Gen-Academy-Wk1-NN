import { FlightTracker } from '../panels/FlightTracker';
import { DreamRanking } from '../panels/DreamRanking';
import styles from './BottomPanels.module.css';

export function BottomPanels() {
  return (
    <div className={styles.panels}>
      <FlightTracker />
      <DreamRanking />
    </div>
  );
}
