import React from 'react';
import { ScheduleItem } from '../types';
import { timeToMinutes, minutesToTime } from '../utils/timeUtils';

interface PrintLayoutProps {
  schedules: ScheduleItem[];
  eventName: string;
  venue: string;
  date: string;
  dayNumber: string;
  order: 'time' | 'stage' | 'category';
}

export const PrintLayout: React.FC<PrintLayoutProps> = ({
  schedules,
  eventName,
  venue,
  date,
  dayNumber,
  order,
}) => {
  
  // Generic helper to render a sub-table of sorted items
  const renderSubTable = (items: ScheduleItem[]) => {
    const sorted = [...items].sort((a, b) => {
      // Primary sort by Day (e.g. Day 1, Day 2...)
      const dayA = parseInt(a.day.replace(/\D/g, '')) || 0;
      const dayB = parseInt(b.day.replace(/\D/g, '')) || 0;
      if (dayA !== dayB) return dayA - dayB;

      // Secondary sort by Starting Time
      const timeA = timeToMinutes(a.startingTime);
      const timeB = timeToMinutes(b.startingTime);
      return timeA - timeB;
    });

    return (
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '11px',
          lineHeight: '1.5',
          color: '#000000',
          marginBottom: '20px',
        }}
      >
        <thead>
          <tr style={{ borderBottom: '1.5px solid #000000', textAlign: 'left', fontWeight: 'bold' }}>
            <th style={{ padding: '6px 4px', width: '50px' }}>Day</th>
            <th style={{ padding: '6px 4px', width: '130px' }}>Time</th>
            <th style={{ padding: '6px 4px', width: '220px' }}>Program</th>
            <th style={{ padding: '6px 4px', width: '160px' }}>Category</th>
            <th style={{ padding: '6px 4px', width: '80px' }}>Stage</th>
            <th style={{ padding: '6px 4px', width: '70px' }}>Duration</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((item) => {
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
                <td style={{ padding: '6px 4px', fontWeight: 'bold' }}>
                  {item.day}
                </td>
                <td style={{ padding: '6px 4px', fontWeight: 'bold' }}>
                  {item.startingTime} - {endTimeStr}
                </td>
                <td style={{ padding: '6px 4px', fontWeight: 600 }}>
                  {item.programName}
                </td>
                <td style={{ padding: '6px 4px' }}>
                  {item.category}
                </td>
                <td style={{ padding: '6px 4px', fontWeight: 500 }}>
                  {item.stage}
                </td>
                <td style={{ padding: '6px 4px' }}>
                  {item.duration} mins
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  // Grouping render logic
  const renderGroupedContent = () => {
    if (schedules.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '40px', fontSize: '14px', border: '1px dashed #E0E0E0' }}>
          No schedules added yet.
        </div>
      );
    }

    if (order === 'stage') {
      // Extract unique stages present, sorted numeric ascending
      const stages = Array.from(new Set(schedules.map(s => s.stage))).sort((a, b) => 
        a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
      );

      return stages.map(stage => {
        const stageItems = schedules.filter(s => s.stage === stage);
        return (
          <div key={stage} style={{ marginBottom: '24px', pageBreakInside: 'avoid' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#000000', marginBottom: '8px', borderBottom: '1.5px solid #000000', paddingBottom: '3px', textTransform: 'uppercase' }}>
              Stage {stage}
            </h3>
            {renderSubTable(stageItems)}
          </div>
        );
      });
    }

    if (order === 'category') {
      // Custom category sort order index sequence
      const catOrder = ['lower primary', 'upper primary', 'high school', 'junior', 'higher secondary', 'senior', 'campus'];
      
      const categories = Array.from(new Set(schedules.map(s => s.category))).sort((a, b) => {
        const idxA = catOrder.indexOf(a.toLowerCase().trim());
        const idxB = catOrder.indexOf(b.toLowerCase().trim());
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return a.localeCompare(b);
      });

      return categories.map(category => {
        const categoryItems = schedules.filter(s => s.category === category);
        return (
          <div key={category} style={{ marginBottom: '24px', pageBreakInside: 'avoid' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#000000', marginBottom: '8px', borderBottom: '1.5px solid #000000', paddingBottom: '3px', textTransform: 'uppercase' }}>
              Category: {category}
            </h3>
            {renderSubTable(categoryItems)}
          </div>
        );
      });
    }

    // Default chronological Time-based rendering
    return renderSubTable(schedules);
  };

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

      {/* Grouped / chronological Content rendering */}
      {renderGroupedContent()}

      {/* Footer stamp (Preserved Malayalam text tag) */}
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
