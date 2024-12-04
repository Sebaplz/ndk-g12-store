export interface AuthResponse {
  token: string;
}

export interface RegisterResponse {
  message: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface JwtPayload {
  id: number;
  email: string;
  exp: number;
  iat: number;
}
