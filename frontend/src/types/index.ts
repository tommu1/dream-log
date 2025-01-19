export interface User {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  dreamCount: number;
  followerCount: number;
  followingCount: number;
}

export interface Dream {
  id: string;
  title: string;
  content: string;
  isPublic: boolean;
  user: User;
  tags: Array<{
    id: string;
    name: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export type Comment = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  dreamId: string;
  user: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
};

export type Tag = {
  name: string;
  _count?: {
    dreams: number;
  };
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type ErrorResponse = {
  error: string;
};
