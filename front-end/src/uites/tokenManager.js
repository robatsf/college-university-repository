// src/utils/tokenManager.js
import {jwtDecode} from 'jwt-decode';
import BackendUrl from '../hooks/config';



class TokenManager {
  static instance;
  refreshPromise = null;
  apibase = BackendUrl.apiUrl

  constructor() {}

  static getInstance() {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  isTokenExpired(token) {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp <= currentTime + 30;
    } catch {
      return true;
    }
  }

  showErrorMessage(message, duration = 5000) {
    // Create overlay background
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(8px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9998;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;

    // Create error message container
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      background-color: #ef4444;
      color: white;
      padding: 20px 40px;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      text-align: center;
      font-size: 16px;
      font-weight: 500;
      max-width: 400px;
      width: 90%;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s ease;
    `;
    errorDiv.textContent = message;

    // Create countdown element
    const countdownDiv = document.createElement('div');
    countdownDiv.style.cssText = `
      margin-top: 12px;
      font-size: 14px;
      opacity: 0.8;
    `;
    
    // Add elements to DOM
    overlay.appendChild(errorDiv);
    errorDiv.appendChild(countdownDiv);
    document.body.appendChild(overlay);

    // Trigger animations
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      errorDiv.style.opacity = '1';
      errorDiv.style.transform = 'translateY(0)';
    });

    // Start countdown
    let timeLeft = Math.floor(duration / 1000);
    const updateCountdown = () => {
      countdownDiv.textContent = `Redirecting in ${timeLeft} seconds...`;
    };
    updateCountdown();

    const countdownInterval = setInterval(() => {
      timeLeft--;
      updateCountdown();
      if (timeLeft <= 0) clearInterval(countdownInterval);
    }, 1000);

    // Remove after duration
    setTimeout(() => {
      overlay.style.opacity = '0';
      errorDiv.style.opacity = '0';
      errorDiv.style.transform = 'translateY(20px)';
      setTimeout(() => {
        document.body.removeChild(overlay);
      }, 300);
    }, duration);
  }

  redirectToLogin() {
    setTimeout(() => {
      window.location.href = '/login';
    }, 5000);
  }

  async refreshToken() {
    const refresh = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYjRmYmQ2YzQtNDY2ZS00OTI1LTllYzktZjhkOTgyMDBjZWU1IiwiZXhwIjoxNzQxMDgyMzE3LCJ0b2tlbl90eXBlIjoicmVmcmVzaCJ9.G-JpEt_t2S8r95zC2I81MoAkep5J0mWG_Js3h6rnfMg"
    // localStorage.getItem('refresh_token');
    if (!refresh) {
      this.showErrorMessage('No refresh token found. Please login again.');
      this.redirectToLogin();
      return null;
    }

    try {
      const response = await fetch(`${apibase}/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refresh }),
      });

      if (!response.ok) {
        throw new Error('Refresh failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.data.access_token);
      return data.data.access_token;
    } catch (error) {
      console.error('Token refresh failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      this.showErrorMessage('Session expired. Redirecting to login...');
      this.redirectToLogin();
      return null;
    }
  }

  async getValidToken() {
    const currentToken =  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYjRmYmQ2YzQtNDY2ZS00OTI1LTllYzktZjhkOTgyMDBjZWU1IiwiZW1haWwiOiJrYWxlYmFkZW1raXNob0BnbWFpbC5jb20iLCJmaXJzdF9uYW1lIjoiY2FsYSIsImxhc3RfbmFtZSI6bnVsbCwidXNlcl90eXBlIjoiZ3Vlc3QiLCJleHAiOjE3NDA0ODExMTQsImlhdCI6MTc0MDQ3NzUxNCwidG9rZW5fdHlwZSI6ImFjY2VzcyIsInJvbGUiOiJndWVzdCIsInVzZXJuYW1lIjoiY2FsYSIsImlzX3ZlcmlmaWVkIjp0cnVlfQ.tr7wXpynJOr2qpFvVQsBYR5CO8_B1RF5rCYbG-VqYGo"
    //localStorage.getItem('token');
    if (!currentToken) {
      this.showErrorMessage('No access token found. Please login.');
      this.redirectToLogin();
      return null;
    }

    if (!this.isTokenExpired(currentToken)) {
      return currentToken;
    }

    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.refreshToken();
    const newToken = await this.refreshPromise;
    this.refreshPromise = null;
    
    if (!newToken) {
      this.showErrorMessage('Failed to refresh token. Please login again.');
      this.redirectToLogin();
    }
    
    return newToken;
  }

  async getAuthHeaders() {
    const token = await this.getValidToken();
    if (!token) {
      return null;
    }
    return token;
  }
}
const tokenManager = TokenManager.getInstance();

export default  tokenManager
