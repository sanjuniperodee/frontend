import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import { useMap } from 'react-leaflet';
export default function MarkerCluster({ markers, onMarkerClick }) {
    const map = useMap();
    useEffect(() => {
        const markerClusterGroup = L.markerClusterGroup({
            chunkedLoading: true,
            maxClusterRadius: 50,
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: true,
        });
        markers.forEach((marker) => {
            const leafletMarker = L.marker([marker.latitude, marker.longitude])
                .on('click', () => onMarkerClick(marker));
            markerClusterGroup.addLayer(leafletMarker);
        });
        map.addLayer(markerClusterGroup);
        return () => {
            map.removeLayer(markerClusterGroup);
        };
    }, [map, markers, onMarkerClick]);
    return null;
}
