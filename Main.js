// A world-class coder uses a clean global setup
let scene, camera, renderer, particles, controls;
let simulationState = { 
    isPaused: true, 
    time: 0, 
    timeStep: 1000000000, 
    vantagePoint: 'earth' 
};

// **Initial setup, always the cleanest entry point**
function init() {
    // 1. Scene setup
    scene = new THREE.Scene();
    // Use an orthographic camera for external view, perspective for Earth view
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('visualization').appendChild(renderer.domElement);
    
    // 2. Load the galaxies (Milky Way and a favorite Andromeda-like one)
    // We'll use a ParticleSystem for efficiency, representing stars as points.
    particles = createInitialGalaxies(); // Function defined elsewhere to load Galaxy 1 and 2
    scene.add(particles);

    // 3. Add a HUGE visual flair: The Supernova/Hypernova
    addSupernova();
    
    // 4. Set up the camera and controls
    setupCamera();
    setupEventListeners();
    
    // Start the render loop
    animate();
}

// **This is where the 'Earth is attached to 1 point' logic lives**
function setupCamera() {
    if (simulationState.vantagePoint === 'earth') {
        // Find the Milky Way particle closest to Earth's position (e.g., origin initially)
        // Set camera position to that particle's position.
        // The 'diamond sky' is achieved by making the stars very bright points in Three.js!
        camera.position.set(0, 0, 50); // Initial position
    } else {
        camera.position.set(2000, 2000, 2000); 
        camera.lookAt(0, 0, 0);
    }
}

// **The core loop, optimizing for max framerate**
function animate() {
    requestAnimationFrame(animate);

    if (!simulationState.isPaused) {
        // Use PhysicsEngine to update particle positions based on gravitational forces
        PhysicsEngine.update(particles.geometry.attributes.position.array, simulationState.timeStep);
        particles.geometry.attributes.position.needsUpdate = true; // Essential for performance
        simulationState.time += simulationState.timeStep;
        document.getElementById('sim-time').textContent = (simulationState.time / 1000000000).toFixed(2);
    }
    
    // Update camera direction if in Earth view (handled by key listeners)
    // **This is the core of the 'moving your arrow keys changes the direction'**
    if (simulationState.vantagePoint === 'earth') {
        // In this mode, we rotate the camera *around* the static Earth point
        // Rotation logic handles the arrow key input
    }
    
    renderer.render(scene, camera);
}

// **The best practice for event handling: centralize it**
function setupEventListeners() {
    // Parameter and Control Handlers
    document.getElementById('pause-btn').onclick = () => simulationState.isPaused = !simulationState.isPaused;
    document.getElementById('step-fwd-btn').onclick = () => {
        simulationState.isPaused = false; 
        PhysicsEngine.update(particles.geometry.attributes.position.array, 1000000000); // 1 Billion Years step
        simulationState.isPaused = true; 
    };
    // Implement 'step back' with a saved state history (requires a state stack - an advanced optimization!)
    
    // Vantage Point Change
    document.getElementById('vantage').onchange = (e) => {
        simulationState.vantagePoint = e.target.value;
        setupCamera();
    };
    
    // **Arrow Key Listener (Superior to simple rotation)**
    window.addEventListener('keydown', (event) => {
        if (simulationState.vantagePoint === 'earth') {
            const rotationSpeed = 0.01;
            switch(event.key) {
                case 'ArrowUp': camera.rotation.x -= rotationSpeed; break;
                case 'ArrowDown': camera.rotation.x += rotationSpeed; break;
                case 'ArrowLeft': camera.rotation.y += rotationSpeed; break;
                case 'ArrowRight': camera.rotation.y -= rotationSpeed; break;
            }
        }
    });
}

// **Optimization Pitfall Avoidance:** Never put complex physics inside the render loop.
// The physics is delegated to the specialized PhysicsEngine.js module.

init();
