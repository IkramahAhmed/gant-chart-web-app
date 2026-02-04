'use client';

import { ZoomLevel } from '@/lib/types';
import { getDateRange, getDateFormat } from '@/lib/utils/dateUtils';
import { getPixelsPerDay } from '@/lib/utils/ganttUtils';
import styles from './Timeline.module.css';

interface TimelineProps {
  startDate: Date;
  endDate: Date;
  zoomLevel: ZoomLevel;
}

/**
 * Timeline component
 * Displays date headers based on zoom level
 */
export function Timeline({ startDate, endDate, zoomLevel }: TimelineProps) {
  const dates = getDateRange(startDate, endDate, zoomLevel);
  const pixelsPerDay = getPixelsPerDay(zoomLevel);
  const dateFormat = getDateFormat(zoomLevel);

  // Show dates every 3 days for cleaner display
  const filteredDates = dates.filter(
    (_, index) => index % 3 === 0 || index === dates.length - 1
  );

  return (
    <div
      className={styles.timeline}
      role="row"
      aria-label="Timeline header"
      style={{
        width: `${dates.length * pixelsPerDay * (zoomLevel === 'day' ? 1 : zoomLevel === 'week' ? 7 : 30)}px`,
      }}
    >
      {filteredDates.map((date, index) => {
        const dateIndex = dates.indexOf(date);
        const cellWidth =
          pixelsPerDay *
          (zoomLevel === 'day' ? 1 : zoomLevel === 'week' ? 7 : 30);
        const spanDays =
          index < filteredDates.length - 1
            ? dates.indexOf(filteredDates[index + 1]) - dateIndex
            : dates.length - dateIndex;

        return (
          <div
            key={index}
            className={styles.timelineCell}
            style={{
              width: `${cellWidth * spanDays}px`,
            }}
            role="columnheader"
            aria-label={`Date: ${date.toLocaleDateString()}`}
          >
            <div className={styles.dateLabel}>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  color: '#64748b',
                  marginBottom: '2px',
                }}
              >
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div>
                {date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
