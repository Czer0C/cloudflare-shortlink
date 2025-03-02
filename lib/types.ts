export interface Link {
  code: string;
  url: string;
  time_created: string;
  time_updated: string;
  image?: string;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}
