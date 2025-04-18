import * as React from "react";
import * as THREE from "three";
interface MeshGroupProps {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    canvas: HTMLCanvasElement;
}
declare const MeshGroup: React.FC<MeshGroupProps>;
export default MeshGroup;
