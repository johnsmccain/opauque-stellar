/**
 * Stellar Soroban contract configuration per network.
 */

import type { StellarNetwork } from "../lib/chain";
import {
  deployedAddresses,
  CONTRACT_ENV_KEYS,
  PLACEHOLDER_CONTRACT_ID,
} from "./deployedAddresses";

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

function getEnvValue(key: string): string {
  return (import.meta.env[key] as string | undefined)?.trim() ?? "";
}

function isValidContractId(value: string): boolean {
  return /^C[A-Z2-7]{55}$/.test(value);
}

function hasExplicitMainnetContracts(): boolean {
  return CONTRACT_ENV_KEYS.every((key) => {
    const value = getEnvValue(key);
    return (
      value.length > 0 &&
      value !== PLACEHOLDER_CONTRACT_ID &&
      isValidContractId(value)
    );
  });
}

function hasProductionMainnetRpc(): boolean {
  const rpcUrl = getEnvValue("VITE_STELLAR_RPC_URL");
  if (!rpcUrl) return false;

  try {
    const url = new URL(rpcUrl);
    const host = url.hostname.toLowerCase();
    if (url.protocol !== "https:") return false;
    if (host === "localhost" || host === "127.0.0.1" || host === "0.0.0.0") {
      return false;
    }
    if (host.includes("testnet") || host.includes("futurenet") || host.includes("local")) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function isMainnetConfigValid(): boolean {
  return hasExplicitMainnetContracts() && hasProductionMainnetRpc();
}

const STATIC_CONFIG: Partial<Record<StellarNetwork, ClusterProgramConfig>> = {
  testnet: withAliases(baseContracts),
  futurenet: withAliases(baseContracts),
  local: withAliases(baseContracts),
};

export const CLUSTER_CONFIG: Partial<Record<StellarNetwork, ClusterProgramConfig>> = {
  ...STATIC_CONFIG,
  ...(isMainnetConfigValid() ? { mainnet: withAliases(baseContracts) } : {}),
};

export function getConfigForCluster(
  network: StellarNetwork | null | undefined,
): ClusterProgramConfig | null {
  if (network == null) return null;
  return CLUSTER_CONFIG[network] ?? null;
}

export const SUPPORTED_NETWORKS: readonly StellarNetwork[] = [
  "testnet",
  "futurenet",
  "local",
  "mainnet",
];

export function isClusterSupported(network: StellarNetwork | null | undefined): boolean {
  if (network == null || !SUPPORTED_NETWORKS.includes(network)) return false;
  if (network === "mainnet") return isMainnetConfigValid();
  return true;
}

export function getNetworkSupportMessage(network: StellarNetwork | null | undefined): string {
  if (network === "mainnet") {
    return "Mainnet requires VITE_STELLAR_RPC_URL to point to a production HTTPS RPC endpoint and all VITE_*_CONTRACT values to be explicit mainnet contract IDs.";
  }
  return `Set VITE_STELLAR_NETWORK to one of: ${SUPPORTED_NETWORKS.join(", ")}.`;
}

/** @deprecated */
export const SUPPORTED_CLUSTERS = SUPPORTED_NETWORKS;
export const isNetworkSupported = isClusterSupported;
