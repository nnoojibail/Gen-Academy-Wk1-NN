import { IconGripVertical, IconPencil, IconShield } from '@tabler/icons-react';
import type { Destination, VisaRequirement } from '../../types';
import { getBudgetStatus, isWithinBudget, budgetDelta } from '../../utils/budgetStatus';
import { getBookingWindow, BOOKING_LABEL } from '../../utils/bookingWindow';
import { formatUSD, formatDelta, VISA_LABEL } from '../../utils/format';
import { routeString } from '../../utils/routeString';
import { getWeather } from '../../data/weather';
import { RankBadge, StatusBadge } from '../ui/Badge';
import { StayPill } from '../ui/Pill';
import { BudgetGauge } from '../ui/BudgetGauge';
import styles from './DestinationRow.module.css';

const VISA_CLASS: Record<VisaRequirement, string> = {
  not_required: styles.visaNotRequired,
  visa_on_arrival: styles.visaOnArrival,
  required: styles.visaRequired,
};

interface DestinationRowProps {
  destination: Destination;
  currentPrice: number;
  departureCode: string;
  isSelected: boolean;
  onClick: () => void;
  onEdit: () => void;
}

export function DestinationRow({
  destination,
  currentPrice,
  departureCode,
  isSelected,
  onClick,
  onEdit,
}: DestinationRowProps) {
  const status = getBudgetStatus(currentPrice, destination.flightBudget);
  const delta = budgetDelta(currentPrice, destination.flightBudget);
  const inBudget = isWithinBudget(currentPrice, destination.flightBudget);
  const weather = getWeather(destination.airportCode, destination.travelMonth);
  const route = routeString(departureCode, destination);
  const bookLabel = BOOKING_LABEL[getBookingWindow(status)];

  const deltaClass =
    delta < 0 ? styles.deltaUnder : delta > 0 ? styles.deltaOver : styles.deltaEven;

  const rowClass = [
    styles.row,
    inBudget ? styles.rowInBudget : '',
    isSelected ? styles.rowSelected : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <tr className={rowClass} onClick={onClick}>
      {/* # — rank */}
      <td className={styles.td}>
        <RankBadge rank={destination.dreamRank} />
      </td>

      {/* Destination — name + route */}
      <td className={styles.td}>
        <div className={styles.destName}>{destination.name}, {destination.country}</div>
        <div className={styles.destRoute}>{route}</div>
      </td>

      {/* Suggested stay */}
      <td className={styles.td}>
        <StayPill nights={destination.suggestedStayNights} />
      </td>

      {/* Status */}
      <td className={styles.td}>
        <StatusBadge status={status} />
      </td>

      {/* Flight price + delta */}
      <td className={styles.td}>
        <div className={styles.priceAmount}>{formatUSD(currentPrice)}</div>
        <div className={`${styles.delta} ${deltaClass}`}>{formatDelta(delta)}</div>
      </td>

      {/* Budget gauge */}
      <td className={styles.td}>
        <BudgetGauge current={currentPrice} budget={destination.flightBudget} status={status} />
      </td>

      {/* Weather — hi/lo for travel month */}
      <td className={styles.td}>
        <div className={styles.weatherHiLo}>{weather.hi}° / {weather.lo}°</div>
        <div className={styles.weatherMonth}>{destination.travelMonth.slice(0, 3)}</div>
      </td>

      {/* Visa */}
      <td className={styles.td}>
        <div className={`${styles.visaCell} ${VISA_CLASS[destination.visa]}`}>
          <IconShield size={13} stroke={1.5} />
          {VISA_LABEL[destination.visa]}
        </div>
      </td>

      {/* Book by */}
      <td className={styles.td}>
        <span className={styles.bookBy}>{bookLabel}</span>
      </td>

      {/* Actions — stop propagation so clicks don't select the row */}
      <td className={styles.td} onClick={(e) => e.stopPropagation()}>
        <div className={styles.actions}>
          <button
            className={styles.iconBtn}
            onClick={onEdit}
            aria-label={`Edit ${destination.name}`}
          >
            <IconPencil size={14} stroke={1.5} />
          </button>
          <span className={styles.grip} aria-label="Drag to reorder">
            <IconGripVertical size={14} stroke={1.5} />
          </span>
        </div>
      </td>
    </tr>
  );
}
