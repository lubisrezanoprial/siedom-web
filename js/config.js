/* ============================================
   KONFIGURASI API SIEDOM
   
   PENTING: Ganti BASE_URL dengan URL deployment 
   Google Apps Script Anda!
   
   Cara mendapatkan URL:
   1. Buka Apps Script
   2. Deploy > Manage deployments
   3. Copy URL Web app
============================================ */

const API_CONFIG = {
  // GANTI URL INI dengan URL deployment Apps Script Anda
  BASE_URL: 'https://script.google.com/macros/s/AKfycbz8gf-E5sCOXZYB9ZofCLQlq-inaUpfGYlPKopj7WzNRUf4-vn_GBnUtqiJb0jHGpFtUQ/exec',
  
  // Timeout untuk request (30 detik)
  TIMEOUT: 30000
};

/* ============================================
   FUNGSI HELPER - JANGAN DIUBAH
============================================ */

// Fetch dengan timeout
async function fetchWithTimeout(url, options = {}, timeout = API_CONFIG.TIMEOUT) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - server terlalu lama merespon');
    }
    throw error;
  }
}

// Fungsi untuk memanggil API
async function callAPI(action, params = {}) {
  try {
    // Buat query parameters
    const queryParams = new URLSearchParams({
      action: action,
      ...params
    });
    
    const url = `${API_CONFIG.BASE_URL}?${queryParams.toString()}`;
    
    console.log('Calling API:', url);
    
    // Fetch data
    const response = await fetchWithTimeout(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Parse JSON
    const data = await response.json();
    
    console.log('Response data:', data);
    
    // Check if API returned error
    if (data.success === false) {
      throw new Error(data.error || 'API returned error');
    }
    
    return data;
    
  } catch (error) {
    console.error('API Error:', error);
    
    // User-friendly error messages
    if (error.message.includes('timeout')) {
      throw new Error('Koneksi timeout. Silakan coba lagi.');
    } else if (error.message.includes('Failed to fetch')) {
      throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
    } else if (error.message.includes('CORS')) {
      throw new Error('CORS error. Pastikan Apps Script di-deploy dengan akses "Anyone".');
    } else {
      throw new Error(error.message || 'Terjadi kesalahan saat mengambil data');
    }
  }
}

// Test koneksi API (opsional, untuk debugging)
async function testAPIConnection() {
  try {
    console.log('Testing API connection...');
    const result = await callAPI('dashboard');
    console.log('API connection successful!', result);
    return true;
  } catch (error) {
    console.error('API connection failed:', error);
    return false;
  }
}
