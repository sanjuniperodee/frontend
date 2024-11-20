import {useEffect, useState} from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useMarkers } from '../../hooks/useMarkers';
import { MAP_CONFIG } from '../../utils/constants';
import MarkerForm from './MarkerForm';
import MarkerPopup from './MarkerPopup';
import MapFilters from './MapFilters';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';

function MapEvents({ onMapClick }: { onMapClick: (e: L.LeafletMouseEvent) => void }) {
    const map = useMap();

    useEffect(() => {
        map.on('click', onMapClick);
        return () => {
            map.off('click', onMapClick);
        };
    }, [map, onMapClick]);

    return null;
}

export default function MapComponent() {
  const { user } = useAuthStore();
  const { markers, createMarker } = useMarkers();
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [newMarkerPosition, setNewMarkerPosition] = useState<[number, number] | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (isAddingMarker && user) {
      setNewMarkerPosition([e.latlng.lat, e.latlng.lng]);
    }
  };


  const handleMarkerCreate = async (data: { name: string; description: string; category: string }) => {
    if (!newMarkerPosition || !user) return;

    try {
      await createMarker.mutateAsync({
        ...data,
        latitude: newMarkerPosition[0],
        longitude: newMarkerPosition[1],
        userId: user.id,
      });

      setNewMarkerPosition(null);
      setIsAddingMarker(false);
    } catch (error) {
      toast.error('Ошибка при создании метки');
      console.error('Error creating marker:', error);
    }
  };

  return (
      <div className="map-wrapper">
          <MapContainer
              center={MAP_CONFIG.DEFAULT_CENTER}
              zoom={MAP_CONFIG.DEFAULT_ZOOM}
              minZoom={MAP_CONFIG.MIN_ZOOM}
              maxZoom={MAP_CONFIG.MAX_ZOOM}
              scrollWheelZoom={true}
              className="map-container"
              whenCreated={(mapInstance) => {
                  mapInstance.on('click', handleMapClick);
              }}
          >
          <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
              <MapEvents onMapClick={handleMapClick} />

          {/* Marker Clustering */}
          <MarkerClusterGroup>
            {markers.map((marker) => (
                <Marker
                    key={marker.id}
                    position={[marker.latitude, marker.longitude]}
                    eventHandlers={{
                      click: () => setSelectedMarker(marker),
                    }}
                />
            ))}
          </MarkerClusterGroup>
        </MapContainer>

        {user && (
            <button
                onClick={() => setIsAddingMarker(!isAddingMarker)}
                className={`fixed bottom-8 right-8 z-[1000] flex items-center px-4 py-2 rounded-lg shadow-lg transition-all duration-200 ${
                    isAddingMarker
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
            >
              <Plus className="h-5 w-5 mr-2" />
              {isAddingMarker ? 'Кликните на карту' : 'Добавить метку'}
            </button>
        )}

        <div className="fixed top-20 right-4 z-[1000]">
          <MapFilters />
        </div>

        {newMarkerPosition && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000] p-4">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                <MarkerForm
                    position={newMarkerPosition}
                    onSubmit={handleMarkerCreate}
                    onCancel={() => {
                      setNewMarkerPosition(null);
                      setIsAddingMarker(false);
                    }}
                />
              </div>
            </div>
        )}

        {selectedMarker && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000] p-4">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                <MarkerPopup
                    marker={selectedMarker}
                    onClose={() => setSelectedMarker(null)}
                />
              </div>
            </div>
        )}
      </div>
  );
}
