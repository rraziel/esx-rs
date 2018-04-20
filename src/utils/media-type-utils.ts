import {RegExpUtils} from './reg-exp-utils';

const MEDIATYPE_DEFAULT: string = 'text/plain';
const MEDIATYPE_DEFAULT_REQUESTED: string = '*/*';
const MEDIATYPE_EXTENSION_QUALITY: string = 'q';
const MEDIATYPE_SEPARATOR: string = ',';
const MEDIATYPE_SEPARATOR_PARTS: string = ';';
const MEDIATYPE_REGEXP: RegExp =  /^([^=]+)=(.+)$/;

/**
 * Parsed media type
 */
interface ParsedMediaType {
    mediaType: string;
    quality: number;
}

/**
 * Media type utility functions
 */
class MediaTypeUtils {

    /**
     * Test whether a requested media type matches an operation's supported media types
     * @param requestedMediaTypes Requested media types
     * @param operationMediaTypes Operation media types
     * @return true if the media type matches the operation's media types
     */
    static supportsRequestedMediaTypes(requestedMediaTypes?: string, operationMediaTypes?: Set<string>): boolean {
        if (!requestedMediaTypes || !operationMediaTypes) {
            return true;
        }

        let parsedMediaTypes: Array<ParsedMediaType> = MediaTypeUtils.parseRequestedMediaTypes(requestedMediaTypes);
        for (let parsedMediaType of parsedMediaTypes) {
            if (MediaTypeUtils.supportsRequestedMediaType(parsedMediaType.mediaType, operationMediaTypes)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get a requested media type based on an operation's supported media types
     * @param requestedMediaTypes Requested media types
     * @param operationMediaTypes Operation media types
     * @return Requested media type
     */
    static getRequestedMediaType(requestedMediaTypes: string, operationMediaTypes: Set<string>): string {
        if (!requestedMediaTypes || !operationMediaTypes) {
            return MediaTypeUtils.getDefaultRequestedMediaType(requestedMediaTypes, operationMediaTypes);
        }

        let requestedMediaType: string = MediaTypeUtils.getMostRequestedMediaType(requestedMediaTypes);

        if (MediaTypeUtils.isWildcardMediaType(requestedMediaType)) {
            requestedMediaType = MediaTypeUtils.getMatchingMediaTypeWithWildcard(requestedMediaType, operationMediaTypes);
        }

        return requestedMediaType;
    }

    /**
     * Test whether a media type contains a wildcard
     * @param requestedMediaType Requested media type
     * @return true if the media type contains a wildcard
     */
    private static isWildcardMediaType(requestedMediaType: string): boolean {
        return requestedMediaType.indexOf('*') !== -1;
    }

    /**
     * Test whether a requested media type is supported by an operation
     * @param requestedMediaType  Requested media type
     * @param operationMediaTypes Operation media types
     * @return true if the requested media type is supported by the operation
     */
    private static supportsRequestedMediaType(requestedMediaType: string, operationMediaTypes: Set<string>): boolean {
        if (!MediaTypeUtils.isWildcardMediaType(requestedMediaType)) {
            return operationMediaTypes.has(requestedMediaType);
        } else {
            return MediaTypeUtils.supportsRequestedMediaTypeWithWildcard(requestedMediaType, operationMediaTypes);
        }
    }

    /**
     * Test whether a requested media type - with wildcard(s) - is supported by an operation
     * @param requestedMediaType  Requested media type
     * @param operationMediaTypes Operation media types
     * @return true if the requested media type is supported by the operation
     */
    private static supportsRequestedMediaTypeWithWildcard(requestedMediaType: string, operationMediaTypes: Set<string>): boolean {
        let regExp: RegExp = RegExpUtils.createWildcardRegExp(requestedMediaType);

        for (let operationMediaType of operationMediaTypes) {
            if (regExp.test(operationMediaType)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Given a requested media type - with wildcard(s) - get a media type supported an the operation
     * @param requestedMediaType  Requested media type
     * @param operationMediaTypes Operation media types
     */
    private static getMatchingMediaTypeWithWildcard(requestedMediaType: string, operationMediaTypes: Set<string>): string {
        let regExp: RegExp = RegExpUtils.createWildcardRegExp(requestedMediaType);

        for (let operationMediaType of operationMediaTypes) {
            if (regExp.test(operationMediaType)) {
                return operationMediaType;
            }
        }

        return undefined;
    }

    /**
     * Get a requested media type by default when there is either no requested media type or no declared supported media type
     * @param requestedMediaTypes Requested media types
     * @param operationMediaTypes Operation media types
     * @return Requested media type
     */
    private static getDefaultRequestedMediaType(requestedMediaTypes?: string, operationMediaTypes?: Set<string>): string {
        if (operationMediaTypes) {
            return MediaTypeUtils.getFirstSupportedMediaType(operationMediaTypes);
        } else if (requestedMediaTypes) {
            return MediaTypeUtils.getMostRequestedMediaType(requestedMediaTypes);
        }

        return MEDIATYPE_DEFAULT;
    }

    /**
     * Get the most requested media type
     * @param requestedMediaTypes Requested media types
     * @return Most requested media type
     */
    private static getMostRequestedMediaType(requestedMediaTypes: string): string {
        let parsedMediaTypes: Array<ParsedMediaType> = MediaTypeUtils.parseRequestedMediaTypes(requestedMediaTypes);
        let parsedMediaTypesByPriority: Array<ParsedMediaType> = parsedMediaTypes.sort(MediaTypeUtils.mediaTypePrioritySortPredicate);
        let requestedMediaType: string = parsedMediaTypes[0].mediaType;

        return requestedMediaType;
    }

    /**
     * Get the first supported media type
     * @param operationMediaTypes Operation media types
     * @return First supported media type
     */
    private static getFirstSupportedMediaType(operationMediaTypes: Set<string>): string {
        return operationMediaTypes.keys().next().value;
    }

    /**
     * Parsed requested media types
     * @param requestedMediaTypes Requested media types
     * @return Parsed media types
     */
    private static parseRequestedMediaTypes(requestedMediaTypes: string): Array<ParsedMediaType> {
        return requestedMediaTypes.split(MEDIATYPE_SEPARATOR)
            .map(requestedMediaType => MediaTypeUtils.parseRequestedMediaType(requestedMediaType))
        ;
    }

    /**
     * Parse a requested media type
     * @param requestedMediaType Requested media type
     * @return Parsed media type
     */
    private static parseRequestedMediaType(requestedMediaType: string): ParsedMediaType {
        let mediaTypeParts: string[] = requestedMediaType.split(MEDIATYPE_SEPARATOR_PARTS);
        let parsedMediaType: ParsedMediaType = {
            mediaType: MEDIATYPE_DEFAULT_REQUESTED,
            quality: 1.0
        };

        for (let mediaTypePart of mediaTypeParts) {
            mediaTypePart = mediaTypePart.trim();
            MediaTypeUtils.parseMediaTypePart(parsedMediaType, mediaTypePart);
        }

        return parsedMediaType;
    }

    /**
     * Parse a media type part
     * @param parsedMediaType Parsed media type
     * @param mediaTypePart   Media type part
     */
    private static parseMediaTypePart(parsedMediaType: ParsedMediaType, mediaTypePart: string): void {
        let matches: RegExpMatchArray = mediaTypePart.match(MEDIATYPE_REGEXP);
        if (matches) {
            let extensionName: string = matches[1];
            let extensionValue: string = matches[2];
            MediaTypeUtils.parseMediaTypeExtensionPart(parsedMediaType, extensionName, extensionValue);
        } else {
            parsedMediaType.mediaType = mediaTypePart;
        }
    }

    /**
     * Parse a media type extension part
     * @param parsedMediaType Parsed media type
     * @param extensionName   Extension name
     * @param extensionValue  Extension value
     */
    private static parseMediaTypeExtensionPart(parsedMediaType: ParsedMediaType, extensionName: string, extensionValue: string): void {
        if (extensionName === MEDIATYPE_EXTENSION_QUALITY) {
            try {
                parsedMediaType.quality = parseFloat(extensionValue);
            } catch (e) {
                // Invalid values are ignored
            }
        }
    }

    /**
     * Media type priority sort predicate
     * @param lhs Parsed media type
     * @param rhs Parsed media type
     * @return Order indicator
     */
    private static mediaTypePrioritySortPredicate(lhs: ParsedMediaType, rhs: ParsedMediaType): number {
        return rhs.quality - lhs.quality;
    }

}

export {
    MediaTypeUtils
};
