/**
 * Ethiopian Phone Number Validation and Normalization Utility
 * Supports Ethio Telecom (09...) and Safaricom Ethiopia (07...)
 */

export function cleanPhoneNumber(raw: string): string {
  if (!raw) return '';
  return raw.replace(/[\s\-\(\)\.]/g, '').trim();
}

export function validateEthiopianPhone(raw: string): { isValid: boolean; normalized: string; error?: string } {
  const cleaned = cleanPhoneNumber(raw);

  if (!cleaned) {
    return { isValid: false, normalized: '', error: 'Phone number is required' };
  }

  // Regex pattern for Ethiopian numbers:
  // Can start with +251, 251, 0, or directly 9/7 followed by 8 digits
  let normalized = '';

  if (/^\+251[79]\d{8}$/.test(cleaned)) {
    normalized = cleaned;
  } else if (/^251[79]\d{8}$/.test(cleaned)) {
    normalized = `+${cleaned}`;
  } else if (/^0[79]\d{8}$/.test(cleaned)) {
    normalized = `+251${cleaned.substring(1)}`;
  } else if (/^[79]\d{8}$/.test(cleaned)) {
    normalized = `+251${cleaned}`;
  } else {
    return {
      isValid: false,
      normalized: '',
      error: 'Invalid Ethiopian phone number. Must start with 09 (Ethio Telecom) or 07 (Safaricom) followed by 8 digits (e.g. 0911234567 or +251911234567).'
    };
  }

  return { isValid: true, normalized };
}

export function formatEthiopianPhone(normalized: string): string {
  if (!normalized || normalized.length !== 13) return normalized;
  // +251 9XX XXX XXX
  const country = normalized.substring(0, 4); // +251
  const prefix = normalized.substring(4, 7);  // 9XX
  const mid = normalized.substring(7, 10);    // XXX
  const end = normalized.substring(10, 13);   // XXX
  return `${country} ${prefix} ${mid} ${end}`;
}

export function maskPhoneNumber(normalized: string): string {
  if (!normalized || normalized.length < 9) return normalized;
  // Format: +251 9•• ••• •89
  const prefix = normalized.substring(0, 6);
  const suffix = normalized.substring(normalized.length - 2);
  return `${prefix} ••• ••• •${suffix}`;
}
