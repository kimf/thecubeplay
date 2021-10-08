import './ColorMaterial';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

export interface BoxSide {
  id: string;
  rgb: string;
  hex: string;
}

const Box = ({ sides }: { sides: BoxSide[] }) => {
  const mesh: React.RefObject<{ rotation: { x: number; y: number } } | undefined> = useRef();

  useFrame((state) => {
    // @ts-ignore
    mesh.current.rotation.x = mesh.current.rotation.y = mesh.current.rotation.z += 0.005;
  });

  return (
    <group>
      <mesh ref={mesh} scale={2}>
        <boxBufferGeometry attach="geometry" args={[2, 2, 2]} />
        {sides.map((side, index) => {
          if (!side) {
            return null;
          }
          // @ts-ignore
          return <colorMaterial attachArray="material" key={side.id} color={side.rgb} />;
        })}
      </mesh>
    </group>
  );
};

export default Box;
