import React from 'react';
import { UnitEconomics } from '../types';

interface UnitEconomicsPanelProps {
  economics: UnitEconomics;
  users: number;
}

const UnitEconomicsPanel: React.FC<UnitEconomicsPanelProps> = ({ economics, users }) => {
  const profitabilityColor = (margin: number): string => {
    if (margin > 70) return 'var(--green)';
    if (margin > 30) return 'var(--amber)';
    return 'var(--red)';
  };

  const scaleMetrics = [
    { label: 'At 100 Users', value: economics.profitabilityAtScale.users_100 },
    { label: 'At 1K Users', value: economics.profitabilityAtScale.users_1000 },
    { label: 'At 10K Users', value: economics.profitabilityAtScale.users_10000 },
    { label: 'At 50K Users', value: economics.profitabilityAtScale.users_50000 },
  ];

  return (
    <div className="unit-economics-container">
      <div className="batch-label">Unit Economics · Profitability Analysis</div>

      <div className="economics-grid">
        {/* Cost per User */}
        <div className="economics-card">
          <div className="economics-label">Cost per User</div>
          <div className="economics-value" style={{ color: 'var(--amber)' }}>
            ${economics.costPerUser.toFixed(4)}
          </div>
          <div className="economics-change">
            Current: {users} users
          </div>
        </div>

        {/* Cost per Transaction */}
        <div className="economics-card">
          <div className="economics-label">Cost per Transaction</div>
          <div className="economics-value" style={{ color: 'var(--amber)' }}>
            ${economics.costPerTransaction.toFixed(5)}
          </div>
          <div className="economics-change negative">
            Batching reduces by ~68%
          </div>
        </div>

        {/* Cost per Batch */}
        <div className="economics-card">
          <div className="economics-label">Cost per Batch</div>
          <div className="economics-value" style={{ color: 'var(--amber)' }}>
            ${economics.costPerBatch.toFixed(3)}
          </div>
          <div className="economics-change">
            Average execution cost
          </div>
        </div>

        {/* Platform Margin */}
        <div className="economics-card">
          <div className="economics-label">Platform Margin</div>
          <div
            className="economics-value"
            style={{ color: profitabilityColor(economics.platformMargin) }}
          >
            {economics.platformMargin.toFixed(1)}%
          </div>
          <div
            className={`economics-change ${
              economics.platformMargin > 70 ? 'positive' : 'negative'
            }`}
          >
            {economics.platformMargin > 70
              ? 'Highly profitable'
              : economics.platformMargin > 30
                ? 'Profitable'
                : 'Review pricing'}
          </div>
        </div>

        {/* Break-Even Point */}
        <div className="economics-card">
          <div className="economics-label">Break-Even Volume</div>
          <div className="economics-value" style={{ color: 'var(--cyan)' }}>
            ${economics.breakEvenPoint.toFixed(2)}
          </div>
          <div className="economics-change">
            Monthly operational cost
          </div>
        </div>

        {/* Network Efficiency */}
        <div className="economics-card">
          <div className="economics-label">Network Efficiency</div>
          <div className="economics-value" style={{ color: 'var(--green)' }}>
            {((1 - economics.costPerTransaction / 0.001) * 100).toFixed(0)}%
          </div>
          <div className="economics-change positive">
            Optimized vs baseline
          </div>
        </div>
      </div>

      {/* SCALE PROFITABILITY */}
      <div
        style={{
          marginTop: 'var(--spacing-lg)',
          paddingTop: 'var(--spacing-lg)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <div
          style={{
            fontSize: '10px',
            color: 'var(--text-3)',
            marginBottom: 'var(--spacing-md)',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-mono)',
          }}
        >
          Profitability at Scale
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 'var(--spacing-md)',
          }}
        >
          {scaleMetrics.map((metric, idx) => (
            <div key={idx}>
              <div
                style={{
                  fontSize: '10px',
                  color: 'var(--text-3)',
                  marginBottom: 'var(--spacing-xs)',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {metric.label}
              </div>
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: profitabilityColor(metric.value),
                }}
              >
                {metric.value.toFixed(1)}%
              </div>
              <div
                style={{
                  fontSize: '10px',
                  color: 'var(--text-3)',
                  marginTop: 'var(--spacing-xs)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                Margin
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KEY INSIGHTS */}
      <div
        style={{
          marginTop: 'var(--spacing-lg)',
          padding: 'var(--spacing-md)',
          background: 'var(--surface-2)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--border-radius-md)',
          fontSize: '12px',
          color: 'var(--text-2)',
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: 'var(--text-1)' }}>Key Insights:</strong>
        <ul
          style={{
            marginLeft: '20px',
            marginTop: '8px',
            listStyleType: 'disc',
          }}
        >
          <li>
            Cost scales sublinearly with batching: each additional operation adds minimal cost
          </li>
          <li>
            Profitability improves significantly from 100 to 50K users due to fixed costs amortization
          </li>
          <li>
            Network efficiency reaches {((1 - economics.costPerTransaction / 0.001) * 100).toFixed(0)}% vs L1 baseline
          </li>
          <li>Platform is {economics.platformMargin > 70 ? 'highly' : 'moderately'} profitable at current scale</li>
        </ul>
      </div>
    </div>
  );
};

export default UnitEconomicsPanel;