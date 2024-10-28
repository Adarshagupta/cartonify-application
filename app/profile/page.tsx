"use client";

import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2, Settings, LogOut, User, Calendar, Mail, Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl p-4 space-y-8">
      {/* Profile Header Card */}
      <Card className="p-8 bg-gradient-to-br from-background/50 to-primary/5 backdrop-blur-sm border-primary/20">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative group">
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-primary to-purple-500 opacity-75 group-hover:opacity-100 transition-opacity blur"></div>
            <Avatar className="h-24 w-24 relative border-2 border-background">
              <AvatarImage
                src={session?.user?.image || "https://github.com/shadcn.png"}
                alt={session?.user?.name || "User avatar"}
              />
              <AvatarFallback className="text-lg">
                {session?.user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary/50">
              {session?.user?.name || "User"}
            </h1>
            <p className="text-muted-foreground">{session?.user?.email}</p>
          </div>
        </div>
      </Card>

      {/* Profile Details */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Account Info */}
        <Card className="p-6 space-y-6 bg-background/50 backdrop-blur-sm border-primary/20 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-2 text-primary">
            <User className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Account Information</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{session?.user?.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium">
                  {session?.user?.createdAt
                    ? new Date(session.user.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6 space-y-6 bg-background/50 backdrop-blur-sm border-primary/20 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-2 text-primary">
            <Shield className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Quick Actions</h2>
          </div>

          <div className="space-y-4">
            <Link href="/settings">
              <Button variant="outline" className="w-full gap-2 group hover:border-primary/50">
                <Settings className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                Settings
              </Button>
            </Link>
            
            <Button
              variant="destructive"
              className="w-full gap-2 group"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Sign out
            </Button>
          </div>
        </Card>
      </div>

      {/* Recent Activity or Stats could go here */}
      <Card className="p-6 bg-background/50 backdrop-blur-sm border-primary/20">
        <p className="text-center text-sm text-muted-foreground">
          View your <Link href="/history" className="text-primary hover:underline">generation history</Link> to see your created images
        </p>
      </Card>
    </div>
  );
}
