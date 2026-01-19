import { NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { readFileSync, existsSync } from "fs";
import path from "path";
import mime from "mime";

// TypeScript interfaces for type safety
interface SpeakerPosition {
  type: "main" | "delay" | "fill" | "column" | "subwoofer" | "monitor";
  x: number;
  y: number;
  z: number;
  description?: string;
  angle_horizontal?: number; // Optional: horizontal aiming angle in degrees
  angle_vertical?: number; // Optional: vertical aiming angle in degrees
}

interface SpeakerRecommendation {
  speaker_type: "main" | "delay" | "fill" | "column" | "subwoofer" | "monitor";
  required: boolean; // true if required, false if optional/not needed
  quantity: number; // 0 if not required
  reasoning: string; // Why this type is or isn't needed
  positions?: SpeakerPosition[]; // Only populated if required=true
}

interface Dimensions {
  width_m: number;
  length_m: number;
  height_m: number;
}

interface CriticalIssue {
  severity: "Critical" | "Warning" | "Minor";
  title: string;
  description: string;
  impact: string;
}

interface RecommendedFix {
  issue_reference: string;
  solution: string;
  steps: string[];
  estimated_cost_usd: number;
  priority: "High" | "Medium" | "Low";
}

interface PlacementView {
  view_type: "2D" | "3D" | "VR" | "AR";
  description: string;
  key_features: string[];
}

interface AnalysisResult {
  room_type: string;
  dimensions: Dimensions;
  total_area_sqm: number;
  ceiling_type: string; // e.g., "flat", "cathedral", "sloped", "tiered"
  seating_capacity_estimate: number;

  // Comprehensive speaker recommendations
  speaker_recommendations: SpeakerRecommendation[];

  // All speaker positions (flattened from recommendations)
  all_speaker_positions: SpeakerPosition[];

  placement_views: PlacementView[];
  critical_issues: CriticalIssue[]; // Can be empty array
  recommended_fixes: RecommendedFix[]; // Can be empty array
  total_estimated_cost_usd: number; // Will be 0 if no fixes needed
  analysis_summary: string;
  room_status: "Excellent" | "Good" | "Needs Improvement" | "Critical";
  positive_features?: string[]; // Optional: things the room does well
  acoustic_challenges?: string[]; // Optional: inherent challenges of the space
}

// Updated Gemini API Schema
const speakerAnalysisSchema = {
  type: SchemaType.OBJECT,
  properties: {
    room_type: {
      type: SchemaType.STRING,
      description:
        "Type of room (e.g., Conference Hall, Auditorium, Church, Theater, Stadium)",
    },
    dimensions: {
      type: SchemaType.OBJECT,
      properties: {
        width_m: { type: SchemaType.NUMBER },
        length_m: { type: SchemaType.NUMBER },
        height_m: { type: SchemaType.NUMBER },
      },
      required: ["width_m", "length_m", "height_m"],
    },
    total_area_sqm: {
      type: SchemaType.NUMBER,
      description: "Total floor area in square meters",
    },
    ceiling_type: {
      type: SchemaType.STRING,
      description: "Type of ceiling: flat, cathedral, sloped, tiered, etc.",
    },
    seating_capacity_estimate: {
      type: SchemaType.NUMBER,
      description: "Estimated number of people the space can accommodate",
    },

    speaker_recommendations: {
      type: SchemaType.ARRAY,
      description: "Comprehensive recommendations for each speaker type",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          speaker_type: {
            type: SchemaType.STRING,
            description: "main, delay, fill, column, subwoofer, or monitor",
          },
          required: {
            type: SchemaType.BOOLEAN,
            description: "true if this speaker type is needed, false if not",
          },
          quantity: {
            type: SchemaType.NUMBER,
            description:
              "Number of speakers of this type needed and  number needed on each side. 0 if not required.",
          },
          reasoning: {
            type: SchemaType.STRING,
            description:
              "Explanation of why this speaker type is or isn't needed",
          },
          positions: {
            type: SchemaType.ARRAY,
            description: "Array of speaker positions. Empty if not required.",
            items: {
              type: SchemaType.OBJECT,
              properties: {
                type: {
                  type: SchemaType.STRING,
                  description:
                    "main, delay, fill, column, subwoofer, or monitor",
                },
                x: {
                  type: SchemaType.NUMBER,
                  description: "X coordinate in meters",
                },
                y: {
                  type: SchemaType.NUMBER,
                  description: "Y coordinate in meters",
                },
                z: {
                  type: SchemaType.NUMBER,
                  description: "Z coordinate (height) in meters",
                },
                description: {
                  type: SchemaType.STRING,
                  description: "Brief description of placement reasoning",
                },
                angle_horizontal: {
                  type: SchemaType.NUMBER,
                  description:
                    "Optional: horizontal aiming angle in degrees (0-360)",
                },
                angle_vertical: {
                  type: SchemaType.NUMBER,
                  description:
                    "Optional: vertical aiming angle in degrees (-90 to 90)",
                },
              },
              required: ["type", "x", "y", "z"],
            },
          },
        },
        required: ["speaker_type", "required", "quantity", "reasoning"],
      },
    },

    all_speaker_positions: {
      type: SchemaType.ARRAY,
      description: "Flattened array of all speaker positions across all types",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          type: {
            type: SchemaType.STRING,
            description: "main, delay, fill, column, subwoofer, or monitor",
          },
          x: { type: SchemaType.NUMBER },
          y: { type: SchemaType.NUMBER },
          z: { type: SchemaType.NUMBER },
          description: {
            type: SchemaType.STRING,
            description: "Brief description of placement reasoning",
          },
          angle_horizontal: {
            type: SchemaType.NUMBER,
            description: "Optional: horizontal aiming angle in degrees",
          },
          angle_vertical: {
            type: SchemaType.NUMBER,
            description: "Optional: vertical aiming angle in degrees",
          },
        },
        required: ["type", "x", "y", "z"],
      },
    },

    placement_views: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          view_type: {
            type: SchemaType.STRING,
            description: "2D, 3D, VR, or AR",
          },
          description: {
            type: SchemaType.STRING,
            description: "What this view shows",
          },
          key_features: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
          },
        },
        required: ["view_type", "description", "key_features"],
      },
    },

    critical_issues: {
      type: SchemaType.ARRAY,
      description:
        "List of issues found. Return empty array if no issues detected.",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          severity: {
            type: SchemaType.STRING,
            description: "Critical, Warning, or Minor",
          },
          title: {
            type: SchemaType.STRING,
            description: "Short title of the issue",
          },
          description: {
            type: SchemaType.STRING,
            description: "Detailed description of the issue",
          },
          impact: {
            type: SchemaType.STRING,
            description: "How this affects audio quality",
          },
        },
        required: ["severity", "title", "description", "impact"],
      },
    },

    recommended_fixes: {
      type: SchemaType.ARRAY,
      description:
        "List of recommended fixes. Return empty array if no fixes needed.",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          issue_reference: {
            type: SchemaType.STRING,
            description: "Which issue this fix addresses",
          },
          solution: {
            type: SchemaType.STRING,
            description: "Summary of the solution",
          },
          steps: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: "Step-by-step implementation",
          },
          estimated_cost_usd: { type: SchemaType.NUMBER },
          priority: {
            type: SchemaType.STRING,
            description: "High, Medium, or Low",
          },
        },
        required: [
          "issue_reference",
          "solution",
          "steps",
          "estimated_cost_usd",
          "priority",
        ],
      },
    },

    total_estimated_cost_usd: {
      type: SchemaType.NUMBER,
      description:
        "Total cost for all recommended fixes. Set to 0 if no fixes needed.",
    },

    analysis_summary: {
      type: SchemaType.STRING,
      description: "Overall summary of the hall analysis and recommendations",
    },

    room_status: {
      type: SchemaType.STRING,
      description:
        "Overall room quality: Excellent, Good, Needs Improvement, or Critical with percentage score of the room",
    },

    positive_features: {
      type: SchemaType.ARRAY,
      description: "Optional: Things the room does well acoustically",
      items: { type: SchemaType.STRING },
    },

    acoustic_challenges: {
      type: SchemaType.ARRAY,
      description: "Optional: Inherent acoustic challenges of the space",
      items: { type: SchemaType.STRING },
    },
  },
  required: [
    "room_type",
    "dimensions",
    "total_area_sqm",
    "ceiling_type",
    "seating_capacity_estimate",
    "speaker_recommendations",
    "all_speaker_positions",
    "placement_views",
    "critical_issues",
    "recommended_fixes",
    "total_estimated_cost_usd",
    "analysis_summary",
    "room_status",
  ],
};

export async function GET() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const root = process.cwd();

    const imageNames = [
      "hall-front.jpg",
      "hall-back.jpg",
      "hall-side1.jpg",
      "hall-side2.jpg",
    ];
    const imageParts = imageNames.map((name) => {
      const filePath = path.join(root, "public", "images", name);

      if (!existsSync(filePath)) {
        throw new Error(`Missing image at: ${filePath}`);
      }

      const imageBuffer = readFileSync(filePath);
      return {
        inlineData: {
          mimeType: mime.getType(filePath) || "image/jpeg",
          data: imageBuffer.toString("base64"),
        },
      };
    });
    const model = genAI.getGenerativeModel({
      model: "gemini-3-pro-preview",
      systemInstruction: `You are EchoVision AI. Analyze the hall images. 
      Use the center-stage floor as origin (0,0,0). 
      Provide precise coordinate-based speaker placement and a cost analysis for issues found.`,
    });

    // 4. Execute Request
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            ...imageParts,
            {
              text: "Analyze this hall and generate the speaker placement JSON.",
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: speakerAnalysisSchema,
      },
    });

    const responseText = result.response.text();
    return NextResponse.json(JSON.parse(responseText));
  } catch (error: any | string) {
    console.error("Analysis Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
