// core/PromptEngine.js
import { MotionLibrary } from "./MotionLibrary.js"; 

export class PromptEngine {
  constructor() {
    this.motionLib = new MotionLibrary();
  }

  parse(prompt) {
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
        // Now includes root_movement
        const numericPose = this.namedPoseToNumeric(kf.pose);
        timeline.push({ time: timeCursor + kf.time, pose: numericPose });
      }
      timeCursor += motion.duration;
    }

    return timeline;
  }

  // 🌟 FIX: Updated poses for realistic forward movement and stronger rotations
  namedPoseToNumeric(named) {
    // Rotation values are stronger and the step/swing are synchronized.
    // The Z-axis rotation creates the slight forward/backward sway.
    const map = {
      // WALK Poses (Slower, 1.2 radians is approx 70 degrees)
      "step_left": { upperLeg_L: { x: 1.2 }, lowerLeg_L: { x: -0.8 }, upperLeg_R: { x: -0.6 } },
      "step_right": { upperLeg_L: { x: -0.6 }, upperLeg_R: { x: 1.2 }, lowerLeg_R: { x: -0.8 } },
      "swing_left": { upperArm_L: { x: 0.8 }, upperArm_R: { x: -0.8 } },
      "swing_right": { upperArm_L: { x: -0.8 }, upperArm_R: { x: 0.8 } },

      // RUN Poses (Faster, more aggressive movement)
      "run_left": { upperLeg_L: { x: 1.8 }, lowerLeg_L: { x: -1.2 }, upperLeg_R: { x: -1.0 } },
      "run_right": { upperLeg_L: { x: -1.0 }, upperLeg_R: { x: 1.8 }, lowerLeg_R: { x: -1.2 } },
      "swing_left_fast": { upperArm_L: { x: 1.2 }, upperArm_R: { x: -1.2 } },
      "swing_right_fast": { upperArm_L: { x: -1.2 }, upperArm_R: { x: 1.2 } },

      // ROOT MOTION: Applied to the main Group position (hip is the root bone)
      "walk_root": { root_movement: { z: 0.05 } }, // Move 0.05 units forward per keyframe
      "run_root": { root_movement: { z: 0.15 } }, // Move 0.15 units forward per keyframe

      "neutral": {}
    };
    
    // Logic to merge all parts (limbs + root) into a single numeric pose object
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
