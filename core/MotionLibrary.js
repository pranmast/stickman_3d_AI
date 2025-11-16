// core/MotionLibrary.js
// Library of pre-defined motions for stickman

export class MotionLibrary {

    constructor() {
        this.motions = [
            // ---------------------------------------------
            //  WALK
            // ---------------------------------------------
            {
                name: "walk",
                keywords: ["walk", "walking", "move forward"],
                duration: 2.0,
                keyframes: [
                    // 🌟 FIX: Apply head_upright during movement
                    { time: 0.0, pose: { legs: "step_left", arms: "swing_right", root: "walk_root", head: "head_upright" } },
                    { time: 1.0, pose: { legs: "step_right", arms: "swing_left", root: "walk_root", head: "head_upright" } },
                    // Set back to neutral (default T-pose) when motion ends/loops
                    { time: 2.0, pose: { legs: "neutral", arms: "neutral", root: "walk_root", head: "head_neutral" } } 
                ]
            },

            // ---------------------------------------------
            //  RUN
            // ---------------------------------------------
            {
                name: "run",
                keywords: ["run", "running", "sprint"],
                duration: 1.0, 
                keyframes: [
                    // 🌟 FIX: Apply head_upright during movement
                    { time: 0.0, pose: { legs: "run_left", arms: "swing_right_fast", root: "run_root", head: "head_upright" } },
                    { time: 0.5, pose: { legs: "run_right", arms: "swing_left_fast", root: "run_root", head: "head_upright" } },
                    { time: 1.0, pose: { legs: "neutral", arms: "neutral", root: "run_root", head: "head_neutral" } }
                ]
            },
            
            // ---------------------------------------------
            //  FIGHT (Stationary)
            // ---------------------------------------------
            {
                name: "fight",
                keywords: ["fight", "punch", "hit", "attack"],
                duration: 2.5,
                keyframes: [
                    { time: 0.0, pose: { arms: "guard_up" } },
                    { time: 0.8, pose: { arms: "punch_left" } },
                    { time: 1.6, pose: { arms: "punch_right" } },
                    { time: 2.5, pose: { arms: "neutral" } }
                ]
            },
            
            // ---------------------------------------------
            //  SIT (Stationary)
            // ---------------------------------------------
            {
                name: "sit",
                keywords: ["sit", "sits", "sitting"],
                duration: 1.4,
                keyframes: [
                    // Targeting the rotation of the upper leg only for simplicity
                    { time: 0.0, pose: { upperLeg_L: { x: 0.5 }, upperLeg_R: { x: 0.5 } } },
                    { time: 1.4, pose: { upperLeg_L: { x: Math.PI / 2 }, upperLeg_R: { x: Math.PI / 2 } } } 
                ]
            }
        ];
    }

    findMotion(text) {
        text = text.toLowerCase();
        for (let m of this.motions) {
            for (let k of m.keywords) {
                if (text.includes(k)) {
                    return m;
                }
            }
        }
        return null;
    }
}
