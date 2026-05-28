/**
 * Soroban contract IDs — set via VITE_* env after deploy, or replace defaults.
 */

function contractId(envKey: string, fallback: string): string {
  const v = (import.meta.env[envKey] as string | undefined)?.trim();
  return v && v.length > 0 ? v : fallback;
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
