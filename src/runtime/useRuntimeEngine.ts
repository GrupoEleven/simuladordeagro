import { useState, useCallback, useEffect } from 'react';
import {
  Operation,
  Batch,
  SimulationState,
  RuntimeMetrics,
  TokenStandard,
  ScalingScenario,
  UnitEconomics,
  BatchConfig,
  ExecutionStage,
  GasPriceData,
} from '../types';

// ============================================================================
// TOKEN STANDARDS DATABASE
// ============================================================================

const TOKEN_STANDARDS: Record<string, TokenStandard> = {
  erc20: {
    id: 'erc20',
    name: 'ERC-20',
    erc: 'ERC-20',
    description: 'Token fungível padrão. Ideal para governança, stablecoins e ativos intercambiáveis.',
    deployGas: 1500000,
    mintGas: 65000,
    transferGas: 45000,
    burnGas: 35000,
    advantages: ['Padrão consolidado', 'Baixo gas', 'Ecosystem robusto'],
    bestFor: 'Governança, moeda',
    complexity: 'simple',
  },
  erc721: {
    id: 'erc721',
    name: 'ERC-721',
    erc: 'ERC-721',
    description: 'NFT único. Ideal para ativos digitais únicos, certificados e propriedade digital.',
    deployGas: 2500000,
    mintGas: 150000,
    transferGas: 85000,
    burnGas: 55000,
    advantages: ['Unicidade garantida', 'Propriedade clara', 'Traceability'],
    bestFor: 'Ativo único, NFT',
    complexity: 'moderate',
  },
  erc1155: {
    id: 'erc1155',
    name: 'ERC-1155',
    erc: 'ERC-1155',
    description: 'Multi-token. Ideal para RWA, ativos fracionados e coleções de ativos reais. Melhor custo-benefício.',
    deployGas: 2800000,
    mintGas: 95000,
    transferGas: 50000,
    burnGas: 45000,
    advantages: ['Batch operations', 'Custo ótimo', 'Flexível'],
    bestFor: 'RWA, fracionado',
    complexity: 'moderate',
  },
  erc777: {
    id: 'erc777',
    name: 'ERC-777',
    erc: 'ERC-777',
    description: 'Token fungível com hooks. Ideal para DeFi avançado e callbacks em transferências.',
    deployGas: 2200000,
    mintGas: 85000,
    transferGas: 75000,
    burnGas: 45000,
    advantages: ['Callbacks integrados', 'Operador suporte', 'Avançado'],
    bestFor: 'DeFi, automação',
    complexity: 'complex',
  },
  erc4626: {
    id: 'erc4626',
    name: 'ERC-4626',
    erc: 'ERC-4626',
    description: 'Tokenized Vault. Ideal para pools de investimento, yield farming e vaults tokenizados.',
    deployGas: 3200000,
    mintGas: 110000,
    transferGas: 50000,
    burnGas: 65000,
    advantages: ['Yield integrado', 'Composable', 'Standard moderno'],
    bestFor: 'Vault, yield',
    complexity: 'complex',
  },
  erc3643: {
    id: 'erc3643',
    name: 'ERC-3643 (T-REX)',
    erc: 'ERC-3643',
    description: 'Security Token com KYC/AML on-chain. Ideal para ativos regulados e tokens permissionados.',
    deployGas: 5000000,
    mintGas: 180000,
    transferGas: 120000,
    burnGas: 75000,
    advantages: ['Compliance on-chain', 'KYC integrado', 'Regulado'],
    bestFor: 'Security token, KYC',
    complexity: 'complex',
  },
};

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

