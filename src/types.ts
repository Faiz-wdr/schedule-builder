export interface ScheduleItem {
  id: string;
  day: string; // e.g. "Day 1", "Day 2"
  category: string;
  programName: string;
  reportingTime: string; // e.g. "08:30 AM"
  startingTime: string;  // e.g. "09:00 AM"
  duration: number;      // in minutes
  stage: string;
  remarks?: string;
  isConflict?: boolean;  // Set when imported with conflicts
}

export interface TimeConflict {
  type: 'category' | 'stage';
  existing: ScheduleItem;
  incoming: Omit<ScheduleItem, 'id'> | ScheduleItem;
}

export interface ImportSummary {
  total: number;
  conflicts: TimeConflict[];
  validItems: Omit<ScheduleItem, 'id'>[];
  conflictingItems: (Omit<ScheduleItem, 'id'> & { conflictTypes: ('category' | 'stage')[] })[];
}

export interface Suggestion {
  time: string; // e.g. "09:00 AM"
}
