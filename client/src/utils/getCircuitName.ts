import type { CircuitType } from "./types";

export default function getCircuitName(circuit: CircuitType | null) {
  return circuit ? `${circuit.name}, ${circuit.country}` : ""
}