"use client";

import { IKImage, ImageKitProvider, IKUpload, IKVideo } from "imagekitio-next";
import config from "@/lib/config";
import ImageKit from "imagekit";
import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  IKUploadResponse,
  UploadError,
} from "imagekitio-next/dist/types/components/IKUpload/props";

const {
  env: {
    imagekit: { publicKey, urlEndpoint },
  },
} = config;

const authenticator = async () => {
  try {
    const response = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Authentication request failed: ${error.message}`);
    }

    throw new Error("Unknown error during authentication.");
  }
};

interface Props {
  type: "image" | "video";
  accept: string;
  placeholder: string;
  folder: string;
  variant: "dark" | "light";
  value?: string;
  onFileChange: (filePath: string) => void;
}

const FileUpload = ({
  type,
  accept,
  placeholder,
  folder,
  variant,
  value,
  onFileChange,
}: Props) => {
  const ikUploadRef = useRef(null);
  const [file, setFile] = useState<{ filePath: string | null }>({
    filePath: value ?? null,
  });
  const [progress, setProgress] = useState<number>(0); // Track upload progress

  const styles = {
    button:
      variant === "dark"
        ? "bg-dark-300"
        : "bg-light-600 border-gray-100 border",
    placeholder: variant === "dark" ? "text-light-100" : "text-slate-500",
    text: variant === "dark" ? "text-light-100" : "text-dark-400",
  };

  const onError = (err: UploadError) => {
    console.log("Error", err);

    toast({
      title: `${type} Upload Failed`,
      description: `Your ${type} could not be uploaded. Please try again.`,
      variant: "destructive",
    });
    setProgress(0);
  };

  const onSuccess = (res: IKUploadResponse) => {
    setFile(res);
    onFileChange(res.filePath);

    toast({
      title: `${type} uploaded successfully`,
      description: `Your ${type} has been uploaded successfully.`,
    });
    setProgress(0);
  };

  const onValidate = (file: File) => {
    if (type === "image") {
      if (file.size > 20 * 1024 * 1024) {
        toast({
          title: "Max Image Size Exceeded",
          description: "Your Image is too large. Maximum size is 20MB.",
          variant: "destructive",
        });
        return false;
      }
    } else if (type === "video") {
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "Max Video Size Exceeded",
          description: "Your Video is too large. Maximum size is 50MB.",
          variant: "destructive",
        });

        return false;
      }
    }

    return true;
  };
  return (
    <ImageKitProvider
      publicKey={config.env.imagekit.publicKey}
      urlEndpoint={config.env.imagekit.urlEndpoint}
      authenticator={authenticator}
    >
      <IKUpload
        ref={ikUploadRef}
        fileName={type === "image" ? "image" : "video"}
        useUniqueFileName={true}
        validateFile={onValidate}
        onUploadStart={() => setProgress(0)}
        onUploadProgress={({ loaded, total }) => {
          const percent = Math.round((loaded / total) * 100);
          setProgress(percent);
        }}
        folder={folder}
        accept={accept}
        onError={onError}
        onSuccess={onSuccess}
        className="hidden"
      />

      <button
        onClick={(e) => {
          e.preventDefault();

          if (ikUploadRef.current) {
            (ikUploadRef?.current as HTMLElement)?.click();
          }
        }}
        className={cn("upload-btn", styles.button)}
      >
        <Image
          src="/icons/upload.svg"
          alt="upload-icon"
          width={20}
          height={20}
          className="object-contain"
        />

        <p className={cn("text-base", styles.placeholder)}>{placeholder}</p>

        {file && (
          <p className={cn("upload-filename", styles.text)}>{file.filePath}</p>
        )}
      </button>

      {progress > 0 && (
        <div className="w-full rounded-full bg-green-200">
          <div className="progress" style={{ width: `${progress}%` }}>
            {progress}%
          </div>
        </div>
      )}

      {file?.filePath &&
        (type === "image" ? (
          <IKImage
            path={file?.filePath!}
            alt="default-image"
            width={500}
            height={500}
          />
        ) : type === "video" ? (
          <IKVideo
            path={file.filePath!}
            controls={true}
            className="h-96 w-full rounded-xl"
          />
        ) : null)}
    </ImageKitProvider>
  );
};

export default FileUpload;
