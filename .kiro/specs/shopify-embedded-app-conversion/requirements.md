# Requirements Document: Shopify Embedded App Conversion

## Introduction

This specification defines the requirements for converting an existing standalone React admin panel application into a fully-integrated Shopify embedded app. The current application is a product customization tool that manages option sets (customization configurations) for products. The conversion will enable the application to run embedded within the Shopify Admin interface, integrate with Shopify's product and metafield APIs, implement proper OAuth authentication, and support deployment to Shopify's infrastructure.

The converted application will maintain all existing functionality while adding Shopify-native features including App Bridge integration, OAuth authentication, webhook handling, and proper data persistence using Shopify metafields.

## Glossary

- **Shopify_App**: The complete application system including backend server and embedded frontend
- **App_Bridge**: Shopify's JavaScript library for embedded app communication with Shopify Admin
- **Option_Set**: A collection of customization options that can be applied to products
- **Product_Option**: An individual customization field (text input, dropdown, color picker, etc.)
- **Metafield**: Shopify's mechanism for storing custom data on resources (products, shops, etc.)
- **OAuth_Flow**: Shopify's authentication mechanism for app installation and access
- **Session_Token**: JWT token used for authenticating embedded app requests
- **Webhook**: HTTP callback from Shopify when specific events occur
- **Admin_API**: Shopify's GraphQL/REST API for managing store data
- **Storefront_Extension**: Theme app extension that renders customization UI on product pages
- **Backend_Server**: Node.js server handling authentication, API requests, and data persistence
- **Embedded_Frontend**: React application running inside Shopify Admin iframe

## Requirements

### Requirement 1: Shopify App Architecture Setup

**User Story:** As a developer, I want to set up a proper Shopify app architecture with backend and frontend separation, so that the application can authenticate with Shopify and run embedded in Shopify Admin.

#### Acceptance Criteria

1. THE Shopify_App SHALL consist of a Backend_Server and an Embedded_Frontend as separate components
2. WHEN the app is installed, THE Backend_Server SHALL handle the OAuth_Flow and store access tokens securely
3. THE Backend_Server SHALL use Node.js with Express framework
4. THE Backend_Server SHALL implement session management using encrypted session storage
5. THE Embedded_Frontend SHALL be built using React 19 and TypeScript with Vite
6. THE Shopify_App SHALL use Shopify App Bridge for embedded app functionality
7. THE Backend_Server SHALL validate all incoming requests using session tokens or HMAC verification

### Requirement 2: OAuth Authentication and Installation

**User Story:** As a merchant, I want to install the app through Shopify's OAuth flow, so that the app can securely access my store data.

#### Acceptance Criteria

1. WHEN a merchant initiates app installation, THE Backend_Server SHALL redirect to Shopify's OAuth authorization page
2. THE Backend_Server SHALL request the following API scopes: read_products, write_products, read_product_listings, write_metafields, read_metafields
3. WHEN Shopify redirects back with an authorization code, THE Backend_Server SHALL exchange it for an access token
4. THE Backend_Server SHALL store the access token encrypted in a database or secure storage
5. WHEN installation completes, THE Backend_Server SHALL redirect the merchant to the Embedded_Frontend
6. IF OAuth verification fails, THEN THE Backend_Server SHALL display an error message and prevent app access
7. THE Backend_Server SHALL implement HMAC validation for all OAuth callbacks

### Requirement 3: Embedded App Integration with App Bridge

**User Story:** As a merchant, I want the app to run seamlessly embedded in Shopify Admin, so that I have a native Shopify experience.

#### Acceptance Criteria

1. THE Embedded_Frontend SHALL initialize Shopify App Bridge on application load
2. THE Embedded_Frontend SHALL use App Bridge for navigation within Shopify Admin
3. THE Embedded_Frontend SHALL use App Bridge Toast API for notifications instead of custom toast component
4. THE Embedded_Frontend SHALL use Polaris design system components for consistent Shopify UI
5. WHEN the user navigates away from the app, THE Embedded_Frontend SHALL use App Bridge navigation methods
6. THE Embedded_Frontend SHALL obtain session tokens from App Bridge for authenticating API requests
7. THE Embedded_Frontend SHALL handle App Bridge authentication errors gracefully

