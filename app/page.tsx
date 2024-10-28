import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sparkles, Zap, Image as ImageIcon, History as HistoryIcon, Wand2, Stars } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  const features = [
    {
      icon: <Wand2 className="h-6 w-6" />,
      title: "AI-Powered Creation",
      description: "Transform text into stunning visuals using advanced AI technology",
      href: "/generate",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: <HistoryIcon className="h-6 w-6" />,
      title: "Image History",
      description: "Keep track of all your creative generations",
      href: "/history",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Instant Generation",
      description: "Create beautiful images in seconds",
      href: "/generate",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    }
  ];

  return (
    <div className="min-h-screen bg-dot-pattern relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float opacity-50" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float-delay opacity-50" />
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="container max-w-4xl px-4 pt-24 pb-20">
          <div className="text-center space-y-8">
            <div className="inline-block relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 blur-xl animate-pulse" />
              <div className="relative p-4 rounded-full bg-background/80 backdrop-blur-sm border border-primary/10">
                <Stars className="h-12 w-12 text-primary animate-pulse" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-6xl font-bold tracking-tight sm:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary/50 animate-gradient">
                AI Image Generator
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Transform your imagination into stunning visuals with our state-of-the-art AI technology
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <Link href="/generate">
                <Button size="lg" className="gap-2 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 animate-gradient" />
                  <span className="relative">Start Creating</span>
                  <ArrowRight className="h-4 w-4 relative group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/history">
                <Button size="lg" variant="outline" className="group backdrop-blur-sm border-primary/20">
                  View Gallery
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container max-w-4xl px-4 py-20">
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="p-6 space-y-4 bg-background/50 backdrop-blur-sm border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group">
            <div className="aspect-square relative rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 animate-gradient z-10" />
              <Image
                src="https://image.cdn2.seaart.me/2024-09-29/crstl9le878c7394thjg/6f4b1887cfbda436ea29c28371a2e301b9f068d3_high.webp"
                alt="Example generated image"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />
            </div>
            <div className="space-y-3 relative z-30">
              <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                Create Magic
              </h3>
              <p className="text-muted-foreground">
                Turn your ideas into stunning visuals with just a few words
              </p>
              <Link href="/generate">
                <Button className="w-full gap-2 group/btn relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 animate-gradient" />
                  <span className="relative">Start Creating</span>
                  <ArrowRight className="h-4 w-4 relative group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </Card>

          <div className="space-y-4">
            {features.map((feature, index) => (
              <Link key={index} href={feature.href}>
                <Card className="p-6 bg-background/50 backdrop-blur-sm border-primary/20 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-500 group">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl ${feature.bgColor} ${feature.color} group-hover:scale-110 transition-transform duration-300 relative`}>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 to-purple-500/10 animate-gradient" />
                      <div className="relative">{feature.icon}</div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-medium group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="container max-w-4xl px-4 py-8 text-center border-t border-primary/10 backdrop-blur-sm relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5" />
        <p className="text-sm text-muted-foreground relative">
          Powered by advanced AI models to create unique and creative images
        </p>
      </div>
    </div>
  );
}
