import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ImageGeneration from "./components/ImageGeneration";

export default async function Home() {
  const { userId } = await auth();
  
  // If not signed in, redirect to sign-in page
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto">
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-leonardo-pink to-leonardo-purple text-transparent bg-clip-text animate-gradient-x">
          Create Amazing AI Art
        </h1>
        <p className="text-leonardo-pink/60 text-lg md:text-xl">
          Transform your imagination into stunning images with Eve AI
        </p>
      </div>
      <ImageGeneration />
    </div>
  );
} 