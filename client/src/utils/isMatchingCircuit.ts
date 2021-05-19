import type { CircuitType } from "./types";

/**
 * Given a circuit and a possible circuit id, return true if the circuit is null or the circuitId matches
 * @param circuit   the circuit filter
 * @param circuitId the circuit id (of the race result for example)
 * @returns         true if match, else false
 */
export default function isMatchingCircuit(
  circuit: CircuitType | null,
  circuitId?: string,
) {
  return circuit===null || circuitId === circuit.circuitId
}