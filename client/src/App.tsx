import { Canvas } from "@react-three/fiber";
import { ComponentType, useCallback, useState } from "react";
import { Color } from "three";
import "./App.css";
import { SceneComponentProps } from "./SceneComponentProps";
import { login } from "./scenes/login";

export function App() {
  const [Scene, setScene] = useState<ComponentType<SceneComponentProps>>(login);
  const setSceneEnhanced = useCallback(
    (scene: ComponentType<SceneComponentProps>) => setScene(() => scene),
    [setScene],
  );

  return (
    <Canvas scene={{ background: new Color("darkblue") }}>
      <Scene setScene={setSceneEnhanced} />
    </Canvas>
  );
}
