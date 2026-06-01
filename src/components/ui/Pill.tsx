import styles from './Pill.module.css';

interface StayPillProps {
  nights: number;
}

export function StayPill({ nights }: StayPillProps) {
  return (
    <span className={styles.pill}>
      {nights} night{nights !== 1 ? 's' : ''}
    </span>
  );
}
