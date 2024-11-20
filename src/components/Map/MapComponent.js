import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
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
function MapEvents({ onMapClick }) {
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
    const [newMarkerPosition, setNewMarkerPosition] = useState(null);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const handleMapClick = (e) => {
        if (isAddingMarker && user) {
            setNewMarkerPosition([e.latlng.lat, e.latlng.lng]);
        }
    };
    const handleMarkerCreate = async (data) => {
        if (!newMarkerPosition || !user)
            return;
        try {
            await createMarker.mutateAsync({
                ...data,
                latitude: newMarkerPosition[0],
                longitude: newMarkerPosition[1],
                userId: user.id,
            });
            setNewMarkerPosition(null);
            setIsAddingMarker(false);
        }
        catch (error) {
            toast.error('Ошибка при создании метки');
            console.error('Error creating marker:', error);
        }
    };
    return (_jsxs("div", { className: "map-wrapper", children: [_jsxs(MapContainer, { center: MAP_CONFIG.DEFAULT_CENTER, zoom: MAP_CONFIG.DEFAULT_ZOOM, minZoom: MAP_CONFIG.MIN_ZOOM, maxZoom: MAP_CONFIG.MAX_ZOOM, scrollWheelZoom: true, className: "map-container", whenCreated: (mapInstance) => {
                    mapInstance.on('click', handleMapClick);
                }, children: [_jsx(TileLayer, { url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", attribution: '\u00A9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }), _jsx(MapEvents, { onMapClick: handleMapClick }), _jsx(MarkerClusterGroup, { children: markers.map((marker) => (_jsx(Marker, { position: [marker.latitude, marker.longitude], eventHandlers: {
                                click: () => setSelectedMarker(marker),
                            } }, marker.id))) })] }), user && (_jsxs("button", { onClick: () => setIsAddingMarker(!isAddingMarker), className: `fixed bottom-8 right-8 z-[1000] flex items-center px-4 py-2 rounded-lg shadow-lg transition-all duration-200 ${isAddingMarker
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'}`, children: [_jsx(Plus, { className: "h-5 w-5 mr-2" }), isAddingMarker ? 'Кликните на карту' : 'Добавить метку'] })), _jsx("div", { className: "fixed top-20 right-4 z-[1000]", children: _jsx(MapFilters, {}) }), newMarkerPosition && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000] p-4", children: _jsx("div", { className: "bg-white rounded-lg shadow-lg w-full max-w-md", children: _jsx(MarkerForm, { position: newMarkerPosition, onSubmit: handleMarkerCreate, onCancel: () => {
                            setNewMarkerPosition(null);
                            setIsAddingMarker(false);
                        } }) }) })), selectedMarker && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000] p-4", children: _jsx("div", { className: "bg-white rounded-lg shadow-lg w-full max-w-md", children: _jsx(MarkerPopup, { marker: selectedMarker, onClose: () => setSelectedMarker(null) }) }) }))] }));
}
