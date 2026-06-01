import { getAirport, QUICK_PICK_DEPARTURE_CODES } from '../../data/airports';
import styles from './DepartureSection.module.css';

interface DepartureSectionProps {
  value: string;
  onChange: (code: string) => void;
}

export function DepartureSection({ value, onChange }: DepartureSectionProps) {
  const upper = value.toUpperCase();
  const airport = getAirport(upper);
  const isKnown = airport.name !== airport.code; // fallback sets name === code

  return (
    <>
      <input
        type="text"
        className={styles.input}
        placeholder="Search airport code or city…"
        value={value}
        onChange={(e) => onChange(e.target.value.toUpperCase().slice(0, 4))}
        maxLength={4}
        autoComplete="off"
        spellCheck={false}
        aria-label="Departure airport code"
      />
      <p className={`${styles.helpText} ${!isKnown && value ? styles.helpUnknown : ''}`}>
        {value
          ? isKnown
            ? airport.name
            : 'Unknown airport code'
          : 'Type a 3-letter airport code'}
      </p>
      <div className={styles.chips} role="group" aria-label="Quick-pick airports">
        {QUICK_PICK_DEPARTURE_CODES.map((code) => (
          <button
            key={code}
            type="button"
            className={`${styles.chip} ${upper === code ? styles.chipActive : ''}`}
            onClick={() => onChange(code)}
          >
            {code}
          </button>
        ))}
      </div>
    </>
  );
}
