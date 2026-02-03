
import React from 'react';
import { OptionType } from './types';

export const OPTION_TYPE_LABELS: Record<OptionType, { label: string; icon: string; category: 'Input' | 'Selection' | 'Static'; description: string }> = {
  // Input
  [OptionType.TEXT]: { label: 'Text Input', icon: 'fa-font', category: 'Input', description: 'Single line text field for names, messages, etc.' },
  [OptionType.TEXTAREA]: { label: 'Text Area', icon: 'fa-align-left', category: 'Input', description: 'Multi-line text area for longer messages' },
  [OptionType.NUMBER]: { label: 'Number', icon: 'fa-hashtag', category: 'Input', description: 'Numeric input with min/max validation' },
  [OptionType.PHONE]: { label: 'Phone', icon: 'fa-phone', category: 'Input', description: 'Phone number input with formatting' },
  [OptionType.EMAIL]: { label: 'Email', icon: 'fa-envelope', category: 'Input', description: 'Email address with validation' },
  [OptionType.HIDDEN]: { label: 'Hidden Field', icon: 'fa-eye-slash', category: 'Input', description: 'Hidden value passed to cart' },
  [OptionType.DATETIME]: { label: 'Date/Time', icon: 'fa-calendar-alt', category: 'Input', description: 'Date and time picker' },
  [OptionType.FILE]: { label: 'File Upload', icon: 'fa-upload', category: 'Input', description: 'Upload images, PDFs, or documents' },
  [OptionType.COLOR_PICKER]: { label: 'Color Picker', icon: 'fa-eye-dropper', category: 'Input', description: 'Visual color selector' },
  [OptionType.SWITCH]: { label: 'Toggle Switch', icon: 'fa-toggle-on', category: 'Input', description: 'On/off toggle switch' },
  [OptionType.RANGE_SLIDER]: { label: 'Range Slider', icon: 'fa-sliders-h', category: 'Input', description: 'Numeric range slider' },

  // Selection
  [OptionType.SELECT]: { label: 'Select Dropdown', icon: 'fa-mouse-pointer', category: 'Selection', description: 'Standard dropdown menu' },
  [OptionType.DROPDOWN]: { label: 'Dropdown', icon: 'fa-chevron-down', category: 'Selection', description: 'Styled dropdown with pricing' },
  [OptionType.COLOR_DROPDOWN]: { label: 'Color Dropdown', icon: 'fa-palette', category: 'Selection', description: 'Dropdown with color previews' },
  [OptionType.IMAGE_DROPDOWN]: { label: 'Image Dropdown', icon: 'fa-images', category: 'Selection', description: 'Dropdown with image thumbnails' },
  [OptionType.RADIO]: { label: 'Radio Buttons', icon: 'fa-dot-circle', category: 'Selection', description: 'Single choice radio buttons' },
  [OptionType.CHECKBOX]: { label: 'Checkboxes', icon: 'fa-check-square', category: 'Selection', description: 'Multiple choice checkboxes' },
  [OptionType.BUTTON]: { label: 'Button Group', icon: 'fa-square', category: 'Selection', description: 'Visual button selection' },
  [OptionType.COLOR_SWATCH]: { label: 'Color Swatches', icon: 'fa-palette', category: 'Selection', description: 'Visual color swatches' },
  [OptionType.IMAGE_SWATCH]: { label: 'Image Swatches', icon: 'fa-image', category: 'Selection', description: 'Image-based swatches' },
  [OptionType.VARIANT_IMAGE]: { label: 'Variant Images', icon: 'fa-images', category: 'Selection', description: 'Product variant images' },
  [OptionType.FONT_PICKER]: { label: 'Font Picker', icon: 'fa-italic', category: 'Selection', description: 'Typography selector' },
  [OptionType.PRODUCT_LINKS]: { label: 'Product Links', icon: 'fa-link', category: 'Selection', description: 'Link to related products' },

  // Static
  [OptionType.HEADING]: { label: 'Heading', icon: 'fa-heading', category: 'Static', description: 'Section heading text' },
  [OptionType.DIVIDER]: { label: 'Divider', icon: 'fa-minus', category: 'Static', description: 'Visual separator line' },
  [OptionType.SPACING]: { label: 'Spacing', icon: 'fa-arrows-alt-v', category: 'Static', description: 'Vertical spacing block' },
  [OptionType.PARAGRAPH]: { label: 'Paragraph', icon: 'fa-paragraph', category: 'Static', description: 'Informational text block' },
  [OptionType.HTML]: { label: 'HTML Block', icon: 'fa-code', category: 'Static', description: 'Custom HTML content' },
  [OptionType.POPUP]: { label: 'Popup', icon: 'fa-window-maximize', category: 'Static', description: 'Modal popup trigger' },
  [OptionType.SIZE_CHART]: { label: 'Size Chart', icon: 'fa-ruler-combined', category: 'Static', description: 'Size guide table' },
  [OptionType.TABS]: { label: 'Tabs', icon: 'fa-folder', category: 'Static', description: 'Tabbed content sections' },
};

export const DEFAULT_SETTINGS = {
  storeName: "Custom Kingdom",
  currency: "USD",
  customizationProductId: "custom-service-001",
  customizationProductTitle: "Customization / Printing Service",
  enableLivePreview: true,
  primaryColor: "#e64a5d",
  secondaryColor: "#303030",
  fontFamily: "system-ui, -apple-system, sans-serif",
  hideDefaultAddToCart: true,
  showPricesInOptions: true,
  groupCustomizations: true,
  enableConditionalLogic: true,
  enableFileUploads: true,
  maxFileUploadSize: 10, // MB
  allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  cartBehavior: 'grouped' as const,
  displayMode: 'inline' as const,
  translations: {
    addToCart: 'Add to Cart',
    required: 'Required',
    optional: 'Optional',
    customizationTotal: 'Customization Total',
    uploadFile: 'Upload File',
    chooseOption: 'Choose an option',
  }
};

export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\d\s\-\+\(\)]+$/,
  url: /^https?:\/\/.+/,
};

export const FILE_UPLOAD_LIMITS = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: {
    images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    all: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
  }
};
