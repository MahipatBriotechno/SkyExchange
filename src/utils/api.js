import CryptoJS from 'crypto-js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ambikaexch.in/extsys';
const API_SECRET = import.meta.env.VITE_API_SECRET || 'F41985E0-D500-4E68-AF71-3701EFC9637A';

/**
 * Standard API request handler for the betting platform
 * Handles hashing and centralized POST requests
 */
export async function fetchAPI(endpoint, body = {}) {
  // Use proxy path if needed or direct URL
  const url = `${API_BASE_URL}${endpoint}`;
  
  // 🛡️ Pre-processing: Ensure LoginToken is a string if present
  if (Object.prototype.hasOwnProperty.call(body, 'LoginToken')) {
    if (body.LoginToken === null || body.LoginToken === undefined) {
      console.warn(`[API] LoginToken is null/undefined for ${endpoint}. Defaulting to empty string.`);
      body.LoginToken = '';
    }
  }

  const jsonBody = JSON.stringify(body);

  // 🔐 Generate Hash (HMAC SHA256 → Base64)
  const hash = CryptoJS.HmacSHA256(jsonBody, API_SECRET).toString(CryptoJS.enc.Base64);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Hash': hash,
      },
      body: jsonBody,
    });

    if (!response.ok) {
      // Handle non-200 responses
      return {
        error: '1',
        msg: `HTTP error! status: ${response.status}`,
      };
    }

    const data = await response.json();

    // Normalization check
    return data;
  } catch (error) {
    console.error(`API Request Error [${endpoint}]:`, error);
    return {
      error: '1',
      msg: error instanceof Error ? error.message : 'Unknown network error',
    };
  }
}
