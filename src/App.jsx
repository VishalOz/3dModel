import React, { useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three-stdlib";
import { OrbitControls } from "three-stdlib";

const App = () => {
  useEffect(() => {
    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1, 5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff); // ✅ white background
    document.body.appendChild(renderer.domElement);

    // Lights
    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(10, 10, 10);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040, 2));

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Load GLB Model
    const loader = new GLTFLoader();
    loader.load("/hygieia.glb", (gltf) => {
      const model = gltf.scene;
      scene.add(model);

      // ✅ Center & fit camera to model
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      model.position.sub(center); // center model at origin

      const fitDistance =
        Math.max(size.x, size.y, size.z) * 1.5 / Math.tan((camera.fov * Math.PI) / 360);

      camera.position.set(0, size.y * 0.5, fitDistance);
      camera.lookAt(0, 0, 0);

      // ✅ Smooth zoom-in effect
      let progress = 0;
      function zoomIn() {
        if (progress < 1) {
          progress += 0.05;
          camera.position.lerp(new THREE.Vector3(0, size.y * 0.5, size.z * 1.2), progress * 0.05);
          requestAnimationFrame(zoomIn);
        }
      }
      zoomIn();
    });

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    // Resize handler
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
  }, []);

  return (
    <div className={`flex justify-center items-center overflow-hidden`}>
      <h1>UNIVERSAL STUDIOS</h1>
    </div>
  );
};

export default App;
