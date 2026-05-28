import React from 'react';
import { Operation, Batch, BatchConfig } from '../types';

interface BatchingVisualizerProps {
  operations: Operation[];
  currentBatch: Batch | null;
  batches: Batch[];
  config: BatchConfig;
  onConfigChange: (config: Partial<BatchConfig>) => void;
  onExecute: () => void;
}

const BatchingVisualizer: React.FC<BatchingVisualizerProps> = ({
  operations,
  currentBatch,
  batches,
  config,
  onConfigChange,
  onExecute,
}) => {
  const getOperationIcon = (type: Operation['type']): string => {
    const icons: Record<Operation['type'], string> = {
      buy: 'B',
      tokenize: 'T',
      stake: 'S',
      sell: 'X',
      mint_cert: 'M',
      claim: 'C',
      swap: 'W',
    };
    return icons[type];
  };

  const getOperationColor = (type: Operation['type']): string => {
    const colors: Record<Operation['type'], string> = {
      buy: 'var(--green)',
      tokenize: 'var(--blue)',
      stake: 'var(--purple)',
      sell: 'var(--red)',
      mint_cert: 'var(--cyan)',
      claim: 'var(--amber)',
      swap: 'var(--blue)',
    };
    return colors[type];
  };

  const operationStats = {
    total: operations.length + (currentBatch?.operationCount || 0),
    pending: operations.filter(op => op.status === 'pending').length,
    queued: operations.filter(op => op.status === 'queued').length,
  };

  const settledBatches = batches.filter(b => b.status === 'settled');
  const avgBatchSize = settledBatches.length > 0
    ? settledBatches.reduce((sum, b) => sum + b.operationCount, 0) / settledBatches.length
    : 0;

  const totalSavings = settledBatches.length > 0
    ? ((operationStats.total * 0.000018 - settledBatches.reduce((sum, b) => sum + b.totalCost, 0)) /
      (operationStats.total * 0.000018)) * 100
    : 0;

  return (
    <div className="batching-container">
      <div className="batch-label">Batching Engine · Operation Flow</div>

      {/* BATCH FLOW VISUALIZATION */}
      <div className="batch-flow">
        {/* STAGE 1: OPERATION QUEUE */}
        <div className={`batch-stage ${operations.length > 0 ? 'active' : ''}`}>
          <div className="batch-stage-name">Operation Queue</div>
          <div className="batch-stage-count">{operationStats.pending + operationStats.queued}</div>
          <div className="batch-stage-sub">awaiting batch trigger</div>
        </div>

        <div className="batch-arrow" />

        {/* STAGE 2: BATCH BUILDER */}
        <div
          className={`batch-stage ${
            currentBatch ? 'active' : settledBatches.length > 0 ? 'completed' : ''
          }`}
        >
          <div className="batch-stage-name">Batch Builder</div>
          <div className="batch-stage-count">{currentBatch?.operationCount || settledBatches.length}</div>
          <div className="batch-stage-sub">
            {currentBatch ? 'Building...' : 'Batches created'}
          </div>
        </div>

        <div className="batch-arrow" />

        {/* STAGE 3: EXECUTION */}
        <div className={`batch-stage ${currentBatch ? 'executing' : settledBatches.length > 0 ? 'completed' : ''}`}>
          <div className="batch-stage-name">Smart Contract</div>
          <div className="batch-stage-count">{settledBatches.length}</div>
          <div className="batch-stage-sub">executed batches</div>
        </div>

        <div className="batch-arrow" />

        {/* STAGE 4: SETTLEMENT */}
        <div className={`batch-stage ${settledBatches.length > 0 ? 'completed' : ''}`}>
          <div className="batch-stage-name">L1 Settlement</div>
          <div className="batch-stage-count">{settledBatches.length}</div>
          <div className="batch-stage-sub">finalized</div>
        </div>
      </div>

      {/* OPERATION QUEUE VISUALIZATION */}
      <div style={{ marginTop: 'var(--spacing-xl)' }}>
        <div style={{ fontSize: '10px', color: 'var(--text-3)', marginBottom: 'var(--spacing-md)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
          Pending Operations ({operationStats.total})
        </div>
        <div className="batch-queue">
          {operations.slice(0, 50).map(op => (
            <div
              key={op.id}
              className={`queue-item ${op.status}`}
              title={`${op.type.toUpperCase()} · ${op.userId}`}
            >
              {getOperationIcon(op.type)}
            </div>
          ))}
          {operations.length > 50 && (
            <div
              className="queue-item"
              style={{
                background: 'var(--surface-3)',
                border: '1px dashed var(--border)',
                color: 'var(--text-2)',
              }}
            >
              +{operations.length - 50}
            </div>
          )}
        </div>
      </div>

      {/* BATCH CONFIGURATION */}
      <div style={{ marginTop: 'var(--spacing-xl)', paddingTop: 'var(--spacing-lg)', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: '10px', color: 'var(--text-3)', marginBottom: 'var(--spacing-md)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
          Batch Triggers
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--spacing-md)' }}>
          <div>
            <label style={{ fontSize: '10px', color: 'var(--text-3)', marginBottom: 'var(--spacing-xs)', display: 'block', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              By Count
            </label>
            <input
              type="number"
              value={config.triggerByCount}
              onChange={(e) => onConfigChange({ triggerByCount: parseInt(e.target.value) })}
              style={{
                width: '100%',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                color: 'var(--text-1)',
                padding: '6px 8px',
                borderRadius: '4px',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
              }}
              min="1"
            />
          </div>
          <div>
            <label style={{ fontSize: '10px', color: 'var(--text-3)', marginBottom: 'var(--spacing-xs)', display: 'block', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              By Volume
            </label>
            <input
              type="number"
              value={config.triggerByVolume}
              onChange={(e) => onConfigChange({ triggerByVolume: parseInt(e.target.value) })}
              style={{
                width: '100%',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                color: 'var(--text-1)',
                padding: '6px 8px',
                borderRadius: '4px',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
              }}
              min="1"
            />
          </div>
          <div>
            <label style={{ fontSize: '10px', color: 'var(--text-3)', marginBottom: 'var(--spacing-xs)', display: 'block', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              By Time (ms)
            </label>
            <input
              type="number"
              value={config.triggerByTime}
              onChange={(e) => onConfigChange({ triggerByTime: parseInt(e.target.value) })}
              style={{
                width: '100%',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                color: 'var(--text-1)',
                padding: '6px 8px',
                borderRadius: '4px',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
              }}
              min="1"
            />
          </div>
        </div>
      </div>

      {/* STATS */}
      <div style={{ marginTop: 'var(--spacing-xl)', paddingTop: 'var(--spacing-lg)', borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--spacing-md)' }}>
        <div>
          <div style={{ fontSize: '10px', color: 'var(--text-3)', marginBottom: 'var(--spacing-xs)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
            Avg Batch Size
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--green)' }}>
            {avgBatchSize.toFixed(1)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '10px', color: 'var(--text-3)', marginBottom: 'var(--spacing-xs)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
            Total Batches
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--blue)' }}>
            {settledBatches.length}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '10px', color: 'var(--text-3)', marginBottom: 'var(--spacing-xs)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
            Cost Savings
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--green)' }}>
            {totalSavings.toFixed(1)}%
          </div>
        </div>
        {currentBatch && (
          <button
            onClick={onExecute}
            style={{
              background: 'var(--green)',
              color: '#000',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '4px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 150ms',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'var(--green)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 16px rgba(0, 230, 118, 0.5)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
            }}
          >
            Execute Batch
          </button>
        )}
      </div>
    </div>
  );
};

export default BatchingVisualizer;