export function useRuntimeEngine() {
  const [state, setState] = useState<SimulationState>({
    operations: [],
    batches: [],
    currentBatch: null,
    metrics: {
      totalOperations: 0,
      totalBatches: 0,
      avgBatchSize: 0,
      totalGasCost: 0,
      costPerOperation: 0,
      executionThroughput: 0,
      systemHealth: 100,
      networkPressure: 0,
    },
    config: {
      triggerByCount: 10,
      triggerByVolume: 10000,
      triggerByTime: 30000,
      triggerByGasPrice: 50,
    },
    selectedTokenStandard: TOKEN_STANDARDS.erc1155,
    scalingUsers: 10,
    time: 0,
    isPaused: false,
  });

  const [gasPrices, setGasPrices] = useState<GasPriceData>({
    ethereum: { standard: 35, fast: 50, instant: 80 },
    arbitrum: { standard: 0.1 },
    updateTime: Date.now(),
  });

  // =========================================================================
  // OPERAÇÕES
  // =========================================================================

  const generateOperation = useCallback((type: Operation['type']): Operation => {
    return {
      id: `op-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      userId: `user-${Math.floor(Math.random() * 10000)}`,
      amount: Math.floor(Math.random() * 100000) + 1000,
      timestamp: Date.now(),
      status: 'pending',
      gasEstimate: Math.floor(Math.random() * 200000) + 21000,
      priority: ['low', 'normal', 'high'][Math.floor(Math.random() * 3)] as any,
    };
  }, []);

  const addOperation = useCallback((operation: Operation) => {
    setState(prev => {
      const newOps = [...prev.operations, operation];
      const newState = { ...prev, operations: newOps };

      // Verificar se deve criar batch
      const shouldBatch =
        newOps.length >= prev.config.triggerByCount ||
        newOps.reduce((sum, op) => sum + op.amount, 0) >= prev.config.triggerByVolume;

      if (shouldBatch && !prev.currentBatch) {
        return createBatch(newState);
      }

      return newState;
    });
  }, []);

  const simulateOperationStream = useCallback((duration: number, opsPerSecond: number) => {
    const operationTypes: Operation['type'][] = ['buy', 'tokenize', 'stake', 'sell', 'mint_cert', 'claim', 'swap'];
    let generated = 0;

    const interval = setInterval(() => {
      for (let i = 0; i < opsPerSecond; i++) {
        const type = operationTypes[Math.floor(Math.random() * operationTypes.length)];
        const op = generateOperation(type);
        addOperation(op);
        generated++;
      }

      if (generated >= opsPerSecond * (duration / 1000)) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [generateOperation, addOperation]);

  // =========================================================================
  // BATCHING
  // =========================================================================

  const createBatch = useCallback((prevState: SimulationState): SimulationState => {
    if (prevState.operations.length === 0) return prevState;

    const batchOps = prevState.operations;
    const totalGas = batchOps.reduce((sum, op) => sum + op.gasEstimate, 0);
    const costPerGas = prevState.selectedTokenStandard.id === 'erc3643' ? 0.000018 : 0.0000008;
    const totalCost = totalGas * costPerGas;

    const batch: Batch = {
      id: `batch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      operationCount: batchOps.length,
      totalGas,
      totalCost,
      executionTime: Math.random() * 5000 + 2000,
      operations: batchOps,
      status: 'building',
      createdAt: Date.now(),
    };

    const updatedOps = batchOps.map(op => ({ ...op, status: 'queued' as const }));

    return {
      ...prevState,
      operations: [],
      currentBatch: batch,
      batches: [...prevState.batches, batch],
    };
  }, []);

  const executeBatch = useCallback((batchId: string) => {
    setState(prev => {
      const batchToExecute = prev.currentBatch || prev.batches.find(b => b.id === batchId);
      if (!batchToExecute) return prev;

      const executedBatch = {
        ...batchToExecute,
        status: 'settled' as const,
        executedAt: Date.now(),
        settlementHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      };

      const updatedBatches = prev.batches.map(b => (b.id === batchId ? executedBatch : b));

      const newMetrics = calculateMetrics(updatedBatches);

      return {
        ...prev,
        currentBatch: null,
        batches: updatedBatches,
        metrics: newMetrics,
      };
    });
  }, []);

  const updateBatchConfig = useCallback((config: Partial<BatchConfig>) => {
    setState(prev => ({
      ...prev,
      config: { ...prev.config, ...config },
    }));
  }, []);

  // =========================================================================
  // SCALING
  // =========================================================================

  const getScalingScenario = useCallback((users: number): ScalingScenario => {
    const operationsPerCycle = users * 5;
    const avgGasPerOp = state.selectedTokenStandard.transferGas || 50000;
    const totalGas = operationsPerCycle * avgGasPerOp;

    const costWithoutBatching = totalGas * 0.000018; // L1 cost
    const costWithBatching = totalGas * 0.0000008 * 0.32; // L2 batched cost

    const batchCount = Math.ceil(operationsPerCycle / state.config.triggerByCount);
    const executionTime = batchCount * 3000;

    const networkPressure = Math.min(100, (users / 50000) * 100);

    return {
      users,
      operationsPerCycle,
      estimatedGas: totalGas,
      estimatedCost: costWithBatching,
      executionTime,
      batchCount,
      pressureLevel: networkPressure,
      margins: {
        without_batching: costWithoutBatching > 0 ? ((1000 - costWithoutBatching) / 1000) * 100 : 0,
        with_batching: costWithBatching > 0 ? ((1000 - costWithBatching) / 1000) * 100 : 0,
        savings: ((costWithoutBatching - costWithBatching) / costWithoutBatching) * 100,
      },
    };
  }, [state.selectedTokenStandard, state.config.triggerByCount]);

  const updateScaling = useCallback((users: number) => {
    setState(prev => ({
      ...prev,
      scalingUsers: users,
      metrics: {
        ...prev.metrics,
        networkPressure: Math.min(100, (users / 50000) * 100),
      },
    }));
  }, []);

  // =========================================================================
  // UNIT ECONOMICS
  // =========================================================================

  const calculateUnitEconomics = useCallback((): UnitEconomics => {
    const revenuePerCycle = 2500;
    const costPerCycle = state.metrics.totalGasCost;
    const profitPerCycle = revenuePerCycle - costPerCycle;

    const totalOps = state.metrics.totalOperations || 1;
    const totalUsers = state.scalingUsers || 10;

    return {
      costPerUser: totalUsers > 0 ? costPerCycle / totalUsers : 0,
      costPerTransaction: totalOps > 0 ? costPerCycle / totalOps : 0,
      costPerBatch: state.metrics.totalBatches > 0 ? costPerCycle / state.metrics.totalBatches : 0,
      platformMargin: revenuePerCycle > 0 ? (profitPerCycle / revenuePerCycle) * 100 : 0,
      breakEvenPoint: costPerCycle > 0 ? costPerCycle : 0,
      profitabilityAtScale: {
        users_100: calculateProfitAtScale(100),
        users_1000: calculateProfitAtScale(1000),
        users_10000: calculateProfitAtScale(10000),
        users_50000: calculateProfitAtScale(50000),
      },
    };
  }, [state.metrics, state.scalingUsers]);

  const calculateProfitAtScale = (users: number): number => {
    const scenario = getScalingScenario(users);
    const revenue = users * 50; // $50 por usuário em taxa de gestão
    const cost = scenario.estimatedCost;
    return revenue > 0 ? ((revenue - cost) / revenue) * 100 : 0;
  };

  // =========================================================================
  // EXECUTION STAGES
  // =========================================================================

  const simulateExecution = useCallback((batch: Batch): ExecutionStage[] => {
    const stages: ExecutionStage[] = [
      {
        id: 1,
        name: 'receiveOperations',
        description: 'Receber e validar operações',
        duration: 500,
        status: 'completed',
        gasUsed: 0,
        timestamp: Date.now(),
      },
      {
        id: 2,
        name: 'validate',
        description: 'Validar integridade e permissões',
        duration: 1000,
        status: 'completed',
        gasUsed: 25000,
        timestamp: Date.now() + 500,
      },
      {
        id: 3,
        name: 'groupByType',
        description: 'Agrupar operações por tipo',
        duration: 300,
        status: 'active',
        gasUsed: 0,
        timestamp: Date.now() + 1500,
      },
      {
        id: 4,
        name: 'executeBatch',
        description: 'Executar batch no smart contract',
        duration: 2000,
        status: 'pending',
        gasUsed: batch.totalGas * 0.8,
        timestamp: Date.now() + 1800,
      },
      {
        id: 5,
        name: 'updateState',
        description: 'Atualizar estado do protocolo',
        duration: 800,
        status: 'pending',
        gasUsed: 45000,
        timestamp: Date.now() + 3800,
      },
      {
        id: 6,
        name: 'emitEvents',
        description: 'Emitir eventos blockchain',
        duration: 400,
        status: 'pending',
        gasUsed: 10000,
        timestamp: Date.now() + 4600,
      },
      {
        id: 7,
        name: 'settleOnChain',
        description: 'Settlement final em L1',
        duration: 3000,
        status: 'pending',
        gasUsed: 50000,
        timestamp: Date.now() + 5000,
      },
    ];

    return stages;
  }, []);

  // =========================================================================
  // TOKEN STANDARD SELECTION
  // =========================================================================

  const setTokenStandard = useCallback((standardId: string) => {
    const standard = TOKEN_STANDARDS[standardId];
    if (standard) {
      setState(prev => ({
        ...prev,
        selectedTokenStandard: standard,
      }));
    }
  }, []);

  const getTokenStandards = useCallback(() => {
    return Object.values(TOKEN_STANDARDS);
  }, []);

  // =========================================================================
  // METRICAS
  // =========================================================================

  const calculateMetrics = (batches: Batch[]): RuntimeMetrics => {
    const completedBatches = batches.filter(b => b.status === 'settled');
    const totalOps = completedBatches.reduce((sum, b) => sum + b.operationCount, 0);
    const totalGas = completedBatches.reduce((sum, b) => sum + b.totalGas, 0);
    const totalCost = completedBatches.reduce((sum, b) => sum + b.totalCost, 0);

    const avgBatchSize = completedBatches.length > 0 ? totalOps / completedBatches.length : 0;
    const costPerOp = totalOps > 0 ? totalCost / totalOps : 0;

    // Simulação de throughput (ops/segundo)
    const executionThroughput = completedBatches.length > 0
      ? totalOps / (completedBatches.reduce((sum, b) => sum + (b.executionTime || 3000), 0) / 1000)
      : 0;

    // Health do sistema (0-100)
    const systemHealth = Math.max(0, 100 - (totalCost / 5000) * 10); // Degrada com custo alto

    return {
      totalOperations: totalOps,
      totalBatches: completedBatches.length,
      avgBatchSize,
      totalGasCost: totalCost,
      costPerOperation: costPerOp,
      executionThroughput,
      systemHealth: Math.max(0, Math.min(100, systemHealth)),
      networkPressure: Math.min(100, (totalOps / 1000) * 10),
    };
  };

  const updateMetrics = useCallback(() => {
    setState(prev => ({
      ...prev,
      metrics: calculateMetrics(prev.batches),
    }));
  }, []);

  // =========================================================================
  // SIMULAÇÃO DE GAS
  // =========================================================================

  const updateGasPrices = useCallback((newPrices: Partial<GasPriceData>) => {
    setGasPrices(prev => ({
      ...prev,
      ...newPrices,
      updateTime: Date.now(),
    }));
  }, []);

  const simulateGasFluctuation = useCallback(() => {
    const interval = setInterval(() => {
      setGasPrices(prev => ({
        ethereum: {
          standard: prev.ethereum.standard * (0.95 + Math.random() * 0.1),
          fast: prev.ethereum.fast * (0.95 + Math.random() * 0.1),
          instant: prev.ethereum.instant * (0.95 + Math.random() * 0.1),
        },
        arbitrum: {
          standard: prev.arbitrum.standard * (0.95 + Math.random() * 0.1),
        },
        updateTime: Date.now(),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // =========================================================================
  // CONTROLE GERAL
  // =========================================================================

  const reset = useCallback(() => {
    setState({
      operations: [],
      batches: [],
      currentBatch: null,
      metrics: {
        totalOperations: 0,
        totalBatches: 0,
        avgBatchSize: 0,
        totalGasCost: 0,
        costPerOperation: 0,
        executionThroughput: 0,
        systemHealth: 100,
        networkPressure: 0,
      },
      config: {
        triggerByCount: 10,
        triggerByVolume: 10000,
        triggerByTime: 30000,
        triggerByGasPrice: 50,
      },
      selectedTokenStandard: TOKEN_STANDARDS.erc1155,
      scalingUsers: 10,
      time: 0,
      isPaused: false,
    });
  }, []);

  return {
    // Estado
    state,
    gasPrices,

    // Operações
    generateOperation,
    addOperation,
    simulateOperationStream,

    // Batching
    createBatch,
    executeBatch,
    updateBatchConfig,

    // Scaling
    getScalingScenario,
    updateScaling,

    // Unit Economics
    calculateUnitEconomics,

    // Execution
    simulateExecution,

    // Token Standards
    setTokenStandard,
    getTokenStandards,

    // Métricas
    updateMetrics,
    calculateMetrics,

    // Gas
    updateGasPrices,
    simulateGasFluctuation,

    // Controle
    reset,
  };
}