import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const queryString = searchParams.toString();
  
  const backendUrl = `https://admin.askcrews.com/api/v1/content/trending/?${queryString}`;
  
  console.log("Proxying request to:", backendUrl);
  
  try {
    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      console.error("Backend response error:", response.status, response.statusText);
      return NextResponse.json(
        { error: "Backend request failed", status: response.status },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    console.log("Backend response data:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Proxy request failed" },
      { status: 500 }
    );
  }
}
