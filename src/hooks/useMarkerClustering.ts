import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useMap } from 'react-leaflet';
import { Marker } from '../types';

export function useMarkerClustering(markers: Marker[], onMarkerClick: (marker: Marker) => void) {
  const map = useMap();
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);

  useEffect(() => {
    if (!map) return;

    // Remove existing cluster group if it exists
    if (clusterGroupRef.current) {
      map.removeLayer(clusterGroupRef.current);
    }

    // Create new cluster group
    const clusterGroup = L.markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
    });

    // Add markers to cluster group
    markers.forEach((marker) => {
      const leafletMarker = L.marker([marker.latitude, marker.longitude])
        .on('click', () => onMarkerClick(marker));
      clusterGroup.addLayer(leafletMarker);
    });

    // Add cluster group to map
    map.addLayer(clusterGroup);
    clusterGroupRef.current = clusterGroup;

    return () => {
      if (clusterGroupRef.current) {
        map.removeLayer(clusterGroupRef.current);
      }
    };
  }, [map, markers, onMarkerClick]);

  return clusterGroupRef.current;
}