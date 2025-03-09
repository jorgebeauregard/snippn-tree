import { NextResponse } from 'next/server';

interface Link {
  id: number;
  short_key: string;
  original_url: string;
  description: string;
  created_at: string;
}

export async function POST(req: Request) {
  try {
    const { username } = await req.json(); // Extract email from request body

    if (!username) {
      return NextResponse.json({ error: "Missing username" }, { status: 400 });
    }

    const response = await fetch("https://snippn.com/fetchTreeUserInfo?", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username }) // Send email instead of handle
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch user info" }, { status: response.status });
    }

    const data = await response.json();

    // Explicitly type links as Link[]
    const links: Link[] = data.links;

    // Format response to match frontend expectations
    const formattedData = {
      profileImage: "https://example.com/profile.jpg", // Placeholder, update if needed
      name: data.display_name,
      handle: data.social_handle,
      links: links.map((link: Link) => ({
        id: link.id,
        title: link.description || "Untitled",
        url: "https://snippn.com/" + link.short_key
      }))
    };

    return NextResponse.json(formattedData);
  } catch (error: unknown) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}