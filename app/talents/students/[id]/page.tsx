"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  ProfileHeader,
  AboutSection,
  StudentDetailsCard,
  ChatButton,
} from "@/components/student/profile";
import { getProfileById } from "@/lib/api/profiles";
import { useCreateChat } from "@/hooks/use-create-chat";

const StudentProfilePage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
 const createChat = useCreateChat();
  const {
    data: profileData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["student-profile", id],
    queryFn: () => getProfileById(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">
            {error instanceof Error ? error.message : "Profile not found"}
          </p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const name = profileData.fullname;
  const image = profileData.profile_photo || "";
  const rating = profileData.rating_mean;
  const reviewCount = profileData.rating_count;
  const role = "Student";
  const isAvailable = profileData.is_active;
  const isVerified = profileData.is_verified;
  const about = profileData.personal_info || "No information available";
  const location = `${profileData.profile.city}, ${profileData.profile.country}`;
  const roleType = profileData.profile.specification;
  const education = `${profileData.profile.institute} (${profileData.profile.academic_year})`;
  const skills: string[] = profileData.profile.skills
    ? profileData.profile.skills.split(",").map((skill: string) => skill.trim())
    : [];
  const socials = {
    facebook: profileData.profile.facebook_link || "",
    instagram: profileData.profile.instagram_link || "",
    linkedin: profileData.profile.linkedin_link || "",
    email: profileData.email,
    youtube: profileData.profile.youtube_link || "",
  };
  const cvUrl = profileData.profile.cv || "";
 
   const handleChatClick = () => {
     createChat.mutate(parseInt(id));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with back button */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="hover:bg-accent"
          >
            <ArrowLeft className="size-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Profile Header */}
          <ProfileHeader
            name={name}
            image={image}
            rating={rating}
            reviewCount={reviewCount}
            role={role}
            isAvailable={isAvailable}
            isVerified={isVerified}
            cvUrl={cvUrl}
          />

          {/* About Section */}
          <AboutSection about={about} />

          {/* Student Details Card (Replaces InfoCards and PortfolioGrid) */}
          <StudentDetailsCard
            location={location}
            education={education}
            role={roleType}
            skills={skills}
            socials={socials}
          />

          {/* Chat Button */}
          <ChatButton onClick={handleChatClick} />
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
