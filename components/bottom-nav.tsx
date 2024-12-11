import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Home, 
  History,
  ImagePlus,
  UserCircle,
  Edit3
} from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  const links = [
    {
      href: "/",
      icon: Home,
      label: "Home",
    },
    {
      href: "/generate",
      icon: ImagePlus,
      label: "Generate",
    },
    {
      href: "/image-editor",
      icon: Edit3,
      label: "Edit",
    },
    {
      href: "/history",
      icon: History,
      label: "History",
    },
    {
      href: "/profile",
      icon: UserCircle,
      label: "Profile",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-background border-t">
      <div className="container h-full mx-auto flex items-center justify-around">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full",
              pathname === link.href
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            )}
          >
            <link.icon className="h-5 w-5" />
            <span className="text-xs mt-1">{link.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
