import {
  WorkshopsDataTable,
  type Workshop,
} from "@/components/enterprise/workshops/workshops-data-table";


const MyWorkShopsPage = () => {

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
          <div className="flex items-center gap-3">
            <div className="h-1 w-12 bg-linear-to-r from-orange-500 to-purple-500 rounded-full"></div>
            <span className="text-sm font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
              Workshop Management
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-orange-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            My Workshops
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Manage your workshops and view applicant details. Track upcoming,
            ongoing, and concluded workshops all in one place.
          </p>

          {/* Stats Cards */}
          {/* <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></div>
              <span className="text-sm font-medium text-orange-700 dark:text-orange-400">
                {workshops.filter((w) => w.status === "upcoming").length}{" "}
                Upcoming
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse"></div>
              <span className="text-sm font-medium text-purple-700 dark:text-purple-400">
                {workshops.filter((w) => w.status === "ongoing").length} Ongoing
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-500/10 border border-pink-500/20">
              <div className="h-2 w-2 rounded-full bg-pink-500"></div>
              <span className="text-sm font-medium text-pink-700 dark:text-pink-400">
                {workshops.filter((w) => w.status === "concluded").length}{" "}
                Concluded
              </span>
            </div>
          </div> */}
        </div>
      </div>

      {/* Data Table */}
      <WorkshopsDataTable  />
    </div>
  );
};

export default MyWorkShopsPage;
