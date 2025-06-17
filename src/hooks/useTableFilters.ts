import { useState, useCallback } from 'react';

interface DateFilterOptions {
  useDate?: boolean;
  dateField?: string; // Field name to filter by date
}

export const useTableFilters = <T extends Record<string, any>>(
  initialData: T[],
  searchFields: (keyof T)[],
  dateOptions?: DateFilterOptions
) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  
  const filteredData = useCallback(() => {
    return initialData.filter((item) => {
      // Search term filter
      if (searchTerm) {
        const searchMatch = searchFields.some(field => {
          const fieldValue = item[field];
          return typeof fieldValue === 'string' && 
            fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
        });
        
        if (!searchMatch) return false;
      }
      
      // Selected filter (for dropdowns like agency, status, etc.)
      if (selectedFilter !== 'all') {
        // We need to make this generic, so we assume there's some field in the data
        // that matches the filter context. This could be improved in actual implementation.
        const hasMatchingField = Object.values(item).some(
          value => typeof value === 'string' && value === selectedFilter
        );
        
        if (!hasMatchingField) return false;
      }
      
      // Date range filter (if enabled)
      if (dateOptions?.useDate && dateOptions.dateField) {
        const dateField = dateOptions.dateField;
        const itemDate = new Date(item[dateField] as string);
        
        if (startDate && itemDate < new Date(startDate)) {
          return false;
        }
        
        if (endDate && itemDate > new Date(endDate)) {
          return false;
        }
      }
      
      return true;
    });
  }, [initialData, searchTerm, selectedFilter, startDate, endDate, searchFields, dateOptions]);
  
  return {
    searchTerm,
    setSearchTerm,
    startDate,
    setStartDate,
    endDate, 
    setEndDate,
    selectedFilter,
    setSelectedFilter,
    filteredData
  };
}; 