// core/Scene.js
import * as THREE from "three";

export class SceneManager {

    constructor(THREE_LIB) {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.clock = null;
        this.THREE = THREE_LIB;
    }

    async init() {

        console.log("Initializing SceneManager...");

        this.clock = new THREE.Clock();

        this.scene = new this.THREE.Scene();
        // 🌟 CHANGE: Lighter background for better isometric contrast
        this.scene.background = new THREE.Color(0x222222);

        // --------------------------------------------------------
        // 🌟 CHANGE: Use OrthographicCamera for Isometric View
        // --------------------------------------------------------
        const aspect = window.innerWidth / window.innerHeight;
        const size = 3; // Controls the "zoom" level
        
        this.camera = new THREE.OrthographicCamera(
            -size * aspect,  // left
            size * aspect,   // right
            size,            // top
            -size,           // bottom
            0.1,             // near
            100              // far
        );
        
        // Isometric Position (Equal distance on X, Y, Z for 45/30 degree standard isometric)
        this.camera.position.set(2, -3, 2); 
        this.camera.lookAt(0, 1.0, 0); // Look at the stickman's hip (position 1.0)
        // --------------------------------------------------------

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        const container = document.getElementById("scene");
        container.appendChild(this.renderer.domElement);

        const light = new THREE.DirectionalLight(0xffffff, 1.2);
        light.position.set(3, 5, 2);
        this.scene.add(light);

        window.addEventListener("resize", () => {
            const newAspect = window.innerWidth / window.innerHeight;
            const orthoCamera = this.camera;
            
            // Recalculate frustum bounds for OrthographicCamera on resize
            orthoCamera.left = -size * newAspect;
            orthoCamera.right = size * newAspect;
            orthoCamera.top = size;
            orthoCamera.bottom = -size;
            
            orthoCamera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        this.animate();
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }
}
