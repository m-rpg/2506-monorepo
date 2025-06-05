import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Container, Fullscreen, Text } from "@react-three/uikit";
import {
  Button,
  Defaults,
  DialogAnchor,
  Input,
  Separator,
} from "@react-three/uikit-default";
import { Box } from "./Box";

import { useState } from "react";
import { Color } from "three";
import "./App.css";
import { trpc } from "./trpc";
import { useAtomicState } from "./util/useAtomicState";
import { useUnmountedRef } from "./util/useUnmountedRef";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loadingRef, setLoading] = useAtomicState(false);
  const unmountedRef = useUnmountedRef();

  const handleLogin = async () => {
    if (loadingRef.current) return;
    setLoading(true);
    try {
      const result = await trpc.login.mutate({
        username,
        password,
      });
      alert(result.success ? "Login successful" : "Login failed");
    } finally {
      if (!unmountedRef.current) {
        setLoading(false);
      }
    }
  };

  const handleRegister = async () => {
    if (loadingRef.current) return;
    setLoading(true);
    try {
      const result = await trpc.register.mutate({
        username,
        password,
      });
      alert(result.success ? "Register successful" : "Register failed");
    } finally {
      if (!unmountedRef.current) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="app">
      <Canvas scene={{ background: new Color("darkblue") }}>
        <OrbitControls />
        <ambientLight />
        <pointLight position={[10, 10, 10]} intensity={100} />
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />
        <Defaults>
          <Fullscreen
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap={32}
            padding={32}
          >
            <DialogAnchor>
              <Container
                width={300}
                flexDirection="column"
                alignItems="center"
                gap={16}
              >
                <Text fontSize={32}>Login</Text>
                <Input
                  placeholder="Username"
                  type="text"
                  value={username}
                  onValueChange={setUsername}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onValueChange={setPassword}
                />
                <Button onClick={handleLogin}>
                  <Text>Login</Text>
                </Button>
                <Button onClick={handleRegister}>
                  <Text>Register</Text>
                </Button>
                <Separator />
                <Text fontSize={12}>© 2025 MyGame Inc.</Text>
              </Container>
            </DialogAnchor>
          </Fullscreen>
        </Defaults>
      </Canvas>
    </div>
  );
};

export default App;