### Requirement 4: Product Data Integration

**User Story:** As a merchant, I want the app to fetch and display my actual Shopify products, so that I can assign option sets to real products in my store.

#### Acceptance Criteria

1. WHEN the Products tab is accessed, THE Backend_Server SHALL fetch products from Shopify Admin API
2. THE Backend_Server SHALL use GraphQL API for product queries with pagination support
3. THE Shopify_App SHALL display product title, handle, price, image, and inventory from Shopify data
4. WHEN a product sync is triggered, THE Backend_Server SHALL fetch updated product data from Shopify
5. THE Shopify_App SHALL cache product data to minimize API calls
6. IF API rate limits are reached, THEN THE Backend_Server SHALL implement exponential backoff retry logic
7. THE Shopify_App SHALL display the count of option sets assigned to each product

### Requirement 5: Option Set Storage in Metafields

**User Story:** As a merchant, I want my option sets to be stored in Shopify metafields, so that my customization data persists with my store and is accessible to theme extensions.

#### Acceptance Criteria

1. WHEN an option set is saved, THE Backend_Server SHALL store it as a JSON string in a shop-level metafield
2. THE Backend_Server SHALL use the metafield namespace "custom_options" and key format "option_set_{id}"
3. WHEN an option set is assigned to products, THE Backend_Server SHALL store the option set ID in product metafields
4. THE Backend_Server SHALL use the metafield namespace "custom_options" and key "assigned_option_sets" for product assignments
5. WHEN the app loads, THE Backend_Server SHALL fetch all option sets from shop metafields
6. WHEN an option set is deleted, THE Backend_Server SHALL remove the corresponding metafield
7. THE Backend_Server SHALL validate metafield data structure before saving

### Requirement 6: API Endpoints for Frontend Communication

**User Story:** As a developer, I want RESTful API endpoints on the backend, so that the frontend can perform CRUD operations on option sets and fetch product data.

#### Acceptance Criteria

1. THE Backend_Server SHALL provide GET /api/option-sets endpoint to fetch all option sets
2. THE Backend_Server SHALL provide POST /api/option-sets endpoint to create new option sets
3. THE Backend_Server SHALL provide PUT /api/option-sets/:id endpoint to update existing option sets
4. THE Backend_Server SHALL provide DELETE /api/option-sets/:id endpoint to delete option sets
5. THE Backend_Server SHALL provide GET /api/products endpoint to fetch Shopify products with pagination
6. THE Backend_Server SHALL provide POST /api/products/sync endpoint to trigger product data refresh
7. THE Backend_Server SHALL validate session tokens on all API endpoints before processing requests
8. IF session token validation fails, THEN THE Backend_Server SHALL return 401 Unauthorized response

### Requirement 7: Session Token Authentication for API Requests

**User Story:** As a developer, I want all API requests from the embedded frontend to be authenticated using session tokens, so that the app is secure and follows Shopify best practices.

#### Acceptance Criteria

1. WHEN the Embedded_Frontend makes an API request, THE Embedded_Frontend SHALL obtain a session token from App Bridge
2. THE Embedded_Frontend SHALL include the session token in the Authorization header as a Bearer token
3. THE Backend_Server SHALL verify session tokens using Shopify's public key
4. THE Backend_Server SHALL extract the shop domain from the verified session token
5. IF a session token is expired, THEN THE Embedded_Frontend SHALL request a new token from App Bridge
6. IF session token verification fails, THEN THE Backend_Server SHALL return 401 Unauthorized
7. THE Backend_Server SHALL use the shop domain from the token to scope all data operations

### Requirement 8: Webhook Integration for Data Synchronization

**User Story:** As a merchant, I want the app to automatically update when products are added, updated, or deleted in my store, so that the product list stays synchronized.

#### Acceptance Criteria

1. WHEN the app is installed, THE Backend_Server SHALL register webhooks for products/create, products/update, and products/delete topics
2. WHEN a product webhook is received, THE Backend_Server SHALL verify the HMAC signature
3. WHEN a products/create webhook is received, THE Backend_Server SHALL add the new product to the cached product list
4. WHEN a products/update webhook is received, THE Backend_Server SHALL update the corresponding product in the cache
5. WHEN a products/delete webhook is received, THE Backend_Server SHALL remove the product from the cache and unassign any option sets
6. IF HMAC verification fails, THEN THE Backend_Server SHALL reject the webhook and log the security event
7. THE Backend_Server SHALL respond to webhooks with 200 OK within 5 seconds

