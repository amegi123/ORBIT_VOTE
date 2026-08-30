export interface Campaign {
  id: string;
  title: string;
  description: string;
  start_at: string;
  end_at: string;
  status: 'active' | 'closed' | 'upcoming';
  created_at: string;
  updated_at: string;
}

export interface TikToker {
  id: string;
  full_name: string;
  username: string;
  profile_image: string;
  bio: string;
  category: string;
  vote_count: number;
  is_active: number;
  rank?: number;
  created_at: string;
  updated_at: string;
}

export interface Vote {
  id: string;
  campaign_id: string;
  tiktoker_id: string;
  phone_number: string;
  ip_address?: string;
  verified_at: string;
  created_at: string;
}

export interface OtpRecord {
  id: string;
  phone_number: string;
  otp_code: string;
  attempts: number;
  expires_at: string;
  verified: number;
  created_at: string;
}

export interface SendOtpRequest {
  phone_number: string;
  tiktoker_id: string;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
  normalized_phone?: string;
  expires_in_seconds?: number;
  demo_otp?: string; // Provided in dev/demo mode for rapid seamless evaluation
  cooldown_remaining_seconds?: number;
  next_eligible_vote_at?: string;
}

export interface VerifyAndVoteRequest {
  phone_number: string;
  otp_code: string;
  tiktoker_id: string;
  campaign_id?: string;
}

export interface VerifyAndVoteResponse {
  success: boolean;
  message: string;
  vote_id?: string;
  tiktoker?: TikToker;
  next_eligible_vote_at?: string;
  cooldown_seconds?: number;
  new_total_votes?: number;
  ranking?: number;
}

export interface PhoneStatusResponse {
  phone_number: string;
  can_vote: boolean;
  last_voted_at: string | null;
  last_voted_tiktoker_name?: string | null;
  next_eligible_vote_at: string | null;
  cooldown_remaining_seconds: number;
}

export interface LiveVotesResponse {
  campaign: Campaign;
  tiktokers: TikToker[];
  total_votes: number;
  server_time: string;
}
