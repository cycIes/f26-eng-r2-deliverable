"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Database } from "@/lib/schema";
import { useState } from "react";
type Species = Database["public"]["Tables"]["species"]["Row"];

export default function SpeciesDetailsDialog({ species }: { species: Species }) {
  // Control open/closed state of the dialog
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="ml-1 mr-1 mt-3 flex-auto" variant="default">
          Learn More
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="mt-3 text-2xl font-semibold">{species.scientific_name}</DialogTitle>
          <DialogDescription className="text-white">
            <h4 className="text-lg font-light italic">{species.common_name}</h4>
            <h5 className="text-lg font-light">Total population: {species.total_population}</h5>
            <h5 className="text-lg font-light">Kingdom: {species.kingdom}</h5>
            <p className="text-base">{species.description}</p>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
