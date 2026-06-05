"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  IconUser,
  IconMapPin,
  IconMail,
  IconWorld,
  IconBriefcase as IconExperience,
} from "@tabler/icons-react";
import { GraduationCap, Briefcase } from "lucide-react";
import Link from "next/link";
import type { JobApplicant } from "../schema";

interface ProfileDetailsDialogProps {
  applicant: JobApplicant;
}

export function ProfileDetailsDialog({ applicant }: ProfileDetailsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950"
        >
          <IconUser className="mr-2 size-4" />
          View Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Applicant Profile</DialogTitle>
          <DialogDescription>
            Detailed information about the applicant
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Profile Header */}
          <div className="flex items-start gap-4">
            <Avatar className="size-20 border-2 border-orange-500/20">
              <AvatarImage src={applicant.image} alt={applicant.name} />
              <AvatarFallback className="bg-orange-500/10 text-orange-700 text-xl font-bold">
                {(applicant.name as string)
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{applicant.name as string}</h3>
              <p className="text-muted-foreground">
                {applicant.specification as string}
              </p>
              <div className="flex gap-2 mt-2">
                <Badge
                  variant={
                    applicant.profile === "student" ? "default" : "secondary"
                  }
                >
                  {applicant.profile === "student" ? (
                    <GraduationCap className="mr-1 size-3" />
                  ) : (
                    <Briefcase className="mr-1 size-3" />
                  )}
                  {applicant.profile as string}
                </Badge>
                <Badge variant="outline">
                  <IconExperience className="mr-1 size-3" />
                  {applicant.experience as string}
                </Badge>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-muted/30 rounded-xl p-4 space-y-3">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-orange-600 dark:text-orange-400">
              Contact Information
            </h4>
            <div className="flex items-center gap-3 text-muted-foreground">
              <IconMail className="size-4" />
              <span className="text-sm">{applicant.email as string}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <IconMapPin className="size-4" />
              <span className="text-sm">{applicant.location as string}</span>
            </div>
            {(applicant.portfolio as string) && (
              <div className="flex items-center gap-3 text-muted-foreground">
                <IconWorld className="size-4" />
                <Link
                  href={applicant.portfolio as string}
                  target="_blank"
                  className="text-sm text-purple-600 hover:underline"
                >
                  View Portfolio
                </Link>
              </div>
            )}
          </div>

          {/* Education */}
          <div className="bg-muted/30 rounded-xl p-4 space-y-3">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Education
            </h4>
            <div className="flex items-center gap-3 text-muted-foreground">
              <GraduationCap className="size-4" />
              <span className="text-sm">{applicant.education as string}</span>
            </div>
          </div>

          {/* Experience */}
          <div className="bg-muted/30 rounded-xl p-4 space-y-3">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Experience
            </h4>
            <div className="flex items-center gap-3 text-muted-foreground">
              <IconExperience className="size-4" />
              <span className="text-sm">
                {applicant.experience as string} of experience
              </span>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-muted/30 rounded-xl p-4 space-y-3">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-pink-600 dark:text-pink-400">
              Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {(applicant.skills as string[]).map(
                (skill: string, index: number) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-orange-500/5 border-orange-500/20"
                  >
                    {skill}
                  </Badge>
                )
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
