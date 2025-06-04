import { ImageGenerationCard } from "@/components/dashboard/ImageGenerationCard";
import { GeneratedImagesGrid } from "@/components/dashboard/GeneratedImagesGrid";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Image Generation Card */}
      <ImageGenerationCard />

      {/* Generated Images Grid */}
      <GeneratedImagesGrid />
    </div>
  );
} 