import { ComponentType } from "react";

export interface SceneComponentProps {
  setScene: (scene: ComponentType<SceneComponentProps>) => void;
}
