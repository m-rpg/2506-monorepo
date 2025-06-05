import { OrbitControls } from "@react-three/drei";
import { Container, Fullscreen, Text } from "@react-three/uikit";
import { Defaults, DialogAnchor } from "@react-three/uikit-default";
import { ComponentType } from "react";
import { Box } from "../Box";
import { SceneComponentProps } from "../SceneComponentProps";
import { trpc } from "../trpc";

export function hello(): ComponentType<SceneComponentProps> {
  return ({ setScene }) => {
    const { data } = trpc.hello.useQuery();

    return (
      <>
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
                <Text fontSize={32}>{data?.message ?? "Loading..."}</Text>
              </Container>
            </DialogAnchor>
          </Fullscreen>
        </Defaults>
      </>
    );
  };
}
