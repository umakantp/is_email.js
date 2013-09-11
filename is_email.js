/*!
 * is_email.js is a port of the is_email PHP library to Javascript.
 *
 * @package	    is_email.js
 * @author      Umakant Patil <me@umakantpatil.com>
 * @copyright   2013 Umakant Patil
 * @copyright   2008-2011 Dominic Sayers
 * @version	    0.0.2
 *
 * To validate an email address according to RFCs 5321, 5322 and others
 *
 * Original library is written by Dominic Sayers for PHP.
 * All rights are reserved with Dominic Sayers and contributors.
 */

/**
 * Copyright ©2013, Umakant Patil
 *
 * Copyright ©2008-2011, Dominic Sayers
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 *     - Redistributions of source code must retain the above copyright notice,
 *       this list of conditions and the following disclaimer.
 *     - Redistributions in binary form must reproduce the above copyright notice,
 *       this list of conditions and the following disclaimer in the documentation
 *       and/or other materials provided with the distribution.
 *     - Neither the name of Dominic Sayers nor the names of its contributors may be
 *       used to endorse or promote products derived from this software without
 *       specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

(function (factory) {
    var
        // Categories
        ISEMAIL_VALID_CATEGORY = 1,
        ISEMAIL_DNSWARN = 7,
        ISEMAIL_RFC5321 = 15,
        ISEMAIL_CFWS = 31,
        ISEMAIL_DEPREC = 63,
        ISEMAIL_RFC5322 = 127,
        ISEMAIL_ERR = 255,

        // Diagnoses
        // Address is valid
        ISEMAIL_VALID = 0,
        // Address is valid but a DNS check was not successful
        ISEMAIL_DNSWARN_NO_MX_RECORD = 5,
        ISEMAIL_DNSWARN_NO_RECORD = 6,
        // Address is valid for SMTP but has unusual elements
        ISEMAIL_RFC5321_TLD = 9,
        ISEMAIL_RFC5321_TLDNUMERIC = 10,
        ISEMAIL_RFC5321_QUOTEDSTRING = 11,
        ISEMAIL_RFC5321_ADDRESSLITERAL = 12,
        ISEMAIL_RFC5321_IPV6DEPRECATED = 13,
        // Address is valid within the message but cannot be used unmodified for the envelope
        ISEMAIL_CFWS_COMMENT = 17,
        ISEMAIL_CFWS_FWS = 18,
        // Address contains deprecated elements but may still be valid in restricted contexts
        ISEMAIL_DEPREC_LOCALPART = 33,
        ISEMAIL_DEPREC_FWS = 34,
        ISEMAIL_DEPREC_QTEXT = 35,
        ISEMAIL_DEPREC_QP = 36,
        ISEMAIL_DEPREC_COMMENT = 37,
        ISEMAIL_DEPREC_CTEXT = 38,
        ISEMAIL_DEPREC_CFWS_NEAR_AT = 49,
        // The address is only valid according to the broad definition of RFC 5322. It is otherwise invalid.
        ISEMAIL_RFC5322_DOMAIN = 65,
        ISEMAIL_RFC5322_TOOLONG = 66,
        ISEMAIL_RFC5322_LOCAL_TOOLONG = 67,
        ISEMAIL_RFC5322_DOMAIN_TOOLONG = 68,
        ISEMAIL_RFC5322_LABEL_TOOLONG = 69,
        ISEMAIL_RFC5322_DOMAINLITERAL = 70,
        ISEMAIL_RFC5322_DOMLIT_OBSDTEXT = 71,
        ISEMAIL_RFC5322_IPV6_GRPCOUNT = 72,
        ISEMAIL_RFC5322_IPV6_2X2XCOLON = 73,
        ISEMAIL_RFC5322_IPV6_BADCHAR = 74,
        ISEMAIL_RFC5322_IPV6_MAXGRPS = 75,
        ISEMAIL_RFC5322_IPV6_COLONSTRT = 76,
        ISEMAIL_RFC5322_IPV6_COLONEND = 77,
        // Address is invalid for any purpose
        ISEMAIL_ERR_EXPECTING_DTEXT = 129,
        ISEMAIL_ERR_NOLOCALPART = 130,
        ISEMAIL_ERR_NODOMAIN = 131,
        ISEMAIL_ERR_CONSECUTIVEDOTS = 132,
        ISEMAIL_ERR_ATEXT_AFTER_CFWS = 133,
        ISEMAIL_ERR_ATEXT_AFTER_QS = 134,
        ISEMAIL_ERR_ATEXT_AFTER_DOMLIT = 135,
        ISEMAIL_ERR_EXPECTING_QPAIR = 136,
        ISEMAIL_ERR_EXPECTING_ATEXT = 137,
        ISEMAIL_ERR_EXPECTING_QTEXT = 138,
        ISEMAIL_ERR_EXPECTING_CTEXT = 139,
        ISEMAIL_ERR_BACKSLASHEND = 140,
        ISEMAIL_ERR_DOT_START = 141,
        ISEMAIL_ERR_DOT_END = 142,
        ISEMAIL_ERR_DOMAINHYPHENSTART = 143,
        ISEMAIL_ERR_DOMAINHYPHENEND = 144,
        ISEMAIL_ERR_UNCLOSEDQUOTEDSTR = 145,
        ISEMAIL_ERR_UNCLOSEDCOMMENT = 146,
        ISEMAIL_ERR_UNCLOSEDDOMLIT = 147,
        ISEMAIL_ERR_FWS_CRLF_X2 = 148,
        ISEMAIL_ERR_FWS_CRLF_END = 149,
        ISEMAIL_ERR_CR_NO_LF = 150,

        // Function control
        ISEMAIL_THRESHOLD = 16,

        // Email parts
        ISEMAIL_COMPONENT_LOCALPART = 0,
        ISEMAIL_COMPONENT_DOMAIN = 1,
        ISEMAIL_COMPONENT_LITERAL = 2,
        ISEMAIL_CONTEXT_COMMENT = 3,
        ISEMAIL_CONTEXT_FWS = 4,
        ISEMAIL_CONTEXT_QUOTEDSTRING = 5,
        ISEMAIL_CONTEXT_QUOTEDPAIR = 6,

        // Miscellaneous string constants
        ISEMAIL_STRING_AT = '@',
        ISEMAIL_STRING_BACKSLASH = '\\',
        ISEMAIL_STRING_DOT = '.',
        ISEMAIL_STRING_DQUOTE = '"',
        ISEMAIL_STRING_OPENPARENTHESIS = '(',
        ISEMAIL_STRING_CLOSEPARENTHESIS = ')',
        ISEMAIL_STRING_OPENSQBRACKET = '[',
        ISEMAIL_STRING_CLOSESQBRACKET = ']',
        ISEMAIL_STRING_HYPHEN = '-',
        ISEMAIL_STRING_COLON = ':',
        ISEMAIL_STRING_DOUBLECOLON = '::',
        ISEMAIL_STRING_SP = ' ',
        ISEMAIL_STRING_HTAB = "\t",
        ISEMAIL_STRING_CR = "\r",
        ISEMAIL_STRING_LF = "\n",
        ISEMAIL_STRING_IPV6TAG = 'IPv6:',
        // US-ASCII visible characters not valid for atext (http://tools.ietf.org/html/rfc5322#section-3.2.3)
        ISEMAIL_STRING_SPECIALS = '()<>[]:;@\\,."',

        // Variables used by other functions internally.
        PREG_GREP_INVERT = 0;

    /**
     * Validates email.
     *
     * @param string  email      Email to be validated.
     * @param mixed   errorLevel Determines the boundary between valid and invalid addresses.
     *                           Status codes above this number will be returned as-is,
     *                           status codes below will be returned as ISEMAIL_VALID. Thus the
     *                           calling program can simply look for ISEMAIL_VALID if it is
     *                           only interested in whether an address is valid or not. The
     *                           errorlevel will determine how "picky" is_email() is about
     *                           the address.
     *
     *                           If omitted or passed as false then is_email() will return
     *                           true or false rather than an integer error or warning.
     *
     *                           NB Note the difference between errorlevel = false and
     *                           errorlevel = 0
     *
     * @return boolean
     */
    function is_email(email, errorLevel) {
        var threshold,
            diagnose,
            returnStatus = new Array(""+ISEMAIL_VALID+""),

            rawLength = email.length,
            context	= ISEMAIL_COMPONENT_LOCALPART,
            contextStack = new Array(""+context+""),
            contextPrior = ISEMAIL_COMPONENT_LOCALPART,
            token = '',
            tokenPrior = '',

            parseData = {
                ISEMAIL_COMPONENT_LOCALPART: '',
                ISEMAIL_COMPONENT_DOMAIN: ''
            },

            atomList = {
                ISEMAIL_COMPONENT_LOCALPART: {},
                ISEMAIL_COMPONENT_DOMAIN: {}
            },
            elementCount = 0,
            elementLen = 0,
            hyphenFlag = false,
            endOrDie = false,
            ord,
            maxGroups,
            matchesIP,
            index,
            addressLiteral,
            IPv6,
            groupCount,
            dnsChecked,
            result,
            finalStatus,
            crlfCount,
            tmp,
            tmp2,
            k;

        // Correctify JS Arrays.
        for(k=0;k<contextStack.length;k++) {
            contextStack[k] = parseInt(contextStack[k]);
        }
        for(k=0;k<returnStatus.length;k++) {
            returnStatus[k] = parseInt(returnStatus[k]);
        }

        if (typeof(errorLevel) === 'undefined') {
            errorLevel = false;
        }

        if (typeof(errorLevel) === "boolean") {
            threshold = ISEMAIL_VALID;
            diagnose = Boolean(errorLevel);
        } else {
            diagnose = true;

            switch (errorLevel) {
                // Warn
                case 2:
                    threshold = ISEMAIL_THRESHOLD;
                    break;

                // Error
                case 1:
                    threshold = ISEMAIL_VALID;
                    break;

                default:
                    threshold = errorLevel;
            }
        }

        for (var i = 0; i < rawLength; i++) {
            token = email[i];

            switch (context) {
                case ISEMAIL_COMPONENT_LOCALPART:
                    switch (token) {
                        case ISEMAIL_STRING_OPENPARENTHESIS:
                            if (elementLen === 0) {
                                if (elementCount === 0) {
                                    returnStatus.push(ISEMAIL_CFWS_COMMENT);
                                } else {
                                    returnStatus.push(ISEMAIL_DEPREC_COMMENT);
                                }
                            } else {
                                returnStatus.push(ISEMAIL_CFWS_COMMENT);
                                endOrDie = true;
                            }
                            contextStack.push(context);
                            context	= ISEMAIL_CONTEXT_COMMENT;
                            break;

                        case ISEMAIL_STRING_DOT:
                            if (elementLen === 0) {
                                if (elementCount === 0) {
                                    returnStatus.push(ISEMAIL_ERR_DOT_START);
                                } else {
                                    returnStatus.push(ISEMAIL_ERR_CONSECUTIVEDOTS);
                                }
                            } else {
                                if (endOrDie) {
                                    returnStatus.push(ISEMAIL_DEPREC_LOCALPART);
                                }
                                endOrDie = false;
                                elementLen = 0;
                                elementCount++;
                                parseData.ISEMAIL_COMPONENT_LOCALPART += token;
                                atomList.ISEMAIL_COMPONENT_LOCALPART.elementCount	= '';
                            }
                            break;

                        case ISEMAIL_STRING_DQUOTE:
                            if (elementLen === 0) {
                                if (elementCount === 0) {
                                    returnStatus.push(ISEMAIL_RFC5321_QUOTEDSTRING);
                                } else {
                                    returnStatus.push(ISEMAIL_DEPREC_LOCALPART);
                                }

                                parseData.ISEMAIL_COMPONENT_LOCALPART += token;
                                if (!atomList.ISEMAIL_COMPONENT_LOCALPART.elementCount) {
                                    atomList.ISEMAIL_COMPONENT_LOCALPART.elementCount = "";
                                }
                                if (!atomList.ISEMAIL_COMPONENT_LOCALPART.elementCount) {
                                    atomList.ISEMAIL_COMPONENT_LOCALPART.elementCount = "";
                                }
                                atomList.ISEMAIL_COMPONENT_LOCALPART.elementCount += token;
                                elementLen++;
                                endOrDie = true;
                                contextStack.push(context);
                                context = ISEMAIL_CONTEXT_QUOTEDSTRING;
                            } else {
                                returnStatus.push(ISEMAIL_ERR_EXPECTING_ATEXT);
                            }
                            break;

                        case ISEMAIL_STRING_CR:
                        case ISEMAIL_STRING_SP:
                        case ISEMAIL_STRING_HTAB:
                            if ((token === ISEMAIL_STRING_CR) && ((++i === rawLength) || (email[i] !== ISEMAIL_STRING_LF))) {
                                returnStatus.push(ISEMAIL_ERR_CR_NO_LF);
                                break;
                            }
                            if (elementLen === 0) {
                                if (elementCount === 0) {
                                    returnStatus.push(ISEMAIL_CFWS_FWS);
                                } else {
                                    returnStatus.push(ISEMAIL_DEPREC_FWS);
                                }
                            } else {
                                endOrDie = true;
                            }
                            contextStack.push(context);
                            context = ISEMAIL_CONTEXT_FWS;
                            tokenPrior = token;
                            break;

                        case ISEMAIL_STRING_AT:
                            if (contextStack.length !== 1) {
                                throw new Error('Unexpected item on context stack');
                            }
                            if (parseData.ISEMAIL_COMPONENT_LOCALPART === '') {
                                returnStatus.push(ISEMAIL_ERR_NOLOCALPART);
                            } else if (elementLen === 0) {
                                returnStatus.push(ISEMAIL_ERR_DOT_END);
                            } else if (((parseData.ISEMAIL_COMPONENT_LOCALPART).length) > 64) {
                                returnStatus.push(ISEMAIL_RFC5322_LOCAL_TOOLONG);
                            } else if ((contextPrior === ISEMAIL_CONTEXT_COMMENT) || (contextPrior === ISEMAIL_CONTEXT_FWS)) {
                                returnStatus.push(ISEMAIL_DEPREC_CFWS_NEAR_AT);
                            }
                            context = ISEMAIL_COMPONENT_DOMAIN;
                            contextStack = new Array(context);
                            for(k=0;k<contextStack.length;k++) {
                                contextStack[k] = parseInt(contextStack[k]);
                            }
                            elementCount = 0;
                            elementLen = 0;
                            endOrDie = false;
                            break;

                        default:
                            if (endOrDie) {
                                switch (contextPrior) {
                                    case ISEMAIL_CONTEXT_COMMENT:
                                    case ISEMAIL_CONTEXT_FWS:
                                        returnStatus.push(ISEMAIL_ERR_ATEXT_AFTER_CFWS);
                                        break;

                                    case ISEMAIL_CONTEXT_QUOTEDSTRING:
                                        returnStatus.push(ISEMAIL_ERR_ATEXT_AFTER_QS);
                                        break;

                                    default:
                                        throw new Error("More atext found where none is allowed, but unrecognised prior context: "+contextPrior);
                                        break;
                                }
                            } else {
                                contextPrior = context;
                                ord = Ord(token);

                                if ((ord < 33) || (ord > 126) || (ord === 10) || (!is_bool(strpos(ISEMAIL_STRING_SPECIALS, token)))) {
                                    returnStatus.push(ISEMAIL_ERR_EXPECTING_ATEXT);
                                }
                                parseData.ISEMAIL_COMPONENT_LOCALPART += token;
                                if (!atomList.ISEMAIL_COMPONENT_LOCALPART.elementCount) {
                                    atomList.ISEMAIL_COMPONENT_LOCALPART.elementCount = "";
                                }
                                atomList.ISEMAIL_COMPONENT_LOCALPART.elementCount += token;
                                elementLen++;
                            }
                    }
                    break;

                case ISEMAIL_COMPONENT_DOMAIN:
                    switch (token) {
                        case ISEMAIL_STRING_OPENPARENTHESIS:
                            if (elementLen === 0) {
                                if (elementCount === 0) {
                                    returnStatus.push(ISEMAIL_DEPREC_CFWS_NEAR_AT);
                                } else {
                                    returnStatus.push(ISEMAIL_DEPREC_COMMENT);
                                }
                            } else {
                                returnStatus.push(ISEMAIL_CFWS_COMMENT);
                                endOrDie = true;
                            }
                            contextStack.push(context);
                            context = ISEMAIL_CONTEXT_COMMENT;
                            break;

                        case ISEMAIL_STRING_DOT:
                            if (elementLen === 0) {
                                if (elementCount === 0) {
                                    returnStatus.push(ISEMAIL_ERR_DOT_START);
                                } else {
                                    returnStatus.push(ISEMAIL_ERR_CONSECUTIVEDOTS);
                                }
                            } else if (hyphenFlag) {
                                returnStatus.push(ISEMAIL_ERR_DOMAINHYPHENEND);
                            } else {
                                if (elementLen > 63) {
                                    returnStatus.push(ISEMAIL_RFC5322_LABEL_TOOLONG);
                                }
                            }
                            endOrDie = false;
                            elementLen = 0;
                            elementCount++;
                            atomList.ISEMAIL_COMPONENT_DOMAIN.elementCount = '';
                            parseData.ISEMAIL_COMPONENT_DOMAIN += token;
                            break;

                        case ISEMAIL_STRING_OPENSQBRACKET:
                            if (parseData.ISEMAIL_COMPONENT_DOMAIN === '') {
                                endOrDie = true;
                                elementLen++;
                                contextStack.push(context);
                                context = ISEMAIL_COMPONENT_LITERAL;
                                parseData.ISEMAIL_COMPONENT_DOMAIN	+= token;
                                atomList.ISEMAIL_COMPONENT_DOMAIN.elementCount += token;
                                parseData.ISEMAIL_COMPONENT_LITERAL = '';
                            } else {
                                returnStatus.push(ISEMAIL_ERR_EXPECTING_ATEXT);
                            }
                            break;

                        case ISEMAIL_STRING_CR:
                        case ISEMAIL_STRING_SP:
                        case ISEMAIL_STRING_HTAB:
                            if ((token === ISEMAIL_STRING_CR) && ((++i === rawLength) || (email[i] !== ISEMAIL_STRING_LF))) {
                                returnStatus.push(ISEMAIL_ERR_CR_NO_LF);
                                break;
                            }
                            if (elementLen === 0) {
                                if (elementCount === 0) {
                                    returnStatus.push(ISEMAIL_DEPREC_CFWS_NEAR_AT);
                                } else {
                                    returnStatus.push(ISEMAIL_DEPREC_FWS);
                                }
                            } else {
                                returnStatus.push(ISEMAIL_CFWS_FWS);
                                endOrDie = true;
                            }

                            contextStack.push(context);
                            context = ISEMAIL_CONTEXT_FWS;
                            tokenPrior = token;
                            break;
                        default:
                            if (endOrDie) {
                                switch (contextPrior) {
                                    case ISEMAIL_CONTEXT_COMMENT:
                                    case ISEMAIL_CONTEXT_FWS:
                                        returnStatus.push(ISEMAIL_ERR_ATEXT_AFTER_CFWS);
                                        break;

                                    case ISEMAIL_COMPONENT_LITERAL:
                                        returnStatus.push(ISEMAIL_ERR_ATEXT_AFTER_DOMLIT);
                                        break;

                                    default:
                                        throw new Error("More atext found where none is allowed, but unrecognised prior context: "+contextPrior);
                                        break;
                                }
                            }
                            ord = Ord(token);
                            hyphenFlag = false;

                            if ((ord < 33) || (ord > 126) || (!is_bool(strpos(ISEMAIL_STRING_SPECIALS, token)))) {
                                returnStatus.push(ISEMAIL_ERR_EXPECTING_ATEXT);
                            } else if (token === ISEMAIL_STRING_HYPHEN) {
                                if (elementLen === 0) {
                                    returnStatus.push(ISEMAIL_ERR_DOMAINHYPHENSTART);
                                }
                                hyphenFlag = true;
                            } else if (!((ord > 47 && ord < 58) || (ord > 64 && ord < 91) || (ord > 96 && ord < 123))) {
                                returnStatus.push(ISEMAIL_RFC5322_DOMAIN);
                            }
                            parseData.ISEMAIL_COMPONENT_DOMAIN += token;
                            atomList.ISEMAIL_COMPONENT_DOMAIN.elementCount += token;
                            elementLen++;
                            break;
                    }
                    break;

                case ISEMAIL_COMPONENT_LITERAL:
                    switch (token) {
                        case ISEMAIL_STRING_CLOSESQBRACKET:
                            if (php_max(returnStatus) < ISEMAIL_DEPREC) {
                                maxGroups = 8;
                                matchesIP = [];
                                index = false;
                                addressLiteral = parseData.ISEMAIL_COMPONENT_LITERAL;
                                tmp = preg_match("\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b$", addressLiteral);
                                matchesIP = tmp[1];
                                tmp2 = tmp[0];
                                if (tmp2 > 0) {
                                    index = strrpos(addressLiteral, matchesIP[0]);
                                    if (index !== 0) {
                                        addressLiteral = substr(addressLiteral, 0, index) + '0:0';
                                    }
                                }

                                if (index === 0) {
                                    returnStatus.push(ISEMAIL_RFC5321_ADDRESSLITERAL);
                                } else if (strncasecmp(addressLiteral, ISEMAIL_STRING_IPV6TAG, 5) !== 0) {
                                    returnStatus.push(ISEMAIL_RFC5322_DOMAINLITERAL);
                                } else {
                                    IPv6 = substr(addressLiteral, 5);
                                    matchesIP = explode(ISEMAIL_STRING_COLON, IPv6);
                                    groupCount = matchesIP.length;
                                    index = strpos(IPv6,ISEMAIL_STRING_DOUBLECOLON);
                                    if (index === false) {
                                        if (groupCount !== maxGroups) {
                                            returnStatus.push(ISEMAIL_RFC5322_IPV6_GRPCOUNT);
                                        }
                                    } else {
                                        if (index !== strrpos(IPv6,ISEMAIL_STRING_DOUBLECOLON)) {
                                            returnStatus.push(ISEMAIL_RFC5322_IPV6_2X2XCOLON);
                                        } else {
                                            if (index === 0 || index === (IPv6.length - 2)) {
                                                maxGroups++;
                                            }
                                            if (groupCount > maxGroups) {
                                                returnStatus.push(ISEMAIL_RFC5322_IPV6_MAXGRPS);
                                            } else if (groupCount === maxGroups) {
                                                returnStatus.push(ISEMAIL_RFC5321_IPV6DEPRECATED);
                                            }
                                        }
                                    }
                                    if ((substr(IPv6, 0,  1) === ISEMAIL_STRING_COLON) && (substr(IPv6, 1,  1) !== ISEMAIL_STRING_COLON)) {
                                        returnStatus.push(ISEMAIL_RFC5322_IPV6_COLONSTRT);
                                    } else if ((substr(IPv6, -1) === ISEMAIL_STRING_COLON) && (substr(IPv6, -2, 1) !== ISEMAIL_STRING_COLON)) {
                                        returnStatus.push(ISEMAIL_RFC5322_IPV6_COLONEND);
                                    } else if ((preg_grep('^[0-9A-Fa-f]{0,4}$', matchesIP, PREG_GREP_INVERT)).length !== 0) {
                                        returnStatus.push(ISEMAIL_RFC5322_IPV6_BADCHAR);
                                    } else {
                                        returnStatus.push(ISEMAIL_RFC5321_ADDRESSLITERAL);
                                    }
                                }
                            } else {
                                returnStatus.push(ISEMAIL_RFC5322_DOMAINLITERAL);
                            }
                            parseData.ISEMAIL_COMPONENT_DOMAIN += token;
                            atomList.ISEMAIL_COMPONENT_DOMAIN.elementCount += token;
                            elementLen++;
                            contextPrior = context;
                            tmp = array_pop(contextStack);
                            context	= Number(tmp[0]);
                            contextStack = tmp[1];
                            break;

                        case ISEMAIL_STRING_BACKSLASH:
                            returnStatus.push(ISEMAIL_RFC5322_DOMLIT_OBSDTEXT);
                            contextStack.push(context);
                            context	= ISEMAIL_CONTEXT_QUOTEDPAIR;
                            break;

                        case ISEMAIL_STRING_CR:
                        case ISEMAIL_STRING_SP:
                        case ISEMAIL_STRING_HTAB:
                            if ((token === ISEMAIL_STRING_CR) && ((++i === rawLength) || (email[i] !== ISEMAIL_STRING_LF))) {
                                returnStatus.push(ISEMAIL_ERR_CR_NO_LF);
                                break;
                            }
                            returnStatus.push(ISEMAIL_CFWS_FWS);

                            contextStack.push(context);
                            context	= ISEMAIL_CONTEXT_FWS;
                            tokenPrior = token;
                            break;
                        default:
                            ord = Ord(token);
                            if ((ord > 127) || (ord === 0) || (token === ISEMAIL_STRING_OPENSQBRACKET)) {
                                returnStatus.push(ISEMAIL_ERR_EXPECTING_DTEXT);
                                break;
                            } else if ((ord < 33) || (ord === 127)) {
                                returnStatus.push(ISEMAIL_RFC5322_DOMLIT_OBSDTEXT);
                            }

                            parseData.ISEMAIL_COMPONENT_LITERAL += token;
                            parseData.ISEMAIL_COMPONENT_DOMAIN	+= token;
                            atomList.ISEMAIL_COMPONENT_DOMAIN.elementCount += token;
                            elementLen++;
                            break;
                    }
                    break;

                case ISEMAIL_CONTEXT_QUOTEDSTRING:
                    switch (token) {
                        case ISEMAIL_STRING_BACKSLASH:
                            contextStack.push(context);
                            context	= ISEMAIL_CONTEXT_QUOTEDPAIR;
                            break;

                        case ISEMAIL_STRING_CR:
                        case ISEMAIL_STRING_HTAB:
                            if ((token === ISEMAIL_STRING_CR) && ((++i === rawLength) || (email[i] !== ISEMAIL_STRING_LF))) {
                                returnStatus.push(ISEMAIL_ERR_CR_NO_LF);
                                break;
                            }
                            parseData.ISEMAIL_COMPONENT_LOCALPART += ISEMAIL_STRING_SP;
                            if (!atomList.ISEMAIL_COMPONENT_LOCALPART.elementCount) {
                                atomList.ISEMAIL_COMPONENT_LOCALPART.elementCount = "";
                            }
                            atomList.ISEMAIL_COMPONENT_LOCALPART.elementCount += ISEMAIL_STRING_SP;
                            elementLen++;

                            returnStatus.push(ISEMAIL_CFWS_FWS);
                            contextStack.push(context);
                            context = ISEMAIL_CONTEXT_FWS;
                            tokenPrior = token;
                            break;

                        case ISEMAIL_STRING_DQUOTE:
                            parseData.ISEMAIL_COMPONENT_LOCALPART += token;
                            if (!atomList.ISEMAIL_COMPONENT_LOCALPART.elementCount) {
                                atomList.ISEMAIL_COMPONENT_LOCALPART.elementCount = "";
                            }
                            atomList.ISEMAIL_COMPONENT_LOCALPART.elementCount += token;
                            elementLen++;
                            contextPrior = context;
                            tmp = array_pop(contextStack);
                            context	= Number(tmp[0]);
                            contextStack = tmp[1];
                            break;

                        default:
                            ord = Ord(token);
                            if ((ord > 127) || (ord === 0) || (ord === 10)) {
                                returnStatus.push(ISEMAIL_ERR_EXPECTING_QTEXT);
                            } else if ((ord < 32) || (ord === 127)) {
                                returnStatus.push(ISEMAIL_DEPREC_QTEXT);
                            }
                            parseData.ISEMAIL_COMPONENT_LOCALPART += token;
                            if (!atomList.ISEMAIL_COMPONENT_LOCALPART.elementCount) {
                                atomList.ISEMAIL_COMPONENT_LOCALPART.elementCount = "";
                            }
                            atomList.ISEMAIL_COMPONENT_LOCALPART.elementCount += token;
                            elementLen++;
                            break;
                    }
                    break;

                case ISEMAIL_CONTEXT_QUOTEDPAIR:
                    ord = Ord(token);
                    if	(ord > 127) {
                        returnStatus.push(ISEMAIL_ERR_EXPECTING_QPAIR);
                    } else if (((ord < 31) && (ord !== 9)) || (ord === 127)) {
                        returnStatus.push(ISEMAIL_DEPREC_QP);
                    }
                    contextPrior = context;
                    tmp = array_pop(contextStack);
                    context	= Number(tmp[0]);
                    contextStack = tmp[1];

                    token = ISEMAIL_STRING_BACKSLASH + token;
                    switch (context) {
                        case ISEMAIL_CONTEXT_COMMENT:
                            break;

                        case ISEMAIL_CONTEXT_QUOTEDSTRING:
                            parseData.ISEMAIL_COMPONENT_LOCALPART += token;
                            if (!atomList.ISEMAIL_COMPONENT_LOCALPART.elementCount) {
                                atomList.ISEMAIL_COMPONENT_LOCALPART.elementCount = "";
                            }
                            atomList.ISEMAIL_COMPONENT_LOCALPART.elementCount += token;
                            elementLen += 2;
                            break;

                        case ISEMAIL_COMPONENT_LITERAL:
                            parseData.ISEMAIL_COMPONENT_DOMAIN += token;
                            atomList.ISEMAIL_COMPONENT_DOMAIN.elementCount += token;
                            elementLen	+= 2;
                            break;

                        default:
                            throw new Error("Quoted pair logic invoked in an invalid context: "+context);
                            break;
                    }
                    break;

                case ISEMAIL_CONTEXT_COMMENT:
                    switch (token) {
                        case ISEMAIL_STRING_OPENPARENTHESIS:
                            contextStack.push(context);
                            context = ISEMAIL_CONTEXT_COMMENT;
                            break;

                        case ISEMAIL_STRING_CLOSEPARENTHESIS:
                            contextPrior = context;
                            tmp = array_pop(contextStack);
                            context	= Number(tmp[0]);
                            contextStack = tmp[1];
                            break;

                        case ISEMAIL_STRING_BACKSLASH:
                            contextStack.push(context);
                            context	= ISEMAIL_CONTEXT_QUOTEDPAIR;
                            break;

                        case ISEMAIL_STRING_CR:
                        case ISEMAIL_STRING_SP:
                        case ISEMAIL_STRING_HTAB:
                            if ((token === ISEMAIL_STRING_CR) && ((++i === rawLength) || (email[i] !== ISEMAIL_STRING_LF))) {
                                returnStatus.push(ISEMAIL_ERR_CR_NO_LF);
                                break;
                            }
                            returnStatus.push(ISEMAIL_CFWS_FWS);

                            contextStack.push(context);
                            context = ISEMAIL_CONTEXT_FWS;
                            tokenPrior = token;
                            break;

                        default:
                            ord = Ord(token);
                            if ((ord > 127) || (ord === 0) || (ord === 10)) {
                                returnStatus.push(ISEMAIL_ERR_EXPECTING_CTEXT);
                                break;
                            } else if ((ord < 32) || (ord === 127)) {
                                returnStatus.push(ISEMAIL_DEPREC_CTEXT);
                            }
                            break;
                    }
                    break;

                case ISEMAIL_CONTEXT_FWS:
                    if (tokenPrior === ISEMAIL_STRING_CR) {
                        if (token === ISEMAIL_STRING_CR) {
                            returnStatus.push(ISEMAIL_ERR_FWS_CRLF_X2);
                            break;
                        }

                        if (isset(crlfCount)) {
                            if (++crlfCount > 1) {
                                returnStatus.push(ISEMAIL_DEPREC_FWS);
                            }
                        } else {
                            crlfCount = 1;
                        }
                    }
                    switch (token) {
                        case ISEMAIL_STRING_CR:
                            if ((++i === rawLength) || (email[i] !== ISEMAIL_STRING_LF)) {
                                returnStatus.push(ISEMAIL_ERR_CR_NO_LF);
                            }
                            break;

                        case ISEMAIL_STRING_SP:
                        case ISEMAIL_STRING_HTAB:
                            break;

                        default:
                            if (tokenPrior === ISEMAIL_STRING_CR) {
                                returnStatus.push(ISEMAIL_ERR_FWS_CRLF_END);
                                break;
                            }
                            if (isset(crlfCount)) {
                                unset(crlfCount);
                            }
                            contextPrior = context;
                            tmp = array_pop(contextStack);
                            context	= Number(tmp[0]);
                            contextStack = tmp[1];
                            i--;
                            break;
                    }
                    tokenPrior = token;
                    break;

                default:
                    throw new Error("Unknown context: "+context);
                    break;
            }

            if (php_max(returnStatus) > ISEMAIL_RFC5322) {
                break;
            }
        }

        if (php_max(returnStatus) < ISEMAIL_RFC5322) {
            if	(context === ISEMAIL_CONTEXT_QUOTEDSTRING) {
                returnStatus.push(ISEMAIL_ERR_UNCLOSEDQUOTEDSTR);
            } else if (context === ISEMAIL_CONTEXT_QUOTEDPAIR)	{
                returnStatus.push(ISEMAIL_ERR_BACKSLASHEND);
            } else if (context === ISEMAIL_CONTEXT_COMMENT) {
                returnStatus.push(ISEMAIL_ERR_UNCLOSEDCOMMENT);
            } else if (context === ISEMAIL_COMPONENT_LITERAL) {
                returnStatus.push(ISEMAIL_ERR_UNCLOSEDDOMLIT);
            } else if (token === ISEMAIL_STRING_CR) {
                returnStatus.push(ISEMAIL_ERR_FWS_CRLF_END);
            } else if (parseData.ISEMAIL_COMPONENT_DOMAIN === '')	{
                returnStatus.push(ISEMAIL_ERR_NODOMAIN);
            } else if (elementLen === 0) {
                returnStatus.push(ISEMAIL_ERR_DOT_END);
            } else if (hyphenFlag) {
                returnStatus.push(ISEMAIL_ERR_DOMAINHYPHENEND);
            } else if ((parseData.ISEMAIL_COMPONENT_DOMAIN).length > 255) {
                returnStatus.push(ISEMAIL_RFC5322_DOMAIN_TOOLONG);
            } else if ((parseData.ISEMAIL_COMPONENT_LOCALPART + ISEMAIL_STRING_AT + parseData.ISEMAIL_COMPONENT_DOMAIN).length > 254) {
                returnStatus.push(ISEMAIL_RFC5322_TOOLONG);
            } else if (elementLen > 63) {
                returnStatus.push(ISEMAIL_RFC5322_LABEL_TOOLONG);
            }
        }

        if (php_max(returnStatus) < ISEMAIL_DNSWARN) {
            if	(elementCount === 0) {
                returnStatus.push(ISEMAIL_RFC5321_TLD);
            }
            if (typeof atomList.ISEMAIL_COMPONENT_DOMAIN.elementCount === "undefined") {
                atomList.ISEMAIL_COMPONENT_DOMAIN.elementCount = [];
            }
            if	(is_numeric(atomList.ISEMAIL_COMPONENT_DOMAIN.elementCount[0])) {
                returnStatus.push(ISEMAIL_RFC5321_TLDNUMERIC);
            }
        }

        returnStatus = array_unique(returnStatus);
        finalStatus = php_max(returnStatus);

        if (returnStatus.length !== 1) {
            array_shift(returnStatus);
        }

        parseData.status	= returnStatus;
        if (finalStatus < threshold) {
            finalStatus = ISEMAIL_VALID;
        }

        if (diagnose) {
            return finalStatus;
        } else {
            return (finalStatus < ISEMAIL_THRESHOLD);
        }
    }

    /**
     * Returns the integer ASCII value of the first character of string.
     *
     * @param string string A character.
     *
     * @return integer
     */
    function Ord(string) {
        var str = string + '',
            code = str.charCodeAt(0),
            hi,
            low;
        if (0xD800 <= code && code <= 0xDBFF) {
            hi = code;
            if (str.length === 1) {
                return code;
            }
            low = str.charCodeAt(1);
            return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
        }
        if (0xDC00 <= code && code <= 0xDFFF) {
            return code;
        }
        return code;
    }

    /**
     * Determine if a variable is set i.e. has some value other than undefined and null.
     *
     * @return boolean
     */
    function isset() {
        var a = arguments,
            l = a.length,
            i = 0,
            undef;
        if (l === 0) {
            throw new Error('Empty isset');
        }
        while (i !== l) {
            if (a[i] === undef || a[i] === null) {
                return false;
            }
            i++;
        }
        return true;
    }

    /**
     * Unset a given variable i.e. undefine it.
     *
     * @return void
     */
    function unset() {
        var a = arguments,
            l = a.length,
            i = 0,
            undef;
        if (l === 0) {
            throw new Error('Empty unset');
        }
        while (i !== l) {
            a[i] = undef;
            i++;
        }
    }

    /**
     * Finds whether a variable is a number or a numeric string.
     *
     * @param mixed mixedVar The variable being evaluated.
     *
     * @return boolean
     */
    function is_numeric(mixedVar) {
        return (typeof(mixedVar) === 'number' || typeof(mixedVar) === 'string') && mixedVar !== '' && !isNaN(mixedVar);
    }

    /**
     * Removes duplicate values from an array
     *
     * @param array inpArray The input array.
     *
     * @return array
     */
    function array_unique(inpArray) {
        var arr = [],
            i,
            j,
            contains = function (cArr, v) {
                for (j = 0; j < cArr.length; j++) {
                    if (cArr[j] === v) {
                        return true;
                    }
                }
                return false;
            };
        for (i = 0; i < inpArray.length; i++) {
            if(!contains(arr, inpArray[i])) {
                arr.push(inpArray[i]);
            }
        }
        return arr;
    }


    /**
     * Shift an element off the beginning of array
     *
     * @param array inpArray The input array.
     *
     * @return array
     */
    function array_shift(inpArray) {
        if (inpArray.length === 0) {
            return null;
        }
        if (inpArray.length > 0) {
            return inpArray.shift();
        }
    }

    /**
     * Pop the element off the end of array.
     *
     * @param array inpArray The input array.
     *
     * @return array Containing end element and Poped array.
     */
    function array_pop(inpArray) {
        var lastValue;
        if (inpArray.hasOwnProperty('length')) {
            if (!inpArray.length) {
                return null;
            }
            lastValue = inpArray.pop();
            return [
                lastValue,
                inpArray
            ];
        }
    }

    /**
     * Find highest value
     *
     * @param array inpArray The input array.
     *
     * @return array
     */
    function php_max(inpArray) {
        var retVal,
            i,
            n,
            _compare = function (current, next) {
                if (current === next) {
                    return 0;
                } else if (typeof next === 'object') {
                    return 1;
                } else if (isNaN(next) && !isNaN(current)) {
                    if (current == 0) {
                        return 0;
                    }
                    return (current < 0 ? 1 : -1);
                } else if (isNaN(current) && !isNaN(next)) {
                    if (next == 0) {
                        return 0;
                    }
                    return (next > 0 ? 1 : -1);
                }
                if (next == current) {
                    return 0;
                }
                return (next > current ? 1 : -1);
            };

        retVal = inpArray[0];
        for (i = 1, n = inpArray.length; i < n; ++i) {
            if (_compare(retVal, inpArray[i]) == 1) {
                retVal = inpArray[i];
            }
        }
        return retVal;
    }

    /**
     * Split a string by string.
     *
     * @param string delimiter The boundary limit.
     * @param string string    The input string.
     * @param string limit     Limit the split operation.
     *
     * @return array
     */
    function explode(delimiter, string, limit) {
        var s;

        if ( arguments.length < 2 || typeof delimiter === 'undefined' || typeof string === 'undefined' ) {
            return null;
        }
        if ( delimiter === '' || delimiter === false || delimiter === null) {
            return false;
        }
        if ( typeof delimiter === 'function' || typeof delimiter === 'object' || typeof string === 'function' || typeof string === 'object') {
            return { 0: '' };
        }
        if ( delimiter === true ) {
            delimiter = '1';
        }

        delimiter += '';
        string += '';

        s = string.split(delimiter);
        if ( typeof limit === 'undefined' ) {
            return s;
        }

        if ( limit === 0 ) {
            limit = 1;
        }

        if ( limit > 0 ) {
            if ( limit >= s.length ) {
                return s;
            }
            return s.slice( 0, limit - 1 ).concat( [ s.slice( limit - 1 ).join( delimiter ) ] );
        }

        if ( -limit >= s.length ) {
            return [];
        }

        s.splice( s.length + limit );
        return s;
    }

    /**
     * Return part of a string.
     *
     * @param string  str    The input string. Must be one character or longer.
     * @param integer start  Position from where to get part of string.
     * @param integer length Length of the string.
     *
     * @return string
     */
    function substr(str, start, length) {
        var end = str.length;
        str += '';

        if (start < 0) {
            start += end;
        }
        end = typeof length === 'undefined' ? end : (length < 0 ? length + end : length + start);

        return start >= str.length || start < 0 || start > end ? !1 : str.slice(start, end);
    }

    /**
     * Case-insensitive string comparison of the first n characters.
     *
     * @param string  argStr1 The first string.
     * @param string  argStr2 The second string.
     * @parma integer len     The length of strings to be used in the comparison.
     *
     * @return integer
     */
    function strncasecmp(argStr1, argStr2, len) {
        var diff, i = 0,
            str1 = (argStr1 + '').toLowerCase().substr(0, len),
            str2 = (argStr2 + '').toLowerCase().substr(0, len);

        if (str1.length !== str2.length) {
            if (str1.length < str2.length) {
                len = str1.length;
                if (str2.substr(0, str1.length) == str1) {
                    return str1.length - str2.length;
                }
            } else {
                len = str2.length;
                if (str1.substr(0, str2.length) == str2) {
                    return str1.length - str2.length; // return the difference of chars
                }
            }
        } else {
            len = str1.length;
        }
        for (diff = 0, i = 0; i < len; i++) {
            diff = str1.charCodeAt(i) - str2.charCodeAt(i);
            if (diff !== 0) {
                return diff;
            }
        }
        return 0;
    }

    /**
     * Find the position of the first occurrence of a substring in a string.
     *
     * @param string         haystack The string to search in.
     * @param string|integer needle   If needle is not a string, it is converted to an integer and applied as the ordinal value of a character.
     * @param string         offset   If specified, search will start this number of characters counted from the beginning of the string.
     *
     * @return integer
     */
    function strpos(haystack, needle, offset) {
        var i = (haystack + '').indexOf(needle, (offset || 0));
        return i === -1 ? false : i;
    }

    /**
     * Finds out whether a variable is a boolean.
     *
     * @param mixed mixed_var The variable being evaluated.
     *
     * @return boolean
     */
    function is_bool(mixed_var) {
      return (mixed_var === true || mixed_var === false);
    }

    /**
     * Perform a regular expression match.
     *
     * @param string The pattern to search for, as a string.
     * @param string The input string.
     *
     * @return array Containing boolean|integer and matches.
     *               boolean|integer => 1=If pattern matches subject. 0=If pattern doesnt match subject. false = If an error occured.
     */
    function preg_match(pattern, subject) {
        var patternObj = new RegExp(pattern),
            matches = patternObj.exec(subject);

        if (matches === null || matches === false || matches === 0) {
            return [
                0,
                []
            ];
        } else {
            return [
                1,
                [matches]
            ];
        }
    }

    /**
     * Return array entries that match the pattern.
     *
     * @param string  pattern The pattern to search for, as a string.
     * @param array   input   The input array.
     * @param integer flag    If set to PREG_GREP_INVERT, this function returns the elements of the input array that do not match the given pattern.
     *
     * @return array
     */
    function preg_grep(pattern, input, flag) {
        var patternObj = new RegExp(pattern);
            matches = [],
            noMatches = [],
            i;
        for (var i=0; i<input.length; i++) {
            var tmp3 = patternObj.exec(input[i]);
            if (tmp3 === null)  {
                noMatches.push(tmp3);
            } else {
                matches.push(tmp3);
            }
        }
        if (flag === PREG_GREP_INVERT) {
            return noMatches;
        } else {
            return matches;
        }
    }

    /**
     * Find the position of the last occurrence of a substring in a string.
     *
     * @param string haystack The string to search in.
     * @param string needle If string to be searched.
     * @param string offset If specified, search will start this number of characters counted from the beginning of the string.
     *
     * @return integer
     */
    function strrpos(haystack, needle, offset) {
        var i = -1;
        if (offset) {
            i = (haystack + '').slice(offset).lastIndexOf(needle); // strrpos' offset indicates starting point of range till end,
            // while lastIndexOf's optional 2nd argument indicates ending point of range from the beginning
            if (i !== -1) {
                i += offset;
            }
        } else {
            i = (haystack + '').lastIndexOf(needle);
        }
        return i >= 0 ? i : false;
    }

    // Enable for Node.js or CommonJS.
    if (typeof(module) !== 'undefined' && module.exports && typeof(exports) !== 'undefined') {
        exports.is_email = is_email;
    }

    // Enable is_email as jQuery plugin.
    if (typeof(jQuery) !== 'undefined') {
        jQuery.is_email = is_email;
    }

    // Enable for Require.js.
    if (typeof(define) === 'function' && define.amd) {
        define(function() { return is_email; });
    }

    // Enable for Browsers.
    if (typeof(window) !== 'undefined') {
        window.is_email = is_email;
    }
})();
