// core/StickmanRigData.js
// Defines the complete, calibrated skeleton hierarchy, lengths, anchor points, AND JOINT LIMITS.

export const RIG_DATA = {
    // SKELETON (Unchanged structure)
    SKELETON: {
        hip: { parent: null, len: 0.0, pos: [0, 1.0, 0] }, 
        spine: { parent: 'hip', len: 0.5, axis: 'y' },
        neck: { parent: 'spine', len: 0.1, axis: 'y' },
        head: { parent: 'neck', len: 0.2, axis: 'y' }, 
        clavicle_L: { parent: 'spine', len: 0.1, pos: [-0.1, 0.2, 0], axis: 'x' },
        clavicle_R: { parent: 'spine', len: 0.1, pos: [0.1, 0.2, 0], axis: 'x' },
        upperArm_L: { parent: 'clavicle_L', len: 0.3, axis: 'y' },
        lowerArm_L: { parent: 'upperArm_L', len: 0.3, axis: 'y' },
        hand_L: { parent: 'lowerArm_L', len: 0.05, axis: 'y' },
        upperArm_R: { parent: 'clavicle_R', len: 0.3, axis: 'y' },
        lowerArm_R: { parent: 'upperArm_R', len: 0.3, axis: 'y' },
        hand_R: { parent: 'lowerArm_R', len: 0.05, axis: 'y' },
        upperLeg_L: { parent: 'hip', len: 0.4, pos: [-0.15, 0, 0], axis: 'y' },
        lowerLeg_L: { parent: 'upperLeg_L', len: 0.4, axis: 'y' },
        foot_L: { parent: 'lowerLeg_L', len: 0.05, axis: 'y' },
        upperLeg_R: { parent: 'hip', len: 0.4, pos: [0.15, 0, 0], axis: 'y' },
        lowerLeg_R: { parent: 'upperLeg_R', len: 0.4, axis: 'y' },
        foot_R: { parent: 'lowerLeg_R', len: 0.05, axis: 'y' },
    },
    
    // INITIAL_ROTATIONS (Unchanged)
    INITIAL_ROTATIONS: {
        clavicle_L: { z: -Math.PI / 2 }, 
        clavicle_R: { z: Math.PI / 2 },
    },

    // 🌟 NEW: DEFINING JOINT LIMITS (Flexion/Extension Constraints)
    // Limits are specified as [min, max] rotation in RADIANS
    // X-axis: Pitch (Forward/Backward Flexion/Extension)
    // Y-axis: Yaw (Twist/Rotation)
    // Z-axis: Roll (Side-to-Side Abduction/Adduction)
    JOINT_LIMITS: {
        // TORSO/HEAD (Slight limits for subtle movements)
        spine:      { x: [-0.3, 0.3], y: [-0.6, 0.6], z: [-0.3, 0.3] },
        neck:       { x: [-0.6, 0.4], y: [-0.8, 0.8], z: [-0.4, 0.4] },
        head:       { x: [-0.4, 0.4], y: [-1.0, 1.0], z: [-0.4, 0.4] }, 

        // ARMS (Upper) - Wide range for expressive movement
        upperArm_L: { x: [-2.5, 2.5], y: [-1.5, 1.5], z: [-0.5, 2.5] },
        upperArm_R: { x: [-2.5, 2.5], y: [-1.5, 1.5], z: [-2.5, 0.5] },
        
        // ARMS (Lower) - Elbow Flexion (X-axis) - cannot hyperextend (bend forward past 0)
        lowerArm_L: { x: [-2.5, 0.1], y: [-0.1, 0.1], z: [-0.1, 0.1] }, 
        lowerArm_R: { x: [-2.5, 0.1], y: [-0.1, 0.1], z: [-0.1, 0.1] }, 

        // LEGS (Upper) - Hip
        upperLeg_L: { x: [-1.5, 1.5], y: [-0.3, 0.3], z: [0.0, 0.8] }, // Z: Abduction (outwards)
        upperLeg_R: { x: [-1.5, 1.5], y: [-0.3, 0.3], z: [-0.8, 0.0] }, // Z: Abduction (outwards)

        // LEGS (Lower) - Knee Flexion (X-axis) - cannot hyperextend (bend back past 0)
        lowerLeg_L: { x: [0.0, 2.5], y: [-0.05, 0.05], z: [-0.05, 0.05] }, 
        lowerLeg_R: { x: [0.0, 2.5], y: [-0.05, 0.05], z: [-0.05, 0.05] },
    }
};
