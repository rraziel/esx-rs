import {MediaTypeUtils} from './media-type-utils';

describe('Media type utility functions', () => {

    describe('can test whether requested media types are supported', () => {

        it('for a single media type', () => {
            // given
            let requestedMediaTypes1: string = 'application/json';
            let requestedMediaTypes2: string = 'text/plain';
            let operationMediaTypes: Set<string> = new Set<string>(['application/json']);
            // when
            let supported1: boolean = MediaTypeUtils.supportsRequestedMediaTypes(requestedMediaTypes1, operationMediaTypes);
            let supported2: boolean = MediaTypeUtils.supportsRequestedMediaTypes(requestedMediaTypes2, operationMediaTypes);
            // then
            expect(supported1).toBe(true);
            expect(supported2).toBe(false);
        });

        it('for multiple media types', () => {
            // given
            let requestedMediaTypes1: string = 'application/json, application/xml';
            let requestedMediaTypes2: string = 'text/plain, application/json';
            let requestedMediaTypes3: string = 'text/plain, application/xml';
            let operationMediaTypes: Set<string> = new Set<string>(['application/json']);
            // when
            let supported1: boolean = MediaTypeUtils.supportsRequestedMediaTypes(requestedMediaTypes1, operationMediaTypes);
            let supported2: boolean = MediaTypeUtils.supportsRequestedMediaTypes(requestedMediaTypes2, operationMediaTypes);
            let supported3: boolean = MediaTypeUtils.supportsRequestedMediaTypes(requestedMediaTypes3, operationMediaTypes);
            // then
            expect(supported1).toBe(true);
            expect(supported2).toBe(true);
            expect(supported3).toBe(false);
        });

        it('for multiple media types with quality', () => {
            // given
            let requestedMediaTypes1: string = 'application/json, application/xml;q=0.2';
            let requestedMediaTypes2: string = 'text/plain;q=0.8, application/json';
            let requestedMediaTypes3: string = 'text/plain, application/xml;q=0.5';
            let operationMediaTypes: Set<string> = new Set<string>(['application/json']);
            // when
            let supported1: boolean = MediaTypeUtils.supportsRequestedMediaTypes(requestedMediaTypes1, operationMediaTypes);
            let supported2: boolean = MediaTypeUtils.supportsRequestedMediaTypes(requestedMediaTypes2, operationMediaTypes);
            let supported3: boolean = MediaTypeUtils.supportsRequestedMediaTypes(requestedMediaTypes3, operationMediaTypes);
            // then
            expect(supported1).toBe(true);
            expect(supported2).toBe(true);
            expect(supported3).toBe(false);
        });

        it('for media types with wildcards', () => {
            // given
            let requestedMediaTypes1: string = 'application/*';
            let requestedMediaTypes2: string = 'text/*';
            let operationMediaTypes: Set<string> = new Set<string>(['application/json']);
            // when
            let supported1: boolean = MediaTypeUtils.supportsRequestedMediaTypes(requestedMediaTypes1, operationMediaTypes);
            let supported2: boolean = MediaTypeUtils.supportsRequestedMediaTypes(requestedMediaTypes2, operationMediaTypes);
            // then
            expect(supported1).toBe(true);
            expect(supported2).toBe(false);
        });

    });

    describe('can get the best matching media type', () => {

        it('for a single media type', () => {
            // given
            let requestedMediaTypes: string = 'application/json';
            let operationMediaTypes: Set<string> = new Set<string>(['application/json', 'application/xml']);
            // when
            let mediaType: string = MediaTypeUtils.getRequestedMediaType(requestedMediaTypes, operationMediaTypes);
            // then
            expect(mediaType).toBe('application/json');
        });

        it('for multiple media types', () => {
            // given
            let requestedMediaTypes: string = 'application/json, application/xml';
            let operationMediaTypes: Set<string> = new Set<string>(['application/json', 'application/xml']);
            // when
            let mediaType: string = MediaTypeUtils.getRequestedMediaType(requestedMediaTypes, operationMediaTypes);
            // then
            expect(mediaType).toBe('application/json');
        });

        it('for multiple media types with quality', () => {
            // given
            let requestedMediaTypes: string = 'application/json;q=0.2, application/xml';
            let operationMediaTypes: Set<string> = new Set<string>(['application/json', 'application/xml']);
            // when
            let mediaType: string = MediaTypeUtils.getRequestedMediaType(requestedMediaTypes, operationMediaTypes);
            // then
            expect(mediaType).toBe('application/xml');
        });

        it('for media types with wildcards', () => {
            // given
            let requestedMediaTypes: string = 'application/*';
            let operationMediaTypes: Set<string> = new Set<string>(['application/json', 'application/xml']);
            // when
            let mediaType: string = MediaTypeUtils.getRequestedMediaType(requestedMediaTypes, operationMediaTypes);
            // then
            expect(mediaType).toBe('application/json');
        });

        it('for media types with wildcards and quality', () => {
            // given
            let requestedMediaTypes: string = 'application/*;q=0.5, application/xml;q=0.8';
            let operationMediaTypes: Set<string> = new Set<string>(['application/json', 'application/xml']);
            // when
            let mediaType: string = MediaTypeUtils.getRequestedMediaType(requestedMediaTypes, operationMediaTypes);
            // then
            expect(mediaType).toBe('application/xml');
        });

    });

});
