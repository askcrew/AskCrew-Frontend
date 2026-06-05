import {
  ApplicantsDataTable,
  Applicant,
} from "@/components/enterprise/workshops/applicants-data-table";
import { Button } from "@/components/ui/button";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

// Mock data - replace with actual data fetching
const applicants: Applicant[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    specification: "Film Director",
    profile: "student",
    email: "sarah.johnson@example.com",
    skills: ["Directing", "Cinematography", "Editing"],
    location: "Los Angeles, CA",
    education: "UCLA Film School",
    status: "pending",
  },
  {
    id: "2",
    name: "Michael Chen",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    specification: "Screenwriter",
    profile: "student",
    email: "michael.chen@example.com",
    skills: ["Screenwriting", "Story Development", "Character Design"],
    location: "New York, NY",
    education: "NYU Tisch School",
    status: "pending",
  },
  {
    id: "3",
    name: "Emma Davis",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    specification: "Cinematographer",
    profile: "enterprise",
    email: "emma.davis@example.com",
    skills: ["Camera Operation", "Lighting", "Color Grading"],
    location: "Atlanta, GA",
    education: "SCAD",
    status: "accepted",
  },
  {
    id: "4",
    name: "James Wilson",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    specification: "Film Editor",
    profile: "student",
    email: "james.wilson@example.com",
    skills: ["Adobe Premiere", "DaVinci Resolve", "Sound Design"],
    location: "Austin, TX",
    education: "UT Austin",
    status: "pending",
  },
  {
    id: "5",
    name: "Olivia Martinez",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
    specification: "Production Designer",
    profile: "enterprise",
    email: "olivia.martinez@example.com",
    skills: ["Set Design", "Art Direction", "Prop Styling"],
    location: "Chicago, IL",
    education: "Columbia College Chicago",
    status: "rejected",
  },
  {
    id: "6",
    name: "Daniel Brown",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Daniel",
    specification: "Sound Designer",
    profile: "student",
    email: "daniel.brown@example.com",
    skills: ["Audio Mixing", "Foley", "Music Composition"],
    location: "Nashville, TN",
    education: "Belmont University",
    status: "pending",
  },
];

interface ApplicantsPageProps {
  params: {
    id: string;
  };
}

const ApplicantsPage = ({ params }: ApplicantsPageProps) => {
  // In a real app, fetch workshop details using params.id
  const workshopTitle = "Acting Masterclass";

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header Section with Gradient Background */}
      <div className="relative overflow-hidden rounded-xl bg-linear-to-br from-orange-500/10 via-purple-500/10 to-pink-500/10 p-8 border border-orange-200/20 dark:border-orange-500/20">
        {/* Decorative Background Blobs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-orange-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

        {/* Content */}
        <div className="relative flex flex-col gap-3">
          {/* Back Button */}
          <Link href="/enterprise/dashboard/workshops/my-workshop">
            <Button
              variant="ghost"
              size="sm"
              className="w-fit -ml-2 mb-2 hover:bg-orange-500/10"
            >
              <IconArrowLeft className="mr-2 size-4" />
              Back to Workshops
            </Button>
          </Link>

          <div className="flex items-center gap-3">
            <div className="h-1 w-12 bg-linear-to-r from-orange-500 to-purple-500 rounded-full"></div>
            <span className="text-sm font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
              Workshop Applicants
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-orange-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {workshopTitle}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Review and manage applications for your workshop. Accept or reject
            applicants based on their profiles and qualifications.
          </p>

          {/* Stats Cards */}
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></div>
              <span className="text-sm font-medium text-orange-700 dark:text-orange-400">
                {applicants.filter((a) => a.status === "pending").length}{" "}
                Pending
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium text-green-700 dark:text-green-400">
                {applicants.filter((a) => a.status === "accepted").length}{" "}
                Accepted
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="h-2 w-2 rounded-full bg-red-500"></div>
              <span className="text-sm font-medium text-red-700 dark:text-red-400">
                {applicants.filter((a) => a.status === "rejected").length}{" "}
                Rejected
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <ApplicantsDataTable data={applicants} />
    </div>
  );
};

export default ApplicantsPage;
