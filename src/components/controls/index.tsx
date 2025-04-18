import React, {useRef, useEffect} from "react";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import * as THREE from "three";
import {gsap} from "gsap";

interface ControlsProps {
    camera: THREE.PerspectiveCamera,
    canvas: HTMLCanvasElement,
    scene: THREE.Scene,
    createFiguresCube: (Y: number, X: number, Z: number) => void,
    objectsRef: React.RefObject<THREE.Mesh[]>, // <-- изменено
    initialPositionsRef: React.RefObject<number[][]>,
}
interface CameraTarget {
    x: number;
    y: number;
    z: number;
}

const Controls: React.FC<ControlsProps> = ({
                                               camera,
                                               canvas,
                                               scene,
                                               createFiguresCube,
                                               objectsRef,
                                               initialPositionsRef
                                           }) => {

    const formRef = useRef<HTMLFormElement>(null);
    const inputYRef = useRef<HTMLInputElement>(null);
    const inputXRef = useRef<HTMLInputElement>(null);
    const inputZRef = useRef<HTMLInputElement>(null);
    const explodeBtnRef = useRef<HTMLButtonElement>(null);
    const collectBtnRef = useRef<HTMLButtonElement>(null);
    const cameraTargetRef = useRef<CameraTarget>({ x: 0, y: 0, z: 0 });


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const Y = Number(inputYRef.current?.value || 0);
        const X = Number(inputXRef.current?.value || 0);
        const Z = Number(inputZRef.current?.value || 0);

        if (Y <= 0 || X <= 0 || Z <= 0) {
            console.warn('Please enter positive numbers for Y, X, Z');
            return;
        }

        createFiguresCube(Y, X, Z);

        gsap.to(camera.position, {
            x: 0,
            y: 0,
            z: 10 + Math.max(X, Y, Z),
            duration: 1.5,
            ease: 'power2.out'
        })


        if (inputYRef.current) inputYRef.current.value = '';
        if (inputXRef.current) inputXRef.current.value = '';
        if (inputZRef.current) inputZRef.current.value = '';
        console.log('Form submitted', objectsRef);
    };

    useEffect(() => {

        cameraTargetRef.current = {
            x: camera.position.x,
            y: camera.position.y,
            z: camera.position.z,
        };



        const handleExplode = () => {
            console.log('handleExplode', objectsRef);

            objectsRef.current?.forEach(obj => {
                console.log('obj');
                const range = 10 + Math.random() * 20;
                const targetX = (Math.random() * range) - range / 2;
                const targetY = (Math.random() * range) - range / 2;
                const targetZ = (Math.random() * range) - range / 2;


                gsap.to(obj.position, {
                    delay: 1.6,
                    duration: 3,
                    x: targetX,
                    y: targetY,
                    z: targetZ,
                    ease: 'power2.out'
                });

                gsap.to(obj.rotation, {
                    delay: 2,
                    duration: 4,
                    x: obj.rotation.x + Math.PI * 2,
                    y: obj.rotation.y + Math.PI,
                    ease: 'power2.out'
                });
            })
            const cameraX = cameraTargetRef.current.x;
            const cameraY = cameraTargetRef.current.y;
            const cameraZ = 30;

            gsap.to(camera.position, {
                duration: 3,
                x: cameraX,
                y: cameraY,
                z: cameraZ,
                ease: 'power2.out'
            });
        }

        const handleCollect = () => {
            objectsRef.current?.forEach((obj, index) => {
                const [targetX, targetY, targetZ] = initialPositionsRef.current[index] || [0, 0, 0];

                gsap.to(obj.position, {
                    duration: 2,
                    x: targetX,
                    y: targetY,
                    z: targetZ,
                    ease: 'power2.out'
                });
            });
            const cameraX = 0;
            const cameraY = 0;
            const cameraZ = 5;
            gsap.to(camera.position, {
                delay: 4,
                duration: 1,
                x: cameraX,
                y: cameraY,
                z: cameraZ,
                ease: 'power2.out'
            });
        }



        const handleKeydown = (event: KeyboardEvent) => {
            if (['w', 'a', 's', 'd', 'ц', 'ф', 'ы', 'в'].includes(event.key.toLowerCase())) {
                objectsRef.current?.forEach((obj) => {
                    let targetX = 0;
                    let targetY = 0;
                    let targetZ = (Math.random() * 40) - 20;

                    switch (event.key.toLowerCase()) {
                        case 'w':
                        case 'ц':
                            targetX = (Math.random() * 40) - 20;
                            targetY = 10;
                            break;
                        case 'a':
                        case 'ф':
                            targetX = -10;
                            targetY = (Math.random() * 40) - 20;
                            break;
                        case 's':
                        case 'ы':
                            targetX = (Math.random() * 40) - 20;
                            targetY = -10;
                            break;
                        case 'd':
                        case 'в':
                            targetX = 10;
                            targetY = (Math.random() * 40) - 20;
                            break;
                    }

                    gsap.to(obj.position, {
                        duration: Math.random() * 3,
                        x: targetX,
                        y: targetY,
                        z: targetZ,
                        ease: 'power2.out',
                    });
                });

                gsap.to(camera.position, {
                    duration: 1,
                    x: 0,
                    y: 0,
                    z: 30,
                    ease: 'power2.out',
                });
            }
        };


        const controls = new OrbitControls(camera, canvas);
        controls.enableDamping = true;



        controls.addEventListener("change", () => {
            cameraTargetRef.current.x = camera.position.x;
            cameraTargetRef.current.y = camera.position.y;
            cameraTargetRef.current.z = camera.position.z;
        });

        const animate = () => {
            controls.update();
            requestAnimationFrame(animate);
        };
        animate();

        explodeBtnRef.current?.addEventListener("click", handleExplode);
        collectBtnRef.current?.addEventListener("click", handleCollect);
        window.addEventListener("keydown", handleKeydown);

        return () => {
            explodeBtnRef.current?.removeEventListener('click', handleExplode);
            collectBtnRef.current?.removeEventListener('click', handleCollect);
            window.removeEventListener('keydown', handleKeydown);
            controls.dispose();
        };
    }, [camera, canvas, objectsRef, scene, createFiguresCube]);

    return (
        <div>
            <div className="keyboard">
                <p>Press any key</p>
                <div className="row">
                    <div className="key empty"></div>
                    <div id="keyW" className="key">W</div>
                    <div className="key empty"></div>
                </div>
                <div className="row">
                    <div id="keyA" className="key">A</div>
                    <div id="keyS" className="key">S</div>
                    <div id="keyD" className="key">D</div>
                </div>
            </div>
            <form id="myForm" ref={formRef} onSubmit={handleSubmit}>
                <label htmlFor="input_Y">Y</label>
                <input type="number" id="input_Y" name="y" placeholder="Y" ref={inputYRef}/>
                <label htmlFor="input_X">X</label>
                <input type="number" id="input_X" name="x" placeholder="X" ref={inputXRef}/>
                <label htmlFor="input_Z">Z</label>
                <input type="number" id="input_Z" name="z" placeholder="Z" ref={inputZRef}/>
                <button id="generateBtn" type="submit">Generate</button>
                <button id="explodeBtn" type="button" ref={explodeBtnRef}>Explode</button>
                <button id="collectBtn" type="button" ref={collectBtnRef}>Collect</button>
            </form>
        </div>
    );
};

export default Controls;
