import React from "react";
import {
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  CheckSquare,
  FileText,
  Globe,
  HandHeart,
  Hash,
  Info,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  ToggleLeft,
  User,
} from "lucide-react";

export function QuestionIcon({
  name,
  size = 24,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const props = { size, strokeWidth: 1.75, className, "aria-hidden": true as const };

  switch (name) {
    case "globe":
      return <Globe {...props} />;
    case "user":
      return <User {...props} />;
    case "map-pin":
      return <MapPin {...props} />;
    case "phone":
      return <Phone {...props} />;
    case "calendar":
      return <Calendar {...props} />;
    case "shield-check":
      return <ShieldCheck {...props} />;
    case "heart-handshake":
      return <HandHeart {...props} />;
    case "briefcase":
      return <Briefcase {...props} />;
    case "mail":
      return <Mail {...props} />;
    case "book-open":
      return <BookOpen {...props} />;
    case "building":
      return <Building2 {...props} />;
    case "hash":
      return <Hash {...props} />;
    case "check-square":
      return <CheckSquare {...props} />;
    case "toggle-left":
      return <ToggleLeft {...props} />;
    case "file-text":
      return <FileText {...props} />;
    case "info":
    default:
      return <Info {...props} />;
  }
}
