import React from 'react';
import { TokenStandard } from '../types';

interface TokenStandardSelectorProps {
  selected: string;
  standards: TokenStandard[];
  onSelect: (id: string) => void;
}

const TokenStandardSelector: React.FC<TokenStandardSelectorProps> = ({
  selected,
  standards,
  onSelect,
}) => {
  const complexityColor = (complexity: string): string => {
    switch (complexity) {
      case 'simple':
        return 'var(--green)';
      case 'moderate':
        return 'var(--amber)';
      case 'complex':
        return 'var(--red)';
      default:
        return 'var(--text-3)';
    }
  };

  return (
    <div className="token-standards-container">
      <div className="batch-label">Token Standard Selection · ERC Impact Analysis</div>

      <div className="standards-grid">
        {standards.map(standard => (
          <div
            key={standard.id}
            className={`standard-card ${selected === standard.id ? 'active' : ''}`}
            onClick={() => onSelect(standard.id)}
            style={{ cursor: 'pointer' }}
          >
            <div className="standard-name">{standard.name}</div>
            <div className="standard-description">{standard.description}</div>

            <div className="standard-gas">
              <div style={{ fontSize: '9px', color: 'var(--text-4)', marginBottom: '2px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                Deploy Gas
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--amber)' }}>
                {(standard.deployGas / 1000000).toFixed(2)}M
              </div>
            </div>

            <div className="standard-gas">
              <div style={{ fontSize: '9px', color: 'var(--text-4)', marginBottom: '2px', marginTop: '6px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                Mint Cost (L2)
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--green)' }}>
                ${(standard.mintGas * 0.0000008).toFixed(5)}
              </div>
            </div>

            <div className="standard-gas">
              <div style={{ fontSize: '9px', color: 'var(--text-4)', marginBottom: '2px', marginTop: '6px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                Complexity
              </div>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: complexityColor(standard.complexity),
                  textTransform: 'capitalize',
                }}
              >
                {standard.complexity}
              </div>
            </div>

            <div className="standard-advantages">
              {standard.advantages.map((adv, idx) => (
                <div key={idx} className="advantage-tag">
                  {adv}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* SELECTED STANDARD ANALYSIS */}
      {selected && (
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
            {standards.find(s => s.id === selected)?.name} - Cost Impact
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: 'var(--spacing-md)',
            }}
          >
            {(() => {
              const std = standards.find(s => s.id === selected);
              if (!std) return null;

              return [
                { label: 'Deploy Cost', value: `$${(std.deployGas * 0.000018).toFixed(2)}`, unit: 'L1' },
                { label: 'Mint Cost', value: `$${(std.mintGas * 0.0000008).toFixed(5)}`, unit: 'L2' },
                { label: 'Transfer Cost', value: `$${(std.transferGas * 0.0000008).toFixed(5)}`, unit: 'L2' },
                { label: 'Burn Cost', value: `$${(std.burnGas * 0.0000008).toFixed(5)}`, unit: 'L2' },
              ].map((item, idx) => (
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
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: item.unit === 'L1' ? 'var(--amber)' : 'var(--green)',
                      marginBottom: 'var(--spacing-xs)',
                    }}
                  >
                    {item.value}
                  </div>
                  <div
                    style={{
                      fontSize: '10px',
                      color: 'var(--text-4)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {item.unit}
                  </div>
                </div>
              ));
            })()}
          </div>

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
            <strong>Recomendado para:</strong> {standards.find(s => s.id === selected)?.bestFor}
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenStandardSelector;