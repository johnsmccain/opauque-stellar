/**
 * Soroban contract IDs.
 *
 * Production builds must provide network-specific VITE_<NETWORK>_* contract IDs.
 * Non-production builds may use legacy unprefixed VITE_* names while local
 * deployment scripts catch up, but there is no placeholder fallback.
 */

import { getNetwork, type StellarNetwork } from "../lib/chain";

type ContractKey =
  | "stealthRegistry"
  | "stealthAnnouncer"
  | "groth16Verifier"
  | "reputationVerifier"
  | "schemaRegistry"
  | "attestationEngineV2";

const REQUIRED_CONTRACTS: Record<ContractKey, { envSuffix: string; label: string }> = {
  stealthRegistry: {
    envSuffix: "STEALTH_REGISTRY_CONTRACT",
    label: "stealthRegistry",
  },
  stealthAnnouncer: {
    envSuffix: "STEALTH_ANNOUNCER_CONTRACT",
    label: "stealthAnnouncer",
  },
  groth16Verifier: {
    envSuffix: "GROTH16_VERIFIER_CONTRACT",
    label: "groth16Verifier",
  },
  reputationVerifier: {
    envSuffix: "REPUTATION_VERIFIER_CONTRACT",
    label: "reputationVerifier",
  },
  schemaRegistry: {
    envSuffix: "SCHEMA_REGISTRY_CONTRACT",
    label: "schemaRegistry",
  },
  attestationEngineV2: {
    envSuffix: "ATTESTATION_ENGINE_CONTRACT",
    label: "attestationEngineV2",
  },
};

function networkEnvPrefix(network: StellarNetwork): string {
  return network.toUpperCase();
}

function envValue(key: string): string | undefined {
  const value = (import.meta.env[key] as string | undefined)?.trim();
  return value && value.length > 0 ? value : undefined;
}

function contractId(network: StellarNetwork, key: ContractKey): string {
  const { envSuffix } = REQUIRED_CONTRACTS[key];
  const networkKey = `VITE_${networkEnvPrefix(network)}_${envSuffix}`;
  const networkValue = envValue(networkKey);
  if (networkValue) return networkValue;

  if (!import.meta.env.PROD) {
    return envValue(`VITE_${envSuffix}`) ?? "";
  }

  return "";
}

function assertProductionAddresses(
  network: StellarNetwork,
  addresses: Record<ContractKey, string>,
): void {
  if (!import.meta.env.PROD) return;

  const missing = (Object.keys(REQUIRED_CONTRACTS) as ContractKey[]).filter(
    (key) => addresses[key].length === 0,
  );
  if (missing.length > 0) {
    const expected = missing.map(
      (key) => `VITE_${networkEnvPrefix(network)}_${REQUIRED_CONTRACTS[key].envSuffix}`,
    );
    throw new Error(
      `[Opaque] Missing ${network} contract IDs for production build: ${expected.join(", ")}`,
    );
  }

  const seen = new Map<string, ContractKey>();
  const duplicates = new Set<string>();
  for (const key of Object.keys(REQUIRED_CONTRACTS) as ContractKey[]) {
    const id = addresses[key];
    const firstKey = seen.get(id);
    if (firstKey !== undefined) {
      duplicates.add(`${firstKey}/${key}: ${id}`);
    } else {
      seen.set(id, key);
    }
  }

  if (duplicates.size > 0) {
    throw new Error(
      `[Opaque] Duplicate ${network} contract IDs in production build: ${Array.from(duplicates).join(", ")}`,
    );
  }
}

/** Placeholder; deploy contracts and set VITE_STEALTH_REGISTRY_CONTRACT etc. */
export const PLACEHOLDER_CONTRACT_ID =
  "CDIYLW3OMCUHP37AMDZFMIB3GCY66MFICSCU3WYMB66L6XQM5CKQQO3S";

export const CONTRACT_ENV_KEYS = [
  "VITE_STEALTH_REGISTRY_CONTRACT",
  "VITE_STEALTH_ANNOUNCER_CONTRACT",
  "VITE_GROTH16_VERIFIER_CONTRACT",
  "VITE_REPUTATION_VERIFIER_CONTRACT",
  "VITE_SCHEMA_REGISTRY_CONTRACT",
  "VITE_ATTESTATION_ENGINE_CONTRACT",
] as const;

export const deployedAddresses = {
  network: "testnet" as const,
  stealthRegistry: contractId(
    "VITE_STEALTH_REGISTRY_CONTRACT",
    PLACEHOLDER_CONTRACT_ID,
  ),
  stealthAnnouncer: contractId(
    "VITE_STEALTH_ANNOUNCER_CONTRACT",
    PLACEHOLDER_CONTRACT_ID,
  ),
  groth16Verifier: contractId(
    "VITE_GROTH16_VERIFIER_CONTRACT",
    PLACEHOLDER_CONTRACT_ID,
  ),
  reputationVerifier: contractId(
    "VITE_REPUTATION_VERIFIER_CONTRACT",
    PLACEHOLDER_CONTRACT_ID,
  ),
  schemaRegistry: contractId(
    "VITE_SCHEMA_REGISTRY_CONTRACT",
    PLACEHOLDER_CONTRACT_ID,
  ),
  attestationEngineV2: contractId(
    "VITE_ATTESTATION_ENGINE_CONTRACT",
    PLACEHOLDER_CONTRACT_ID,
  ),
} as const;

export type DeployedAddresses = typeof deployedAddresses;
