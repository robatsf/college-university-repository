export const HTTP_STATUS_CODES = {
    // 1xx Informational
    100: {
        name: 'Continue',
        userMessage: 'Request in progress',
        devMessage: 'Server received request headers, client should proceed with request'
    },
    101: {
        name: 'Switching Protocols',
        userMessage: 'Changing connection type',
        devMessage: 'Server is switching protocols as requested'
    },
    102: {
        name: 'Processing',
        userMessage: 'Processing request',
        devMessage: 'Server is processing the request but no response is available yet'
    },
    103: {
        name: 'Early Hints',
        userMessage: 'Preparing response',
        devMessage: 'Server is likely to send a final response with the included headers'
    },

    // 2xx Success
    200: {
        name: 'OK',
        userMessage: 'Request successful',
        devMessage: 'Request succeeded with response data'
    },
    201: {
        name: 'Created',
        userMessage: 'Successfully created',
        devMessage: 'Request succeeded and new resource was created'
    },
    202: {
        name: 'Accepted',
        userMessage: 'Request accepted',
        devMessage: 'Request accepted for processing but not yet completed'
    },
    203: {
        name: 'Non-Authoritative Information',
        userMessage: 'Request successful with modified data',
        devMessage: 'Request processed through a proxy that modified the server\'s response'
    },
    204: {
        name: 'No Content',
        userMessage: 'Request completed',
        devMessage: 'Request succeeded but no content returned'
    },
    205: {
        name: 'Reset Content',
        userMessage: 'Please refresh the page',
        devMessage: 'Request processed, client should reset the document view'
    },
    206: {
        name: 'Partial Content',
        userMessage: 'Partial content loaded',
        devMessage: 'Server is delivering only part of the resource due to range header'
    },
    207: {
        name: 'Multi-Status',
        userMessage: 'Multiple operations completed',
        devMessage: 'Multiple status codes for multiple operations'
    },
    208: {
        name: 'Already Reported',
        userMessage: 'Information already provided',
        devMessage: 'Members of a DAV binding have already been enumerated'
    },
    226: {
        name: 'IM Used',
        userMessage: 'Request completed with modifications',
        devMessage: 'Server has fulfilled GET request using delta encoding'
    },

    // 3xx Redirection
    300: {
        name: 'Multiple Choices',
        userMessage: 'Multiple options available',
        devMessage: 'Multiple options available for the resource'
    },
    301: {
        name: 'Moved Permanently',
        userMessage: 'Page moved permanently',
        devMessage: 'Resource has been permanently moved to a new URL'
    },
    302: {
        name: 'Found',
        userMessage: 'Page temporarily moved',
        devMessage: 'Resource temporarily moved to a different URL'
    },
    303: {
        name: 'See Other',
        userMessage: 'Resource found elsewhere',
        devMessage: 'Response found at a different URL using GET'
    },
    304: {
        name: 'Not Modified',
        userMessage: 'Content unchanged',
        devMessage: 'Resource not modified since last request'
    },
    305: {
        name: 'Use Proxy',
        userMessage: 'Please use proxy',
        devMessage: 'Requested resource must be accessed through proxy'
    },
    307: {
        name: 'Temporary Redirect',
        userMessage: 'Temporarily redirected',
        devMessage: 'Resource temporarily moved, maintain request method'
    },
    308: {
        name: 'Permanent Redirect',
        userMessage: 'Permanently redirected',
        devMessage: 'Resource permanently moved, maintain request method'
    },

    // 4xx Client Errors
    400: {
        name: 'Bad Request',
        userMessage: 'Invalid request',
        devMessage: 'Server cannot process request due to client error'
    },
    401: {
        name: 'Unauthorized',
        userMessage: 'Please login to continue',
        devMessage: 'Authentication required and has failed or not been provided'
    },
    402: {
        name: 'Payment Required',
        userMessage: 'Payment required',
        devMessage: 'Payment required to access resource'
    },
    403: {
        name: 'Forbidden',
        userMessage: 'Access denied',
        devMessage: 'Server refuses to authorize request'
    },
    404: {
        name: 'Not Found',
        userMessage: 'Resource not found',
        devMessage: 'Requested resource could not be found on the server'
    },
    405: {
        name: 'Method Not Allowed',
        userMessage: 'Operation not allowed',
        devMessage: 'Request method not supported for the requested resource'
    },
    406: {
        name: 'Not Acceptable',
        userMessage: 'Request cannot be processed',
        devMessage: 'Resource cannot generate response matching accept headers'
    },
    407: {
        name: 'Proxy Authentication Required',
        userMessage: 'Proxy authentication required',
        devMessage: 'Client must authenticate with proxy'
    },
    408: {
        name: 'Request Timeout',
        userMessage: 'Request timed out',
        devMessage: 'Server timed out waiting for request'
    },
    409: {
        name: 'Conflict',
        userMessage: 'Request conflict',
        devMessage: 'Request conflicts with server state'
    },
    410: {
        name: 'Gone',
        userMessage: 'Content no longer available',
        devMessage: 'Resource permanently removed'
    },
    411: {
        name: 'Length Required',
        userMessage: 'Invalid request format',
        devMessage: 'Content-Length header required'
    },
    412: {
        name: 'Precondition Failed',
        userMessage: 'Request cannot be completed',
        devMessage: 'Precondition in headers failed'
    },
    413: {
        name: 'Payload Too Large',
        userMessage: 'Request too large',
        devMessage: 'Request entity exceeds server limits'
    },
    414: {
        name: 'URI Too Long',
        userMessage: 'Request URL too long',
        devMessage: 'Request URL exceeds server limits'
    },
    415: {
        name: 'Unsupported Media Type',
        userMessage: 'File format not supported',
        devMessage: 'Request media type not supported'
    },
    416: {
        name: 'Range Not Satisfiable',
        userMessage: 'Request range not available',
        devMessage: 'Requested range cannot be fulfilled'
    },
    417: {
        name: 'Expectation Failed',
        userMessage: 'Request failed',
        devMessage: 'Server cannot meet Expect header requirements'
    },
    418: {
        name: 'I\'m a teapot',
        userMessage: 'Cannot brew coffee',
        devMessage: 'Server refuses to brew coffee because it is a teapot'
    },
    421: {
        name: 'Misdirected Request',
        userMessage: 'Request sent to wrong server',
        devMessage: 'Server cannot produce response for this request'
    },
    422: {
        name: 'Unprocessable Entity',
        userMessage: 'Invalid input provided',
        devMessage: 'Request semantically incorrect'
    },
    423: {
        name: 'Locked',
        userMessage: 'Resource is locked',
        devMessage: 'Resource is locked'
    },
    424: {
        name: 'Failed Dependency',
        userMessage: 'Request failed due to previous error',
        devMessage: 'Request failed due to failed dependency'
    },
    425: {
        name: 'Too Early',
        userMessage: 'Request cannot be processed yet',
        devMessage: 'Server unwilling to risk processing early request'
    },
    426: {
        name: 'Upgrade Required',
        userMessage: 'Please upgrade',
        devMessage: 'Client should upgrade to required protocol'
    },
    428: {
        name: 'Precondition Required',
        userMessage: 'Additional action required',
        devMessage: 'Precondition header required'
    },
    429: {
        name: 'Too Many Requests',
        userMessage: 'Too many requests, please wait',
        devMessage: 'User has sent too many requests in given time'
    },
    431: {
        name: 'Request Header Fields Too Large',
        userMessage: 'Request header too large',
        devMessage: 'Header fields too large for server'
    },
    451: {
        name: 'Unavailable For Legal Reasons',
        userMessage: 'Content not available for legal reasons',
        devMessage: 'Resource unavailable due to legal demands'
    },

    // 5xx Server Errors
    500: {
        name: 'Internal Server Error',
        userMessage: 'Server error occurred',
        devMessage: 'Server encountered an unexpected condition'
    },
    501: {
        name: 'Not Implemented',
        userMessage: 'Service not available',
        devMessage: 'Server does not support functionality required'
    },
    502: {
        name: 'Bad Gateway',
        userMessage: 'Server temporarily unavailable',
        devMessage: 'Server received invalid response from upstream server'
    },
    503: {
        name: 'Service Unavailable',
        userMessage: 'Service temporarily unavailable',
        devMessage: 'Server temporarily unable to handle request'
    },
    504: {
        name: 'Gateway Timeout',
        userMessage: 'Server timeout',
        devMessage: 'Gateway timeout waiting for upstream server'
    },
    505: {
        name: 'HTTP Version Not Supported',
        userMessage: 'Service not supported',
        devMessage: 'HTTP version not supported by server'
    },
    506: {
        name: 'Variant Also Negotiates',
        userMessage: 'Configuration error',
        devMessage: 'Server has internal configuration error'
    },
    507: {
        name: 'Insufficient Storage',
        userMessage: 'Server storage full',
        devMessage: 'Server unable to store required representation'
    },
    508: {
        name: 'Loop Detected',
        userMessage: 'Request loop detected',
        devMessage: 'Server detected infinite loop while processing'
    },
    510: {
        name: 'Not Extended',
        userMessage: 'Server extension required',
        devMessage: 'Further extensions required for server to fulfill request'
    },
    511: {
        name: 'Network Authentication Required',
        userMessage: 'Network login required',
        devMessage: 'Client needs to authenticate to gain network access'
    }
};

export default HTTP_STATUS_CODES;