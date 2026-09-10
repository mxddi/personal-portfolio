"use client";

import Image from "next/image";

export function ProtectedProfileImage({ src }: { src: string }) {
  return (
    <Image
      src={src}
      alt="Portrait of Madaly G"
      width={900}
      height={1200}
      quality={100}
      unoptimized
      priority
      draggable={false}
      onContextMenu={(event) => event.preventDefault()}
      onDragStart={(event) => event.preventDefault()}
      className="h-auto w-full select-none"
    />
  );
}
