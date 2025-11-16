// core/StickmanRigData.js
// Static calibration file for all anchor points and bone lengths.
export const RIG_DATA = {
    // SKELETON: Defines the entire skeleton hierarchy and lengths in a normalized unit
    SKELETON: {
        // Root Anchor Point
        hip: { parent: null, len: 0.0, pos: [0, 1.0, 0] }, 

        // Torso and Head
        spine: { parent: 'hip', len: 0.5, axis: 'y' },
        neck: { parent: 'spine', len: 0.1, axis: 'y' },
        head: { parent: 'neck', len: 0.2, axis: 'y' },

        // Arms (Anchored at spine/chest level)
        clavicle_L: { parent: 'spine', len: 0.1, pos: [-0.1, 0.2, 0], axis: 'x' },
        clavicle_R: { parent: 'spine', len: 0.1, pos: [0.1, 0.2, 0], axis: 'x' },

        upperArm_L: { parent: 'clavicle_L', len: 0.3, axis: 'y' },
        lowerArm_L: { parent: 'upperArm_L', len: 0.3, axis: 'y' },
        hand_L: { parent: 'lowerArm_L', len: 0.05, axis: 'y' },

        upperArm_R: { parent: 'clavicle_R', len: 0.3, axis: 'y' },
        lowerArm_R: { parent: 'upperArm_R', len: 0.3, axis: 'y' },
        hand_R: { parent: 'lowerArm_R', len: 0.05, axis: 'y' },

        // Legs
        upperLeg_L: { parent: 'hip', len: 0.4, pos: [-0.15, 0, 0], axis: 'y' },
        lowerLeg_L: { parent: 'upperLeg_L', len: 0.4, axis: 'y' },
        foot_L: { parent: 'lowerLeg_L', len: 0.05, axis: 'y' },

        upperLeg_R: { parent: 'hip', len: 0.4, pos: [0.15, 0, 0], axis: 'y' },
        lowerLeg_R: { parent: 'upperLeg_R', len: 0.4, axis: 'y' },
        foot_R: { parent: 'lowerLeg_R', len: 0.05, axis: 'y' },
    },
    
    // Initial mesh rotations required for T-Pose alignment (e.g., clavicles must be horizontal)
    INITIAL_ROTATIONS: {
        clavicle_L: { z: -Math.PI / 2 }, 
        clavicle_R: { z: Math.PI / 2 },
    }
};
