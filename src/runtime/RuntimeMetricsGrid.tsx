import React from 'react';
import { RuntimeMetrics } from '../types';

interface RuntimeMetricsGridProps {
  metrics: RuntimeMetrics;
}

const RuntimeMetricsGrid: React.FC<RuntimeMetricsGridProps> = ({ metrics }) => {
  const formatNumber = (n: number, decimals = 0): string => {
    if (n >= 1000000) return (n / 1000000).toFixed(decimals) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(decimals) + 'K';
    return n.toFixed(decimals);
  };

  const getTrend = (value: number, threshold: number): string => {
    if (value > threshold) return 'down';
    return 'up';
  };

  return (
    <div className="runtime-metrics">
      {/* Total Operations */}
      <div className="metric-widget">
        <span className="metric-label">Total Operations</span>
        <div className="metric-value">{formatNumber(metrics.totalOperations)}</div>
        <span className="metric-sub">executed in current session</span>
        <span className={`metric-trend ${getTrend(metrics.totalOperations, 500)}`}>
          {metrics.totalOperations > 500 ? '↑' : '↓'} Network active
        </span>
      </div>

      {/* Total Batches */}
      <div className="metric-widget">
        <span className="metric-label">Total Batches</span>
        <div className="metric-value" style={{ color: 'var(--green)' }}>
          {metrics.totalBatches}
        </div>
        <span className="metric-sub">settlement completed</span>
        <span className="metric-trend up">
          ↑ {metrics.avgBatchSize.toFixed(1)} ops/batch
        </span>
      </div>

      {/* Avg Batch Size */}
      <div className="metric-widget">
        <span className="metric-label">Avg Batch Size</span>
        <div className="metric-value" style={{ color: 'var(--cyan)' }}>
          {metrics.avgBatchSize.toFixed(1)}
        </div>
        <span className="metric-sub">operations per batch</span>
        <span className="metric-trend up">optimization at {((metrics.avgBatchSize / 20) * 100).toFixed(0)}%</span>
      </div>

      {/* Cost Per Operation */}
      <div className="metric-widget">
        <span className="metric-label">Cost/Op</span>
        <div className="metric-value" style={{ color: 'var(--amber)' }}>
          ${metrics.costPerOperation.toFixed(5)}
        </div>
        <span className="metric-sub">average on-chain cost</span>
        <span className={`metric-trend ${metrics.costPerOperation < 0.001 ? 'up' : 'down'}`}>
          {metrics.costPerOperation < 0.001 ? '✓ Optimized' : '⚠ High'}
        </span>
      </div>

      {/* Total Gas Cost */}
      <div className="metric-widget">
        <span className="metric-label">Total Gas Cost</span>
        <div className="metric-value" style={{ color: 'var(--red)' }}>
          ${metrics.totalGasCost.toFixed(2)}
        </div>
        <span className="metric-sub">cumulative blockchain spend</span>
        <span className="metric-trend">100% of operational expense</span>
      </div>

      {/* Execution Throughput */}
      <div className="metric-widget">
        <span className="metric-label">Throughput</span>
        <div className="metric-value" style={{ color: 'var(--blue)' }}>
          {metrics.executionThroughput.toFixed(1)}
        </div>
        <span className="metric-sub">operations per second</span>
        <span className="metric-trend">peak capacity reached</span>
      </div>

      {/* System Health */}
      <div className="metric-widget">
        <span className="metric-label">System Health</span>
        <div
          className="metric-value"
          style={{
            color:
              metrics.systemHealth > 80
                ? 'var(--green)'
                : metrics.systemHealth > 50
                  ? 'var(--amber)'
                  : 'var(--red)',
          }}
        >
          {metrics.systemHealth.toFixed(0)}%
        </div>
        <span className="metric-sub">overall infrastructure status</span>
        <span
          className={`metric-trend ${metrics.systemHealth > 80 ? 'up' : 'down'}`}
        >
          {metrics.systemHealth > 80 ? '✓ Healthy' : metrics.systemHealth > 50 ? '⚠ Stressed' : '✗ Critical'}
        </span>
      </div>

      {/* Network Pressure */}
      <div className="metric-widget">
        <span className="metric-label">Network Pressure</span>
        <div
          className="metric-value"
          style={{
            color:
              metrics.networkPressure < 30
                ? 'var(--green)'
                : metrics.networkPressure < 70
                  ? 'var(--amber)'
                  : 'var(--red)',
          }}
        >
          {metrics.networkPressure.toFixed(0)}%
        </div>
        <span className="metric-sub">utilization level</span>
        <span
          className={`metric-trend ${metrics.networkPressure < 50 ? 'up' : 'down'}`}
        >
          {metrics.networkPressure < 50 ? 'Capacity available' : 'Near limits'}
        </span>
      </div>
    </div>
  );
};

export default RuntimeMetricsGrid;