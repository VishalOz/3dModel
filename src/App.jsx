import React from 'react'
import { useEffect } from 'react'
import * as THREE from "three"
import { GLTFLoader } from 'three-stdlib'
import { OrbitControls } from 'three-stdlib'


const App = () => {
  useEffect( () => {
    //Scene
    const scene  = new THREE.Scene();

    //Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1, 3);

    //Renderer
    const renderer = new THREE.WebGLRenderer({ antialias:true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    //Light
    const light = new THREE.DirectionalLight(0xffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040, 2));

    // Controls (mouse move)
    const controls = new OrbitControls(camera, renderer.domElement);

    //Load GLB Model
    const loader = new GLTFLoader();
    loader.load("/public/hygieia.glb", (gltf) => {
      scene.add(gltf.scene)
    });

     // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      controls.update(); // so mouse movement works
      renderer.render(scene, camera);
    }
    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.removeChild(renderer.domElement);
    };

  }, [])
  return null;
}

export default App