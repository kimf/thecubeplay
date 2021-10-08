/// <reference types="react-scripts" />
declare global {
  namespace JSX {
    interface IntrinsicElements {
      customMaterial: ReactThreeFiber.Object3DNode<CustomMaterial, typeof CustomMaterial>;
    }
  }
}
