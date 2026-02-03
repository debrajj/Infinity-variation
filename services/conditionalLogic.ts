import { ProductOption, Condition, ConditionOperator } from '../types';

/**
 * Evaluates whether an option should be visible based on conditional logic
 */
export const evaluateConditions = (
  option: ProductOption,
  selections: Record<string, any>,
  allOptions: ProductOption[]
): boolean => {
  if (!option.conditions || option.conditions.length === 0) {
    return true;
  }

  // All conditions must be met (AND logic by default)
  return option.conditions.every(condition => {
    return evaluateSingleCondition(condition, selections, allOptions);
  });
};

/**
 * Evaluates a single condition
 */
export const evaluateSingleCondition = (
  condition: Condition,
  selections: Record<string, any>,
  allOptions: ProductOption[]
): boolean => {
  const sourceOption = allOptions.find(opt => opt.id === condition.sourceOptionId);
  if (!sourceOption) return false;

  const selectedValue = selections[condition.sourceOptionId];
  
  // Get the actual value to compare
  let compareValue: string;
  if (sourceOption.values && sourceOption.values.length > 0) {
    const valueObj = sourceOption.values.find(v => v.id === selectedValue);
    compareValue = valueObj ? valueObj.label : String(selectedValue || '');
  } else {
    compareValue = String(selectedValue || '');
  }

  // Evaluate based on operator
  switch (condition.operator) {
    case ConditionOperator.EQUALS:
      return compareValue.toLowerCase() === condition.value.toLowerCase();
    
    case ConditionOperator.NOT_EQUALS:
      return compareValue.toLowerCase() !== condition.value.toLowerCase();
    
    case ConditionOperator.CONTAINS:
      return compareValue.toLowerCase().includes(condition.value.toLowerCase());
    
    case ConditionOperator.NOT_CONTAINS:
      return !compareValue.toLowerCase().includes(condition.value.toLowerCase());
    
    case ConditionOperator.GREATER_THAN:
      return parseFloat(compareValue) > parseFloat(condition.value);
    
    case ConditionOperator.LESS_THAN:
      return parseFloat(compareValue) < parseFloat(condition.value);
    
    case ConditionOperator.IS_EMPTY:
      return !selectedValue || selectedValue === '' || selectedValue.length === 0;
    
    case ConditionOperator.IS_NOT_EMPTY:
      return !!selectedValue && selectedValue !== '' && selectedValue.length > 0;
    
    default:
      return true;
  }
};

/**
 * Gets all visible options based on current selections
 */
export const getVisibleOptions = (
  allOptions: ProductOption[],
  selections: Record<string, any>
): ProductOption[] => {
  return allOptions.filter(option => 
    evaluateConditions(option, selections, allOptions)
  );
};

/**
 * Validates if all required visible options have values
 */
export const validateRequiredOptions = (
  allOptions: ProductOption[],
  selections: Record<string, any>
): { isValid: boolean; missingFields: string[] } => {
  const visibleOptions = getVisibleOptions(allOptions, selections);
  const missingFields: string[] = [];

  visibleOptions.forEach(option => {
    if (option.isRequired) {
      const value = selections[option.id];
      if (!value || value === '' || (Array.isArray(value) && value.length === 0)) {
        missingFields.push(option.label);
      }
    }
  });

  return {
    isValid: missingFields.length === 0,
    missingFields
  };
};
