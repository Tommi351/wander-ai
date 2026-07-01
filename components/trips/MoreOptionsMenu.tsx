"use client";

import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";

import { deleteTrip } from "@/lib/actions/trip.action";
import { useState } from "react";

export function MoreOptionsMenu({ tripId }: { tripId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteTrip(tripId);
      router.refresh();
    } catch (e) {
      console.error("Failed to delete trip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>

        <DropdownMenuItem onClick={() => router.push(`/trips/${tripId}`)}>
          Open Trip
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* ⚠️ DELETE FLOW WITH CONFIRMATION */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              className="text-red-600"
              onSelect={(e) => e.preventDefault()} // IMPORTANT: stops dropdown from closing weirdly
            >
              Delete Trip
            </DropdownMenuItem>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this trip?</AlertDialogTitle>

              <AlertDialogDescription>
                This action cannot be undone. The trip and all its versions will
                be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="flex justify-end gap-2">
              <AlertDialogCancel>Cancel</AlertDialogCancel>

              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={handleDelete}
              >
                Delete
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
