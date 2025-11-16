// core/Stickman.js
import * as THREE from "three";
import { RIG_DATA } from "./StickmanRigData.js"; 

export class Stickman {

    constructor(scene, options = {}) {
        this.scene = scene;
        this.THREE = THREE;
        this.size = options.size || 1;
        this.bones = {}; 
        this.group = new THREE.Group();
        this.scene.add(this.group);
        this.build();
    }

    build() {
        const mat = new this.THREE.MeshBasicMaterial({ color: 0xffffff });
        const jointMat = new this.THREE.MeshBasicMaterial({ color: 0xff5555 });
        const limbRadius = 0.04 * this.size;
        const jointRadius = 0.06 * this.size;

        const data = RIG_DATA.SKELETON;

        for (const boneName in data) {
            const boneData = data[boneName];
            let mesh;
            
            if (boneData.len > 0) {
                // Limb (Cylinder)
                const len = boneData.len * this.size;
                const geom = new this.THREE.CylinderGeometry(limbRadius, limbRadius, len, 8);
                // Center offset for rotation pivot at the base
                geom.translate(0, len / 2, 0); 
                mesh = new this.THREE.Mesh(geom, mat);
                
                // Apply T-Pose rotations
                const initRot = RIG_DATA.INITIAL_ROTATIONS[boneName];
                if (initRot) {
                    if (initRot.x) mesh.rotation.x = initRot.x;
                    if (initRot.y) mesh.rotation.y = initRot.y;
                    if (initRot.z) mesh.rotation.z = initRot.z;
                }

            } else {
                // Joint (Sphere)
                const geom = new this.THREE.SphereGeometry(jointRadius, 12, 12);
                mesh = new this.THREE.Mesh(geom, jointMat);
            }

            // --- Set Local Position and Parenting ---
            
            if (boneData.pos) {
                mesh.position.set(boneData.pos[0] * this.size, boneData.pos[1] * this.size, boneData.pos[2] * this.size);
            } else if (boneData.parent && data[boneData.parent].len) {
                // Position at the end of the parent bone's length
                mesh.position.y = data[boneData.parent].len * this.size;
            }

            // Parenting
            if (boneData.parent && this.bones[boneData.parent]) {
                this.bones[boneData.parent].add(mesh);
            } else {
                this.group.add(mesh); // Root element
            }

            this.bones[boneName] = mesh;
        }

        // Adjust entire group so the hip is correctly positioned above the ground (Y=0)
        this.group.position.y = -data.hip.pos[1] * this.size;
    }

    setPose(pose) {
        if (!pose) return;
        for (const boneName in pose) {
            const bone = this.bones[boneName];
            if (bone) {
                const rot = pose[boneName];
                bone.rotation.x = rot.x !== undefined ? rot.x : bone.rotation.x;
                bone.rotation.y = rot.y !== undefined ? rot.y : bone.rotation.y;
                bone.rotation.z = rot.z !== undefined ? rot.z : bone.rotation.z;
            }
        }
    }
}
