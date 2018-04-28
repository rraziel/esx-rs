
const REGEXP_ESCAPE_PATTERN: RegExp = new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\-]', 'g');
const REGEXP_ESCAPE_ASTERISK: RegExp = /\\\*/g;

/**
 * Regular expression utility functions
 */
class RegExpUtils {

    /**
     * Create a regular expression that matches a pattern with wildcards
     * @param pattern Pattern
     * @return Regular expression
     */
    static createWildcardRegExp(pattern: string): RegExp {
        return new RegExp(RegExpUtils.escapeRegExp(pattern).replace(REGEXP_ESCAPE_ASTERISK, '.*'));
    }

    /**
     * Escape a regular expression pattern
     * @param pattern Pattern
     * @return Escaped pattern
     */
    private static escapeRegExp(pattern: string): string {
        return pattern.replace(REGEXP_ESCAPE_PATTERN, '\\$&');
    }

}

export {
    RegExpUtils
};
