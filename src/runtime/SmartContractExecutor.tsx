import React, { useEffect, useState } from 'react';
import { Batch, TokenStandard, ExecutionStage } from '../types';
import { useRuntimeEngine } from '../hooks/useRuntimeEngine';

interface SmartContractExecutorProps {
  batch: Batch;
  tokenStandard: TokenStandard;
}

const SmartContractExecutor: React.FC<SmartContractExecutorProps> = ({
  batch,
  tokenStandard,
}) => {
  const engine = useRuntimeEngine();
  const [stages, setStages] = useState<ExecutionStage[]>([]);
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const executionStages = engine.simulateExecution(batch);
    setStages(executionStages);

    // Simulate stage progression
    const timer = setInterval(() => {
      setActiveStage(prev => {
        if (prev < executionStages.length - 1) {
          return prev + 1;
        }
        clearInterval(timer);
        return prev;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [batch, engine]);

  const formatGas = (gas: number): string => {
    if (gas > 1000000) return (gas / 1000000).toFixed(2) + 'M';
    if (gas > 1000) return (gas / 1000).toFixed(2) + 'K';
    return gas.toFixed(0);
  };

  const totalDuration = stages.reduce((sum, s) => sum + s.duration, 0);
  const totalGas = stages.reduce((sum, s) => sum + s.gasUsed, 0);

  return (
    <div className="execution-stages">
      <div className="batch-label">Smart Contract Execution · {tokenStandard.erc}</div>

      {/* STAGE LIST */}
      {stages.map((stage, idx) => {
        const isActive = idx === activeStage;
        const isCompleted = idx < activeStage;

        return (
          <div key={stage.id} className="execution-stage-row">
            <div
              className={`stage-number ${isActive ? 'active' : isCompleted ? 'completed' : ''}`}
            >
              {stage.id}
            </div>

            <div className="stage-details">
              <div className="stage-name">{stage.name}</div>
              <div className="stage-description">{stage.description}</div>

              {isActive && (
                <div className="stage-progress-bar">
                  <div
                    className="stage-progress-fill"
                    style={{
                      animationDuration: `${stage.duration}ms`,
                    }}
                  />
                </div>
              )}

              {isCompleted && <div style={{ height: '4px', background: 'var(--green)' }} />}

              <div className="stage-metrics">
                <div className="stage-duration">⏱ {stage.duration}ms</div>
                {stage.gasUsed > 0 && (
                  <div className="stage-gas">⛽ {formatGas(stage.gasUsed)} gas</div>
                )}
                <div style={{ color: 'var(--text-3)' }}>
                  {isActive ? '◆ Executing' : isCompleted ? '◆ Completed' : '◆ Pending'}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* EXECUTION SUMMARY */}
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
            Total Duration
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--cyan)' }}>
            {totalDuration}ms
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
            Total Gas
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--amber)' }}>
            {formatGas(totalGas)} gas
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
            Cost (L2)
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--green)' }}>
            ${(totalGas * 0.0000008).toFixed(4)}
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
            Batch Size
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--blue)' }}>
            {batch.operationCount} ops
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
            Cost/Op
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--purple)' }}>
            ${(batch.totalCost / batch.operationCount).toFixed(6)}
          </div>
        </div>

        {batch.settlementHash && (
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
              Settlement
            </div>
            <div
              style={{
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--green)',
                wordBreak: 'break-all',
                lineHeight: 1.3,
              }}
            >
              {batch.settlementHash.slice(0, 20)}...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartContractExecutor;