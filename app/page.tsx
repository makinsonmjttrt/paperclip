import { MeshGradientSVG } from "@/components/mesh-gradient-svg"
import { AIAgentsSection } from "@/components/ai-agents-section"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#101010] flex flex-col items-center justify-center gap-12 p-8">
      <div className="max-w-md">
        <MeshGradientSVG />
      </div>
      <AIAgentsSection />
    </div>
  )
}
