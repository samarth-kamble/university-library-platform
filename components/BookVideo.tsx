"use client";

import { IKVideo, ImageKitProvider } from "imagekitio-next";

import config from "@/lib/config";
import { cn } from "@/lib/utils";

interface Props {
  videoUrl: string;
  className?: string;
}

const BookVideo = ({ videoUrl, className }: Props) => {
  return (
    <ImageKitProvider
      publicKey={config.env.imagekit.publicKey}
      urlEndpoint={config.env.imagekit.urlEndpoint}
    >
      <IKVideo
        path={videoUrl}
        title="Book Trailer"
        lang="en"
        controls={true}
        className={cn("w-full rounded-xl", className)}
        preload="auto"
      />
    </ImageKitProvider>
  );
};

export default BookVideo;
