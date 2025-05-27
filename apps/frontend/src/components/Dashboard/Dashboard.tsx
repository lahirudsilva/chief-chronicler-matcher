import React, { useState } from 'react';
import styles from './Dashboard.module.scss';

interface ProcessingResult {
  totalDistance: number;
  pairsCount: number;
  pairs: Array<{
    index: number;
    left: number;
    right: number;
    distance: number;
  }>;
  statistics: {
    average: number;
  };
}

interface DashboardProps {
  results: ProcessingResult;
  onReset: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ results, onReset }) => {
  const [showAllPairs, setShowAllPairs] = useState(false);
  const { totalDistance, pairsCount, pairs, statistics } = results;

  // Number of pairs to show initially
  const INITIAL_PAIRS_COUNT = 5;
  const displayedPairs = showAllPairs ? pairs : pairs.slice(0, INITIAL_PAIRS_COUNT);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Journey Summary</h2>
        <p className={styles.subtitle}>
          {pairsCount} locations analyzed
        </p>
      </div>

      <div className={styles.summary}>
        <div className={styles.primaryMetric}>
          <div className={styles.metricValue}>{totalDistance}</div>
          <div className={styles.metricLabel}>Total Distance</div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{pairsCount}</div>
            <div className={styles.statLabel}>Locations</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{statistics.average.toFixed(1)}</div>
            <div className={styles.statLabel}>Average Distance</div>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button onClick={onReset} className={styles.resetButton}>
          Find New Location
        </button>
      </div>

      <div className={styles.detailsSection}>
        <div className={styles.detailsHeader}>
          <h3 className={styles.detailsTitle}>Journey Details</h3>
        </div>
        <div className={styles.tableContainer}>
          <table className={styles.resultsTable}>
            <thead>
              <tr>
                <th>Site #</th>
                <th>List #1</th>
                <th>List #2</th>
                <th>Distance</th>
              </tr>
            </thead>
            <tbody>
              {displayedPairs.map((pair) => (
                <tr key={pair.index} className={styles.tableRow}>
                  <td className={styles.indexCell}>{pair.index}</td>
                  <td className={styles.locationCell}>{pair.left}</td>
                  <td className={styles.locationCell}>{pair.right}</td>
                  <td className={styles.distanceCell}>{pair.distance}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {pairs.length > INITIAL_PAIRS_COUNT && (
            <div className={styles.showMoreContainer}>
              <button
                onClick={() => setShowAllPairs(!showAllPairs)}
                className={styles.showMoreButton}
              >
                {showAllPairs ? 'Show Less' : `Show More (${pairs.length - INITIAL_PAIRS_COUNT} more)`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;