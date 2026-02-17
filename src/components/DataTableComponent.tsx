// src/components/DataTableComponent.tsx
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Artwork, ApiResponse } from '../types/artwork';
import { CustomSelectionPanel, CustomSelectionPanelRef } from './CustomSelectionPanel';
import { useArtworkSelection } from '../hooks/useArtworkSelection';
import classNames from 'classnames';

export const DataTableComponent: React.FC = () => {
  // State
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Selection hook
  const {
    isRowSelected,
    toggleRowSelection,
    toggleAllRows,
    selectCustomRows,
    getEffectiveSelectionCount,
    areAllRowsSelected,
    areSomeRowsSelected,
    selectedIds,
    deselectedIds
  } = useArtworkSelection();

  // Refs
  const selectionPanelRef = useRef<CustomSelectionPanelRef>(null);

  // Fetch data when page changes
  useEffect(() => {
    fetchArtworks(currentPage);
  }, [currentPage]);

  // Log selection changes for debugging
  useEffect(() => {
    console.log('Selected IDs:', Array.from(selectedIds));
    console.log('Deselected IDs:', Array.from(deselectedIds));
  }, [selectedIds, deselectedIds]);

  const fetchArtworks = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}`);
      const data: ApiResponse = await response.json();
      setArtworks(data.data);
      setTotalRecords(data.pagination.total);
    } catch (error) {
      console.error('Error fetching artworks:', error);
    } finally {
      setLoading(false);
    }
  };

  const onPageChange = (event: any) => {
    setFirst(event.first);
    setRows(event.rows);
    setCurrentPage(event.page + 1);
  };

  // Custom selection handler
  const handleCustomSelection = (count: number) => {
    selectCustomRows(count, artworks, totalRecords);
  };

  // Template for selection checkbox - FIXED: Add visual feedback
  const selectionCheckboxTemplate = (rowData: Artwork) => {
    const selected = isRowSelected(rowData);
    
    return (
      <div className="flex justify-center">
        <Checkbox
          checked={selected}
          onChange={() => toggleRowSelection(rowData)}
          className={classNames('cursor-pointer', {
            'p-highlight': selected
          })}
        />
      </div>
    );
  };

  // Template for header checkbox - FIXED: Add visual feedback
  const headerCheckboxTemplate = () => {
    const allSelected = areAllRowsSelected(artworks);
    const someSelected = areSomeRowsSelected(artworks);

    return (
      <div className="relative flex justify-center">
        <Checkbox
          checked={allSelected}
          onChange={() => toggleAllRows(artworks)}
          className={classNames('cursor-pointer', {
            'p-highlight': allSelected || someSelected
          })}
        />
        {someSelected && !allSelected && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-blue-500 text-xs font-bold">-</span>
          </div>
        )}
      </div>
    );
  };

  // Custom styles for some columns
  const artistDisplayTemplate = (rowData: Artwork) => {
    return (
      <div className="whitespace-pre-wrap font-mono text-sm">
        {rowData.artist_display}
      </div>
    );
  };

  const inscriptionsTemplate = (rowData: Artwork) => {
    return (
      <div className="max-w-xs truncate" title={rowData.inscriptions || 'No inscriptions'}>
        {rowData.inscriptions || '—'}
      </div>
    );
  };

  const dateTemplate = (rowData: Artwork) => {
    return (
      <span>
        {rowData.date_start} - {rowData.date_end}
      </span>
    );
  };

  // Force re-render when selection changes
  const selectedCount = getEffectiveSelectionCount();

  return (
    <div className="datatable-container">
      {/* Header with controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <Button 
            label="Custom Selection"
            icon="pi pi-sliders-h" 
            onClick={(e) => selectionPanelRef.current?.show(e)}
            className="p-button-outlined"
            tooltip="Select first N rows (from current page only)"
            tooltipOptions={{ position: 'top' }}
          />
          <span className={classNames(
            "text-sm px-3 py-1 rounded-full transition-colors duration-200",
            selectedCount > 0 
              ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200" 
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
          )}>
            Selected: {selectedCount} {selectedCount === 1 ? 'row' : 'rows'}
          </span>
        </div>
        <Button
          label="Refresh"
          icon="pi pi-refresh"
          className="p-button-text"
          onClick={() => fetchArtworks(currentPage)}
          loading={loading}
        />
      </div>

      {/* Custom Selection Panel */}
      <CustomSelectionPanel
        ref={selectionPanelRef}
        onSelect={handleCustomSelection}
        currentPageArtworks={artworks}
        totalRecords={totalRecords}
        currentSelectionCount={selectedCount}
      />

      {/* DataTable */}
      <div className="border rounded-lg overflow-hidden shadow-sm">
        <DataTable 
          value={artworks} 
          loading={loading}
          className="p-datatable-sm"
          tableStyle={{ minWidth: '80rem' }}
          stripedRows
          showGridlines
          size="small"
          // Force re-render when selection changes
          key={`table-${selectedCount}-${currentPage}`}
        >
          <Column 
            header={headerCheckboxTemplate} 
            body={selectionCheckboxTemplate}
            style={{ width: '4rem' }}
            headerStyle={{ width: '4rem', textAlign: 'center' }}
            bodyClassName="text-center"
          />
          <Column 
            field="title" 
            header="Title" 
            sortable 
            style={{ minWidth: '15rem' }}
            bodyClassName="font-medium"
          />
          <Column 
            field="place_of_origin" 
            header="Place of Origin" 
            sortable 
            style={{ minWidth: '10rem' }}
          />
          <Column 
            field="artist_display" 
            header="Artist Display" 
            body={artistDisplayTemplate}
            style={{ minWidth: '20rem' }}
          />
          <Column 
            field="inscriptions" 
            header="Inscriptions" 
            body={inscriptionsTemplate}
            style={{ minWidth: '12rem' }}
          />
          <Column 
            field="date_start" 
            header="Date Start" 
            sortable 
            style={{ minWidth: '8rem' }}
          />
          <Column 
            field="date_end" 
            header="Date End" 
            sortable 
            style={{ minWidth: '8rem' }}
            body={dateTemplate}
          />
        </DataTable>
      </div>

      {/* Paginator */}
      <div className="mt-4">
        <Paginator
          first={first}
          rows={rows}
          totalRecords={totalRecords}
          onPageChange={onPageChange}
          rowsPerPageOptions={[10, 25, 50, 100]}
          template={{
            layout: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport',
            CurrentPageReport: (options: any) => {
              return (
                <span className="mx-3 text-sm text-gray-600 dark:text-gray-400">
                  Showing {options.first} to {options.last} of {options.totalRecords} records
                </span>
              );
            }
          }}
        />
      </div>

      {/* Selection persistence indicator */}
      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-right">
        <i className="pi pi-check-circle mr-1 text-green-500"></i>
        Selections persist across pages
        {selectedCount > 0 && (
          <span className="ml-2 text-blue-500">
            ({selectedCount} total selected)
          </span>
        )}
      </div>
    </div>
  );
};