
export enum OptionType {
  // Input Fields
  TEXT = 'text',
  TEXTAREA = 'textarea',
  NUMBER = 'number',
  PHONE = 'phone',
  EMAIL = 'email',
  HIDDEN = 'hidden',
  DATETIME = 'datetime',
  FILE = 'file',
  COLOR_PICKER = 'color_picker',
  SWITCH = 'switch',
  RANGE_SLIDER = 'range_slider',

  // Selection Types
  SELECT = 'select',
  DROPDOWN = 'dropdown',
  COLOR_DROPDOWN = 'color_dropdown',
  IMAGE_DROPDOWN = 'image_dropdown',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  BUTTON = 'button',
  COLOR_SWATCH = 'color_swatch',
  IMAGE_SWATCH = 'image_swatch',
  VARIANT_IMAGE = 'variant_image',
  FONT_PICKER = 'font_picker',
  PRODUCT_LINKS = 'product_links',

  // Static Elements
  HEADING = 'heading',
  DIVIDER = 'divider',
  SPACING = 'spacing',
  PARAGRAPH = 'paragraph',
  HTML = 'html',
  POPUP = 'popup',
  SIZE_CHART = 'size_chart',
  TABS = 'tabs'
}

export enum ConditionOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not_contains',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  IS_EMPTY = 'is_empty',
  IS_NOT_EMPTY = 'is_not_empty'
}

export enum PricingRuleType {
  FIXED = 'fixed',
  PERCENTAGE = 'percentage',
  MULTIPLIER = 'multiplier'
}

export interface OptionValue {
  id: string;
  label: string;
  addPrice: number;
  priceType?: PricingRuleType;
  image?: string;
  color?: string;
  isDefault?: boolean;
  sku?: string;
  tooltip?: string;
}

export interface Condition {
  id: string;
  sourceOptionId: string;
  operator: ConditionOperator;
  value: string;
  logicType?: 'AND' | 'OR';
}

export interface ProductOption {
  id: string;
  type: OptionType;
  label: string;
  helpText?: string;
  placeholder?: string;
  isRequired: boolean;
  values: OptionValue[];
  conditions: Condition[];
  validationRules?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    fileTypes?: string[];
    maxFileSize?: number;
  };
  isGroup?: boolean;
  parentId?: string;
  displayOrder?: number;
  cssClass?: string;
  showInCart?: boolean;
  showInCheckout?: boolean;
  showInOrder?: boolean;
}

export interface OptionSet {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'draft';
  targetProducts: string[];
  targetCollections?: string[];
  targetTags?: string[];
  applyToAllProducts?: boolean;
  options: ProductOption[];
  createdAt: string;
  updatedAt?: string;
  priority?: number;
  seasonalDates?: {
    startDate?: string;
    endDate?: string;
  };
}

export interface Product {
  id: string;
  title: string;
  handle: string;
  price: number;
  image: string;
  inventory: number;
  setsCount: number;
  status: 'active' | 'archived' | 'draft';
}

export interface AppSettings {
  storeName: string;
  currency: string;
  customizationProductId: string;
  customizationProductTitle: string;
  enableLivePreview: boolean;
  primaryColor: string;
  secondaryColor?: string;
  fontFamily?: string;
  hideDefaultAddToCart: boolean;
  showPricesInOptions: boolean;
  groupCustomizations: boolean;
  enableConditionalLogic: boolean;
  enableFileUploads: boolean;
  maxFileUploadSize: number;
  allowedFileTypes: string[];
  cartBehavior: 'separate' | 'grouped';
  displayMode: 'inline' | 'modal' | 'sidebar';
  translations?: Record<string, string>;
}

export interface CartLineItem {
  id: string;
  productId: string;
  variantId?: string;
  title: string;
  price: number;
  quantity: number;
  properties?: Record<string, string>;
  image?: string;
  isCustomizationService?: boolean;
}

export interface ExportData {
  optionSets: OptionSet[];
  products: Product[];
  settings: AppSettings;
  exportDate: string;
  version: string;
}
