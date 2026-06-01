import { IconGripVertical, IconPencil, IconTrash } from '@tabler/icons-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Destination } from '../../types';
import { RankBadge } from '../ui/Badge';
import styles from './DestinationEditRow.module.css';

interface DestinationEditRowProps {
  destination: Destination;
  onChange: (updated: Destination) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export function DestinationEditRow({
  destination,
  onChange,
  onDelete,
  onEdit,
}: DestinationEditRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: destination.id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`${styles.row} ${isDragging ? styles.rowDragging : ''}`}
    >
      <div className={styles.top}>
        <span
          className={styles.grip}
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
        >
          <IconGripVertical size={16} stroke={1.5} />
        </span>

        <RankBadge rank={destination.dreamRank} />

        <span className={styles.name}>{destination.name}</span>

        <div className={styles.rowActions}>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => onEdit(destination.id)}
            aria-label={`Edit ${destination.name}`}
          >
            <IconPencil size={14} stroke={1.5} />
          </button>
          <button
            type="button"
            className={`${styles.iconBtn} ${styles.deleteBtn}`}
            onClick={() => onDelete(destination.id)}
            aria-label={`Delete ${destination.name}`}
          >
            <IconTrash size={14} stroke={1.5} />
          </button>
        </div>
      </div>

      <div className={styles.inputs}>
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel} htmlFor={`budget-${destination.id}`}>
            Flight budget ($)
          </label>
          <input
            id={`budget-${destination.id}`}
            type="number"
            className={styles.input}
            value={destination.flightBudget}
            min={0}
            step={50}
            onChange={(e) =>
              onChange({ ...destination, flightBudget: Math.max(0, Number(e.target.value)) })
            }
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel} htmlFor={`stay-${destination.id}`}>
            Stay (nights)
          </label>
          <input
            id={`stay-${destination.id}`}
            type="number"
            className={styles.input}
            value={destination.suggestedStayNights}
            min={1}
            step={1}
            onChange={(e) =>
              onChange({
                ...destination,
                suggestedStayNights: Math.max(1, Number(e.target.value)),
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
