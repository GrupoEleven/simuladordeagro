// ============================================================================
// RUNTIME ENGINE TYPES
// ============================================================================

export interface Operation {
  id: string;
  type: 'buy' | 'tokenize' | 'stake' | 'sell' | 'mint_cert' | 'claim' | 'swap';
  userId: string;
  amount: number;
  timestamp: number;
  status: 'pending' | 'queued' | 'executing' | 'settled' | 'failed';
  gasEstimate: number;
  priority: 'low' | 'normal' | 'high';
}

export interface ExecutionStage {
  id: number;
  name: string;
  description: string;
  duration: number;
  status: 'pending' | 'active' | 'completed' | 'failed';
  gasUsed: number;
  timestamp: number;
}

export interface Batch {
  id: string;
  operationCount: number;
  totalGas: number;
  totalCost: number;
  executionTime: number;
  operations: Operation[];
  status: 'building' | 'ready' | 'executing' | 'settled' | 'failed';
  createdAt: number;
  executedAt?: number;
  settlementHash?: string;
}

export interface BatchConfig {
  triggerByCount: number;
  triggerByVolume: number;
  triggerByTime: number;
  triggerByGasPrice: number;
}

export interface TokenStandard {
  id: string;
  name: string;
  erc: string;
  description: string;
  deployGas: number;
  mintGas: number;
  transferGas: number;
  burnGas: number;
  advantages: string[];
  bestFor: string;
  complexity: 'simple' | 'moderate' | 'complex';
}

export interface RuntimeMetrics {
  totalOperations: number;
  totalBatches: number;
  avgBatchSize: number;
  totalGasCost: number;
  costPerOperation: number;
  executionThroughput: number;
  systemHealth: number;
  networkPressure: number;
}

export interface ScalingScenario {
  users: number;
  operationsPerCycle: number;
  estimatedGas: number;
  estimatedCost: number;
  executionTime: number;
  batchCount: number;
  pressureLevel: number;
  margins: {
    without_batching: number;
    with_batching: number;
    savings: number;
  };
}

export interface UnitEconomics {
  costPerUser: number;
  costPerTransaction: number;
  costPerBatch: number;
  platformMargin: number;
  breakEvenPoint: number;
  profitabilityAtScale: {
    users_100: number;
    users_1000: number;
    users_10000: number;
    users_50000: number;
  };
}

export interface SimulationState {
  operations: Operation[];
  batches: Batch[];
  currentBatch: Batch | null;
  metrics: RuntimeMetrics;
  config: BatchConfig;
  selectedTokenStandard: TokenStandard;
  scalingUsers: number;
  time: number;
  isPaused: boolean;
}

export interface ExecutionFlow {
  stages: ExecutionStage[];
  totalGas: number;
  totalTime: number;
  validationSuccess: boolean;
  eventEmissions: string[];
}

export interface GasPriceData {
  ethereum: {
    standard: number;
    fast: number;
    instant: number;
  };
  arbitrum: {
    standard: number;
  };
  updateTime: number;
}

export interface Transaction {
  id: string;
  type: string;
  gas: number;
  cost: number;
  layer: 'L1' | 'L2';
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
}

export interface ArchitectureNode {
  id: string;
  label: string;
  layer: number;
  type: 'contract' | 'data' | 'settlement' | 'oracle' | 'user';
  connections: string[];
}

// ============================================================================
// DASHBOARD TYPES
// ============================================================================

export interface ScoreMetrics {
  cost: number;
  risk: number;
  scale: number;
  liquidity: number;
}

export interface RiskProfile {
  oracle: number;
  bridge: number;
  smartContract: number;
  physical: number;
  regulatory: number;
}

export interface ScenarioReturn {
  conservative: number;
  realistic: number;
  aggressive: number;
}

// ============================================================================
// SIMULATOR TYPES
// ============================================================================

export interface SimulatorConfig {
  assets: number;
  investorsPerAsset: number;
  interactionsPerCycle: number;
  tokenType: 'erc20' | 'erc721' | 'erc1155' | 'erc777' | 'erc4626' | 'erc3643';
  contractType: 'simple' | 'upgradeable' | 'diamond' | 'dao';
  batchingEnabled: boolean;
  bridgeEnabled: boolean;
  strategy: 'l2' | 'hybrid' | 'l1';
  managementFee: number;
  transactionFee: number;
}

export interface CostBreakdown {
  operation: string;
  layer: 'L1' | 'L2' | 'Bridge';
  unitCost: number;
  quantity: number;
  totalCost: number;
}

export interface PlatformMetrics {
  totalOperations: number;
  costPerOperation: number;
  revenuePerCycle: number;
  totalCostPerCycle: number;
  breakEvenOperations?: number;
  profitMargin: number;
  cumulativeProfitYear: number;
}