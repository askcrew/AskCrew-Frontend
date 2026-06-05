"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LogOut } from "lucide-react";

interface LogoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function LogoutDialog({
  open,
  onOpenChange,
  onConfirm,
}: LogoutDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md bg-background/95 backdrop-blur-md border border-white/10 shadow-2xl">
        {/* Decorative gradient background */}
        <div className="absolute inset-0 bg-linear-to-br from-red-500/5 via-transparent to-orange-500/5 rounded-lg pointer-events-none" />

        {/* Icon */}
        <div className="relative flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-linear-to-br from-red-500/10 to-orange-500/10 flex items-center justify-center border border-red-500/20">
            <LogOut className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <AlertDialogHeader className="relative text-center space-y-3">
          <AlertDialogTitle className="text-2xl font-bold">
            Sign Out?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base text-muted-foreground">
            Are you sure you want to sign out? You'll need to sign in again to
            access your account.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="relative flex-col sm:flex-col gap-2 mt-6">
          <AlertDialogAction
            onClick={onConfirm}
            className="w-full bg-linear-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all order-1"
          >
            Yes, Sign Out
          </AlertDialogAction>
          <AlertDialogCancel className="w-full mt-0 border-border hover:bg-muted py-6 rounded-xl font-medium transition-all order-2">
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
