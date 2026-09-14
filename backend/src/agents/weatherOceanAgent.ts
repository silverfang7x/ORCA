// Owned by Aditi - see CONTEXT.md
// TEMPORARY STUB IMPLEMENTATION - Will be overwritten when Aditi's real agent PR is merged.

import { AgentState } from '@orca/shared';

export async function weatherOceanAgent(state: AgentState): Promise<Partial<AgentState>> {
  return {
    weatherData: {
      waveHeightMeters: 1.2,
      seaSurfaceTempCelsius: 28.5,
      windSpeedKmh: 15,
      tideTimes: [
        { time: '06:00', type: 'high' },
        { time: '18:00', type: 'low' }
      ],
      source: "STUB DATA - Aditi's real agent not yet merged"
    }
  };
}
