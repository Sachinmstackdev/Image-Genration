import { currentUser } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    
    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Update user metadata to set premium status
    await clerkClient.users.updateUserMetadata(user.id, {
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

    const clerkUser = await clerkClient.users.getUser(user.id);
    const isPremium = clerkUser.publicMetadata.isPremium;

    return NextResponse.json({ isPremium });
  } catch (error) {
    console.error("[PREMIUM_STATUS_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 