import * as THREE from "three";
import { gsap } from "gsap"; // Imported via importmap
import { SceneManager } from "./core/Scene.js";
import { Stickman } from "./core/Stickman.js";
import { PromptEngine } from "./core/PromptEngine.js";
import { Animator } from "./core/Animator.js";

let sceneManager, character, animator, promptEngine;

async function start() {
    // 1. Scene setup
    sceneManager = new SceneManager(THREE);
    await sceneManager.init(); 

    // 2. Character rig setup (uses StickmanRigData.js internally)
    character = new Stickman(sceneManager.scene, { size: 1.0 });

    // 3. Logic & Animation setup
    animator = new Animator(character); 
    promptEngine = new PromptEngine(); 

    setupUI();
    console.log("3D Stickman Studio Loaded.");
}

function setupUI() {
    const promptBox = document.getElementById("promptInput");
    const runBtn = document.getElementById("runPrompt");

    runBtn.onclick = async () => {
        const text = promptBox.value.trim();
        if (!text) return;

        // 🌟 Runtime generation of keyframes
        const actions = promptEngine.parse(text); 
        
        animator.loadTimeline(actions); 
        animator.play();              
    };
}

window.addEventListener("DOMContentLoaded", start);
