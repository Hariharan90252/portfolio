// three-model.js

// 1. Import dependencies from CDN using ES modules
import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/GLTFLoader.js';


document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('blender-canvas');
    if (!canvas) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    const parentContainer = canvas.parentElement;
    
    // 2. Camera
    const camera = new THREE.PerspectiveCamera(50, parentContainer.clientWidth / parentContainer.clientHeight, 0.1, 1000);
    camera.position.set(0, 1, 5);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true // Transparent background
    });
    renderer.setSize(parentContainer.clientWidth, canvas.height);
    renderer.setPixelRatio(window.devicePixelRatio);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // 5. OrbitControls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Smooths out camera movement
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controls.target.set(0, 0.5, 0);

    // 6. Loading Manager and GLTF Loader
    const loadingManager = new THREE.LoadingManager();

    // Optional: Add a loading indicator
    loadingManager.onStart = function (url, itemsLoaded, itemsTotal) {
        console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
        canvas.style.opacity = '0.5'; // Dim canvas while loading
    };

    loadingManager.onLoad = function () {
        console.log('Loading complete!');
        canvas.style.opacity = '1';
    };

    loadingManager.onError = function (url) {
        console.error('There was an error loading ' + url);
        // Optionally show an error message in the canvas container
    };

    const loader = new THREE.GLTFLoader(loadingManager);
    loader.load(
        'assets/blender-model-1.glb',
        function (gltf) {
            const model = gltf.scene;
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center); // Center the model
            scene.add(model);
        }
    );

    // 7. Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update(); // Required for damping
        renderer.render(scene, camera);
    }
    animate();

    // 8. Responsive Resizing
    function onWindowResize() {
        const newWidth = parentContainer.clientWidth;
        const newHeight = canvas.height; // Keep height from CSS

        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    }

    window.addEventListener('resize', onWindowResize);

    // Initial size setup
    onWindowResize();
});