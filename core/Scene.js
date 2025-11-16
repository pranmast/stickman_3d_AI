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
        this.clock = new this.THREE.Clock();
        this.scene = new this.THREE.Scene();
        this.scene.background = new this.THREE.Color(0x000000);

        this.camera = new this.THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 1.8, 4);

        this.renderer = new this.THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        const container = document.getElementById("scene");
        container.appendChild(this.renderer.domElement);

        const light = new this.THREE.DirectionalLight(0xffffff, 1.2);
        light.position.set(3, 5, 2);
        this.scene.add(light);
        
        // Add ground plane
        const groundGeo = new this.THREE.PlaneGeometry(100, 100);
        const groundMat = new this.THREE.MeshBasicMaterial({ color: 0x333333, side: this.THREE.DoubleSide });
        const ground = new this.THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = Math.PI / 2;
        this.scene.add(ground);


        window.addEventListener("resize", () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        this.animate();
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }
}
