import React from "react";
import * as THREE from "three";
interface ControlsProps {
    camera: THREE.PerspectiveCamera;
    canvas: HTMLCanvasElement;
    scene: THREE.Scene;
    createFiguresCube: (Y: number, X: number, Z: number) => void;
    objectsRef: React.RefObject<THREE.Mesh[]>;
    initialPositionsRef: React.RefObject<number[][]>;
}
declare const Controls: React.FC<ControlsProps>;
export default Controls;
