import { ProductOption, OptionValue, PricingRuleType } from '../types';

export interface PriceBreakdown {
  basePrice: number;
  customizationPrice: number;
  totalPrice: number;
  itemizedPrices: Array<{
    optionLabel: string;
    valueLabel: string;
    price: number;
  }>;
}

/**
 * Calculates total customization price from all selections
 */
export const calculateCustomizationPrice = (
  options: ProductOption[],
  selections: Record<string, any>
): number => {
  let total = 0;

  options.forEach(option => {
    const selection = selections[option.id];
    if (!selection) return;

    // Handle multi-select (checkboxes)
    if (Array.isArray(selection)) {
      selection.forEach(valueId => {
        const value = option.values.find(v => v.id === valueId);
        if (value) {
          total += calculateValuePrice(value, 1);
        }
      });
    } else {
      // Single selection
      const value = option.values.find(v => v.id === selection);
      if (value) {
        total += calculateValuePrice(value, 1);
      }
    }
  });

  return total;
};

/**
 * Calculates price for a single option value
 */
export const calculateValuePrice = (
  value: OptionValue,
  basePrice: number = 1
): number => {
  const priceType = value.priceType || PricingRuleType.FIXED;

  switch (priceType) {
    case PricingRuleType.FIXED:
      return value.addPrice;
    
    case PricingRuleType.PERCENTAGE:
      return basePrice * (value.addPrice / 100);
    
    case PricingRuleType.MULTIPLIER:
      return basePrice * value.addPrice;
    
    default:
      return value.addPrice;
  }
};

/**
 * Gets detailed price breakdown
 */
export const getPriceBreakdown = (
  options: ProductOption[],
  selections: Record<string, any>,
  basePrice: number = 0
): PriceBreakdown => {
  const itemizedPrices: Array<{
    optionLabel: string;
    valueLabel: string;
    price: number;
  }> = [];

  let customizationPrice = 0;

  options.forEach(option => {
    const selection = selections[option.id];
    if (!selection) return;

    if (Array.isArray(selection)) {
      selection.forEach(valueId => {
        const value = option.values.find(v => v.id === valueId);
        if (value && value.addPrice > 0) {
          const price = calculateValuePrice(value, basePrice);
          itemizedPrices.push({
            optionLabel: option.label,
            valueLabel: value.label,
            price
          });
          customizationPrice += price;
        }
      });
    } else {
      const value = option.values.find(v => v.id === selection);
      if (value && value.addPrice > 0) {
        const price = calculateValuePrice(value, basePrice);
        itemizedPrices.push({
          optionLabel: option.label,
          valueLabel: value.label,
          price
        });
        customizationPrice += price;
      }
    }
  });

  return {
    basePrice,
    customizationPrice,
    totalPrice: basePrice + customizationPrice,
    itemizedPrices
  };
};

/**
 * Formats selections for cart line item properties
 */
export const formatSelectionsForCart = (
  options: ProductOption[],
  selections: Record<string, any>
): Record<string, string> => {
  const properties: Record<string, string> = {};

  options.forEach(option => {
    const selection = selections[option.id];
    if (!selection) return;

    // Skip static elements
    if (['heading', 'divider', 'paragraph', 'spacing', 'html'].includes(option.type)) {
      return;
    }

    if (Array.isArray(selection)) {
      const labels = selection
        .map(valueId => {
          const value = option.values.find(v => v.id === valueId);
          return value ? value.label : '';
        })
        .filter(Boolean)
        .join(', ');
      
      if (labels) {
        properties[option.label] = labels;
      }
    } else if (option.values && option.values.length > 0) {
      const value = option.values.find(v => v.id === selection);
      if (value) {
        properties[option.label] = value.label;
      }
    } else {
      // Text input, file upload, etc.
      if (selection && String(selection).trim()) {
        properties[option.label] = String(selection);
      }
    }
  });

  return properties;
};
