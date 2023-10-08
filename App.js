import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Suspense, useLayoutEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { TextureLoader } from "expo-three";
import { useAnimatedSensor, SensorType } from "react-native-reanimated";

function Box(props) {
  const [active, setActive] = useState(false);
  const mesh = useRef();

  useFrame((state, delta) => {
    // console.log(props.animatedSensor.sensor.value);
    let { x, y, z } = props.animatedSensor.sensor.value;
    x = ~~(x * 100) / 5000;
    y = ~~(y * 100) / 5000;
    mesh.current.rotation.x += x;
    mesh.current.rotation.y += y;
  });

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.7 : 1}
      onClick={() => setActive(!active)}
    >
      <boxGeometry />
      <meshStandardMaterial color={active ? "green" : "grey"} />
    </mesh>
  );
}

function Shoe(props) {
  const [base, normal, rough] = useLoader(TextureLoader, [
    require("./assets/Airmax/textures/BaseColor.jpg"),
    require("./assets/Airmax/textures/Normal.jpg"),
    require("./assets/Airmax/textures/Roughness.png"),
  ]);

  const material = useLoader(MTLLoader, require("./assets/Airmax/shoe.mtl"));

  const obj = useLoader(
    OBJLoader,
    require("./assets/Airmax/shoe.obj"),
    (loader) => {
      material.preload();
      loader.setMaterials(material);
    }
  );

  useLayoutEffect(() => {
    obj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.map = base;
      }
    });
  }, [obj]);

  return (
    <mesh rotation={[1, 1, -0.5]}>
      <primitive object={obj} scale={15} />
    </mesh>
  );
}

export default function App() {
  const animatedSensor = useAnimatedSensor(SensorType.GYROSCOPE, {
    interval: 100,
  });

  console.log(animatedSensor.sensor.value);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "grey",
      }}
    >
      <Canvas>
        <ambientLight />
        <pointLight position={[-1, 1, 1]} />

        <Suspense fallback={null}>
          {/* <Shoe /> */}
          <Box animatedSensor={animatedSensor} />
        </Suspense>

        {/* <Box position={[0, 2, 0]} /> */}
      </Canvas>
    </View>
  );
}
