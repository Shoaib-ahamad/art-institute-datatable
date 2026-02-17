// src/hooks/useArtworkSelection.ts
import { useState, useCallback } from 'react';
import { Artwork } from '../types/artwork';

export const useArtworkSelection = () => {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [deselectedIds, setDeselectedIds] = useState<Set<number>>(new Set());

  // Check if a specific row is selected
  const isRowSelected = useCallback((artwork: Artwork): boolean => {
    if (deselectedIds.has(artwork.id)) return false;
    if (selectedIds.has(artwork.id)) return true;
    return false;
  }, [selectedIds, deselectedIds]);

  // Get effectively selected count (selected minus deselected)
  const getEffectiveSelectionCount = useCallback((): number => {
    const effective = new Set(selectedIds);
    deselectedIds.forEach(id => effective.delete(id));
    return effective.size;
  }, [selectedIds, deselectedIds]);

  // Toggle single row selection
  const toggleRowSelection = useCallback((artwork: Artwork) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (prev.has(artwork.id)) {
        newSet.delete(artwork.id);
      } else {
        newSet.add(artwork.id);
      }
      return newSet;
    });

    // Remove from deselected if it was there
    setDeselectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(artwork.id)) {
        newSet.delete(artwork.id);
      }
      return newSet;
    });
  }, []);

  // Toggle all rows on current page
  const toggleAllRows = useCallback((currentPageArtworks: Artwork[]) => {
    const allSelected = currentPageArtworks.every(artwork => 
      selectedIds.has(artwork.id) && !deselectedIds.has(artwork.id)
    );

    if (allSelected) {
      // Deselect all on current page
      setSelectedIds(prev => {
        const newSet = new Set(prev);
        currentPageArtworks.forEach(artwork => newSet.delete(artwork.id));
        return newSet;
      });
      
      setDeselectedIds(prev => {
        const newSet = new Set(prev);
        currentPageArtworks.forEach(artwork => newSet.add(artwork.id));
        return newSet;
      });
    } else {
      // Select all on current page
      setSelectedIds(prev => {
        const newSet = new Set(prev);
        currentPageArtworks.forEach(artwork => newSet.add(artwork.id));
        return newSet;
      });
      
      setDeselectedIds(prev => {
        const newSet = new Set(prev);
        currentPageArtworks.forEach(artwork => newSet.delete(artwork.id));
        return newSet;
      });
    }
  }, [selectedIds, deselectedIds]);

  // CUSTOM SELECTION HANDLER - CRITICAL: Does NOT fetch other pages
  // This only works with already known selections and current page
  const selectCustomRows = useCallback((
    count: number, 
    currentPageArtworks: Artwork[],
    totalRecords: number
  ) => {
    if (count < 0 || count > totalRecords) return;

    // Get all currently effective selections (selected minus deselected)
    const effectiveSelected = new Set<number>();
    selectedIds.forEach(id => {
      if (!deselectedIds.has(id)) {
        effectiveSelected.add(id);
      }
    });

    const currentCount = effectiveSelected.size;

    if (count <= currentCount) {
      // Need to deselect some rows - keep only first 'count' selections
      const selectedArray = Array.from(effectiveSelected);
      const toKeep = new Set(selectedArray.slice(0, count));
      const toRemove = selectedArray.slice(count);

      setSelectedIds(toKeep);
      
      // Add removed ones to deselected (only if they're not on current page)
      setDeselectedIds(prev => {
        const newSet = new Set(prev);
        toRemove.forEach(id => {
          // Only add to deselected if not on current page
          // This ensures selections on current page can be reselected
          if (!currentPageArtworks.some(a => a.id === id)) {
            newSet.add(id);
          }
        });
        return newSet;
      });
    } else {
      // Need to select more rows - but ONLY from current page
      const additionalNeeded = count - currentCount;
      
      // Find available rows on current page that aren't effectively selected
      const availableOnCurrentPage = currentPageArtworks
        .filter(artwork => !effectiveSelected.has(artwork.id))
        .map(artwork => artwork.id);

      // Take what we need from current page (up to additionalNeeded)
      const toSelect = availableOnCurrentPage.slice(0, additionalNeeded);

      // Add new selections
      setSelectedIds(prev => {
        const newSet = new Set(prev);
        toSelect.forEach(id => newSet.add(id));
        return newSet;
      });

      // Remove from deselected if they were there
      setDeselectedIds(prev => {
        const newSet = new Set(prev);
        toSelect.forEach(id => newSet.delete(id));
        return newSet;
      });

      // If we couldn't select enough rows from current page,
      // we simply select what's available - NO FETCHING OTHER PAGES
      if (toSelect.length < additionalNeeded) {
        console.log(`Only able to select ${toSelect.length} additional rows from current page. Total now: ${currentCount + toSelect.length}`);
      }
    }
  }, [selectedIds, deselectedIds]);

  // Check if all rows on current page are selected
  const areAllRowsSelected = useCallback((currentPageArtworks: Artwork[]): boolean => {
    if (currentPageArtworks.length === 0) return false;
    
    return currentPageArtworks.every(artwork => 
      selectedIds.has(artwork.id) && !deselectedIds.has(artwork.id)
    );
  }, [selectedIds, deselectedIds]);

  // Check if some rows on current page are selected
  const areSomeRowsSelected = useCallback((currentPageArtworks: Artwork[]): boolean => {
    const selectedOnPage = currentPageArtworks.filter(artwork => 
      selectedIds.has(artwork.id) && !deselectedIds.has(artwork.id)
    );
    
    return selectedOnPage.length > 0 && selectedOnPage.length < currentPageArtworks.length;
  }, [selectedIds, deselectedIds]);

  // Reset selections (useful for testing)
  const resetSelections = useCallback(() => {
    setSelectedIds(new Set());
    setDeselectedIds(new Set());
  }, []);

  return {
    selectedIds,
    deselectedIds,
    isRowSelected,
    toggleRowSelection,
    toggleAllRows,
    selectCustomRows,
    getEffectiveSelectionCount,
    areAllRowsSelected,
    areSomeRowsSelected,
    resetSelections
  };
};