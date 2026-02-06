import { NextResponse, NextRequest } from "next/server";
import { GoogleGenerativeAI, SchemaType, Schema } from "@google/generative-ai";

const venueConsistencySchema = {
  type: SchemaType.OBJECT,
  properties: {
    same_venue: { type: SchemaType.BOOLEAN },
    confidence: {
      type: SchemaType.NUMBER,
      description: "0 to 1 confidence score",
    },
    mismatches: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.STRING,
      },
    },
    reasoning: {
      type: SchemaType.STRING,
    },
  },
  required: ["same_venue", "confidence"],
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
      You are EchoVision AI acting as a VENUE CONSISTENCY INSPECTOR.

      Your task is to determine whether multiple uploaded images
      represent the SAME physical enclosed venue.

      You must compare images AGAINST EACH OTHER.

      STRICT RULES:
      - Do NOT generate acoustic plans
      - Do NOT estimate speaker placement
      - Do NOT describe audio systems
      - Do NOT use markdown
      - Do NOT include explanations outside JSON
      - Output ONLY valid JSON matching the schema
      - Be conservative when uncertain

      ANALYZE CONSISTENCY BASED ON:
      - Ceiling height and structure
      - Stage presence, elevation, and width
      - Wall materials and geometry
      - Seating layout and orientation
      - Balcony or tiered seating presence
      - Room proportions (long vs wide)
      - Permanent fixtures (columns, trusses, lighting grids)

      If major structural conflicts exist, the venue is NOT the same.

      If images are ambiguous, lower confidence.

      Return confidence as a value between 0 and 1.
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
              text: `These images are claimed to be from the SAME venue,
                      captured from different viewpoints:

                      - Stage / Front view
                      - Left wall
                      - Right wall
                      - Rear / Ceiling view

                      Determine if they depict the same physical space.
`,
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: venueConsistencySchema,
      },
    });

    const responseText = result.response.text();
    return NextResponse.json(JSON.parse(responseText));
  } catch (error: any | string) {
    console.error("Analysis Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
