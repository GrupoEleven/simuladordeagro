import React from 'react';
import { ScalingScenario } from '../types';

interface ScaleStressTestProps {
  currentUsers: number;
  scenario: ScalingScenario;
  onScaleChange: (users: number) => void;
}

const ScaleStressTest: React.FC<ScaleStressTestProps> = ({
  currentUsers,
  scenario,
  onScaleChange,
}) => {
  const pressureColor = (pressure: number): string => {
    if (pressure < 30) return 'var(--green)';
    if (pressure < 70) return 'var(--amber)';
    return 'var(--red)';
  };

  const pressureStatus = (pressure: number): string => {
    if (pressure < 30) return 'Healthy';
    if (pressure < 70) return 'Elevated';
    return 'Critical';
  };

  const indicators = [
    { name: 'Queue Size', value: scenario.batchCount, max: 100, color: 'var(--blue)' },
    { name: 'Exec Time', value: (scenario.executionTime / 10000) * 100, max: 100, color: 'var(--cyan)', unit: `${scenario.executionTime}ms` },
    { name: 'Gas Cost', value: Math.min(100, (scenario.estimatedCost / 500) * 100), max: 100, color: 'var(--amber)', unit: `$${scenario.estimatedCost.toFixed(2)}` },
    { name: 'Network', value: scenario.pressureLevel, max: 100, color: pressureColor(scenario.pressureLevel) },
  ];

  return (
    <div className="scale-stress-container">
      <div className="batch-label">Scale Stress Test · Network Simulation</div>

      {/* SLIDER */}
      <div className="stress-slider">
        <div className="slider-label">
          <span>Scaling Simulation</span>
          <span className="slider-value">{currentUsers.toLocaleString()} Users</span>
        </div>
        <input
          type="range"
          min="10"
          max="100000"
          value={currentUsers}
          onChange={(e) => onScaleChange(parseInt(e.target.value))}
          style={{ width: '100%' }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '10px',
            color: 'var(--text-3)',
            fontFamily: 'var(--font-mono)',
            marginTop: 'var(--spacing-sm)',
          }}
        >
          <span>10</span>
          <span>100</span>
          <span>1K</span>
          <span>10K</span>
          <span>100K</span>
        </div>
      </div>

      {/* PRESSURE INDICATORS */}
      <div className="pressure-indicators">
        {indicators.map((indicator, idx) => (
          <div key={idx} className="pressure-indicator">
            <div className="pressure-name">{indicator.name}</div>
            <div className="pressure-bar">
              <div
                className="pressure-fill"
                style={{
                  width: `${Math.min(100, indicator.value)}%`,
                  background:
                    indicator.name === 'Network'
                      ? pressureColor(indicator.value)
                      : indicator.color,
                }}
              />
            </div>
            <div className="pressure-value">{indicator.value.toFixed(0)}%</div>
            {indicator.unit && (
              <div className="pressure-sub">{indicator.unit}</div>
            )}
          </div>
        ))}
      </div>

      {/* SCENARIO DETAILS */}
      <div
        style={{
          marginTop: 'var(--spacing-lg)',
          paddingTop: 'var(--spacing-lg)',
          borderTop: '1px solid var(--border)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 'var(--spacing-md)',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '10px',
              color: 'var(--text-3)',
              marginBottom: 'var(--spacing-xs)',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-mono)',
            }}
          >
            Operations/Cycle
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--blue)' }}>
            {scenario.operationsPerCycle.toLocaleString()}
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: '10px',
              color: 'var(--text-3)',
              marginBottom: 'var(--spacing-xs)',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-mono)',
            }}
          >
            Total Gas Est.
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--amber)' }}>
            {(scenario.estimatedGas / 1000000).toFixed(2)}M
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: '10px',
              color: 'var(--text-3)',
              marginBottom: 'var(--spacing-xs)',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-mono)',
            }}
          >
            Est. Cost (L2)
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--green)' }}>
            ${scenario.estimatedCost.toFixed(2)}
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: '10px',
              color: 'var(--text-3)',
              marginBottom: 'var(--spacing-xs)',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-mono)',
            }}
          >
            Batch Count
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--cyan)' }}>
            {scenario.batchCount}
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: '10px',
              color: 'var(--text-3)',
              marginBottom: 'var(--spacing-xs)',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-mono)',
            }}
          >
            Exec Time
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--purple)' }}>
            {(scenario.executionTime / 1000).toFixed(2)}s
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: '10px',
              color: 'var(--text-3)',
              marginBottom: 'var(--spacing-xs)',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-mono)',
            }}
          >
            Network Status
          </div>
          <div
            style={{
              fontSize: '14px',
              fontWeight: 700,
              color: pressureColor(scenario.pressureLevel),
            }}
          >
            {pressureStatus(scenario.pressureLevel)}
          </div>
        </div>
      </div>

      {/* MARGIN ANALYSIS */}
      <div
        style={{
          marginTop: 'var(--spacing-lg)',
          paddingTop: 'var(--spacing-lg)',
          borderTop: '1px solid var(--border)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 'var(--spacing-md)',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '10px',
              color: 'var(--text-3)',
              marginBottom: 'var(--spacing-xs)',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-mono)',
            }}
          >
            Margin Without Batching
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--red)' }}>
            {scenario.margins.without_batching.toFixed(1)}%
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: '10px',
              color: 'var(--text-3)',
              marginBottom: 'var(--spacing-xs)',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-mono)',
            }}
          >
            Margin With Batching
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--green)' }}>
            {scenario.margins.with_batching.toFixed(1)}%
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: '10px',
              color: 'var(--text-3)',
              marginBottom: 'var(--spacing-xs)',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-mono)',
            }}
          >
            Cost Savings
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--green)' }}>
            {scenario.margins.savings.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScaleStressTest;