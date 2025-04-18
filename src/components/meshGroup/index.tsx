import * as React from "react";
import Controls from "../controls";
import * as THREE from "three";
import {useEffect, useRef} from "react";

interface MeshGroupProps {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    canvas: HTMLCanvasElement;
}



const MeshGroup: React.FC<MeshGroupProps> = ( { scene, camera,  canvas }) => {
    const objectsRef = useRef<THREE.Mesh[]>([]);
    const initialPositionsRef = useRef<number[][]>([]);
    const texturesRef = useRef<THREE.Texture[]>([]);
    const geometriesRef = useRef<THREE.BufferGeometry[]>([]);
    const materialsRef = useRef<THREE.MeshPhysicalMaterial[]>([]);

    useEffect(() => {
    const loadingManager = new THREE.LoadingManager();
    loadingManager.onStart = () => console.log('onStart');
    loadingManager.onLoad = () => console.log('onLoad');
    loadingManager.onProgress = () => console.log('onProgress');
    loadingManager.onError = (e) => console.error('onError', e);


    const textureLoader = new THREE.TextureLoader(loadingManager)

    const textures = [
        textureLoader.load('/textures/fire/color.jpg', undefined, undefined, (error) =>
            console.error('Error loading fire texture:', error)
        ),
        textureLoader.load('/textures/water/color.jpg', undefined, undefined, (error) =>
            console.error('Error loading water texture:', error)
        ),
        textureLoader.load('/textures/earth/color.jpg', undefined, undefined, (error) =>
            console.error('Error loading earth texture:', error)
        ),
    ];

    textures.forEach(texture => {
        texture.colorSpace = THREE.SRGBColorSpace;
    })

    const geometries =
        [
            new THREE.SphereGeometry(0.5, 16, 16),
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.CylinderGeometry(0.5, 0.5, 1, 8)
        ]


    const materials = textures.map(texture => {
        const material = new THREE.MeshPhysicalMaterial();
        material.roughness = 1;
        material.metalness = 0.5;
        material.clearcoat = 1;
        material.clearcoatRoughness = 0;
        material.map = texture;
        return material
    });

    texturesRef.current = textures;
    geometriesRef.current = geometries;
    materialsRef.current = materials;
    return () => {


       texturesRef.current.forEach((texture) => texture.dispose());
        geometriesRef.current.forEach((geometry) => geometry.dispose());
        materialsRef.current.forEach((material) => material.dispose());

    };
},[]);

    const createFiguresCube = (Y: number, X: number, Z: number): void => {

        objectsRef.current.forEach((obj) => {
            scene.remove(obj);
            obj.geometry.dispose();
            if (Array.isArray(obj.material)) {
                obj.material.forEach((mat) => mat.dispose());
            } else {
                obj.material.dispose();
            }
        });
        objectsRef.current = [];
        initialPositionsRef.current = [];

        const xOffset = -0.5 * (X - 1);
        const yOffset = -0.5 * (Y - 1);
        const zOffset = -0.5 * (Z - 1);

        for (let y = 0; y < Y; y++) {
            for (let x = 0; x < X; x++) {
                for (let z = 0; z < Z; z++) {

                    const material = materialsRef.current[Math.floor(Math.random() * materialsRef.current.length)];
                    const geometry = geometriesRef.current[Math.floor(Math.random() * geometriesRef.current.length)];

                    const mesh = new THREE.Mesh(geometry, material);

                    const posX = x + xOffset;
                    const posY = y + yOffset;
                    const posZ = z + zOffset;

                    mesh.position.set(posX, posY, posZ);

                    objectsRef.current.push(mesh);
                    initialPositionsRef.current.push([posX, posY, posZ]);
                    scene.add(mesh)

                }
            }
        }


    }

    return (
        <div>
            <Controls camera={camera} canvas={canvas} objectsRef={objectsRef} scene={scene}
                      createFiguresCube={createFiguresCube} initialPositionsRef={initialPositionsRef}/>
        </div>
    )
}

export default MeshGroup