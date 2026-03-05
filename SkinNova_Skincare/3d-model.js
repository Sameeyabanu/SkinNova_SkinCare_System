// ==========================================
// SkinNova System - 3D Interactive Model & Audio
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    const canvasContainer = document.getElementById('three-canvas');
    if (!canvasContainer || typeof THREE === 'undefined') return;

    // --- 1. Scene Setup ---
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 8);

    // Renderer (transparent background)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // mobile optimization
    canvasContainer.appendChild(renderer.domElement);

    // --- 2. Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xfff0dd, 1.2);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xc38eb4, 2, 20); // Lavender glow
    pointLight.position.set(-3, 2, 4);
    scene.add(pointLight);

    // --- 3. 3D Cute Character Creation ---
    const isMobile = window.innerWidth < 768;
    const segments = isMobile ? 32 : 64;

    const characterGroup = new THREE.Group();
    scene.add(characterGroup);

    // Body/Head
    const bodyGeometry = new THREE.SphereGeometry(2, segments, segments);
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0xf6d1dc, // Soft pink starting color
        roughness: 0.3,
        metalness: 0.1,
    });
    const bodyModel = new THREE.Mesh(bodyGeometry, bodyMaterial);
    characterGroup.add(bodyModel);

    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x222222 });

    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.6, 0.3, 1.85);
    characterGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.6, 0.3, 1.85);
    characterGroup.add(rightEye);

    // Blush
    const blushGeometry = new THREE.CircleGeometry(0.35, 32);
    const blushMaterial = new THREE.MeshBasicMaterial({ color: 0xff6b9d, transparent: true, opacity: 0.4 });

    const leftBlush = new THREE.Mesh(blushGeometry, blushMaterial);
    leftBlush.position.set(-1.1, -0.1, 1.7);
    leftBlush.lookAt(new THREE.Vector3(-1.1, -0.1, 5));
    characterGroup.add(leftBlush);

    const rightBlush = new THREE.Mesh(blushGeometry, blushMaterial);
    rightBlush.position.set(1.1, -0.1, 1.7);
    rightBlush.lookAt(new THREE.Vector3(1.1, -0.1, 5));
    characterGroup.add(rightBlush);

    // Smile (Small dark curve)
    const smileCurve = new THREE.EllipseCurve(0, 0, 0.15, 0.1, 0, Math.PI, false, 0);
    const smilePoints = smileCurve.getPoints(20);
    const smileGeometry = new THREE.BufferGeometry().setFromPoints(smilePoints);
    const smileLineMat = new THREE.LineBasicMaterial({ color: 0x222222, linewidth: 3 });
    const smileLine = new THREE.Line(smileGeometry, smileLineMat);
    smileLine.position.set(0, -0.3, 1.95);
    smileLine.rotation.x = Math.PI; // flip to smile
    characterGroup.add(smileLine);

    // Protective Shield (Invisible initially, for Step 5 Sunscreen)
    const shieldGeometry = new THREE.SphereGeometry(2.15, segments, segments);
    const shieldMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xa7c7e7,
        transparent: true,
        opacity: 0,
        roughness: 0.1,
        transmission: 0.9,
        thickness: 0.5
    });
    const shieldModel = new THREE.Mesh(shieldGeometry, shieldMaterial);
    characterGroup.add(shieldModel);

    // --- 4. Floating Particles (Premium Feel) ---
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = isMobile ? 100 : 300;
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
        size: 0.06,
        color: 0xffe6f0, // Soft pink/white cute dust
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    const particlesMesh = new THREE.Points(particleGeo, particleMat);
    scene.add(particlesMesh);

    // --- 5. Interaction & Animation ---
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // Handle touch for mobile
    document.addEventListener('touchmove', (event) => {
        if (event.touches.length > 0) {
            mouseX = (event.touches[0].clientX - windowHalfX);
            mouseY = (event.touches[0].clientY - windowHalfY);
        }
    }, { passive: true });

    const clock = new THREE.Clock();
    let animationFrameId = null;

    function animate() {
        if (!isVisible) {
            animationFrameId = null;
            return;
        }
        animationFrameId = requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // Smooth mouse rotation
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;

        characterGroup.rotation.y += 0.05 * (targetX - characterGroup.rotation.y);
        characterGroup.rotation.x += 0.05 * (targetY - characterGroup.rotation.x);

        // Gentle breathing animation + jump if active
        let jumpOffset = 0;
        if (isPlaying) {
            // Little bounce while speaking/acting
            jumpOffset = Math.abs(Math.sin(elapsedTime * 6)) * 0.15;
            // Blink occasionally
            const blink = Math.sin(elapsedTime * 10) > 0.95;
            leftEye.scale.y = blink ? 0.1 : 1;
            rightEye.scale.y = blink ? 0.1 : 1;
        } else {
            leftEye.scale.y = 1;
            rightEye.scale.y = 1;
        }

        characterGroup.position.y = Math.sin(elapsedTime * 2) * 0.1 + jumpOffset;

        // Animate particles
        particlesMesh.rotation.y = elapsedTime * 0.05;

        renderer.render(scene, camera);
    }

    // Lazy load & Performance Optimization: Only animate when visible
    let isVisible = false;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isVisible = entry.isIntersecting;
            if (isVisible && animationFrameId === null) {
                // Resume animation loop
                requestAnimationFrame(animate);
            }
        });
    }, { threshold: 0.1 });
    observer.observe(canvasContainer);

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    });

    // --- 6. Audio Sync & Simulation Sequence ---
    const btnStart = document.getElementById('btn-start-simulation');
    const btnPlay = document.getElementById('btn-play-audio');
    const btnPause = document.getElementById('btn-pause-audio');
    const btnReplay = document.getElementById('btn-replay-audio');
    const stepsUI = document.querySelectorAll('.step-item');

    let currentStep = -1;
    let isPlaying = false;
    let synth = window.speechSynthesis;
    let currentUtterance = null;
    let animationSequence = [];
    let sequenceIndex = 0;

    // The script segments for the cute character
    const scriptSteps = [
        { text: "To protect your skin, start with cleansing. This gently removes impurities.", targetColor: 0xffffff, blushOpacity: 0.5, shield: 0 },
        { text: "Next, tone the skin to balance pH levels.", targetColor: 0xe8b7c8, blushOpacity: 0.7, shield: 0 },   // Fresh pink
        { text: "Then, apply an antioxidant serum for a radiant, targeted treatment.", targetColor: 0xfff3a1, blushOpacity: 0.9, shield: 0 }, // Glowing yellow/gold
        { text: "After that, moisturize deeply to lock in hydration.", targetColor: 0xf6d1dc, blushOpacity: 0.8, shield: 0 }, // Hydrated soft pink 
        { text: "Finally, apply sunscreen for an invisible shield of UV protection.", targetColor: 0xf6d1dc, blushOpacity: 0.8, shield: 0.6 } // Shield appears
    ];

    function applyVisualStep(index) {
        // Reset all UI
        stepsUI.forEach((el, i) => {
            if (i === index) {
                el.style.opacity = '1';
                el.style.transform = 'scale(1.05)';
                el.style.background = 'rgba(255,255,255,0.9)';
                el.style.borderLeft = '4px solid var(--lavender)';
            } else {
                el.style.opacity = '0.4';
                el.style.transform = 'scale(1)';
                el.style.background = 'rgba(255,255,255,0.5)';
                el.style.borderLeft = 'none';
            }
        });

        // Animate 3D Model glow transition
        if (index >= 0 && index < scriptSteps.length) {
            const stepData = scriptSteps[index];
            const targetColor = new THREE.Color(stepData.targetColor);

            // GSAP-like simple transition (could use GSAP if included, but keeping it vanilla)
            let transitionStep = 0;
            const startColor = bodyModel.material.color.clone();
            const startBlushOpacity = blushMaterial.opacity;
            const startShield = shieldMaterial.opacity;

            const transitionInterval = setInterval(() => {
                transitionStep += 0.05;
                if (transitionStep >= 1) {
                    clearInterval(transitionInterval);
                    bodyModel.material.color.copy(targetColor);
                    blushMaterial.opacity = stepData.blushOpacity;
                    shieldMaterial.opacity = stepData.shield;
                } else {
                    bodyModel.material.color.lerpColors(startColor, targetColor, transitionStep);
                    blushMaterial.opacity = startShield + (stepData.blushOpacity - startShield) * transitionStep;
                    shieldMaterial.opacity = startShield + (stepData.shield - startShield) * transitionStep;
                }
            }, 30);

            // Highlight point light to match action
            pointLight.color.copy(targetColor);
            pointLight.intensity = index === 2 ? 4 : 2; // Serum glows brighter
        }
    }

    function speakNextStep() {
        if (!isPlaying || sequenceIndex >= scriptSteps.length) {
            isPlaying = false;
            updatePlayPauseUI();

            // End of simulation reset UI
            if (sequenceIndex >= scriptSteps.length) {
                setTimeout(() => {
                    stepsUI.forEach(el => {
                        el.style.opacity = '0.5';
                        el.style.transform = 'scale(1)';
                        el.style.borderLeft = 'none';
                    });
                }, 2000);
            }
            return;
        }

        applyVisualStep(sequenceIndex);

        currentUtterance = new SpeechSynthesisUtterance(scriptSteps[sequenceIndex].text);

        // Force load voices if they aren't loaded yet (Chrome bug)
        let voices = synth.getVoices();

        // Find a female voice (prioritize high quality built-in voices for Mac/Windows/Chrome)
        let femaleVoice = voices.find(v =>
            v.name.includes('Samantha') ||
            v.name.includes('Zira') ||
            v.name.includes('Female') ||
            v.name.includes('Google UK English Female') ||
            v.name.includes('Google US English')
        );

        // Fallback to first english voice or default
        if (!femaleVoice) femaleVoice = voices.find(v => v.lang.startsWith('en-') && !v.name.includes('Male')) || voices[0];
        if (femaleVoice) currentUtterance.voice = femaleVoice;

        currentUtterance.rate = 0.95; // Professional paced speed

        currentUtterance.onend = () => {
            sequenceIndex++;
            setTimeout(speakNextStep, 800); // 800ms pause between steps
        };

        synth.speak(currentUtterance);
    }

    function startSimulation() {
        synth.cancel(); // Stop any current speech
        sequenceIndex = 0;
        isPlaying = true;
        updatePlayPauseUI();
        speakNextStep();
    }

    function updatePlayPauseUI() {
        if (isPlaying) {
            btnPlay.style.display = 'none';
            btnPause.style.display = 'flex';
            btnStart.textContent = 'Simulation Running...';
            btnStart.disabled = true;
            btnStart.style.opacity = '0.7';
        } else {
            btnPlay.style.display = 'flex';
            btnPause.style.display = 'none';
            btnStart.textContent = 'How to Protect Your Skin ✨';
            btnStart.disabled = false;
            btnStart.style.opacity = '1';
        }
    }

    // Controls bindings
    btnStart.addEventListener('click', startSimulation);

    btnPlay.addEventListener('click', () => {
        if (synth.paused) {
            synth.resume();
            isPlaying = true;
        } else {
            startSimulation();
        }
        updatePlayPauseUI();
    });

    btnPause.addEventListener('click', () => {
        if (synth.speaking) {
            synth.pause();
            isPlaying = false;
            updatePlayPauseUI();
        }
    });

    btnReplay.addEventListener('click', () => {
        startSimulation();
    });

    // Clean up voice caching
    window.speechSynthesis.onvoiceschanged = () => {
        // Just forces browser to cache voices internally
        window.speechSynthesis.getVoices();
    };
});