### Requirement 9: Polaris Design System Integration

**User Story:** As a merchant, I want the app interface to match Shopify's design language, so that it feels like a native part of Shopify Admin.

#### Acceptance Criteria

1. THE Embedded_Frontend SHALL use Shopify Polaris components for all UI elements
2. THE Embedded_Frontend SHALL replace custom sidebar with Polaris Navigation component
3. THE Embedded_Frontend SHALL use Polaris Page component for page layouts
4. THE Embedded_Frontend SHALL use Polaris Card components for content sections
5. THE Embedded_Frontend SHALL use Polaris Button components with appropriate variants
6. THE Embedded_Frontend SHALL use Polaris Toast component via App Bridge for notifications
7. THE Embedded_Frontend SHALL use Polaris DataTable or IndexTable for product and option set lists
8. THE Embedded_Frontend SHALL follow Polaris spacing, typography, and color guidelines

### Requirement 10: Environment Configuration and Deployment

**User Story:** As a developer, I want proper environment configuration and deployment setup, so that the app can be deployed to production and tested in development.

#### Acceptance Criteria

1. THE Shopify_App SHALL use environment variables for all configuration (API keys, secrets, database URLs)
2. THE Backend_Server SHALL load configuration from .env files in development
3. THE Shopify_App SHALL support deployment to Shopify's hosting infrastructure or custom hosting
4. THE Backend_Server SHALL serve the built Embedded_Frontend static files in production
5. THE Shopify_App SHALL use HTTPS in production for secure communication
6. THE Backend_Server SHALL implement health check endpoint at /api/health
7. THE Shopify_App SHALL include a shopify.app.toml configuration file for Shopify CLI deployment

### Requirement 11: Google Gemini AI Service Integration

**User Story:** As a merchant, I want the AI-powered copy generation feature to continue working in the embedded app, so that I can generate help text and placeholders for options.

#### Acceptance Criteria

1. THE Backend_Server SHALL proxy Google Gemini API requests to protect the API key
2. THE Backend_Server SHALL provide POST /api/ai/generate-copy endpoint for AI generation
3. WHEN the Embedded_Frontend requests AI-generated copy, THE Backend_Server SHALL call Google Gemini API
4. THE Backend_Server SHALL store the Google Gemini API key in environment variables
5. THE Backend_Server SHALL validate AI generation requests before calling the external API
6. IF the AI API call fails, THEN THE Backend_Server SHALL return a graceful error response
7. THE Backend_Server SHALL implement rate limiting for AI generation requests

### Requirement 12: Settings Persistence

**User Story:** As a merchant, I want my app settings to be saved in Shopify, so that my preferences persist across sessions and devices.

#### Acceptance Criteria

1. WHEN settings are saved, THE Backend_Server SHALL store them in a shop-level metafield
2. THE Backend_Server SHALL use the metafield namespace "custom_options" and key "app_settings"
3. WHEN the app loads, THE Backend_Server SHALL fetch settings from the shop metafield
4. THE Backend_Server SHALL provide GET /api/settings endpoint to fetch current settings
5. THE Backend_Server SHALL provide PUT /api/settings endpoint to update settings
6. IF no settings metafield exists, THEN THE Backend_Server SHALL return default settings
7. THE Backend_Server SHALL validate settings data structure before saving

### Requirement 13: Error Handling and Logging

**User Story:** As a developer, I want comprehensive error handling and logging, so that I can debug issues and monitor app health in production.

#### Acceptance Criteria

1. THE Backend_Server SHALL log all API requests with timestamp, endpoint, and shop domain
2. THE Backend_Server SHALL log all errors with stack traces and context information
3. WHEN an API error occurs, THE Backend_Server SHALL return structured error responses with error codes
4. THE Embedded_Frontend SHALL display user-friendly error messages for API failures
5. THE Backend_Server SHALL implement centralized error handling middleware
6. THE Backend_Server SHALL log webhook events and processing results
7. THE Shopify_App SHALL support integration with external logging services (e.g., Sentry, LogRocket)

