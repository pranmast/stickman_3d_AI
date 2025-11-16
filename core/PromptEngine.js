// core/PromptEngine.js (Modified for Random Action)
import { MotionLibrary } from "./MotionLibrary.js"; 
import { RIG_DATA } from "./StickmanRigData.js"; 

export class PromptEngine {
  constructor() {
    this.motionLib = new MotionLibrary();
  }

  // Helper to generate a random float within min/max constraints
  getRandomRotation(min, max) {
      if (min === undefined || max === undefined) return 0;
      return Math.random() * (max - min) + min;
  }

  // 🌟 NEW FUNCTION: Generates a sequence of constrained random poses
  generateRandomTimeline(numSteps = 15, durationPerStep = 0.4) {
      const timeline = [];
      let currentTime = 0;
      const limits = RIG_DATA.JOINT_LIMITS;
      
      // We only generate for bones with defined limits to skip simple joints like clavicles
      const boneNames = Object.keys(limits); 

      for (let i = 0; i < numSteps; i++) {
          const randomPose = {};
          
          for (const boneName of boneNames) {
              const boneLimits = limits[boneName];

              // 1. Generate random rotations within limits
              const rotX = this.getRandomRotation(boneLimits.x?.[0], boneLimits.x?.[1]);
              const rotY = this.getRandomRotation(boneLimits.y?.[0], boneLimits.y?.[1]);
              const rotZ = this.getRandomRotation(boneLimits.z?.[0], boneLimits.z?.[1]);

              // 2. Only include axes with significant rotation to avoid jitter
              const rotation = {};
              if (boneLimits.x && Math.abs(rotX) > 0.01) rotation.x = rotX;
              if (boneLimits.y && Math.abs(rotY) > 0.01) rotation.y = rotY;
              if (boneLimits.z && Math.abs(rotZ) > 0.01) rotation.z = rotZ;
              
              if (Object.keys(rotation).length > 0) {
                  randomPose[boneName] = rotation;
              }
          }
          
          timeline.push({ time: currentTime, pose: randomPose });
          currentTime += durationPerStep;
      }
      
      // Ensure the final keyframe returns to neutral for smooth looping/transitions
      timeline.push({ time: currentTime, pose: {} }); 

      return timeline;
  }
  
  // 🌟 MODIFIED parse function to check for "random" prompt
  parse(prompt) {
    if (prompt.toLowerCase().includes("random")) {
        // Example prompt: "random 20" for 20 steps
        const match = prompt.match(/random\s*(\d*)/);
        const steps = (match && match[1]) ? parseInt(match[1], 10) : 15;
        console.log(`Generating ${steps} random constrained poses.`);
        return this.generateRandomTimeline(steps, 0.4);
    }
    
    // ... (Existing logic for defined motions remains the same) ...
    const parts = prompt.split(/,|then|and then|;/i).map(s => s.trim()).filter(Boolean);
    let timeline = [];
    let timeCursor = 0;

    for (const part of parts) {
      const motion = this.motionLib.findMotion(part);
      if (!motion) {
        timeline.push({ time: timeCursor, pose: {} });
        timeCursor += 0.8;
        continue;
      }

      for (const kf of motion.keyframes) {
        const numericPose = this.namedPoseToNumeric(kf.pose);
        timeline.push({ time: timeCursor + kf.time, pose: numericPose });
      }
      timeCursor += motion.duration;
    }

    return timeline;
  }
  
  // ... (namedPoseToNumeric function remains the same) ...
  namedPoseToNumeric(named) {
    const map = {
      // WALK Poses
      "step_left": { upperLeg_L: { x: 1.2 }, lowerLeg_L: { x: -0.8 }, upperLeg_R: { x: -0.6 } },
      "step_right": { upperLeg_L: { x: -0.6 }, upperLeg_R: { x: 1.2 }, lowerLeg_R: { x: -0.8 } },
      "swing_left": { upperArm_L: { x: 0.8 }, upperArm_R: { x: -0.8 } },
      "swing_right": { upperArm_L: { x: -0.8 }, upperArm_R: { x: 0.8 } },

      // RUN Poses
      "run_left": { upperLeg_L: { x: 1.8 }, lowerLeg_L: { x: -1.2 }, upperLeg_R: { x: -1.0 } },
      "run_right": { upperLeg_L: { x: -1.0 }, upperLeg_R: { x: 1.8 }, lowerLeg_R: { x: -1.2 } },
      "swing_left_fast": { upperArm_L: { x: 1.2 }, upperArm_R: { x: -1.2 } },
      "swing_right_fast": { upperArm_L: { x: -1.2 }, upperArm_R: { x: 1.2 } },

      // 🌟 FIX: Head must be neutral (0.0 rotation) when in a neutral pose.
      // NOTE: If the rig's T-pose already has a forward lean, this should be the inverse of that lean.
      "head_upright": { neck: { x: 0.0 } }, // Explicitly set to 0.0 for a straight head
      "head_neutral": { neck: { x: 0.0 } },

      // ROOT MOTION
      "walk_root": { root_movement: { z: 0.05 } },
      "run_root": { root_movement: { z: 0.15 } },

      "neutral": {}
    };
    
    const numericPose = {};
    for (const part in named) {
      if (map[named[part]]) {
        for (const bone in map[named[part]]) {
            numericPose[bone] = { 
                ...numericPose[bone], 
                ...map[named[part]][bone] 
            };
        }
      }
    }
    return numericPose;
  }
}
