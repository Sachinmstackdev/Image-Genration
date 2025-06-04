import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Premium subscription management API
export async function POST(req: Request) {
  try {
    const user = await currentUser();
    
    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Update user metadata to set premium status
    const client = await clerkClient();
    await client.users.updateUserMetadata(user.id, {
      publicMetadata: {
        isPremium: true,
        premiumSince: new Date().toISOString(),
      }
    });

    return new NextResponse("Premium status updated", { status: 200 });
  } catch (error) {
    console.error("[PREMIUM_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const user = await currentUser();
    
    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const client = await clerkClient();
    const clerkUser = await client.users.getUser(user.id);
    const isPremium = clerkUser.publicMetadata.isPremium;

    return NextResponse.json({ isPremium });
  } catch (error) {
    console.error("[PREMIUM_STATUS_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 