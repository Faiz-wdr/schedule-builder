import React from 'react';
import { ScheduleItem } from '../types';
import { timeToMinutes, minutesToTime } from '../utils/timeUtils';

interface PrintLayoutProps {
  schedules: ScheduleItem[];
  eventName: string;
  venue: string;
  date: string;
  dayNumber: string;
}

export const PrintLayout: React.FC<PrintLayoutProps> = ({
  schedules,
  eventName,
  venue,
  date,
  dayNumber,
}) => {
  // Sort schedules by starting time for a professional chronological print layout
  const sortedSchedules = [...schedules].sort((a, b) => {
    const minA = timeToMinutes(a.startingTime);
    const minB = timeToMinutes(b.startingTime);
    return minA - minB;
  });

  return (
    <div
      id="printable-schedule"
      style={{
        position: 'absolute',
        left: '-9999px',
        top: '-9999px',
        width: '800px',
        backgroundColor: '#FFFFFF',
        color: '#000000',
        padding: '40px',
        fontFamily: "'Inter', sans-serif",
        boxSizing: 'border-box',
      }}
    >
      {/* Top Section */}
      <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #000000', paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#000000', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
          {eventName || 'Arts Festival Schedule'}
        </h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '12px', fontWeight: 500 }}>
          {venue && (
            <span>
              <strong>Venue:</strong> {venue}
            </span>
          )}
          {date && (
            <span>
              <strong>Date:</strong> {date}
            </span>
          )}
          {dayNumber && (
            <span>
              <strong>Day:</strong> {dayNumber}
            </span>
          )}
        </div>
      </div>

      {/* Schedule Table */}
      {sortedSchedules.length > 0 ? (
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '11px',
            lineHeight: '1.5',
            color: '#000000',
          }}
        >
          <thead>
            <tr style={{ borderBottom: '2px solid #000000', textAlign: 'left', fontWeight: 'bold' }}>
              <th style={{ padding: '8px 6px', width: '130px' }}>Time</th>
              <th style={{ padding: '8px 6px', width: '220px' }}>Program</th>
              <th style={{ padding: '8px 6px', width: '160px' }}>Category</th>
              <th style={{ padding: '8px 6px', width: '120px' }}>Stage</th>
              <th style={{ padding: '8px 6px', width: '90px' }}>Duration</th>
            </tr>
          </thead>
          <tbody>
            {sortedSchedules.map((item) => {
              const startMins = timeToMinutes(item.startingTime);
              const endMins = startMins + item.duration;
              const endTimeStr = minutesToTime(endMins);

              return (
                <tr
                  key={item.id}
                  style={{
                    borderBottom: '1px solid #E0E0E0',
                  }}
                >
                  <td style={{ padding: '8px 6px', fontWeight: 'bold' }}>
                    {item.startingTime} - {endTimeStr}
                  </td>
                  <td style={{ padding: '8px 6px', fontWeight: 600 }}>
                    {item.programName}
                  </td>
                  <td style={{ padding: '8px 6px' }}>
                    {item.category}
                  </td>
                  <td style={{ padding: '8px 6px' }}>
                    {item.stage}
                  </td>
                  <td style={{ padding: '8px 6px' }}>
                    {item.duration} mins
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', fontSize: '14px', border: '1px dashed #E0E0E0' }}>
          No schedules added yet.
        </div>
      )}

      {/* Footer stamp */}
      <div
        style={{
          marginTop: '40px',
          textAlign: 'center',
          fontSize: '10px',
          color: '#888888',
          borderTop: '1px solid #E0E0E0',
          paddingTop: '10px',
        }}
      >
        മാറ്റങ്ങൾക്ക് വിധേയം • EventCrew@wdrsector
      </div>
    </div>
  );
};
