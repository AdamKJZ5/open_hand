/**
 * ICS (iCalendar) Generator Utility
 * Generates RFC 5545 compliant .ics files for calendar applications
 */

export interface ICSEvent {
  uid: string;
  startTime: Date;
  endTime: Date;
  summary: string;
  description?: string;
  location?: string;
  rrule?: string; // For recurring events (e.g., "FREQ=WEEKLY;BYDAY=MO,TU,WE")
}

/**
 * Format date to ICS datetime format (YYYYMMDDTHHMMSS)
 */
function formatICSDateTime(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}

/**
 * Escape special characters in ICS text fields
 */
function escapeICSText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * Fold long lines according to RFC 5545 (max 75 octets per line)
 */
function foldLine(line: string): string {
  const maxLength = 75;
  if (line.length <= maxLength) {
    return line;
  }

  const folded: string[] = [];
  let currentLine = line.substring(0, maxLength);
  let remaining = line.substring(maxLength);

  folded.push(currentLine);

  while (remaining.length > 0) {
    const chunk = remaining.substring(0, maxLength - 1);
    folded.push(' ' + chunk);
    remaining = remaining.substring(maxLength - 1);
  }

  return folded.join('\r\n');
}

/**
 * Generate a single VEVENT block
 */
function generateEvent(event: ICSEvent): string {
  const lines: string[] = [];

  lines.push('BEGIN:VEVENT');
  lines.push(`UID:${event.uid}`);
  lines.push(`DTSTAMP:${formatICSDateTime(new Date())}`);
  lines.push(`DTSTART:${formatICSDateTime(event.startTime)}`);
  lines.push(`DTEND:${formatICSDateTime(event.endTime)}`);
  lines.push(`SUMMARY:${escapeICSText(event.summary)}`);

  if (event.description) {
    lines.push(foldLine(`DESCRIPTION:${escapeICSText(event.description)}`));
  }

  if (event.location) {
    lines.push(`LOCATION:${escapeICSText(event.location)}`);
  }

  if (event.rrule) {
    lines.push(`RRULE:${event.rrule}`);
  }

  lines.push('END:VEVENT');

  return lines.join('\r\n');
}

/**
 * Generate complete ICS file content
 */
export function generateICS(events: ICSEvent[], calendarName: string): string {
  const lines: string[] = [];

  // VCALENDAR header
  lines.push('BEGIN:VCALENDAR');
  lines.push('VERSION:2.0');
  lines.push('PRODID:-//OpenHand Care//Schedule Export//EN');
  lines.push('CALSCALE:GREGORIAN');
  lines.push('METHOD:PUBLISH');
  lines.push(`X-WR-CALNAME:${escapeICSText(calendarName)}`);
  lines.push('X-WR-TIMEZONE:America/New_York');

  // Add each event
  events.forEach(event => {
    lines.push(generateEvent(event));
  });

  // VCALENDAR footer
  lines.push('END:VCALENDAR');

  return lines.join('\r\n');
}

/**
 * Convert day of week number to ICS day code
 * 0 (Sunday) -> SU, 1 (Monday) -> MO, etc.
 */
export function dayOfWeekToICS(dayOfWeek: number): string {
  const days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
  return days[dayOfWeek] || 'MO';
}

/**
 * Generate ICS from caretaker schedule shifts
 */
