import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:44352/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/Customers/auth-login`, credentials);
    return response.data;
  }

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/Customers/auth-signup`, credentials);
    return response.data;
  }

  async googleLogin(token: string): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/google`, { token });
    return response.data;
  }

  async facebookLogin(accessToken: string, userID: string): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/facebook`, { accessToken, userID });
    return response.data;
  }

  async logout(): Promise<void> {
    await axios.post(`${API_URL}/Customers/auth-logout`);
  }
}

export const authService = new AuthService(); 