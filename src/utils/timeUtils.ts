import { ScheduleItem, TimeConflict } from '../types';

/**
 * Converts a time string (e.g. "09:00 AM", "2:15 PM", "14:30") to minutes since midnight.
 * Returns -1 if invalid.
 */
export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return -1;
  const cleanStr = timeStr.trim();

  // Match 12-hour AM/PM format (e.g. "09:00 AM", "9:00 PM", "12:30 AM")
  const ampmRegex = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
  const ampmMatch = cleanStr.match(ampmRegex);

  if (ampmMatch) {
    let hours = parseInt(ampmMatch[1], 10);
    const minutes = parseInt(ampmMatch[2], 10);
    const ampm = ampmMatch[3].toUpperCase();

    if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) {
      return -1;
    }

    if (ampm === 'AM') {
      if (hours === 12) hours = 0;
    } else { // PM
      if (hours !== 12) hours += 12;
    }

    return hours * 60 + minutes;
  }

  // Match 24-hour format (e.g. "14:30", "09:00")
  const militaryRegex = /^(\d{1,2}):(\d{2})$/;
  const militaryMatch = cleanStr.match(militaryRegex);

  if (militaryMatch) {
    const hours = parseInt(militaryMatch[1], 10);
    const minutes = parseInt(militaryMatch[2], 10);

    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return -1;
    }

    return hours * 60 + minutes;
  }

  return -1;
}

/**
 * Converts minutes since midnight back to a standard "HH:MM AM/PM" format.
 */
export function minutesToTime(minutes: number): string {
  if (minutes < 0 || minutes >= 1440) return '12:00 AM';

  let hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  if (hours === 0) hours = 12;

  const hoursStr = hours.toString().padStart(2, '0');
  const minsStr = mins.toString().padStart(2, '0');

  return `${hoursStr}:${minsStr} ${ampm}`;
}

/**
 * Checks if two time intervals overlap.
 * Returns true if there is an overlap.
 * Assumes intervals are [start, start + duration).
 * If itemA ends at 10:00 and itemB starts at 10:00, they DO NOT overlap.
 */
export function isOverlapping(
  startA: number,
  durationA: number,
  startB: number,
  durationB: number
): boolean {
  if (startA < 0 || durationA <= 0 || startB < 0 || durationB <= 0) return false;
  const endA = startA + durationA;
  const endB = startB + durationB;

  return startA < endB && startB < endA;
}

/**
 * Validates a schedule item against existing schedules and returns a conflict if found.
 */
export function detectConflict(
  incoming: Omit<ScheduleItem, 'id'> | ScheduleItem,
  existingSchedules: ScheduleItem[],
  excludeId?: string
): TimeConflict | null {
  const startInc = timeToMinutes(incoming.startingTime);
  const durInc = incoming.duration;

  if (startInc === -1 || durInc <= 0) return null;

  for (const existing of existingSchedules) {
    // Exclude self if editing
    if (excludeId && existing.id === excludeId) continue;

    // Must be same day to have conflict
    if (existing.day !== incoming.day) continue;

    const startExt = timeToMinutes(existing.startingTime);
    const durExt = existing.duration;

    if (startExt === -1 || durExt <= 0) continue;

    if (isOverlapping(startInc, durInc, startExt, durExt)) {
      // 1. Category conflict: Same category, overlapping time
      if (existing.category.toLowerCase().trim() === incoming.category.toLowerCase().trim()) {
        return { type: 'category', existing, incoming };
      }

      // 2. Stage conflict: Same stage, overlapping time
      if (existing.stage.toLowerCase().trim() === incoming.stage.toLowerCase().trim()) {
        return { type: 'stage', existing, incoming };
      }
    }
  }

  return null;
}

/**
 * Suggests available time slots for a given day, category, duration and stage
 * by scanning the day from 08:00 AM to 09:00 PM in 15-minute increments.
 */
export function suggestAvailableSlots(
  day: string,
  category: string,
  duration: number,
  stage: string,
  existingSchedules: ScheduleItem[]
): string[] {
  const startMinutes = 8 * 60; // 08:00 AM
  const endMinutes = 21 * 60;   // 09:00 PM
  const step = 15;             // 15-minute steps
  const suggestions: string[] = [];

  for (let mins = startMinutes; mins <= endMinutes; mins += step) {
    const timeStr = minutesToTime(mins);
    const testItem: Omit<ScheduleItem, 'id'> = {
      day,
      category,
      programName: 'Test Slot',
      reportingTime: timeStr,
      startingTime: timeStr,
      duration,
      stage,
      remarks: '',
    };

    const conflict = detectConflict(testItem, existingSchedules);
    if (!conflict) {
      suggestions.push(timeStr);
      if (suggestions.length >= 3) break; // Return top 3 slots
    }
  }

  // Fallback slots if no conflict-free slots are found
  if (suggestions.length === 0) {
    return ['09:00 AM', '11:30 AM', '02:00 PM'];
  }

  return suggestions;
}
