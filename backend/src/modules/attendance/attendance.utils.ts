/**
 * Normalize date to start of day
 */
export const normalizeDate = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

/**
 * Count working days (Mon–Fri)
 */
export const countWorkingDays = (
  start: Date,
  end: Date
) => {
  let workingDays = 0;

  for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
    const day = d.getDay();

    // Ignore Saturday (6) & Sunday (0)
    if (day !== 0 && day !== 6) {
      workingDays++;
    }
  }

  return workingDays;
};