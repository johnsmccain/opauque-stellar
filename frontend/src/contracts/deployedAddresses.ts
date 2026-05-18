/**
 * Soroban contract IDs — set via VITE_* env after deploy, or replace defaults.
 */

function contractId(envKey: string, fallback: string): string {
  const v = (import.meta.env[envKey] as string | undefined)?.trim();
  return v && v.length > 0 ? v : fallback;
}

/** Placeholder; deploy contracts and set VITE_STEALTH_REGISTRY_CONTRACT etc. */
const PLACEHOLDER = "CDIYLW3OMCUHP37AMDZFMIB3GCY66MFICSCU3WYMB66L6XQM5CKQQO3S";

export const deployedAddresses = {
  network: "testnet" as const,
  stealthRegistry: contractId("VITE_STEALTH_REGISTRY_CONTRACT", PLACEHOLDER),
  stealthAnnouncer: contractId("VITE_STEALTH_ANNOUNCER_CONTRACT", PLACEHOLDER),
  groth16Verifier: contractId("VITE_GROTH16_VERIFIER_CONTRACT", PLACEHOLDER),
  reputationVerifier: contractId("VITE_REPUTATION_VERIFIER_CONTRACT", PLACEHOLDER),
  schemaRegistry: contractId("VITE_SCHEMA_REGISTRY_CONTRACT", PLACEHOLDER),
  attestationEngineV2: contractId("VITE_ATTESTATION_ENGINE_CONTRACT", PLACEHOLDER),
} as const;

export type DeployedAddresses = typeof deployedAddresses;
