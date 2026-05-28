import React from 'react';

interface ControlCenterProps {
  isRunning: boolean;
  speed: number;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onAddOperation: () => void;
}

const ControlCenter: React.FC<ControlCenterProps> = ({
  isRunning,
  speed,
  onStart,
  onStop,
  onReset,
  onSpeedChange,
  onAddOperation,
}) => {
  return (
    <div className="control-center">
      <div className="batch-label">Simulation Control Center</div>

      <div className="control-grid">
        {/* SIMULATION STATE */}
        <div className="control-input">
          <label className="control-label">Status</label>
          <div
            style={{
              padding: '12px',
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: isRunning ? 'var(--green)' : 'var(--text-3)',
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                background: isRunning ? 'var(--green)' : 'var(--text-4)',
                borderRadius: '50%',
                animation: isRunning ? 'pulse 2s infinite' : 'none',
              }}
            />
            {isRunning ? 'RUNNING' : 'STOPPED'}
          </div>
        </div>

        {/* SPEED CONTROL */}
        <div className="control-input">
          <label className="control-label">Simulation Speed</label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="range"
              min="0.25"
              max="4"
              step="0.25"
              value={speed}
              onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
              style={{ flex: 1 }}
            />
            <div
              style={{
                minWidth: '40px',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                padding: '6px 8px',
                borderRadius: '4px',
                textAlign: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--blue)',
              }}
            >
              {speed.toFixed(2)}x
            </div>
          </div>
        </div>

        {/* MANUAL OPERATION */}
        <div className="control-input">
          <label className="control-label">Manual Control</label>
          <button
            onClick={onAddOperation}
            style={{
              width: '100%',
              padding: '8px 12px',
              background: 'var(--blue)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 150ms',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = '#5599ff';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 12px rgba(68, 136, 255, 0.5)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'var(--blue)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
            }}
          >
            Add Operation
          </button>
        </div>
      </div>

      {/* CONTROL BUTTONS */}
      <div
        style={{
          marginTop: 'var(--spacing-lg)',
          display: 'flex',
          gap: 'var(--spacing-md)',
          flexWrap: 'wrap',
        }}
      >
        {!isRunning ? (
          <button
            onClick={onStart}
            style={{
              flex: 1,
              minWidth: '120px',
              padding: '12px 16px',
              background: 'var(--green)',
              color: '#000',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 150ms',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 16px rgba(0, 230, 118, 0.5)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
            }}
          >
            Start Simulation
          </button>
        ) : (
          <button
            onClick={onStop}
            style={{
              flex: 1,
              minWidth: '120px',
              padding: '12px 16px',
              background: 'var(--amber)',
              color: '#000',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 150ms',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 16px rgba(255, 179, 0, 0.5)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
            }}
          >
            Stop Simulation
          </button>
        )}

        <button
          onClick={onReset}
          style={{
            flex: 1,
            minWidth: '120px',
            padding: '12px 16px',
            background: 'var(--surface-3)',
            color: 'var(--text-1)',
            border: '1px solid var(--border-bright)',
            borderRadius: '4px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 150ms',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-4)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-3)';
          }}
        >
          Reset
        </button>
      </div>

      {/* INFO BOX */}
      <div
        style={{
          marginTop: 'var(--spacing-lg)',
          padding: 'var(--spacing-md)',
          background: 'var(--blue-mid)',
          border: '1px solid var(--blue)',
          borderRadius: 'var(--border-radius-md)',
          fontSize: '12px',
          color: 'var(--text-1)',
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: 'var(--blue)' }}>How to use:</strong> Click "Start Simulation" to
        begin generating operations and batches. Adjust speed to control operation throughput. Use
        "Add Operation" to manually inject transactions. Watch the metrics update in real-time as
        batches form and execute on the blockchain.
      </div>
    </div>
  );
};

export default ControlCenter;