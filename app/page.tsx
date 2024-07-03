"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [checked, setChecked] = useState(false);
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-24 bg-black text-white">
      <div className="flex flex-col items-center justify-center gap-8 max-w-xl w-full border-2 border-white rounded-3xl px-8 pb-10 pt-6">
        <h1 className="text-3xl font-bold">Stake ETH</h1>
        <div className="flex flex-row justify-center items-center gap-2">
          <Switch onCheckedChange={(e) => setChecked(e)} checked={checked} />
          <div>{checked ? "Ethereum" : "Taiko"}</div>
        </div>
        <div className="flex flex-col justify-start items-start gap-4 w-full">
          <div className="flex flex-col justify-start items-start gap-2  w-full">
            <Input
              type="number"
              className="w-full text-black py-5"
              placeholder="Enter the amount"
            />
          </div>
          <Button
            className="text-black w-full text-xl py-6 font-medium"
            variant="outline"
          >
            Stake
          </Button>
        </div>
      </div>
    </main>
  );
}
