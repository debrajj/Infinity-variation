import { OptionSet, ProductOption, OptionValue, ExportData } from '../types';

/**
 * Exports option sets to CSV format
 */
export const exportOptionSetsToCSV = (optionSets: OptionSet[]): string => {
  const headers = [
    'Set ID',
    'Set Name',
    'Status',
    'Target Products',
    'Option ID',
    'Option Type',
    'Option Label',
    'Required',
    'Value ID',
    'Value Label',
    'Add Price',
    'Conditions'
  ];

  const rows: string[][] = [headers];

  optionSets.forEach(set => {
    set.options.forEach(option => {
      if (option.values && option.values.length > 0) {
        option.values.forEach(value => {
          rows.push([
            set.id,
            set.name,
            set.status,
            set.targetProducts.join(';'),
            option.id,
            option.type,
            option.label,
            option.isRequired ? 'Yes' : 'No',
            value.id,
            value.label,
            value.addPrice.toString(),
            JSON.stringify(option.conditions || [])
          ]);
        });
      } else {
        rows.push([
          set.id,
          set.name,
          set.status,
          set.targetProducts.join(';'),
          option.id,
          option.type,
          option.label,
          option.isRequired ? 'Yes' : 'No',
          '',
          '',
          '',
          JSON.stringify(option.conditions || [])
        ]);
      }
    });
  });

  return rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
};

/**
 * Imports option sets from CSV format
 */
export const importOptionSetsFromCSV = (csvContent: string): OptionSet[] => {
  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length < 2) {
    throw new Error('CSV file is empty or invalid');
  }

  // Skip header row
  const dataLines = lines.slice(1);
  
  const setsMap = new Map<string, OptionSet>();
  const optionsMap = new Map<string, ProductOption>();

  dataLines.forEach(line => {
    const cells = parseCSVLine(line);
    if (cells.length < 12) return;

    const [
      setId,
      setName,
      status,
      targetProducts,
      optionId,
      optionType,
      optionLabel,
      required,
      valueId,
      valueLabel,
      addPrice,
      conditions
    ] = cells;

    // Create or update option set
    if (!setsMap.has(setId)) {
      setsMap.set(setId, {
        id: setId,
        name: setName,
        status: status as 'active' | 'draft',
        targetProducts: targetProducts ? targetProducts.split(';') : [],
        options: [],
        createdAt: new Date().toISOString()
      });
    }

    // Create or update option
    const optionKey = `${setId}_${optionId}`;
    if (!optionsMap.has(optionKey)) {
      optionsMap.set(optionKey, {
        id: optionId,
        type: optionType as any,
        label: optionLabel,
        isRequired: required === 'Yes',
        values: [],
        conditions: conditions ? JSON.parse(conditions) : []
      });
    }

    // Add value if present
    if (valueId && valueLabel) {
      const option = optionsMap.get(optionKey)!;
      option.values.push({
        id: valueId,
        label: valueLabel,
        addPrice: parseFloat(addPrice) || 0
      });
    }
  });

  // Assemble option sets
  optionsMap.forEach((option, key) => {
    const setId = key.split('_')[0];
    const set = setsMap.get(setId);
    if (set) {
      set.options.push(option);
    }
  });

  return Array.from(setsMap.values());
};

/**
 * Parses a CSV line handling quoted fields
 */
const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
};

/**
 * Downloads CSV file
 */
export const downloadCSV = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Exports complete app data as JSON
 */
export const exportAppData = (data: ExportData): string => {
  return JSON.stringify(data, null, 2);
};

/**
 * Imports complete app data from JSON
 */
export const importAppData = (jsonContent: string): ExportData => {
  try {
    return JSON.parse(jsonContent);
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
};
