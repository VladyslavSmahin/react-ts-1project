import * as React from 'react';
import * as THREE from 'three';

interface LightProps {
    scene: THREE.Scene;
}

const Light: React.FC<LightProps> = ({ scene }) => {
    const pointLight = React.useMemo(() => {
        const light = new THREE.PointLight(0xffffff, 100);
        light.position.set(5, 5, 5);
        return light;
    }, []);

    React.useEffect(() => {
        scene.add(pointLight);
        return () => {
            scene.remove(pointLight);
        };
    }, [scene, pointLight]);

    return null;
};

export default Light;
