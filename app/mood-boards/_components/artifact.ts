import type { ReactNode } from "react";

export type Photo = {
  kind: "photo";
  src: string;
  width: number;
  height: number;
  alt: string;
  photographer: string;
  photoUrl: string;
  className?: string;
};

export type Generated = {
  kind: "color" | "type" | "texture" | "interface";
  id: string;
  node: ReactNode;
};

export type Artifact = Photo | Generated;
