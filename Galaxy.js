class Galaxy {
    constructor(numStars, centerPos, velocity, inclinationDeg, mass) {
        this.numStars = numStars;
        this.centerPos = centerPos;
        this.velocity = velocity;
        this.inclinationRad = inclinationDeg * (Math.PI / 180);
        this.mass = mass;
        this.stars = this.generateStars();
    }

    // **Best practice: Use a pseudo-random distribution for a realistic disk shape**
    generateStars() {
        const stars = [];
        for (let i = 0; i < this.numStars; i++) {
            // Simplified star generation: needs a proper disk/halo structure 
            // with a velocity profile (Keplerian/non-Keplerian) for realism.
            
            // Example: Simple random scatter
            let radius = Math.random() * 500;
            let angle = Math.random() * Math.PI * 2;
            let z = (Math.random() - 0.5) * 5; // Thin disk
            
            let x = Math.cos(angle) * radius + this.centerPos.x;
            let y = Math.sin(angle) * radius + this.centerPos.y;
            z += this.centerPos.z;
            
            // Rotation based on inclination (crucial parameter!)
            // Rotation matrix application is needed here for the tilt.
            
            stars.push({ x: x, y: y, z: z, vx: 0, vy: 0, vz: 0, mass: this.mass / this.numStars });
        }
        return stars;
    }
}
// This class would be used in main.js to construct the initial data for the THREE.js ParticleSystem.
