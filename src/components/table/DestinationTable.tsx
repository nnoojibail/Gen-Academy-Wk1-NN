import { useAppState } from '../../context/AppStateContext';
import { DestinationRow } from './DestinationRow';
import styles from './DestinationTable.module.css';

export function DestinationTable() {
  const { destinations, prices, departureAirport, selectedDestinationId, dispatch, openModal } =
    useAppState();

  const sorted = [...destinations].sort((a, b) => a.dreamRank - b.dreamRank);

  return (
    <div className={styles.wrapper}>
      <div className={styles.scroll}>
      <table className={styles.table}>
        <colgroup>
          <col className={styles.colRank} />
          <col className={styles.colDest} />
          <col className={styles.colStay} />
          <col className={styles.colStatus} />
          <col className={styles.colPrice} />
          <col className={styles.colGauge} />
          <col className={styles.colWindow} />
          <col className={styles.colBuying} />
          <col className={styles.colWeather} />
          <col className={styles.colVisa} />
          <col className={styles.colActions} />
        </colgroup>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>#</th>
            <th className={styles.th}>Destination</th>
            <th className={styles.th}>Suggested stay</th>
            <th className={styles.th}>Status</th>
            <th className={styles.th}>Flight price</th>
            <th className={styles.th}>Budget gauge</th>
            <th className={styles.th}>Travel window</th>
            <th className={styles.th}>Buying window</th>
            <th className={styles.th}>Weather</th>
            <th className={styles.th}>Visa</th>
            <th className={`${styles.th} ${styles.thRight}`}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={11} className={styles.empty}>
                No destinations yet — add one to get started.
              </td>
            </tr>
          ) : (
            sorted.map((dest) => (
              <DestinationRow
                key={dest.id}
                destination={dest}
                currentPrice={prices[dest.id]?.current ?? dest.basePrice}
                departureCode={departureAirport}
                isSelected={selectedDestinationId === dest.id}
                onClick={() => dispatch({ type: 'SET_SELECTED', id: dest.id })}
                onEdit={() => openModal(dest.id)}
              />
            ))
          )}
        </tbody>
        {sorted.length > 0 && (
          <tfoot>
            <tr>
              <td colSpan={11} className={styles.addRow}>
                <button className={styles.addBtn} onClick={() => openModal()}>
                  + Add destination
                </button>
              </td>
            </tr>
          </tfoot>
        )}
      </table>
      </div>
    </div>
  );
}