export function generateCaretakerScheduleICS(
  caretakerName: string,
  shifts: any[],
  effectiveFrom: Date
): string {
  const events: ICSEvent[] = [];

  shifts.forEach((shift, index) => {
    // Parse start and end times
    const [startHour, startMin] = shift.startTime.split(':').map(Number);
    const [endHour, endMin] = shift.endTime.split(':').map(Number);

    if (shift.isRecurring && shift.dayOfWeek !== undefined) {
      // Recurring shift
      // Create start date on the first occurrence of this day of week
      const startDate = new Date(effectiveFrom);

      // Find the next occurrence of this day of week
      const daysUntilShift = (shift.dayOfWeek - startDate.getDay() + 7) % 7;
      startDate.setDate(startDate.getDate() + daysUntilShift);

      startDate.setHours(startHour, startMin, 0, 0);
      const endDate = new Date(startDate);
      endDate.setHours(endHour, endMin, 0, 0);

      const roomsText = shift.assignedRooms && shift.assignedRooms.length > 0
        ? ` - Rooms: ${shift.assignedRooms.join(', ')}`
        : '';

      events.push({
        uid: `caretaker-shift-${index}-${Date.now()}@openhandcare.com`,
        startTime: startDate,
        endTime: endDate,
        summary: `Shift${roomsText}`,
        description: `Caretaker shift for ${caretakerName}`,
        location: shift.assignedRooms && shift.assignedRooms.length > 0
          ? `Rooms: ${shift.assignedRooms.join(', ')}`
          : undefined,
        rrule: `FREQ=WEEKLY;BYDAY=${dayOfWeekToICS(shift.dayOfWeek)}`
      });
    } else if (shift.specificDate) {
      // One-time shift
      const startDate = new Date(shift.specificDate);
      startDate.setHours(startHour, startMin, 0, 0);
      const endDate = new Date(startDate);
      endDate.setHours(endHour, endMin, 0, 0);

      const roomsText = shift.assignedRooms && shift.assignedRooms.length > 0
        ? ` - Rooms: ${shift.assignedRooms.join(', ')}`
        : '';

      events.push({
        uid: `caretaker-shift-${index}-${Date.now()}@openhandcare.com`,
        startTime: startDate,
        endTime: endDate,
        summary: `Special Shift${roomsText}`,
        description: `One-time caretaker shift for ${caretakerName}`,
        location: shift.assignedRooms && shift.assignedRooms.length > 0
          ? `Rooms: ${shift.assignedRooms.join(', ')}`
          : undefined
      });
    }
  });

  return generateICS(events, `${caretakerName}'s Work Schedule`);
}

/**
 * Generate ICS from resident schedule items
 */
export function generateResidentScheduleICS(
  residentName: string,
  scheduleItems: any[],
  effectiveFrom: Date
): string {
  const events: ICSEvent[] = [];

  scheduleItems.forEach((item, index) => {
    // Parse start and end times
    const [startHour, startMin] = item.startTime.split(':').map(Number);
    const [endHour, endMin] = item.endTime.split(':').map(Number);

    const icon = item.icon || '';
    const title = icon ? `${icon} ${item.title}` : item.title;

    if (item.isRecurring && item.dayOfWeek !== undefined) {
      // Recurring activity
      const startDate = new Date(effectiveFrom);

      // Find the next occurrence of this day of week
      const daysUntilActivity = (item.dayOfWeek - startDate.getDay() + 7) % 7;
      startDate.setDate(startDate.getDate() + daysUntilActivity);

      startDate.setHours(startHour, startMin, 0, 0);
      const endDate = new Date(startDate);
      endDate.setHours(endHour, endMin, 0, 0);

      events.push({
        uid: `resident-activity-${index}-${Date.now()}@openhandcare.com`,
        startTime: startDate,
        endTime: endDate,
        summary: title,
        description: item.description || `${item.activityType} for ${residentName}`,
        location: item.location,
        rrule: `FREQ=WEEKLY;BYDAY=${dayOfWeekToICS(item.dayOfWeek)}`
      });
    } else if (item.specificDate) {
      // One-time activity
      const startDate = new Date(item.specificDate);
      startDate.setHours(startHour, startMin, 0, 0);
      const endDate = new Date(startDate);
      endDate.setHours(endHour, endMin, 0, 0);

      events.push({
        uid: `resident-activity-${index}-${Date.now()}@openhandcare.com`,
        startTime: startDate,
        endTime: endDate,
        summary: title,
        description: item.description || `Special ${item.activityType} for ${residentName}`,
        location: item.location
      });
    }
  });

  return generateICS(events, `${residentName}'s Schedule`);
}
