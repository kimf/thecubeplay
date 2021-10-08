import * as React from 'react';
import gql from 'graphql-tag';
import { OrthographicCamera, OrbitControls } from '@react-three/drei';
import { useQuery, useSubscription } from '@apollo/client';
import { Canvas } from '@react-three/fiber';
import Box from './Box';
import Controls from './Controls';

const THE_CUBE_QUERY = gql`
  query Cube {
    cube {
      id
      sides {
        id
        red
        green
        blue
      }
    }
  }
`;

const SUBSCRIPTION = gql`
  subscription CubeChange {
    cubeChange {
      id
      sides {
        id
        red
        green
        blue
      }
    }
  }
`;

export interface Side {
  id: string;
  blue: number;
  green: number;
  red: number;
}

export interface ICube {
  id: string;
  sides: Side[];
}

const sideStyle = (side: Side | undefined): string => {
  if (!side) return 'rgb(0,0,0)';
  return `rgb(${side.red},${side.green},${side.blue})`;
};
const inputStyle = (side: Side | undefined): string => {
  if (!side) return 'rgb(0,0,0)';
  return '#' + ((1 << 24) + (side.red << 16) + (side.green << 8) + side.blue).toString(16).slice(1);
};

const Cube = () => {
  const controls = React.useRef();
  const query = useQuery<{ cube: ICube }>(THE_CUBE_QUERY);
  const subscription = useSubscription<{ cubeChange: ICube }>(SUBSCRIPTION);

  if (query.loading) return <p>Loading...</p>;
  if (query.error) return <p>Error :(</p>;
  const cube = subscription.data?.cubeChange || query.data?.cube;
  if (!cube) {
    return null;
  }

  const sides = cube.sides.map((side) => {
    return {
      id: side.id,
      rgb: sideStyle(side),
      hex: inputStyle(side),
    };
  });

  return (
    <div className="wrapper">
      <Controls sides={sides} />
      <Canvas>
        <OrthographicCamera ref={controls} makeDefault position={[-10, 10, 10]} zoom={100} />
        <OrbitControls camera={controls.current} />
        <ambientLight intensity={0.25} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        {cube && <Box sides={sides} />}
      </Canvas>
    </div>
  );
};

export default Cube;
