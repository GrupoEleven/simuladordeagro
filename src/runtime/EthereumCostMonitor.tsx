import React, { useMemo } from 'react';
import { GasPriceData } from '../types';

interface EthereumCostMonitorProps {
  gasPrices: GasPriceData;
}

const EthereumCostMonitor: React.FC<EthereumCostMonitorProps> = ({ gasPrices }) => {
  const costAnalysis = useMemo(() => {
    const ethStd = gasPrices.ethereum.standard;
    const ethFast = gasPrices.ethereum.fast;
    const ethInst = gasPrices.ethereum.instant;
    const arbStd = gasPrices.arbitrum.standard;

    // Exemplo de custo para 50K gas (typical transfer)
    const gasAmount = 50000;

    return {
      eth: {
        standard: (ethStd * gasAmount * 1e-9).toFixed(4),
        fast: (ethFast * gasAmount * 1e-9).toFixed(4),
        instant: (ethInst * gasAmount * 1e-9).toFixed(4),
      },
      arb: {
        standard: (arbStd * gasAmount * 1e-9).toFixed(6),
      },
      savings: (
        ((ethStd * gasAmount * 1e-9 - arbStd * gasAmount * 1e-9) /
          (ethStd * gasAmount * 1e-9)) *
        100
      ).toFixed(1),
    };
  }, [gasPrices]);

  const timeAgo = useMemo(() => {
    const diff = Date.now() - gasPrices.updateTime;
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    return `${Math.floor(seconds / 60)}m ago`;
  }, [gasPrices.updateTime]);

  return (
    <div className="gas-monitor-container">
      <div className="batch-label">Ethereum Gas Monitor · Real-Time Pricing</div>

      <div className="gas-prices">
        {/* ETHEREUM STANDARD */}
        <div className="gas-price-card">
          <div className="gas-chain">ETH - Standard</div>
          <div className="gas-price">{gasPrices.ethereum.standard.toFixed(0)}</div>
          <div className="gas-unit">gwei</div>
          <div className="gas-update">
            Est. cost (50K gas): ${costAnalysis.eth.standard}
          </div>
        </div>

        {/* ETHEREUM FAST */}
        <div className="gas-price-card">
          <div className="gas-chain">ETH - Fast</div>
          <div className="gas-price">{gasPrices.ethereum.fast.toFixed(0)}</div>
          <div className="gas-unit">gwei</div>
          <div className="gas-update">
            Est. cost (50K gas): ${costAnalysis.eth.fast}
          </div>
        </div>

        {/* ETHEREUM INSTANT */}
        <div className="gas-price-card">
          <div className="gas-chain">ETH - Instant</div>
          <div className="gas-price">{gasPrices.ethereum.instant.toFixed(0)}</div>
          <div className="gas-unit">gwei</div>
          <div className="gas-update">
            Est. cost (50K gas): ${costAnalysis.eth.instant}
          </div>
        </div>

        {/* ARBITRUM */}
        <div className="gas-price-card" style={{ background: 'var(--green-mid)', borderColor: 'var(--green)' }}>
          <div className="gas-chain">ARB - Standard</div>
          <div className="gas-price" style={{ color: 'var(--green)' }}>
            {gasPrices.arbitrum.standard.toFixed(4)}
          </div>
          <div className="gas-unit">gwei</div>
          <div className="gas-update">
            Est. cost (50K gas): ${costAnalysis.arb.standard}
          </div>
        </div>
      </div>

      {/* COMPARISON & ANALYSIS */}
      <div
        style={{
          marginTop: 'var(--spacing-lg)',
          paddingTop: 'var(--spacing-lg)',
          borderTop: '1px solid var(--border)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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
            L1 Avg. Cost (50K gas)
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--amber)' }}>
            ${(
              (parseFloat(costAnalysis.eth.standard) +
                parseFloat(costAnalysis.eth.fast) +
                parseFloat(costAnalysis.eth.instant)) /
              3
            ).toFixed(4)}
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
            L2 Cost (50K gas)
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--green)' }}>
            ${costAnalysis.arb.standard}
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
            Savings (L2 vs L1)
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--green)' }}>
            {costAnalysis.savings}%
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
            Last Update
          </div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-2)' }}>
            {timeAgo}
          </div>
        </div>
      </div>

      {/* RECOMMENDATIONS */}
      <div
        style={{
          marginTop: 'var(--spacing-lg)',
          padding: 'var(--spacing-md)',
          background: 'var(--green-mid)',
          border: '1px solid var(--green)',
          borderRadius: 'var(--border-radius-md)',
          fontSize: '12px',
          color: 'var(--text-1)',
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: 'var(--green)' }}>Recomendação:</strong> Com L2 a ${costAnalysis.arb.standard}, você economiza{' '}
        <strong>{costAnalysis.savings}%</strong> comparado a L1 Standard. Ideal para operações de alta frequência. Reserve L1 para
        settlement e ativos {`>`} $100K.
      </div>
    </div>
  );
};

export default EthereumCostMonitor;