import { Keypair, Networks, rpc } from "@stellar/stellar-sdk";
import { config } from "./config.js";

const NETWORK_PASSPHRASES: Record<string, string> = {
  "stellar:testnet": Networks.TESTNET,
  "stellar:pubnet": Networks.PUBLIC
};

export function getNetworkPassphrase() {
  return NETWORK_PASSPHRASES[config.STELLAR_NETWORK] ?? Networks.TESTNET;
}

export function getRpcServer() {
  return new rpc.Server(config.STELLAR_RPC_URL);
}

export function loadDemoKeypair() {
  if (!config.DEMO_CLIENT_SECRET_KEY) {
    return null;
  }

  try {
    return Keypair.fromSecret(config.DEMO_CLIENT_SECRET_KEY);
  } catch {
    return null;
  }
}
