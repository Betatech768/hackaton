import { NextResponse, NextRequest } from "next/server";
import { GoogleGenerativeAI, SchemaType, Schema } from "@google/generative-ai";
import { AnalysisResult } from "@/types/speaker";

// Gemini API Schema
const speakerAnalysisSchema = {
  type: SchemaType.OBJECT,
  properties: {
    room_type: {
      type: SchemaType.STRING,
      description:
        "Type of room (e.g., Conference Hall, Auditorium, Church, Theater, Stadium)",
    },
    stage_area: {
      type: SchemaType.OBJECT,
      properties: {
        length_m: { type: SchemaType.NUMBER },
        width_m: { type: SchemaType.NUMBER },
        height_m: { type: SchemaType.NUMBER },
        stage_position: {
          type: SchemaType.OBJECT,
          properties: {
            x_m: { type: SchemaType.NUMBER },
            y_m: { type: SchemaType.NUMBER },
            z_m: { type: SchemaType.NUMBER },
          },
        },
      },
      description: "Area of the stage in square meters",
      required: ["length_m", "width_m"],
    },

    seating_area: {
      type: SchemaType.OBJECT,
      properties: {
        length_m: { type: SchemaType.NUMBER },
        width_m: { type: SchemaType.NUMBER },
        seating_capacity: {
          type: SchemaType.NUMBER,
          description: "Total number of people the area can accommodate",
        },
        layout_type: {
          type: SchemaType.STRING,
          description: "e.g., Theater, Banquet, Classroom, or Standing",
        },
        floor_to_stage_distance_m: {
          type: SchemaType.NUMBER,
          description: "Distance from the front of the seating to the stage",
        },
        is_tiered: {
          type: SchemaType.BOOLEAN,
          description: "Whether the seating is sloped/stadium style",
        },
      },
      description: "Dimensions and capacity of the audience area",
      required: ["length_m", "width_m", "seating_capacity"],
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
      description: `Flattened array of all speaker positions across all types consider the stage area when placing speakers; 
        consider the stage height when placing monitors, monitors must be on the stage. consider stage width when placing subwoofers. consider the hall 
        height when placing the eposition of the line array speakers.
        stage must be included in the hall dimensions and speaker positions must be relative to the hall dimensions.`,
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
          range: {
            type: SchemaType.NUMBER,
            description:
              "Effective acoustic throw distance in meters. Mains: 20-50m, Fills/Monitors: 3-10m, Subs: 10-15m. Adjust based on hall depth.",
          },
        },
        required: [
          "type",
          "x",
          "y",
          "z",
          "angle_horizontal",
          "angle_vertical",
          "range",
        ],
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
    "critical_issues",
    "recommended_fixes",
    "total_estimated_cost_usd",
    "analysis_summary",
    "stage_area",
    "room_status",
    "seating_area",
  ],
} satisfies Schema;

export async function POST(request: NextRequest) {
  try {
    const { images } = await request.json();

    const imageParts = images.filter(Boolean).map((image: any) => {
      const { dataUrl } = image;
      const [meta, base64] = dataUrl.split(",");
      const mimeType = meta.match(/data:(.*);base64/)?.[1] ?? "image/jpeg";
      return {
        inlineData: {
          mimeType,
          data: base64,
        },
      };
    });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: "gemini-3-pro-preview",
      systemInstruction: `
      You are EchoVision AI, a professional acoustic analysis engine.

      Your task is to analyze multiple images of the SAME enclosed hall and generate
      a precise, engineering-grade speaker placement plan.

      STRICT RULES:
      - Do NOT explain your reasoning
      - Do NOT use markdown
      - Do NOT add extra fields
      - Output ONLY valid JSON matching the provided schema
      - All units MUST be in meters
      - All coordinates MUST be relative to the hall dimensions
      - Ensure that Subwoofers, Monitors, and Fill must be relative to the stage size and positon
      - Subwoofers MUST NOT be placed under the stage. Position them at y > (stage.y + stage.depth).
      - Monitors and Front Fills must have a z value equal to stage.height.
      - The room percentage score MUST be a string in the format "XX%" (e.g., "70%"). Never use fractions like "70/100".
      - Never stack the "Main" speakers on top of one another.
      - Monitors must never be placed in front of Front Fills.
      - Monitors must back seating area.
      - Speaker Grounding: For any equipment placed on the stage (Monitors/Fills), the Z-coordinate must be stage.height + (speaker_half_height). Assume Monitor height is 0.4m and Fill height is 0.3m.
      - The seating area coordinates must be positioned relative to the stage front and remain within hall boundaries.
      - Dynamic Equipment Selection: If the hall area is < 60m², do NOT use Line Arrays (Mains). Instead, use "Point Source" speakers. Do NOT calculate for line array curvature or multiple elements.
      - Ceiling Constraint: If hall height is < 4m, set all speaker vertical angles to 0° to avoid floor/ceiling phase cancellation.
      - High-Frequency Aiming: The angle_vertical for Mains must be calculated to point at the center-point of the seating area depth, never at the floor or back wall directly.
      - Obstruction Check: No speaker (Mains or Fills) may have a direct line-of-sight path blocked by the stage or other speakers.
      - Subwoofer Symmetry: If multiple subwoofers are used, they must be placed symmetrically relative to the center-line of the hall (Mirror X-axis) unless the hall is asymmetrical.


      COMPONENT LOGIC (The "Anti-Stacking" Fix):
        - Main Arrays: Each "main" must be a SINGLE entry in the array representing the top-most hang point.
        - No Element Listing: Do NOT list individual elements of a line array (e.g., Top, Mid, Bottom). Gemini must calculate the optimal single position for the entire array hang.
        - Subwoofers: If multiple subwoofers are needed, they must have unique [x, y] coordinates. Do NOT stack them on top of each other at the same coordinate.
      
      COORDINATE SYSTEM:
      - Origin (0,0,0) = front-left floor corner of the hall
      - X axis → hall width (left to right)
      - Y axis → height (floor to ceiling)
      - Z axis → hall length (front to back)

      PLACEMENT CONSTRAINTS:
      - Stage MUST be inside hall dimensions
      - Monitors MUST be on the stage
      - Subwoofers MUST be on the floor
      - Line arrays MUST respect hall height
      - Speaker positions MUST NOT exceed hall bounds
      - Seating area must not exceed hall bounds
      - Seating area must be atleast 1m away from stage position 
      - Use realistic professional audio engineering assumptions for Seating Area 

      Use realistic professional audio engineering assumptions
      when exact measurements are not visually available.

      All angle values MUST be in degrees.
      0 degrees faces directly toward the back of the hall (positive Z axis).

      `,
    });

    // 4. Execute Request
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            ...imageParts,
            {
              text: `The following images show the same hall from different viewpoints
                      1. Stage / front view
                      2. Left wall view
                      3. Right wall view
                      4. Rear / ceiling view

                      Analyze the hall and generate a complete speaker analysis
                      and placement plan using the required JSON schema`,
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
    return NextResponse.json(JSON.parse(responseText) as AnalysisResult);
  } catch (error: any | string) {
    console.error("Analysis Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
