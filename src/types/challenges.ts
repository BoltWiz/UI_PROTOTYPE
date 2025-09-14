export interface Challenge {
  id: string;
  slug: string;
  title: string;
  brief: string;
  cover: string;
  hashtag: string;
  curatorId?: string; // stylist ID
  startAt: string;
  endAt: string;
  status: 'upcoming' | 'active' | 'ended';
  rules: string[];
  prizes?: string[];
  collections?: string[]; // related collection IDs
  styleGuides?: string[]; // related style guide IDs
  createdAt: string;
  updatedAt: string;
}

export interface ChallengeEntry {
  id: string;
  challengeId: string;
  postId: string;
  userId: string;
  status: 'submitted' | 'withdrawn';
  createdAt: string;
}

export interface ChallengeResult {
  challengeId: string;
  winners: string[]; // post IDs
  curatorsPick: string[]; // post IDs selected by curator
  stats: {
    totalSubmissions: number;
    totalLikes: number;
    totalParticipants: number;
    topContributors: Array<{
      userId: string;
      submissions: number;
      totalLikes: number;
    }>;
  };
  finalizedAt: string;
}

export interface ChallengeStats {
  submissions: number;
  likes: number;
  participants: number;
  topContributors: Array<{
    userId: string;
    name: string;
    submissions: number;
    totalLikes: number;
  }>;
}