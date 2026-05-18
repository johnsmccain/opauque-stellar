/**
 * Stellar Soroban contract configuration per network.
 */

import type { StellarNetwork } from "../lib/chain";
import { deployedAddresses } from "./deployedAddresses";

export type ClusterProgramConfig = {
  registryContract: string;
  announcerContract: string;
  groth16Contract: string;
  reputationContract: string;
  schemaRegistryContract: string;
  attestationEngineContract: string;
  /** @deprecated legacy alias */
  registryProgram: string;
  /** @deprecated legacy alias */
  announcerProgram: string;
  /** @deprecated legacy alias */
  groth16Program: string;
  /** @deprecated legacy alias */
  reputationProgram: string;
};

function withAliases(
  c: Omit<ClusterProgramConfig, "registryProgram" | "announcerProgram" | "groth16Program" | "reputationProgram">,
): ClusterProgramConfig {
  return {
    ...c,
    registryProgram: c.registryContract,
    announcerProgram: c.announcerContract,
    groth16Program: c.groth16Contract,
    reputationProgram: c.reputationContract,
  };
}

const baseContracts = {
  registryContract: deployedAddresses.stealthRegistry,
  announcerContract: deployedAddresses.stealthAnnouncer,
  groth16Contract: deployedAddresses.groth16Verifier,
  reputationContract: deployedAddresses.reputationVerifier,
  schemaRegistryContract: deployedAddresses.schemaRegistry,
  attestationEngineContract: deployedAddresses.attestationEngineV2,
};

const STATIC_CONFIG: Partial<Record<StellarNetwork, ClusterProgramConfig>> = {
  testnet: withAliases(baseContracts),
  futurenet: withAliases(baseContracts),
  local: withAliases(baseContracts),
};

export const CLUSTER_CONFIG: Partial<Record<StellarNetwork, ClusterProgramConfig>> = {
  ...STATIC_CONFIG,
};

export function getConfigForCluster(
  network: StellarNetwork | null | undefined,
): ClusterProgramConfig | null {
  if (network == null) return null;
  return CLUSTER_CONFIG[network] ?? CLUSTER_CONFIG.testnet ?? null;
}

export const SUPPORTED_NETWORKS: readonly StellarNetwork[] = ["testnet", "futurenet", "local"];

export function isClusterSupported(network: StellarNetwork | null | undefined): boolean {
  return network != null && SUPPORTED_NETWORKS.includes(network);
}

/** @deprecated */
export const SUPPORTED_CLUSTERS = SUPPORTED_NETWORKS;
export const isNetworkSupported = isClusterSupported;
