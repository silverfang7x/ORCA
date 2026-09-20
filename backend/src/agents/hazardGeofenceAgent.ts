import fs from 'fs';
import path from 'path';
import * as turf from '@turf/turf';
import { AgentState } from '@orca/shared';
import { LocationQuery, HazardGeofenceData } from '../types';

/**
 * Calculates Haversine distance in kilometers between two lat/lng coordinates.
 */
function calculateHaversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Helper to resolve data files across backend and root working directories safely.
 */
function getDataFilePath(filename: string): string | null {
  const candidatePaths = [
    path.resolve(process.cwd(), 'data', filename),
    path.resolve(process.cwd(), '..', 'data', filename),
    path.resolve(__dirname, '..', '..', '..', 'data', filename),
    path.resolve(__dirname, '..', '..', 'data', filename),
  ];

  for (const candidate of candidatePaths) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

/**
 * Core function to evaluate hazard alerts and geofence boundary checks for a location query.
 */
export async function getHazardGeofenceData(query: LocationQuery): Promise<HazardGeofenceData> {
  const defaultResult: HazardGeofenceData = {
    hazardAlerts: [],
    isInRestrictedZone: false,
    nearestBoundaryName: null,
    source: 'Mock hazard dataset + Turf.js geofencing',
  };

  if (!query || typeof query.latitude !== 'number' || typeof query.longitude !== 'number') {
    return defaultResult;
  }

  const matchedAlerts: { type: string; severity: string; description: string }[] = [];
  let isInRestrictedZone = false;
  let nearestBoundaryName: string | null = null;

  try {
    // 1. Load and evaluate hazard alerts (data/hazardAlerts.json)
    const hazardFilePath = getDataFilePath('hazardAlerts.json');
    if (hazardFilePath) {
      const rawData = fs.readFileSync(hazardFilePath, 'utf-8');
      const alertsList = JSON.parse(rawData);

      if (Array.isArray(alertsList)) {
        for (const alert of alertsList) {
          const alertLat = alert.latitude ?? alert.lat;
          const alertLng = alert.longitude ?? alert.lng;
          const radiusKm = alert.radiusKm ?? alert.radius ?? 50;

          if (typeof alertLat === 'number' && typeof alertLng === 'number') {
            const distance = calculateHaversineDistanceKm(query.latitude, query.longitude, alertLat, alertLng);

            if (distance <= radiusKm) {
              const descriptionText =
                alert.description || `${alert.type || 'Hazard Alert'} issued for ${alert.region || 'coastal region'}`;

              matchedAlerts.push({
                type: alert.type || 'Hazard Warning',
                severity: alert.severity || 'Medium',
                description: descriptionText,
              });
            }
          }
        }
      }
    }

    // 2. Load and evaluate maritime boundary polygons (data/maritimeBoundaries.geojson)
    const geojsonFilePath = getDataFilePath('maritimeBoundaries.geojson');
    if (geojsonFilePath) {
      const rawGeojson = fs.readFileSync(geojsonFilePath, 'utf-8');
      const featureCollection = JSON.parse(rawGeojson);

      if (featureCollection && Array.isArray(featureCollection.features)) {
        // Turf point coordinates are [longitude, latitude]
        const userPoint = turf.point([query.longitude, query.latitude]);

        for (const feature of featureCollection.features) {
          if (feature.geometry && (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon')) {
            const isInside = turf.booleanPointInPolygon(userPoint, feature);

            if (isInside) {
              isInRestrictedZone = true;
              nearestBoundaryName = feature.properties?.name || feature.properties?.title || 'Restricted Maritime Zone';
              break; // Stop at first containing restricted zone
            }
          }
        }
      }
    }

    return {
      hazardAlerts: matchedAlerts,
      isInRestrictedZone,
      nearestBoundaryName,
      source: 'Mock hazard dataset + Turf.js geofencing',
    };
  } catch (error) {
    console.error('[hazardGeofenceAgent] Safe fallback triggered due to error:', error);
    return defaultResult;
  }
}

import { extractLocationAndDateFromQuery } from './weatherOceanAgent';

/**
 * LangGraph Agent node wrapper.
 */
export async function hazardGeofenceAgent(state: AgentState): Promise<Partial<AgentState>> {
  const queryText = state.translatedQuery || state.userQuery || '';
  const queryLocation = extractLocationAndDateFromQuery(queryText, state.location);

  const hazardStart = Date.now();
  const hazardData = await getHazardGeofenceData(queryLocation);
  console.error(`[PERF TIMING] Hazard Geofence evaluation for ${queryLocation.locationName || 'location'}: ${Date.now() - hazardStart}ms`);
  return { hazardData };
}
