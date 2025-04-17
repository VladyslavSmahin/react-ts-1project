import {useEffect, useRef, useState} from 'react';
import * as THREE from 'three';
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js';
import * as React from "react";
import Light from "../lights";
import MeshGroup from "../meshGroup";

const Scene: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scene, setScene] = useState<THREE.Scene | null>(null); // Состояние для сцены
    const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);


    useEffect(() => {
        const container = containerRef.current;

        if (!container) return;

        const newScene = new THREE.Scene();
        setScene(newScene);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 5);
        setCamera(camera);

        const renderer = new THREE.WebGLRenderer();
        container.innerHTML = '';
        container.appendChild(renderer.domElement);
        setCanvas(renderer.domElement);

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const loadingManager = new THREE.LoadingManager();
        loadingManager.onStart = () => console.log('onStart');
        loadingManager.onLoad = () => console.log('onLoad');
        loadingManager.onProgress = (url, itemsLoaded, itemsTotal) =>
            console.log(`onProgress: ${url}, ${itemsLoaded}/${itemsTotal}`);
        loadingManager.onError = (url) => console.log(`onError: ${url}`);

        const rgbeLoader = new RGBELoader();
        rgbeLoader.load('/textures/environmentMap/2k.hdr', (texture: THREE.DataTexture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            newScene.environment = texture;
            newScene.background = texture;
        });

        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(newScene, camera);
        };
        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        };
        window.addEventListener('resize', handleResize);

        return () => {
            renderer.dispose();
            container.removeChild(renderer.domElement);
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    return (
        <div ref={containerRef} style={{width: '100%', height: '100vh'}}>
            {scene && <Light scene={scene}/>}
            {scene && camera && canvas && <MeshGroup scene={scene} camera={camera} canvas={canvas}/>}
        </div>
    );
};

export default Scene;
