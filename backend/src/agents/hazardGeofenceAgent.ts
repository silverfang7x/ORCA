// Owned by Kunal - see CONTEXT.md
// TEMPORARY STUB IMPLEMENTATION - Will be overwritten when Kunal's real agent PR is merged.

import { AgentState } from '@orca/shared';

export async function hazardGeofenceAgent(state: AgentState): Promise<Partial<AgentState>> {
  return {
    hazardData: {
      hazardAlerts: [],
      isInRestrictedZone: false,
      nearestBoundaryName: null,
      source: "STUB DATA - Kunal's real agent not yet merged"
    }
  };
}
