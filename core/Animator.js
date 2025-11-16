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
            
            const limbs = Object.keys(kf.pose);

            for (const boneName of limbs) {
                if (this.targets[boneName]) {
                    const rotation = kf.pose[boneName];
                    const targetRotation = {};
                    const initRot = RIG_DATA.INITIAL_ROTATIONS[boneName];

                    // Map rotation targets, including the static T-pose offsets
                    if (rotation.x !== undefined) targetRotation.x = rotation.x + (initRot?.x || 0);
                    if (rotation.y !== undefined) targetRotation.y = rotation.y + (initRot?.y || 0);
                    if (rotation.z !== undefined) targetRotation.z = rotation.z + (initRot?.z || 0);

                    this.timeline.to(
                        this.targets[boneName], 
                        {
                            ease: "power1.inOut", 
                            duration: duration,
                            ...targetRotation, 
                        },
                        timePosition 
                    );
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
