import React, { useState, useEffect, useMemo, useRef } from 'react';
import { OptionSet, ProductOption, OptionType, AppSettings, OptionValue } from '../types';
import { getVisibleOptions, validateRequiredOptions } from '../services/conditionalLogic';
import { validateOptionValue } from '../services/validation';
import { getPriceBreakdown, formatSelectionsForCart } from '../services/pricingCalculator';

interface CustomizerProps {
  optionSet: OptionSet;
  settings: AppSettings;
  productPrice: number;
  productTitle: string;
  onAddToCart: (mainProduct: any, customizationService: any) => void;
}

const StorefrontCustomizer: React.FC<CustomizerProps> = ({
  optionSet,
  settings,
  productPrice,
  productTitle,
  onAddToCart
}) => {
  const [selections, setSelections] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({});

  // Initialize default selections
  useEffect(() => {
    const initialSelections: Record<string, any> = {};
    optionSet.options.forEach(opt => {
      if (opt.values && opt.values.length > 0) {
        const defaultVal = opt.values.find(v => v.isDefault) || opt.values[0];
        if ([OptionType.RADIO, OptionType.DROPDOWN, OptionType.SELECT, OptionType.BUTTON, 
             OptionType.COLOR_SWATCH, OptionType.IMAGE_SWATCH].includes(opt.type)) {
          initialSelections[opt.id] = defaultVal.id;
        }
      }
    });
    setSelections(initialSelections);
  }, [optionSet]);

  // Get visible options based on conditional logic
  const visibleOptions = useMemo(() => {
    return getVisibleOptions(optionSet.options, selections);
  }, [optionSet.options, selections]);

  // Calculate pricing
  const priceBreakdown = useMemo(() => {
    return getPriceBreakdown(visibleOptions, selections, productPrice);
  }, [visibleOptions, selections, productPrice]);

  const handleSelect = (optionId: string, value: any) => {
    setSelections(prev => ({ ...prev, [optionId]: value }));
    // Clear error for this field
    if (errors[optionId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[optionId];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (optionId: string, valueId: string, checked: boolean) => {
    setSelections(prev => {
      const current = prev[optionId] || [];
      if (checked) {
        return { ...prev, [optionId]: [...current, valueId] };
      } else {
        return { ...prev, [optionId]: current.filter((id: string) => id !== valueId) };
      }
    });
  };

  const handleFileUpload = (optionId: string, file: File) => {
    setUploadedFiles(prev => ({ ...prev, [optionId]: file }));
    setSelections(prev => ({ ...prev, [optionId]: file.name }));
  };

  const handleAddToCart = async () => {
    // Validate all required fields
    const validation = validateRequiredOptions(visibleOptions, selections);
    if (!validation.isValid) {
      const newErrors: Record<string, string> = {};
      validation.missingFields.forEach(field => {
        const option = visibleOptions.find(opt => opt.label === field);
        if (option) {
          newErrors[option.id] = `${field} is required`;
        }
      });
      setErrors(newErrors);
      return;
    }

    // Validate individual fields
    const fieldErrors: Record<string, string> = {};
    visibleOptions.forEach(option => {
      const result = validateOptionValue(option, selections[option.id]);
      if (!result.isValid && result.error) {
        fieldErrors[option.id] = result.error;
      }
    });

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    // Format selections for cart
    const properties = formatSelectionsForCart(visibleOptions, selections);

    // Main product
    const mainProduct = {
      id: 'main-product',
      title: productTitle,
      price: productPrice,
      quantity: quantity
    };

    // Grouped customization service
    const customizationService = {
      id: settings.customizationProductId,
      title: settings.customizationProductTitle,
      price: priceBreakdown.customizationPrice,
      quantity: 1,
      properties: properties,
      isCustomizationService: true
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    onAddToCart(mainProduct, customizationService);
    setIsLoading(false);
  };

  const renderOptionField = (option: ProductOption) => {
    const value = selections[option.id];
    const error = errors[option.id];
    const isChecked = (valueId: string) => {
      if (Array.isArray(value)) {
        return value.includes(valueId);
      }
      return value === valueId;
    };

    switch (option.type) {
      case OptionType.TEXT:
        return (
          <div className="space-y-2">
            <input
              type="text"
              placeholder={option.placeholder || 'Enter text...'}
              value={value || ''}
              onChange={(e) => handleSelect(option.id, e.target.value)}
              className={`w-full border-2 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                error ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#e64a5d]'
              } outline-none`}
              maxLength={option.validationRules?.maxLength}
            />
            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
            {option.helpText && <p className="text-xs text-gray-400">{option.helpText}</p>}
          </div>
        );

      case OptionType.TEXTAREA:
        return (
          <div className="space-y-2">
            <textarea
              placeholder={option.placeholder || 'Enter your message...'}
              value={value || ''}
              onChange={(e) => handleSelect(option.id, e.target.value)}
              rows={4}
              className={`w-full border-2 rounded-xl px-4 py-3 text-sm font-medium transition-all resize-none ${
                error ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#e64a5d]'
              } outline-none`}
              maxLength={option.validationRules?.maxLength}
            />
            {option.validationRules?.maxLength && (
              <p className="text-xs text-gray-400 text-right">
                {(value || '').length} / {option.validationRules.maxLength}
              </p>
            )}
            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
          </div>
        );

      case OptionType.NUMBER:
        return (
          <div className="space-y-2">
            <input
              type="number"
              placeholder={option.placeholder}
              value={value || ''}
              onChange={(e) => handleSelect(option.id, e.target.value)}
              min={option.validationRules?.min}
              max={option.validationRules?.max}
              className={`w-full border-2 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                error ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#e64a5d]'
              } outline-none`}
            />
            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
          </div>
        );

      case OptionType.FILE:
        return (
          <div className="space-y-2">
            <label className="flex items-center justify-center gap-3 w-full border-2 border-dashed border-gray-300 rounded-xl px-4 py-6 cursor-pointer hover:border-[#e64a5d] hover:bg-gray-50 transition-all">
              <i className="fas fa-cloud-upload-alt text-gray-400 text-xl"></i>
              <span className="text-sm font-bold text-gray-600">
                {value || settings.translations?.uploadFile || 'Upload File'}
              </span>
              <input
                type="file"
                className="hidden"
                accept={option.validationRules?.fileTypes?.join(',')}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(option.id, file);
                }}
              />
            </label>
            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
          </div>
        );

      case OptionType.RADIO:
      case OptionType.BUTTON:
        return (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-3">
              {option.values.map(val => (
                <label
                  key={val.id}
                  className={`flex items-center gap-2 px-4 py-3 border-2 rounded-xl cursor-pointer transition-all ${
                    isChecked(val.id)
                      ? 'border-[#e64a5d] bg-[#e64a5d]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name={option.id}
                    checked={isChecked(val.id)}
                    onChange={() => handleSelect(option.id, val.id)}
                    className="w-4 h-4 accent-[#e64a5d]"
                  />
                  <span className="text-sm font-bold text-gray-700">{val.label}</span>
                  {val.addPrice > 0 && settings.showPricesInOptions && (
                    <span className="text-xs font-black text-green-600">+${val.addPrice.toFixed(2)}</span>
                  )}
                </label>
              ))}
            </div>
            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
          </div>
        );

      case OptionType.CHECKBOX:
        return (
          <div className="space-y-3">
            {option.values.map(val => (
              <label
                key={val.id}
                className="flex items-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-gray-300 transition-all"
              >
                <input
                  type="checkbox"
                  checked={isChecked(val.id)}
                  onChange={(e) => handleCheckboxChange(option.id, val.id, e.target.checked)}
                  className="w-5 h-5 accent-[#e64a5d] rounded"
                />
                <span className="flex-1 text-sm font-bold text-gray-700">{val.label}</span>
                {val.addPrice > 0 && settings.showPricesInOptions && (
                  <span className="text-xs font-black text-green-600">+${val.addPrice.toFixed(2)}</span>
                )}
              </label>
            ))}
            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
          </div>
        );

      case OptionType.DROPDOWN:
      case OptionType.SELECT:
        return (
          <div className="space-y-2">
            <select
              value={value || ''}
              onChange={(e) => handleSelect(option.id, e.target.value)}
              className={`w-full border-2 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                error ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#e64a5d]'
              } outline-none bg-white`}
            >
              <option value="">{settings.translations?.chooseOption || 'Choose an option'}</option>
              {option.values.map(val => (
                <option key={val.id} value={val.id}>
                  {val.label}
                  {val.addPrice > 0 && settings.showPricesInOptions ? ` (+$${val.addPrice.toFixed(2)})` : ''}
                </option>
              ))}
            </select>
            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
          </div>
        );

      case OptionType.COLOR_SWATCH:
        return (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-3">
              {option.values.map(val => (
                <button
                  key={val.id}
                  onClick={() => handleSelect(option.id, val.id)}
                  className={`w-12 h-12 rounded-full border-4 transition-all ${
                    isChecked(val.id) ? 'border-gray-900 scale-110' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ backgroundColor: val.color || '#ccc' }}
                  title={val.label}
                />
              ))}
            </div>
            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
          </div>
        );

      case OptionType.IMAGE_SWATCH:
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-3">
              {option.values.map(val => (
                <button
                  key={val.id}
                  onClick={() => handleSelect(option.id, val.id)}
                  className={`aspect-square rounded-xl border-4 overflow-hidden transition-all ${
                    isChecked(val.id) ? 'border-[#e64a5d] scale-105' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {val.image ? (
                    <img src={val.image} alt={val.label} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">
                      {val.label}
                    </div>
                  )}
                </button>
              ))}
            </div>
            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
          </div>
        );

      case OptionType.HEADING:
        return (
          <h3 className="text-base font-black text-gray-900 uppercase tracking-wider border-b-2 border-gray-100 pb-3">
            {option.label}
          </h3>
        );

      case OptionType.DIVIDER:
        return <div className="border-t-2 border-gray-100 my-6" />;

      case OptionType.PARAGRAPH:
        return <p className="text-sm text-gray-600 leading-relaxed">{option.label}</p>;

      default:
        return (
          <div className="text-xs text-gray-400 italic">
            {option.type} field (coming soon)
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Options List */}
      <div className="space-y-6">
        {visibleOptions.map(option => (
          <div key={option.id} className="animate-fadeIn">
            {![OptionType.DIVIDER, OptionType.HEADING, OptionType.PARAGRAPH].includes(option.type) && (
              <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-3">
                {option.label}
                {option.isRequired && <span className="text-[#e64a5d] ml-1">*</span>}
                {!option.isRequired && (
                  <span className="text-gray-400 font-normal ml-2">
                    ({settings.translations?.optional || 'Optional'})
                  </span>
                )}
              </label>
            )}
            {renderOptionField(option)}
          </div>
        ))}
      </div>

      {/* Price Summary */}
      {settings.groupCustomizations && priceBreakdown.customizationPrice > 0 && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-500">
              {settings.translations?.customizationTotal || 'Customization Total'}
            </h4>
            <span className="px-3 py-1 bg-[#e64a5d] text-white text-xs font-black rounded-full">
              GROUPED
            </span>
          </div>

          {priceBreakdown.itemizedPrices.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-sm py-2 border-b border-gray-200 last:border-0">
              <span className="font-medium text-gray-600">
                {item.optionLabel}: <span className="font-bold text-gray-900">{item.valueLabel}</span>
              </span>
              <span className="font-black text-green-600">+${item.price.toFixed(2)}</span>
            </div>
          ))}

          <div className="flex justify-between items-center pt-4 mt-4 border-t-2 border-gray-300">
            <span className="text-sm font-black uppercase text-gray-700">Add-on Total:</span>
            <span className="text-2xl font-black text-gray-900">
              ${priceBreakdown.customizationPrice.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={isLoading}
        className="w-full py-5 bg-[#e64a5d] text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-black transition-all shadow-xl shadow-red-100 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <i className="fas fa-spinner fa-spin"></i>
            Processing...
          </>
        ) : (
          <>
            <i className="fas fa-shopping-cart"></i>
            {settings.translations?.addToCart || 'Add to Cart'}
          </>
        )}
      </button>

      {settings.groupCustomizations && (
        <p className="text-center text-xs font-medium text-gray-400">
          All customizations will be grouped into one service line item
        </p>
      )}
    </div>
  );
};

export default StorefrontCustomizer;
