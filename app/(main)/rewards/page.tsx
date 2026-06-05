"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentUserProfile } from "@/lib/api/profiles";
import {
  useMyCodes,
  useRedeemReward,
  useRewardHistory,
  useRewards,
} from "@/lib/queries/rewards";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle2,
  Coins,
  Copy,
  Gift,
  History,
  Loader2,
  Ticket,
} from "lucide-react";
import Image from "next/image";
import Swal from "sweetalert2";

export default function RewardsPage() {
  const { data: userProfile } = useQuery({
    queryKey: ["current-user-profile"],
    queryFn: getCurrentUserProfile,
  });

  const userPoints = userProfile?.data?.points || 0;
  const { data: rewardsData, isLoading: rewardsLoading } = useRewards();
  const { data: myCodesData, isLoading: codesLoading } = useMyCodes();
  const { data: historyData, isLoading: historyLoading } = useRewardHistory();
  const { mutate: redeem, isPending: isRedeeming } = useRedeemReward();

  const handleRedeem = (rewardId: number, rewardPoints: number) => {
    if (userPoints < rewardPoints) {
      Swal.fire({
        icon: "warning",
        title: "Insufficient Points",
        text: `You need ${rewardPoints - userPoints} more points to redeem this reward.`,
        confirmButtonColor: "#f97316",
      });
      return;
    }

    Swal.fire({
      title: "Confirm Redemption",
      text: `Are you sure you want to spend ${rewardPoints} points on this reward?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#9333ea",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, redeem it!",
    }).then((result) => {
      if (result.isConfirmed) {
        redeem(rewardId);
      }
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Code copied!",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  if (rewardsLoading || codesLoading || historyLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
          <div className="absolute inset-0 blur-xl bg-purple-500/20 animate-pulse" />
        </div>
        <p className="text-muted-foreground animate-pulse font-medium">
          Gathering your rewards...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col px-4 pb-12 pt-6 sm:px-6 lg:px-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header / Points Summary */}
      <div className="relative overflow-hidden group">
        <div className="absolute inset-0 bg-linear-to-r from-purple-600/10 to-orange-500/10 rounded-3xl blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
        <Card className="relative p-8 rounded-3xl border-none bg-white/50 dark:bg-zinc-950/40 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
          <div className="absolute top-0 right-0 -tranzinc-y-1/2 tranzinc-x-1/4 size-64 bg-purple-500/10 rounded-full blur-3xl" />

          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">
              Rewards{" "}
              <span className="bg-linear-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                Center
              </span>
            </h1>
            <p className="text-muted-foreground max-w-md font-medium">
              Redeem your hard-earned points for exclusive content, bookings,
              and more. Keep active to earn more!
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 p-6 rounded-2xl bg-linear-to-br from-purple-600 to-purple-800 text-white shadow-xl shadow-purple-500/30 min-w-[200px] border border-white/20">
            <div className="flex items-center gap-2 mb-1">
              <Coins className="size-5 text-yellow-300 fill-yellow-300/20" />
              <span className="text-xs font-bold uppercase tracking-widest opacity-80">
                Available Points
              </span>
            </div>
            <span className="text-4xl font-black">
              {userPoints.toLocaleString()}
            </span>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="available" className="w-full">
        <div className="flex justify-center mb-10">
          <TabsList className="bg-white/50 dark:bg-zinc-900/50 p-1 rounded-2xl h-auto border border-border/40 backdrop-blur-sm self-center">
            <TabsTrigger
              value="available"
              className="rounded-xl px-8 py-3 data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg gap-2 transition-all font-bold"
            >
              <Gift className="size-4" />
              Shop Rewards
            </TabsTrigger>
            <TabsTrigger
              value="my-codes"
              className="rounded-xl px-8 py-3 data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg gap-2 transition-all font-bold"
            >
              <Ticket className="size-4" />
              My Coupons
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="rounded-xl px-8 py-3 data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg gap-2 transition-all font-bold"
            >
              <History className="size-4" />
              Points History
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Available Rewards */}
        <TabsContent value="available" className="mt-0 outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rewardsData?.results.map((reward) => (
              <Card
                key={reward.id}
                className="group relative rounded-3xl overflow-hidden border-none bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={reward.image}
                    alt={reward.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute top-4 left-4">
                    <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase text-white tracking-wider">
                      {reward.content.replace("_", " ")}
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div className="space-y-0.5">
                      <h3 className="text-xl font-black text-white">
                        {reward.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-yellow-400 font-black">
                        <Coins className="size-4 fill-yellow-400/20" />
                        <span>{reward.points.toLocaleString()} pts</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {reward.description}
                  </p>
                  <Button
                    onClick={() => handleRedeem(reward.id, reward.points)}
                    disabled={isRedeeming}
                    className={cn(
                      "w-full h-12 rounded-xl font-bold transition-all duration-300",
                      userPoints >= reward.points
                        ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/25"
                        : "bg-zinc-100 dark:bg-zinc-800 text-muted-foreground border border-dashed border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700",
                    )}
                  >
                    {isRedeeming ? (
                      <Loader2 className="animate-spin" />
                    ) : userPoints >= reward.points ? (
                      "Redeem Reward"
                    ) : (
                      `Need ${reward.points - userPoints} more pts`
                    )}
                  </Button>
                </div>
              </Card>
            ))}
            {rewardsData?.results.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <AlertCircle className="size-16 text-muted-foreground/20 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-muted-foreground">
                  No rewards available right now.
                </h3>
                <p className="text-sm text-gray-400">
                  Check back later for new surprises!
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Tab 2: My Codes */}
        <TabsContent value="my-codes" className="mt-0 outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myCodesData?.results.map((item, idx) => (
              <Card
                key={idx}
                className="flex items-center gap-6 p-4 rounded-3xl border border-border/40 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm group"
              >
                <div className="relative size-24 min-w-[96px] rounded-2xl overflow-hidden shadow-lg border border-white/20">
                  <Image
                    src={item.reward.image}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 space-y-3">
                  <div>
                    <h4 className="font-black text-gray-900 dark:text-white leading-tight">
                      {item.reward.name}
                    </h4>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                      Claimed on{" "}
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-10 px-4 flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-xl font-mono text-sm font-bold border-2 border-dashed border-zinc-200 dark:border-zinc-700">
                      {item.code}
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => copyToClipboard(item.code)}
                      className="size-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 hover:bg-purple-100 transition-colors"
                    >
                      <Copy className="size-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            {myCodesData?.results.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <Ticket className="size-16 text-muted-foreground/20 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-muted-foreground">
                  You haven&apos;t claimed any rewards yet.
                </h3>
                <p className="text-sm text-gray-400">
                  Head over to the Shop to trade your points!
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Tab 3: History */}
        <TabsContent value="history" className="mt-0 outline-none">
          <Card className="rounded-3xl border border-border/40 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm overflow-hidden">
            <div className="divide-y divide-border/20">
              {historyData?.results.map((log, idx) => (
                <div
                  key={idx}
                  className="p-6 flex items-center justify-between hover:bg-white/40 dark:hover:bg-zinc-800/40 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "size-12 rounded-2xl flex items-center justify-center",
                        log.points > 0
                          ? "bg-green-100 text-green-600 dark:bg-green-900/20"
                          : "bg-purple-100 text-purple-600 dark:bg-purple-900/20",
                      )}
                    >
                      {log.points > 0 ? (
                        <CheckCircle2 className="size-6" />
                      ) : (
                        <Gift className="size-6" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">
                        {log.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(log.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "text-lg font-black",
                      log.points > 0 ? "text-green-500" : "text-purple-500",
                    )}
                  >
                    {log.points > 0 ? "+" : ""}
                    {log.points.toLocaleString()}
                  </div>
                </div>
              ))}
              {historyData?.results.length === 0 && (
                <div className="p-20 text-center">
                  <History className="size-16 text-muted-foreground/20 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-muted-foreground">
                    No points history yet.
                  </h3>
                  <p className="text-sm text-gray-400">
                    Start watching content or booking talent to earn points!
                  </p>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
