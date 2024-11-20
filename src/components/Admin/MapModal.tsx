import { MapContainer, TileLayer, Marker } from 'react-leaflet';

export default function MapModal({
                                     marker,
                                     onClose,
                                 }: {
    marker: { latitude: number; longitude: number; name: string };
    onClose: () => void;
}) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000] p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
                <div className="p-4 flex justify-between items-center border-b">
                    <h3 className="text-lg font-medium text-gray-900">{marker.name}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        ✕
                    </button>
                </div>
                <div className="h-80 w-full">
                    <MapContainer
                        center={[marker.latitude, marker.longitude]}
                        zoom={15}
                        scrollWheelZoom={false}
                        className="h-full w-full"
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker position={[marker.latitude, marker.longitude]} />
                    </MapContainer>
                </div>
            </div>
        </div>
    );
}
