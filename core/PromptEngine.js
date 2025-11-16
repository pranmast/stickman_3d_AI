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
        const numericPose = this.namedPoseToNumeric(kf.pose);
        timeline.push({ time: timeCursor + kf.time, pose: numericPose });
      }
      timeCursor += motion.duration;
    }

    return timeline;
  }

  // Uses CALIBRATED BONE NAMES for motion definition
  namedPoseToNumeric(named) {
    const map = {
      // WALK Poses - Targets upper-most segment (upperLeg and upperArm)
      "step_left": { upperLeg_L: { x: -0.8 }, upperLeg_R: { x: 0.8 } },
      "step_right": { upperLeg_L: { x: 0.8 }, upperLeg_R: { x: -0.8 } },
      "swing_left": { upperArm_L: { x: -1.0 }, upperArm_R: { x: 1.0 } },
      "swing_right": { upperArm_L: { x: 1.0 }, upperArm_R: { x: -1.0 } },

      // RUN Poses
      "run_left": { upperLeg_L: { x: -1.5 }, upperLeg_R: { x: 1.5 } },
      "run_right": { upperLeg_L: { x: 1.5 }, upperLeg_R: { x: -1.5 } },
      "swing_left_fast": { upperArm_L: { x: -1.5 }, upperArm_R: { x: 1.5 } },
      "swing_right_fast": { upperArm_L: { x: 1.5 }, upperArm_R: { x: -1.5 } },

      // FIGHT Poses
      "guard_up": { upperArm_L: { x: -0.5, y: 0.2 }, upperArm_R: { x: 0.5, y: -0.2 } },
      "punch_left": { upperArm_L: { x: -2.0, z: -0.8 } }, 
      "punch_right": { upperArm_R: { x: 2.0, z: 0.8 } },
      
      "neutral": {}
    };
    
    // Logic to merge all parts into a single numeric pose object
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
