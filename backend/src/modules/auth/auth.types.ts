export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  token: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  };
}