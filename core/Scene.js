// core/Scene.js
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

export class SceneManager {

    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.clock = null;
        this.THREE = THREE;
        
        // 🌟 NEW: Camera rotation state variables
        this.isDragging = false;
        this.startMouseX = 0;
        this.startMouseY = 0;
        this.radius = 4.0; // Fixed distance from target (locked to stick extents)
        this.target = new THREE.Vector3(0, 1.0, 0); // Stickman's center point (hip)
        this.phi = Math.PI / 3;    // Polar angle (vertical rotation, 0 is top) - Initial 60 deg
        this.theta = Math.PI * 0.25; // Azimuth angle (horizontal rotation) - Initial 45 deg
        this.size = 3; // Orthographic size
    }

    async init() {
        this.clock = new THREE.Clock();
        this.scene = new this.THREE.Scene();
        this.scene.background = new THREE.Color(0x222222);

        this.setupOrthographicCamera();
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        const container = document.getElementById("scene");
        container.appendChild(this.renderer.domElement);

        const light = new THREE.DirectionalLight(0xffffff, 1.2);
        light.position.set(3, 5, 2);
        this.scene.add(light);
        
        // Add ground plane for visual context
        const groundGeo = new this.THREE.PlaneGeometry(100, 100);
        const groundMat = new this.THREE.MeshBasicMaterial({ color: 0x333333, side: this.THREE.DoubleSide });
        const ground = new this.THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.01;
        this.scene.add(ground);

        this.updateCameraPosition(); // Set initial camera position

        // 🌟 NEW: Event Listeners for Touch/Mouse Drag
        window.addEventListener("resize", () => this.onWindowResize());
        container.addEventListener('mousedown', (e) => this.onPointerDown(e), false);
        container.addEventListener('touchstart', (e) => this.onPointerDown(e), false);
        container.addEventListener('mousemove', (e) => this.onPointerMove(e), false);
        container.addEventListener('touchmove', (e) => this.onPointerMove(e), false);
        window.addEventListener('mouseup', (e) => this.onPointerUp(e), false); // Use window to catch outside drags
        window.addEventListener('touchend', (e) => this.onPointerUp(e), false);

        this.animate();
    }
    
    setupOrthographicCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        
        this.camera = new THREE.OrthographicCamera(
            -this.size * aspect,
            this.size * aspect,
            this.size,
            -this.size,
            0.1,
            100
        );
    }
    
    // 🌟 Core function: Updates camera position based on Phi and Theta angles
    updateCameraPosition() {
        // Clamp phi (vertical angle) to prevent the camera from flipping over
        this.phi = Math.max(0.1, Math.min(Math.PI - 0.1, this.phi));
        
        // Convert spherical angles (phi, theta, radius) to Cartesian (x, y, z)
        const x = this.radius * Math.sin(this.phi) * Math.cos(this.theta);
        const y = this.radius * Math.cos(this.phi);
        const z = this.radius * Math.sin(this.phi) * Math.sin(this.theta);

        // Set the camera position relative to the target (stickman's center)
        this.camera.position.set(
            this.target.x + x, 
            this.target.y + y, 
            this.target.z + z
        );
        
        // Always look at the stickman's center
        this.camera.lookAt(this.target);
        
        this.camera.updateProjectionMatrix(); 
    }
    
    onWindowResize() {
        const newAspect = window.innerWidth / window.innerHeight;
        const orthoCamera = this.camera;
        
        orthoCamera.left = -this.size * newAspect;
        orthoCamera.right = this.size * newAspect;
        orthoCamera.top = this.size;
        orthoCamera.bottom = -this.size;
        
        orthoCamera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    // 🌟 Pointer Down Handler (Start Drag)
    onPointerDown(event) {
        event.preventDefault();
        this.isDragging = true;

        const clientX = event.clientX !== undefined ? event.clientX : event.touches[0].clientX;
        const clientY = event.clientY !== undefined ? event.clientY : event.touches[0].clientY;

        this.startMouseX = clientX;
        this.startMouseY = clientY;
    }

    // 🌟 Pointer Move Handler (Update Angles)
    onPointerMove(event) {
        if (!this.isDragging) return;
        event.preventDefault();

        const clientX = event.clientX !== undefined ? event.clientX : event.touches[0].clientX;
        const clientY = event.clientY !== undefined ? event.clientY : event.touches[0].clientY;

        const deltaX = clientX - this.startMouseX;
        const deltaY = clientY - this.startMouseY;

        // Rotation speed factor (adjust sensitivity)
        const speed = 0.005; 

        // Update Azimuth (horizontal rotation) and Polar (vertical rotation)
        this.theta -= deltaX * speed;
        this.phi -= deltaY * speed;

        this.startMouseX = clientX;
        this.startMouseY = clientY;

        this.updateCameraPosition();
    }

    // 🌟 Pointer Up Handler (End Drag)
    onPointerUp(event) {
        this.isDragging = false;
    }


    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }
}
        );
        
        // Isometric Position (Equal distance on X, Y, Z for 45/30 degree standard isometric)
        this.camera.position.set(0, -1, -1); 
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
