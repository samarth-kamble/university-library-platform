// app/not-found.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <section className="py-10 bg-white font-serif">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-3xl text-center">
            <div
              className="bg-center bg-no-repeat bg-cover h-[400px]"
              style={{
                backgroundImage:
                  "url('https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif')",
              }}
            />

            <div className="-mt-10">
              <h1 className="text-8xl pb-3 text-center text-black">404</h1>
              <h2 className="text-3xl font-bold mb-4">Look like you're lost</h2>
              <p className="text-lg text-gray-600 mb-6">
                The page you are looking for is not available!
              </p>
              <Button
                onClick={() => router.back()}
                className="bg-primary text-dark-100 hover:bg-primary inline-flex min-h-14 w-[70%] items-center justify-center rounded-md  font-bold text-base"
              >
                <Home className="-mt-1 size-10" />
                Go to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