### Requirement 14: Development Tools and Testing Setup

**User Story:** As a developer, I want proper development tools and testing infrastructure, so that I can develop and test the app efficiently.

#### Acceptance Criteria

1. THE Shopify_App SHALL use Shopify CLI for local development with tunnel support
2. THE Backend_Server SHALL support hot reloading in development mode
3. THE Embedded_Frontend SHALL support hot module replacement (HMR) in development
4. THE Shopify_App SHALL include a test store configuration for development
5. THE Backend_Server SHALL use ngrok or Cloudflare tunnel for local HTTPS during development
6. THE Shopify_App SHALL include TypeScript type definitions for all Shopify API responses
7. THE Shopify_App SHALL include a README with setup and development instructions

### Requirement 15: Migration from Local Storage to Shopify Storage

**User Story:** As a developer, I want to migrate existing option sets from localStorage to Shopify metafields, so that existing data is preserved during the conversion.

#### Acceptance Criteria

1. WHEN the app first loads after conversion, THE Backend_Server SHALL check for a migration flag
2. IF migration is needed, THEN THE Backend_Server SHALL provide an import endpoint for option set data
3. THE Backend_Server SHALL validate imported option set data structure
4. WHEN option sets are imported, THE Backend_Server SHALL create corresponding metafields
5. THE Backend_Server SHALL provide feedback on migration success or failure
6. AFTER successful migration, THE Backend_Server SHALL set a migration completed flag
7. THE Shopify_App SHALL include migration documentation for merchants

### Requirement 16: Storefront Theme Extension

**User Story:** As a merchant, I want a theme app extension that displays customization options on product pages, so that customers can customize products on my storefront.

#### Acceptance Criteria

1. THE Shopify_App SHALL include a theme app extension for rendering option sets on product pages
2. THE Storefront_Extension SHALL fetch assigned option sets from product metafields
3. THE Storefront_Extension SHALL render option inputs based on option type (text, dropdown, color picker, etc.)
4. WHEN a customer selects options, THE Storefront_Extension SHALL calculate and display price adjustments
5. WHEN a customer adds to cart, THE Storefront_Extension SHALL include customization data as line item properties
6. THE Storefront_Extension SHALL validate required fields before allowing add to cart
7. THE Storefront_Extension SHALL support conditional logic for showing/hiding options based on other selections
8. THE Storefront_Extension SHALL use Liquid templating and JavaScript for rendering

### Requirement 17: App Uninstallation Handling

**User Story:** As a merchant, I want the app to clean up properly when uninstalled, so that no orphaned data remains in my store.

#### Acceptance Criteria

1. WHEN the app is uninstalled, THE Backend_Server SHALL receive an app/uninstalled webhook
2. WHEN the uninstall webhook is received, THE Backend_Server SHALL delete the shop's access token
3. THE Backend_Server SHALL delete all session data for the uninstalled shop
4. THE Backend_Server SHALL log the uninstallation event with timestamp and shop domain
5. THE Backend_Server SHALL optionally delete all metafields created by the app (configurable)
6. IF webhook processing fails, THEN THE Backend_Server SHALL retry with exponential backoff
7. THE Backend_Server SHALL send uninstallation confirmation to monitoring systems

### Requirement 18: Rate Limiting and API Quota Management

**User Story:** As a developer, I want proper rate limiting and API quota management, so that the app doesn't exceed Shopify's API limits and cause service disruptions.

#### Acceptance Criteria

1. THE Backend_Server SHALL track Shopify API rate limit headers from responses
2. WHEN API rate limit is approaching, THE Backend_Server SHALL delay subsequent requests
3. THE Backend_Server SHALL implement request queuing for bulk operations
4. THE Backend_Server SHALL use GraphQL query cost analysis to optimize API usage
5. IF rate limit is exceeded, THEN THE Backend_Server SHALL retry requests after the reset time
6. THE Backend_Server SHALL log rate limit warnings for monitoring
7. THE Backend_Server SHALL implement client-side rate limiting for AI API calls
