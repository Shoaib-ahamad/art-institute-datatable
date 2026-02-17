// src/components/CustomSelectionPanel.tsx
import React, { forwardRef, useImperativeHandle, useState, useRef } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Artwork } from '../types/artwork';

interface CustomSelectionPanelProps {
  onSelect: (count: number) => void;
  currentPageArtworks: Artwork[];
  totalRecords: number;
  currentSelectionCount: number;
}

export interface CustomSelectionPanelRef {
  show: (event: React.SyntheticEvent) => void;
  hide: () => void;
}

export const CustomSelectionPanel = forwardRef<CustomSelectionPanelRef, CustomSelectionPanelProps>(
  ({ onSelect, currentPageArtworks, totalRecords, currentSelectionCount }, ref) => {
    const [selectCount, setSelectCount] = useState<number | null>(null);
    const [error, setError] = useState<string>('');
    const op = useRef<OverlayPanel>(null);

    useImperativeHandle(ref, () => ({
      show: (event: React.SyntheticEvent) => {
        op.current?.toggle(event);
        setError('');
      },
      hide: () => {
        op.current?.hide();
      }
    }));

    const handleApply = () => {
      // Validation
      if (!selectCount || selectCount <= 0) {
        setError('Please enter a valid positive number');
        return;
      }

      if (selectCount > totalRecords) {
        setError(`Cannot select more than ${totalRecords} rows`);
        return;
      }

      // Clear error and apply selection
      setError('');
      onSelect(selectCount);
      setSelectCount(null);
      op.current?.hide();
    };

    const getAvailableMessage = () => {
      const availableOnPage = currentPageArtworks.length;
      const canSelectMore = currentSelectionCount < totalRecords;
      
      if (canSelectMore) {
        return (
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            <p>• Total records: {totalRecords}</p>
            <p>• Currently selected: {currentSelectionCount}</p>
            <p>• Available on this page: {availableOnPage}</p>
            <p className="text-yellow-600 dark:text-yellow-400 mt-1">
              Note: Can only select from current page. Navigate to select from other pages.
            </p>
          </div>
        );
      }
      return (
        <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
          Maximum selection ({totalRecords}) reached
        </p>
      );
    };

    return (
      <OverlayPanel 
        ref={op} 
        className="selection-panel w-80"
        dismissable
        showCloseIcon
      >
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
            Custom Row Selection
          </h3>
          
          <div className="mb-3">
            <label 
              htmlFor="selectCount" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Number of rows to select:
            </label>
            <InputNumber
  id="selectCount"
  value={selectCount}
  onValueChange={(e) => {
    // Handle the value properly - e.value could be number | null | undefined
    const newValue = e.value !== undefined ? e.value : null;
    setSelectCount(newValue);
    setError('');
  }}
  placeholder="Enter number"
  min={0}
  max={totalRecords}
  showButtons
  mode="decimal"
  className="w-full"
  inputClassName="w-full"
  disabled={currentSelectionCount >= totalRecords}
/>
          </div>

          {error && (
            <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          <div className="mb-4 p-3 bg-blue-50 dark:bg-gray-800 rounded border border-blue-200 dark:border-gray-700">
            {getAvailableMessage()}
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              label="Cancel" 
              icon="pi pi-times" 
              onClick={() => {
                op.current?.hide();
                setSelectCount(null);
                setError('');
              }}
              className="p-button-outlined p-button-secondary p-button-sm"
            />
            <Button 
              label="Apply" 
              icon="pi pi-check" 
              onClick={handleApply}
              className="p-button-sm"
              disabled={currentSelectionCount >= totalRecords}
            />
          </div>
        </div>
      </OverlayPanel>
    );
  }
);

CustomSelectionPanel.displayName = 'CustomSelectionPanel';