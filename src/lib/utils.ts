import { MOVIES__DATA } from "@/data";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRuntime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}m`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

export function formatReleaseDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatYear(dateString: string): string {
  return new Date(dateString).getFullYear().toString();
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function formatVoteCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export function getYouTubeEmbedUrl(key: string): string {
  return `https://www.youtube.com/embed/${key}`;
}

export function getYouTubeThumbnailUrl(
  key: string,
  quality: "default" | "medium" | "high" | "maxres" = "medium"
): string {
  const qualityMap = {
    default: "default.jpg",
    medium: "mqdefault.jpg",
    high: "hqdefault.jpg",
    maxres: "maxresdefault.jpg",
  };

  return `https://img.youtube.com/vi/${key}/${qualityMap[quality]}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export const getMovieDownloadUrl = (title: string): string | null => {
  const id = MOVIES__DATA[title];

  if (id) {
    return `https://luluvdoo.com/d/${id}`;
  }

  return null;
};

export const getMovieWatchUrl = (title: string): string | null => {
  const id = MOVIES__DATA[title];

  if (id) {
    return `https://luluvd.com/e/${id}`;
  }

  return null;
};

// Country code to flag emoji mapping
export function getCountryFlag(countryCode: string): string {
  const flags: Record<string, string> = {
    // North America
    US: "🇺🇸", // United States
    CA: "🇨🇦", // Canada
    MX: "🇲🇽", // Mexico
    GT: "🇬🇹", // Guatemala
    BZ: "🇧🇿", // Belize
    SV: "🇸🇻", // El Salvador
    HN: "🇭🇳", // Honduras
    NI: "🇳🇮", // Nicaragua
    CR: "🇨🇷", // Costa Rica
    PA: "🇵🇦", // Panama
    CU: "🇨🇺", // Cuba
    JM: "🇯🇲", // Jamaica
    HT: "🇭🇹", // Haiti
    DO: "🇩🇴", // Dominican Republic
    PR: "🇵🇷", // Puerto Rico
    BS: "🇧🇸", // Bahamas
    BB: "🇧🇧", // Barbados
    TT: "🇹🇹", // Trinidad and Tobago
    GD: "🇬🇩", // Grenada
    VC: "🇻🇨", // Saint Vincent and the Grenadines
    LC: "🇱🇨", // Saint Lucia
    DM: "🇩🇲", // Dominica
    AG: "🇦🇬", // Antigua and Barbuda
    KN: "🇰🇳", // Saint Kitts and Nevis

    // South America
    BR: "🇧🇷", // Brazil
    AR: "🇦🇷", // Argentina
    CL: "🇨🇱", // Chile
    CO: "🇨🇴", // Colombia
    PE: "🇵🇪", // Peru
    VE: "🇻🇪", // Venezuela
    EC: "🇪🇨", // Ecuador
    BO: "🇧🇴", // Bolivia
    PY: "🇵🇾", // Paraguay
    UY: "🇺🇾", // Uruguay
    GY: "🇬🇾", // Guyana
    SR: "🇸🇷", // Suriname
    GF: "🇬🇫", // French Guiana

    // Europe
    GB: "🇬🇧", // United Kingdom
    FR: "🇫🇷", // France
    DE: "🇩🇪", // Germany
    IT: "🇮🇹", // Italy
    ES: "🇪🇸", // Spain
    PT: "🇵🇹", // Portugal
    NL: "🇳🇱", // Netherlands
    BE: "🇧🇪", // Belgium
    CH: "🇨🇭", // Switzerland
    AT: "🇦🇹", // Austria
    SE: "🇸🇪", // Sweden
    NO: "🇳🇴", // Norway
    DK: "🇩🇰", // Denmark
    FI: "🇫🇮", // Finland
    IS: "🇮🇸", // Iceland
    IE: "🇮🇪", // Ireland
    PL: "🇵🇱", // Poland
    CZ: "🇨🇿", // Czech Republic
    SK: "🇸🇰", // Slovakia
    HU: "🇭🇺", // Hungary
    RO: "🇷🇴", // Romania
    BG: "🇧🇬", // Bulgaria
    GR: "🇬🇷", // Greece
    HR: "🇭🇷", // Croatia
    SI: "🇸🇮", // Slovenia
    BA: "🇧🇦", // Bosnia and Herzegovina
    RS: "🇷🇸", // Serbia
    ME: "🇲🇪", // Montenegro
    MK: "🇲🇰", // North Macedonia
    AL: "🇦🇱", // Albania
    LT: "🇱🇹", // Lithuania
    LV: "🇱🇻", // Latvia
    EE: "🇪🇪", // Estonia
    LU: "🇱🇺", // Luxembourg
    MT: "🇲🇹", // Malta
    CY: "🇨🇾", // Cyprus
    MD: "🇲🇩", // Moldova
    UA: "🇺🇦", // Ukraine
    BY: "🇧🇾", // Belarus
    RU: "🇷🇺", // Russia
    GE: "🇬🇪", // Georgia
    AM: "🇦🇲", // Armenia
    AZ: "🇦🇿", // Azerbaijan
    TR: "🇹🇷", // Turkey

    // Asia
    CN: "🇨🇳", // China
    JP: "🇯🇵", // Japan
    KR: "🇰🇷", // South Korea
    KP: "🇰🇵", // North Korea
    MN: "🇲🇳", // Mongolia
    IN: "🇮🇳", // India
    PK: "🇵🇰", // Pakistan
    BD: "🇧🇩", // Bangladesh
    LK: "🇱🇰", // Sri Lanka
    NP: "🇳🇵", // Nepal
    BT: "🇧🇹", // Bhutan
    MV: "🇲🇻", // Maldives
    AF: "🇦🇫", // Afghanistan
    IR: "🇮🇷", // Iran
    IQ: "🇮🇶", // Iraq
    SY: "🇸🇾", // Syria
    LB: "🇱🇧", // Lebanon
    JO: "🇯🇴", // Jordan
    IL: "🇮🇱", // Israel
    PS: "🇵🇸", // Palestine
    SA: "🇸🇦", // Saudi Arabia
    YE: "🇾🇪", // Yemen
    OM: "🇴🇲", // Oman
    AE: "🇦🇪", // United Arab Emirates
    QA: "🇶🇦", // Qatar
    BH: "🇧🇭", // Bahrain
    KW: "🇰🇼", // Kuwait
    TH: "🇹🇭", // Thailand
    VN: "🇻🇳", // Vietnam
    LA: "🇱🇦", // Laos
    KH: "🇰🇭", // Cambodia
    MM: "🇲🇲", // Myanmar
    MY: "🇲🇾", // Malaysia
    SG: "🇸🇬", // Singapore
    ID: "🇮🇩", // Indonesia
    BN: "🇧🇳", // Brunei
    PH: "🇵🇭", // Philippines
    TW: "🇹🇼", // Taiwan
    HK: "🇭🇰", // Hong Kong
    MO: "🇲🇴", // Macau
    UZ: "🇺🇿", // Uzbekistan
    KZ: "🇰🇿", // Kazakhstan
    KG: "🇰🇬", // Kyrgyzstan
    TJ: "🇹🇯", // Tajikistan
    TM: "🇹🇲", // Turkmenistan

    // Africa
    EG: "🇪🇬", // Egypt
    LY: "🇱🇾", // Libya
    TN: "🇹🇳", // Tunisia
    DZ: "🇩🇿", // Algeria
    MA: "🇲🇦", // Morocco
    SD: "🇸🇩", // Sudan
    SS: "🇸🇸", // South Sudan
    ET: "🇪🇹", // Ethiopia
    ER: "🇪🇷", // Eritrea
    DJ: "🇩🇯", // Djibouti
    SO: "🇸🇴", // Somalia
    KE: "🇰🇪", // Kenya
    UG: "🇺🇬", // Uganda
    TZ: "🇹🇿", // Tanzania
    RW: "🇷🇼", // Rwanda
    BI: "🇧🇮", // Burundi
    MG: "🇲🇬", // Madagascar
    MU: "🇲🇺", // Mauritius
    SC: "🇸🇨", // Seychelles
    KM: "🇰🇲", // Comoros
    MZ: "🇲🇿", // Mozambique
    ZW: "🇿🇼", // Zimbabwe
    ZM: "🇿🇲", // Zambia
    MW: "🇲🇼", // Malawi
    BW: "🇧🇼", // Botswana
    NA: "🇳🇦", // Namibia
    ZA: "🇿🇦", // South Africa
    LS: "🇱🇸", // Lesotho
    SZ: "🇸🇿", // Eswatini
    AO: "🇦🇴", // Angola
    CD: "🇨🇩", // Democratic Republic of the Congo
    CG: "🇨🇬", // Republic of the Congo
    CF: "🇨🇫", // Central African Republic
    CM: "🇨🇲", // Cameroon
    GQ: "🇬🇶", // Equatorial Guinea
    GA: "🇬🇦", // Gabon
    ST: "🇸🇹", // São Tomé and Príncipe
    TD: "🇹🇩", // Chad
    NE: "🇳🇪", // Niger
    NG: "🇳🇬", // Nigeria
    BJ: "🇧🇯", // Benin
    TG: "🇹🇬", // Togo
    GH: "🇬🇭", // Ghana
    CI: "🇨🇮", // Côte d'Ivoire
    LR: "🇱🇷", // Liberia
    SL: "🇸🇱", // Sierra Leone
    GN: "🇬🇳", // Guinea
    GW: "🇬🇼", // Guinea-Bissau
    SN: "🇸🇳", // Senegal
    GM: "🇬🇲", // Gambia
    ML: "🇲🇱", // Mali
    BF: "🇧🇫", // Burkina Faso
    MR: "🇲🇷", // Mauritania
    CV: "🇨🇻", // Cape Verde

    // Oceania
    AU: "🇦🇺", // Australia
    NZ: "🇳🇿", // New Zealand
    FJ: "🇫🇯", // Fiji
    PG: "🇵🇬", // Papua New Guinea
    SB: "🇸🇧", // Solomon Islands
    VU: "🇻🇺", // Vanuatu
    NC: "🇳🇨", // New Caledonia
    PF: "🇵🇫", // French Polynesia
    WS: "🇼🇸", // Samoa
    AS: "🇦🇸", // American Samoa
    TO: "🇹🇴", // Tonga
    CK: "🇨🇰", // Cook Islands
    NU: "🇳🇺", // Niue
    KI: "🇰🇮", // Kiribati
    TV: "🇹🇻", // Tuvalu
    NR: "🇳🇷", // Nauru
    PW: "🇵🇼", // Palau
    FM: "🇫🇲", // Federated States of Micronesia
    MH: "🇲🇭", // Marshall Islands

    // Antarctica
    AQ: "🇦🇶", // Antarctica
  };

  return flags[countryCode.toUpperCase()] || "🌍";
}

