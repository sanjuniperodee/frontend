import { useState, useCallback } from 'react';
import { Marker } from '../types';

interface FilterOptions {
  categories: string[];
  dateRange: [Date | null, Date | null];
  rating: number | null;
}

export function useMarkerFilters(markers: Marker[]) {
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    dateRange: [null, null],
    rating: null,
  });

  const filteredMarkers = useCallback(() => {
    return markers.filter((marker) => {
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(marker.category)) {
        return false;
      }

      // Rating filter
      if (filters.rating !== null && marker.rating < filters.rating) {
        return false;
      }

      // Date range filter
      if (filters.dateRange[0] && filters.dateRange[1]) {
        const markerDate = new Date(marker.createdAt);
        if (markerDate < filters.dateRange[0] || markerDate > filters.dateRange[1]) {
          return false;
        }
      }

      return true;
    });
  }, [markers, filters]);

  return {
    filters,
    setFilters,
    filteredMarkers: filteredMarkers(),
  };
}