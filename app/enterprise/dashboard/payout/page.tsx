"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentUserProfile } from "@/lib/actions/auth";
import {
  IconWallet,
  IconArrowUpRight,
  IconHistory,
  IconCreditCard,
  IconBuildingBank,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function PayoutPage() {
  const { data: userProfileResponse, isLoading } = useQuery({
    queryKey: ["current-user-profile"],
    queryFn: getCurrentUserProfile,
  });

  const user = userProfileResponse?.success ? userProfileResponse.data : null;

  if (isLoading) {
    return (
      <div className="p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
        <div className="space-y-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white lg:text-4xl">
          Payouts & Cash Out
        </h1>
        <p className="text-muted-foreground">
          Manage your earnings, request withdrawals, and view transaction
          history.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Balance Card */}
        <Card className="relative overflow-hidden border-0 bg-linear-to-br from-orange-500 to-amber-400 text-white shadow-xl lg:col-span-1">
          <div className="absolute top-0 right-0 p-3 opacity-20">
            <IconWallet size={80} />
          </div>
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-wider opacity-90">
              Total Balance
            </CardTitle>
            <CardDescription className="text-3xl lg:text-4xl font-black text-white">
              {user?.wallet || "0.00"}{" "}
              <span className="text-xl font-medium opacity-80">EGP</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-white text-orange-600 hover:bg-orange-50 font-bold rounded-xl mt-2 transition-all hover:scale-[1.02]">
              Request Cash Out
              <IconArrowUpRight className="ml-2 size-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Pending Payouts */}
        <Card className="border-0 bg-white dark:bg-zinc-900 shadow-lg lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Pending Payouts
            </CardTitle>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <IconHistory size={20} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black tracking-tight">0.00 EGP</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently processing by finance team
            </p>
          </CardContent>
        </Card>

        {/* Bank Account */}
        <Card className="border-0 bg-white dark:bg-zinc-900 shadow-lg lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Payout Method
            </CardTitle>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <IconBuildingBank size={20} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">Bank Transfer</div>
            <p className="text-xs text-muted-foreground mt-1">
              •••• •••• •••• 4242
            </p>
            <Button
              variant="link"
              className="p-0 h-auto text-xs text-blue-500 font-bold mt-2"
            >
              Edit Method
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card className="border-0 bg-white dark:bg-zinc-900 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
              <IconHistory size={20} />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">
                Transaction History
              </CardTitle>
              <CardDescription>
                Recent payout requests and wallet activity.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-zinc-100 dark:border-zinc-800">
                <TableHead className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
                  ID
                </TableHead>
                <TableHead className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
                  Date
                </TableHead>
                <TableHead className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
                  Type
                </TableHead>
                <TableHead className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="text-right font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
                  Amount
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-zinc-100 dark:border-zinc-800">
                <TableCell className="font-medium">#TX-12345</TableCell>
                <TableCell className="text-muted-foreground">
                  Oct 12, 2023
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="bg-emerald-500/5 text-emerald-500 border-emerald-500/20"
                    >
                      Earnings
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-none"
                  >
                    Completed
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-bold text-emerald-600">
                  + 1,200 EGP
                </TableCell>
              </TableRow>
              <TableRow className="hover:bg-transparent text-center">
                <TableCell colSpan={5} className="py-12">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <IconHistory size={40} className="opacity-20" />
                    <p className="text-sm font-medium">No more records found</p>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
