import { ProductOption, OptionType } from '../types';
import { VALIDATION_PATTERNS, FILE_UPLOAD_LIMITS } from '../constants';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates a single option value based on its type and rules
 */
export const validateOptionValue = (
  option: ProductOption,
  value: any
): ValidationResult => {
  // Skip validation for non-required empty values
  if (!option.isRequired && (!value || value === '')) {
    return { isValid: true };
  }

  // Required field check
  if (option.isRequired && (!value || value === '')) {
    return { isValid: false, error: `${option.label} is required` };
  }

  // Type-specific validation
  switch (option.type) {
    case OptionType.EMAIL:
      if (!VALIDATION_PATTERNS.email.test(value)) {
        return { isValid: false, error: 'Please enter a valid email address' };
      }
      break;

    case OptionType.PHONE:
      if (!VALIDATION_PATTERNS.phone.test(value)) {
        return { isValid: false, error: 'Please enter a valid phone number' };
      }
      break;

    case OptionType.NUMBER:
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        return { isValid: false, error: 'Please enter a valid number' };
      }
      if (option.validationRules?.min !== undefined && numValue < option.validationRules.min) {
        return { isValid: false, error: `Minimum value is ${option.validationRules.min}` };
      }
      if (option.validationRules?.max !== undefined && numValue > option.validationRules.max) {
        return { isValid: false, error: `Maximum value is ${option.validationRules.max}` };
      }
      break;

    case OptionType.TEXT:
    case OptionType.TEXTAREA:
      if (option.validationRules?.minLength && value.length < option.validationRules.minLength) {
        return { isValid: false, error: `Minimum length is ${option.validationRules.minLength} characters` };
      }
      if (option.validationRules?.maxLength && value.length > option.validationRules.maxLength) {
        return { isValid: false, error: `Maximum length is ${option.validationRules.maxLength} characters` };
      }
      if (option.validationRules?.pattern) {
        const regex = new RegExp(option.validationRules.pattern);
        if (!regex.test(value)) {
          return { isValid: false, error: 'Invalid format' };
        }
      }
      break;

    case OptionType.FILE:
      if (value instanceof File) {
        // Check file size
        if (value.size > FILE_UPLOAD_LIMITS.maxSize) {
          return { isValid: false, error: `File size must be less than ${FILE_UPLOAD_LIMITS.maxSize / 1024 / 1024}MB` };
        }
        // Check file type
        if (option.validationRules?.fileTypes && option.validationRules.fileTypes.length > 0) {
          if (!option.validationRules.fileTypes.includes(value.type)) {
            return { isValid: false, error: 'Invalid file type' };
          }
        }
      }
      break;
  }

  return { isValid: true };
};

/**
 * Validates all options in a set
 */
export const validateAllOptions = (
  options: ProductOption[],
  selections: Record<string, any>
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  options.forEach(option => {
    const value = selections[option.id];
    const result = validateOptionValue(option, value);
    if (!result.isValid && result.error) {
      errors[option.id] = result.error;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Sanitizes user input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

/**
 * Formats price for display
 */
export const formatPrice = (price: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price);
};
