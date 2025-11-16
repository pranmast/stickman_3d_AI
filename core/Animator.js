// core/Animator.js
import { gsap } from "gsap"; 
import { RIG_DATA } from "./StickmanRigData.js"; 

export class Animator {
    constructor(stickman) {
        this.stickman = stickman;
        
        // Map bone names from the calibration data to the actual THREE.js rotation objects
        this.targets = {};
        for(const boneName in RIG_DATA.SKELETON) {
            this.targets[boneName] = this.stickman.bones[boneName].rotation;
        }
        
        // 🌟 NEW: Target the position of the main THREE.Group for root motion
        this.targets.root_movement = this.stickman.group.position; 

        this.timeline = gsap.timeline({ paused: true, repeat: -1 }); 
        this.playing = false;
    }

    loadTimeline(keyframes) {
        this.timeline.clear();
        this.playing = false;
        
        if (keyframes.length === 0) return;

        this.stickman.setPose(keyframes[0].pose);

        for (let i = 1; i < keyframes.length; i++) {
            const kf = keyframes[i];
            const prevKf = keyframes[i - 1];
            
            const timePosition = prevKf.time;
            const duration = kf.time - prevKf.time;
            
            const keys = Object.keys(kf.pose);

            for (const key of keys) {
                const isRootMotion = key === 'root_movement';
                const target = this.targets[key];

                if (target) {
                    const values = kf.pose[key];
                    const targetValues = {};

                    if (isRootMotion) {
                        // 🌟 ROOT MOTION: Animate Group Position (x, y, z)
                        // Note: We use += for Z movement to continuously move forward
                        if (values.x !== undefined) targetValues.x = target.x + (values.x || 0);
                        if (values.y !== undefined) targetValues.y = target.y + (values.y || 0);
                        if (values.z !== undefined) targetValues.z = target.z + (values.z || 0);
                        
                        this.timeline.to(
                            target,
                            {
                                ease: "linear", // Root motion is usually linear for consistent speed
                                duration: duration,
                                ...targetValues,
                            },
                            timePosition
                        );

                    } else {
                        // 🌟 LOCAL MOTION: Animate Bone Rotations (x, y, z)
                        const initRot = RIG_DATA.INITIAL_ROTATIONS[key];
                        
                        if (values.x !== undefined) targetValues.x = values.x + (initRot?.x || 0);
                        if (values.y !== undefined) targetValues.y = values.y + (initRot?.y || 0);
                        if (values.z !== undefined) targetValues.z = values.z + (initRot?.z || 0);

                        this.timeline.to(
                            target, 
                            {
                                ease: "power1.inOut", 
                                duration: duration,
                                ...targetValues, 
                            },
                            timePosition 
                        );
                    }
                }
            }
        }
    }
    
    play() { 
        this.timeline.repeat(-1); 
        this.timeline.restart(); 
        this.playing = true; 
    }
    
    pause() { 
        this.timeline.pause(); 
        this.playing = false; 
    }
}