// Language code to flag emoji mapping
export function getLanguageFlag(languageCode: string): string {
  const languageToCountry: Record<string, string> = {
    // Major world languages
    en: "US", // English
    fr: "FR", // French
    de: "DE", // German
    it: "IT", // Italian
    es: "ES", // Spanish
    pt: "PT", // Portuguese
    ru: "RU", // Russian
    ja: "JP", // Japanese
    ko: "KR", // Korean
    zh: "CN", // Chinese
    ar: "EG", // Arabic
    hi: "IN", // Hindi
    th: "TH", // Thai
    tr: "TR", // Turkish
    pl: "PL", // Polish
    nl: "NL", // Dutch
    sv: "SE", // Swedish
    no: "NO", // Norwegian
    da: "DK", // Danish
    fi: "FI", // Finnish
    he: "IL", // Hebrew
    el: "GR", // Greek
    cs: "CZ", // Czech
    hu: "HU", // Hungarian
    ro: "RO", // Romanian
    bg: "BG", // Bulgarian
    hr: "HR", // Croatian
    sk: "SK", // Slovak
    sl: "SI", // Slovenian
    et: "EE", // Estonian
    lv: "LV", // Latvian
    lt: "LT", // Lithuanian
    uk: "UA", // Ukrainian
    be: "BY", // Belarusian
    vi: "VN", // Vietnamese
    id: "ID", // Indonesian
    ms: "MY", // Malay
    tl: "PH", // Filipino/Tagalog

    // Additional European languages
    is: "IS", // Icelandic
    ga: "IE", // Irish
    mt: "MT", // Maltese
    cy: "GB", // Welsh
    eu: "ES", // Basque
    ca: "ES", // Catalan
    gl: "ES", // Galician

    // Additional Asian languages
    bn: "BD", // Bengali
    ur: "PK", // Urdu
    fa: "IR", // Persian/Farsi
    ps: "AF", // Pashto
    ta: "IN", // Tamil
    te: "IN", // Telugu
    kn: "IN", // Kannada
    ml: "IN", // Malayalam
    gu: "IN", // Gujarati
    pa: "IN", // Punjabi
    or: "IN", // Odia
    as: "IN", // Assamese
    ne: "NP", // Nepali
    si: "LK", // Sinhala
    my: "MM", // Burmese
    km: "KH", // Khmer
    lo: "LA", // Lao
    ka: "GE", // Georgian
    hy: "AM", // Armenian
    az: "AZ", // Azerbaijani
    kk: "KZ", // Kazakh
    ky: "KG", // Kyrgyz
    uz: "UZ", // Uzbek
    tg: "TJ", // Tajik
    tk: "TM", // Turkmen
    mn: "MN", // Mongolian

    // African languages
    sw: "KE", // Swahili
    zu: "ZA", // Zulu
    xh: "ZA", // Xhosa
    af: "ZA", // Afrikaans
    am: "ET", // Amharic
    om: "ET", // Oromo
    ti: "ET", // Tigrinya
    so: "SO", // Somali
    ha: "NG", // Hausa
    yo: "NG", // Yoruba
    ig: "NG", // Igbo

    // Additional languages
    sr: "RS", // Serbian
    bs: "BA", // Bosnian
    mk: "MK", // Macedonian
    sq: "AL", // Albanian

    // Variants and special cases
    "zh-cn": "CN", // Chinese Simplified
    "zh-tw": "TW", // Chinese Traditional
    "pt-br": "BR", // Portuguese (Brazil)
    "en-gb": "GB", // English (UK)
    "en-us": "US", // English (US)
    "fr-ca": "CA", // French (Canada)
    "es-mx": "MX", // Spanish (Mexico)
    "es-ar": "AR", // Spanish (Argentina)
  };

  const countryCode = languageToCountry[languageCode.toLowerCase()];
  return countryCode ? getCountryFlag(countryCode) : "🌐";
}
