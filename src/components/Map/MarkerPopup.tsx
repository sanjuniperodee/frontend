import { useState } from 'react';
import { Marker } from '../../types';
import { MessageSquare, ThumbsUp, ThumbsDown, X } from 'lucide-react';
import CommentList from '../Comments/CommentList';
import { useAuthStore } from '../../store/authStore';
import { useMarkers } from '../../hooks/useMarkers';
import { toast } from 'react-hot-toast';

interface MarkerPopupProps {
  marker: Marker;
  onClose: () => void;
}

export default function MarkerPopup({ marker, onClose }: MarkerPopupProps) {
  const { user } = useAuthStore();
  const [showComments, setShowComments] = useState(false);
  const { rateMarker } = useMarkers();

  const handleRate = async (rating: number) => {
    if (!user) {
      toast.error('Войдите, чтобы оценить метку');
      return;
    }

    try {
      await rateMarker.mutateAsync({ markerId: marker.id, rating });
    } catch (error) {
      console.log(error)
      toast.error('Ошибка при оценке метки');
    }
  };

  return (
    <div className="relative p-4 min-w-[300px]">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
      >
        <X className="h-5 w-5" />
      </button>

      <h3 className="text-lg font-semibold mb-2 pr-8">{marker.name}</h3>
      <p className="text-gray-600 mb-4">{marker.description}</p>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handleRate(1)}
            className="flex items-center text-gray-600 hover:text-green-600"
            disabled={!user}
          >
            <ThumbsUp className="h-4 w-4 mr-1" />
          </button>
          <span className="text-sm font-medium">{marker.rating}</span>
          <button
            onClick={() => handleRate(-1)}
            className="flex items-center text-gray-600 hover:text-red-600"
            disabled={!user}
          >
            <ThumbsDown className="h-4 w-4 mr-1" />
          </button>
        </div>
        
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center text-gray-600 hover:text-blue-600"
        >
          <MessageSquare className="h-4 w-4 mr-1" />
          <span className="text-sm">Комментарии</span>
        </button>
      </div>

      {showComments && (
        <div className="mt-4 border-t pt-4">
          <CommentList markerId={marker.id} />
        </div>
      )}
    </div>
  );
}