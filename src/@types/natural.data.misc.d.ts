declare namespace ND {

    const enum FormatRules {
        COMMAS = "commas",
        RRN = "rrn",
        SSN = "ssn",
        KBRN = "kbrn",
        KCN = "kcn",
        UPPER = "upper",
        LOWER = "lower",
        CAPITALIZE = "capitalize",
        ZIPCODE = "zipcode",
        PHONE = "phone",
        REALNUM = "realnum",
        TRIMTOEMPTY = "trimtoempty",
        TRIMTOZERO = "trimtozero",
        TRIMTOVAL = "trimtoval",
        DATE = "date",
        TIME = "time",
        LIMIT = "limit",
        REPLACE = "replace",
        LPAD = "lpad",
        RPAD = "rpad",
        MASK = "mask",
        GENERIC = "generic",
        NUMERIC = "numeric"
    }
    const enum FormatMaskingRules {
        PHONE = "phone",
        EMAIL = "email",
        ADDRESS = "address",
        NAME = "name",
        RRN = "rrn"
    }

    const enum ValidationRules {
        REQUIRED = "required",
        ALPHABET = "alphabet",
        INTEGER = "integer",
        KOREAN = "korean",
        ALPHABET_INTEGER = "alphabet_integer",
        INTEGER_KOREAN = "integer_korean",
        ALPHABET_KOREAN = "alphabet_korean",
        ALPHABET_INTEGER_KOREAN = "alphabet_integer_korean",
        DASH_INTEGER = "dash_integer",
        COMMAS_INTEGER = "commas_integer",
        NUMBER = "number",
        EMAIL = "email",
        URL = "url",
        ZIPCODE = "zipcode",
        DECIMAL = "decimal",
        PHONE = "phone",
        RRN = "rrn",
        SSN = "ssn",
        FRN = "frn",
        FRN_RRN = "frn_rrn",
        KBRN = "kbrn",
        KCN = "kcn",
        DATE = "date",
        TIME = "time",
        ACCEPT = "accept",
        MATCH = "match",
        ACCEPTFILEEXT = "acceptfileext",
        NOTACCEPT = "notaccept",
        NOTMATCH = "notmatch",
        NOTACCEPTFILEEXT = "notacceptfileext",
        EQUALTO = "equalTo",
        MAXLENGTH = "maxlength",
        MINLENGTH = "minlength",
        RANGELENGTH = "rangelength",
        MAXBYTE = "maxbyte",
        MINBYTE = "minbyte",
        RANGEBYTE = "rangebyte",
        MAXVALUE = "maxvalue",
        MINVALUE = "minvalue",
        RANGEVALUE = "rangevalue",
        REGEXP = "regexp"
    }

    type FormatRuleObject = {
        [key: string]: [FormatRules, ...NC.Primitive[]][];
    };

    type ValidationRuleObject = {
        [key: string]: [ValidationRules, ...NC.Primitive[]][];
    };

    type FormatResultObject = {
        [key: string]: string;
    };

    type ValidateResultObject = {
        [key: string]: [{
            rule: string,
            result: boolean;
            msg: string | null;
        }];
    }[];

    type ConditionCallback = {
        (item: object): boolean;
    };
}
