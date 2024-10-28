import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await prisma.userSettings.findUnique({
      where: {
        userEmail: session.user.email,
      },
      select: {
        theme: true,
        notifications: true,
        emailUpdates: true,
        imageQuality: true,
        autoSave: true,
        language: true,
      }
    });

    if (!settings) {
      // Return default settings if none exist
      return NextResponse.json({
        theme: 'light',
        notifications: true,
        emailUpdates: false,
        imageQuality: 'high',
        autoSave: true,
        language: 'en',
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Settings fetch error:', error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await request.json();
    
    // Validate the settings object
    const validSettings = {
      theme: settings.theme,
      notifications: Boolean(settings.notifications),
      emailUpdates: Boolean(settings.emailUpdates),
      imageQuality: settings.imageQuality,
      autoSave: Boolean(settings.autoSave),
      language: settings.language,
    };

    const updatedSettings = await prisma.userSettings.upsert({
      where: {
        userEmail: session.user.email,
      },
      update: validSettings,
      create: {
        ...validSettings,
        userEmail: session.user.email,
      },
      select: {
        theme: true,
        notifications: true,
        emailUpdates: true,
        imageQuality: true,
        autoSave: true,
        language: true,
      }
    });

    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
