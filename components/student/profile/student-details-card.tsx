import {
  MapPin,
  GraduationCap,
  Briefcase,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Youtube,
} from "lucide-react";
import Link from "next/link";

interface StudentDetailsCardProps {
  location: string;
  education: string;
  role: string;
  skills: string[];
  socials: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    email?: string;
    youtube?: string;
  };
}

export function StudentDetailsCard({
  location,
  education,
  role,
  skills,
  socials,
}: StudentDetailsCardProps) {
  return (
    <div className="bg-muted/30 border border-border rounded-3xl p-8 shadow-sm">
      <div className="space-y-6">
        {/* Info Items */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-muted-foreground">
            <MapPin className="size-5" />
            <span className="text-base">{location}</span>
          </div>
          <div className="h-px bg-border/50 w-full" />

          <div className="flex items-center gap-3 text-muted-foreground">
            <GraduationCap className="size-5" />
            <span className="text-base">{education}</span>
          </div>
          <div className="h-px bg-border/50 w-full" />

          <div className="flex items-center gap-3 text-muted-foreground">
            <Briefcase className="size-5" />
            <span className="text-base">{role}</span>
          </div>
          <div className="h-px bg-border/50 w-full" />
        </div>

        {/* Skills */}
        <div>
          <h3 className="text-lg font-bold text-purple-700 dark:text-purple-400 mb-4">
            Skills
          </h3>
          <div className="grid grid-cols-2 gap-y-3 gap-x-8">
            {skills.map((skill, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-orange-400 shrink-0" />
                <span className="text-muted-foreground">{skill}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-px bg-border/50 w-full" />

        {/* Socials */}
        <div className="flex gap-4">
          {socials.facebook && (
            <Link
              href={socials.facebook}
              className="text-blue-600 hover:opacity-80 transition-opacity"
            >
              <Facebook className="size-6" />
            </Link>
          )}
          {socials.instagram && (
            <Link
              href={socials.instagram}
              className="text-pink-600 hover:opacity-80 transition-opacity"
            >
              <Instagram className="size-6" />
            </Link>
          )}
          {socials.linkedin && (
            <Link
              href={socials.linkedin}
              className="text-blue-700 hover:opacity-80 transition-opacity"
            >
              <Linkedin className="size-6" />
            </Link>
          )}
          {socials.email && (
            <Link
              href={`mailto:${socials.email}`}
              className="text-red-500 hover:opacity-80 transition-opacity"
            >
              <Mail className="size-6" />
            </Link>
          )}
          {socials.youtube && (
            <Link
              href={socials.youtube}
              className="text-red-600 hover:opacity-80 transition-opacity"
            >
              <Youtube className="size-6" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
