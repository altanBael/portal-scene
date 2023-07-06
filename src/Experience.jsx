import {
  Stage,
  shaderMaterial,
  Sparkles,
  useTexture,
  useGLTF,
  OrbitControls,
  OrthographicCamera,
  Center,
} from "@react-three/drei";
import { Leva, button, useControls } from "leva";
import { useFrame, extend } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import portalVertexShader from "./shaders/portal/vertex.jsx";
import portalFragmentShader from "./shaders/portal/fragment.jsx";
import { Perf } from "r3f-perf";

const lampMaterial = new THREE.MeshBasicMaterial({ color: "#ffffe5" });

const PortalMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorStart: new THREE.Color("#000000"),
    uColorEnd: new THREE.Color("#ffffff"),
  },
  portalVertexShader,
  portalFragmentShader
);

extend({ PortalMaterial });

export default function Experience() {
  let { color } = useControls("Background", {
    color: "#727E40",
  });
  const { fogcolor, fognear, fogfar } = useControls("Fog", {
    fogcolor: "#727E40",
    fognear: { value: 20, min: 0, max: 1000, step: 0.1 },
    fogfar: { value: 30, min: 0, max: 1000, step: 0.1 },
  });

  const portalMaterial = useRef();
  useFrame((state, delta) => {
    portalMaterial.current.uTime += delta;
  });

  const { nodes } = useGLTF("./personelFiles/portalScenev.glb");
  console.log(nodes);
  const bakedTexture = useTexture("./personelFiles/modelBaked.jpg");
  const floorBakedTexture = useTexture("./personelFiles/floorBaked.jpg");
  bakedTexture.flipY = false;

  return (
    <>
      {/* <Perf position="top-left" showGraph={false} /> */}

      <color args={[color]} attach="background" />
      <fog attach="fog" color={fogcolor} near={fognear} far={fogfar} />

      <Center>
        <mesh
          geometry={nodes.merged.geometry}
          position={nodes.merged.position}
          rotation={nodes.merged.rotation}
        >
          <meshBasicMaterial map={bakedTexture} />
        </mesh>
        <mesh
          geometry={nodes.floor.geometry}
          position={nodes.floor.position}
          rotation={nodes.floor.rotation}
        >
          <meshBasicMaterial map={floorBakedTexture} />
        </mesh>

        {/* Pole Light */}
        <mesh position={nodes.lampL.position} geometry={nodes.lampL.geometry}>
          <meshBasicMaterial />
        </mesh>
        <mesh position={nodes.lampR.position} geometry={nodes.lampR.geometry}>
          <meshBasicMaterial />
        </mesh>

        {/* Portal Doorway */}
        <mesh
          geometry={nodes.portalDoorway.geometry}
          position={nodes.portalDoorway.position}
          rotation={nodes.portalDoorway.rotation}
        >
          <portalMaterial ref={portalMaterial} />
        </mesh>

        {/* Sparkles */}
        <Sparkles
          size={3}
          scale={[4, 2, 4]}
          position-y={1.5}
          speed={0.2}
          count={40}
        />

        <OrthographicCamera
          makeDefault
          position={[2, 3.5, 2]}
          zoom={50}
          near={-50}
          far={500}
        />

        <OrbitControls
          makeDefault
          enablePan={false}
          enableRotate={true}
          enableZoom={true}
          minZoom={20}
          maxZoom={250}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.7}
        />
      </Center>
    </>
  );
}
