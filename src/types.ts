export interface API {
  id: string;
  name: string;
  description: string;
  category: string;
  provider: string;
  icon: string;
  rating: number;
  reviewsCount: number;
  usageCount: number;
  latency: number; // in ms
  uptime: number; // percentage
  tags: string[];
  isPremium: boolean;
  isTrending: boolean;
  docsUrl: string;
  baseUrl: string;
  pricing: 'Free' | 'Freemium' | 'Paid';
  endpoints: Endpoint[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  createdAt: any;
}

export interface Endpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  parameters: Parameter[];
  responses: APIResponse[];
}

export interface Parameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description: string;
  in: 'header' | 'query' | 'path' | 'body';
}

export interface APIResponse {
  status: number;
  description: string;
  example: string; // JSON string
}

export interface Review {
  id: string;
  apiId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  content: string;
  pros: string[];
  cons: string[];
  createdAt: string;
  upvotes: number;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  author: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  videoUrl?: string;
  content: string; // Markdown
  tags: string[];
  apiId?: string;
}

export interface UserRole {
  role: 'Guest' | 'Developer' | 'Premium User' | 'API Creator' | 'Moderator' | 'Admin' | 'Super Admin';
}
