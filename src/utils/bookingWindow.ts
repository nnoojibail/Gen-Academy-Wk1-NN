import type { BookingWindow, BudgetStatus } from '../types';

/**
 * Booking urgency derived from the budget status:
 *   Deal     → Book now    (price is great, lock it in)
 *   Close    → 3–4 wks     (near budget, book soon)
 *   Watching → 8–10 wks    (under budget but watch for a better fare)
 *   Over     → Wait        (over budget, hold off)
 */
const STATUS_TO_WINDOW: Record<BudgetStatus, BookingWindow> = {
  deal: 'book_now',
  close: '3_4_wks',
  watching: '8_10_wks',
  over: 'wait',
};

export function getBookingWindow(status: BudgetStatus): BookingWindow {
  return STATUS_TO_WINDOW[status];
}

export const BOOKING_LABEL: Record<BookingWindow, string> = {
  book_now: 'Book now',
  '3_4_wks': '3–4 wks',
  '8_10_wks': '8–10 wks',
  wait: 'Wait',
};

/**
 * General advisory across all destinations for the "Best booking window" stat
 * tile: surfaces the most urgent actionable window present.
 */
export function bestBookingAdvisory(windows: BookingWindow[]): string {
  if (windows.includes('book_now')) return 'Book now';
  if (windows.includes('3_4_wks')) return '3–4 wks out';
  if (windows.includes('8_10_wks')) return '8–10 wks out';
  return 'Wait — over budget';
}
