import { HTTP_STATUS_CODES } from './statusCode';

class APIResponseValidator {
    constructor(isDevelopment = false) {
        this.isDevelopment = isDevelopment;
        this.HTTP_STATUS_CODES = HTTP_STATUS_CODES;
        this.reset();
    }

    reset() {
        this.errors = [];
        this.success = false;
        this.data = null;
        this.message = "";
        this.devInfo = {
            timestamp: null,
            endpoint: null,
            method: null,
            statusCode: null,
            statusText: null,
            headers: null,
            stack: null
        };
    }

    /**
     * Validates and processes an API response
     * @param {Response} response - Fetch API Response object
     * @param {Object} requestInfo - Additional request information
     * @returns {Promise<Object>} Formatted response with user and developer information
     */
    async validateResponse(response, requestInfo = {}) {
        try {
            const status = response.status;
            this.success = status >= 200 && status < 300;

            // Record developer information
            this.devInfo = {
                timestamp: new Date().toISOString(),
                endpoint: response.url,
                method: requestInfo.method || 'GET',
                statusCode: status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries()),
                stack: new Error().stack
            };

            if (this.success) {
                this.data = await this.parseResponseData(response);
                this.message = this.getStatusMessage(status).userMessage;
            } else {
                await this.handleErrorResponse(response);
            }

            return this.formatResponse();
        } catch (error) {
            this.success = false;
            this.errors.push(`Error processing response: ${error.message}`);
            this.devInfo.error = {
                message: error.message,
                stack: error.stack
            };
            return this.formatResponse();
        }
    }

    /**
     * Parses response data based on content type
     * @param {Response} response - Fetch API Response object
     * @returns {Promise<any>} Parsed response data
     */
    async parseResponseData(response) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        }
        return await response.text();
    }

    /**
     * Handles error responses and extracts meaningful error messages
     * @param {Response} response - Fetch API Response object
     */
    async handleErrorResponse(response) {
        const status = response.status;
        this.message = this.getStatusMessage(status).userMessage;

        try {
            const errorData = await response.json();
            
            if (typeof errorData === 'object') {
                if (errorData.detail) {
                    this.errors.push(errorData.detail);
                } else if (errorData.errors) {
                    this.errors = Array.isArray(errorData.errors) 
                        ? errorData.errors 
                        : [errorData.errors];
                } else {
                    Object.entries(errorData).forEach(([field, errors]) => {
                        if (Array.isArray(errors)) {
                            errors.forEach(error => {
                                this.errors.push(`${this.formatFieldName(field)}: ${error}`);
                            });
                        } else {
                            this.errors.push(`${this.formatFieldName(field)}: ${errors}`);
                        }
                    });
                }
            } else if (Array.isArray(errorData)) {
                this.errors = errorData;
            } else {
                this.errors.push(String(errorData));
            }
        } catch (error) {
            const errorText = await response.text();
            this.errors.push(errorText || "No error details available");
        }
    }

    /**
     * Gets status message information for a given status code
     * @param {number} status - HTTP status code
     * @returns {Object} Status message information
     */
    getStatusMessage(status) {
        return this.HTTP_STATUS_CODES[status] || {
            name: 'Unknown Status',
            userMessage: 'An unknown error occurred',
            devMessage: `Unknown status code: ${status}`
        };
    }

    /**
     * Formats the field name for user display
     * @param {string} field - The field name to format
     * @returns {string} Formatted field name
     */
    formatFieldName(field) {
        return field
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    /**
     * Formats the response including developer information when in development mode
     * @returns {Object} Formatted response
     */
    formatResponse() {
        const response = {
            success: this.success,
            data: this.success ? this.data : null,
            message: this.message,
            errors: this.success ? [] : this.errors
        };

        if (this.isDevelopment) {
            response.dev = {
                ...this.devInfo,
                statusInfo: this.getStatusMessage(this.devInfo.statusCode)
            };
        }

        return response;
    }
}

const validator = new APIResponseValidator(true);

export default validator;