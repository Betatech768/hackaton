// TypeScript interfaces for type safety
export interface SpeakerPosition {
  type: "main" | "delay" | "fill" | "column" | "subwoofer" | "monitor";
  x: number;
  y: number;
  z: number;
  description?: string;
  angle_horizontal?: number; // Optional: horizontal aiming angle in degrees
  angle_vertical?: number; // Optional: vertical aiming angle in degrees
  range?: number;
}

export interface SpeakerRecommendation {
  speaker_type: "main" | "delay" | "fill" | "column" | "subwoofer" | "monitor";
  required: boolean; // true if required, false if optional/not needed
  quantity: number; // 0 if not required
  reasoning: string; // Why this type is or isn't needed
  positions?: SpeakerPosition[]; // Only populated if required=true
}
export interface SeatingAreaProps {
  length_m: number;
  width_m: number;
  seating_capacity: number;
  layout_type?: string;
  floor_to_stage_distance_m?: number;
  is_tiered?: boolean;
}
export interface Dimensions {
  width_m: number;
  length_m: number;
  height_m: number;
}

export interface CriticalIssue {
  severity: "Critical" | "Warning" | "Minor";
  title: string;
  description: string;
  impact: string;
}

export interface RecommendedFix {
  issue_reference: string;
  solution: string;
  steps: string[];
  estimated_cost_usd: number;
  priority: "High" | "Medium" | "Low";
}

export interface AnalysisResult {
  room_type: string;
  dimensions: Dimensions;
  total_area_sqm: number;
  ceiling_type: string; // e.g., "flat", "cathedral", "sloped", "tiered"
  seating_capacity_estimate: number;
  stage_area: StageData;
  // Comprehensive speaker recommendations
  speaker_recommendations: SpeakerRecommendation[];

  // All speaker positions (flattened from recommendations)
  all_speaker_positions: SpeakerPosition[];
  seating_area: SeatingAreaProps;
  critical_issues: CriticalIssue[]; // Can be empty array
  recommended_fixes: RecommendedFix[]; // Can be empty array
  total_estimated_cost_usd: number; // Will be 0 if no fixes needed
  analysis_summary: string;
  room_status: "Excellent" | "Good" | "Needs Improvement" | "Critical";
  positive_features?: string[]; // Optional: things the room does well
  acoustic_challenges?: string[]; // Optional: inherent challenges of the space
}

export type StageData = {
  width_m: number;
  length_m: number;
  height_m: number;
  stage_position: {
    x_m: number;
    y_m: number;
    z_m: number;
  };
};
