import * as THREE from 'three';

export class Level {
    constructor(scene) {
        this.scene = scene;
        this.levelData = null;
        this.geometry = [];
        this.width = 20;
        this.height = 20;
        this.wallHeight = 4;
        this.spawnPoint = new THREE.Vector3(0, 2, 0);

        console.log('🗺️ Level constructor initialized');
    }

    async generate() {
        console.log('🎲 Generating level...');

        try {
            // Clear previous level
            this.clearLevel();

            // Generate level data
            this.generateLevelData();

            // Create geometry
            this.createFloor();
            this.createWalls();
            this.createCeiling();

            // Add lighting
            this.addLevelLighting();

            // Set spawn point
            this.setSpawnPoint();

            console.log('✅ Level generated successfully');

        } catch (error) {
            console.error('❌ Failed to generate level:', error);
            throw error;
        }
    }

    generateLevelData() {
        // Initialize grid (0 = floor, 1 = wall)
        this.levelData = [];
        for (let x = 0; x < this.width; x++) {
            this.levelData[x] = [];
            for (let z = 0; z < this.height; z++) {
                // Create walls around the border
                if (x === 0 || x === this.width - 1 || z === 0 || z === this.height - 1) {
                    this.levelData[x][z] = 1;
                } else {
                    this.levelData[x][z] = 0;
                }
            }
        }

        // Add some random internal walls for maze-like structure
        this.addRandomWalls();

        // Ensure spawn area is clear
        this.clearSpawnArea();
    }

    addRandomWalls() {
        const numWalls = Math.floor((this.width * this.height) * 0.15); // 15% walls

        for (let i = 0; i < numWalls; i++) {
            const x = Math.floor(Math.random() * (this.width - 2)) + 1;
            const z = Math.floor(Math.random() * (this.height - 2)) + 1;

            // Don't place walls too close to spawn
            const distanceFromSpawn = Math.sqrt((x - this.width/2) ** 2 + (z - this.height/2) ** 2);
            if (distanceFromSpawn > 3) {
                this.levelData[x][z] = 1;
            }
        }
    }

    clearSpawnArea() {
        const centerX = Math.floor(this.width / 2);
        const centerZ = Math.floor(this.height / 2);
        const clearRadius = 2;

        for (let x = centerX - clearRadius; x <= centerX + clearRadius; x++) {
            for (let z = centerZ - clearRadius; z <= centerZ + clearRadius; z++) {
                if (x >= 0 && x < this.width && z >= 0 && z < this.height) {
                    this.levelData[x][z] = 0;
                }
            }
        }
    }

    createFloor() {
        // Create a large floor plane
        const floorGeometry = new THREE.PlaneGeometry(this.width * 2, this.height * 2);
        const floorMaterial = new THREE.MeshLambertMaterial({
            color: 0x333333,
            side: THREE.DoubleSide
        });

        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = 0;
        floor.receiveShadow = true;

        this.scene.add(floor);
        this.geometry.push(floor);

        console.log('🟫 Floor created');
    }

    createWalls() {
        const wallGeometry = new THREE.BoxGeometry(2, this.wallHeight, 2);
        const wallMaterial = new THREE.MeshLambertMaterial({
            color: 0x666666
        });

        for (let x = 0; x < this.width; x++) {
            for (let z = 0; z < this.height; z++) {
                if (this.levelData[x][z] === 1) {
                    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
                    wall.position.set(
                        (x - this.width / 2) * 2,
                        this.wallHeight / 2,
                        (z - this.height / 2) * 2
                    );
                    wall.castShadow = true;
                    wall.receiveShadow = true;

                    this.scene.add(wall);
                    this.geometry.push(wall);
                }
            }
        }

        console.log('🧱 Walls created');
    }

    createCeiling() {
        // Create a ceiling for atmosphere
        const ceilingGeometry = new THREE.PlaneGeometry(this.width * 2, this.height * 2);
        const ceilingMaterial = new THREE.MeshLambertMaterial({
            color: 0x222222,
            side: THREE.DoubleSide
        });

        const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.y = this.wallHeight + 1;

        this.scene.add(ceiling);
        this.geometry.push(ceiling);

        console.log('🏠 Ceiling created');
    }

    addLevelLighting() {
        // Add some point lights around the level
        const numLights = 5;
        const lightColor = 0xff6600;
        const lightIntensity = 0.8;
        const lightDistance = 15;

        for (let i = 0; i < numLights; i++) {
            const light = new THREE.PointLight(lightColor, lightIntensity, lightDistance);

            // Random position within the level
            const x = (Math.random() - 0.5) * (this.width * 1.5);
            const z = (Math.random() - 0.5) * (this.height * 1.5);
            const y = this.wallHeight - 1;

            light.position.set(x, y, z);
            light.castShadow = true;

            // Add light helper for debugging (comment out for production)
            // const lightHelper = new THREE.PointLightHelper(light, 0.5);
            // this.scene.add(lightHelper);

            this.scene.add(light);
            this.geometry.push(light);
        }

        console.log('💡 Level lighting added');
    }

    setSpawnPoint() {
        // Set spawn point to center of level
        this.spawnPoint.set(0, 2, 0);

        // Add a spawn indicator (temporary visual aid)
        const spawnGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1);
        const spawnMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.7
        });

        const spawnMarker = new THREE.Mesh(spawnGeometry, spawnMaterial);
        spawnMarker.position.copy(this.spawnPoint);
        spawnMarker.position.y = 0.05;

        this.scene.add(spawnMarker);
        this.geometry.push(spawnMarker);

        console.log('🎯 Spawn point set');
    }

    getSpawnPoint() {
        return this.spawnPoint.clone();
    }

    // Collision detection
    checkCollision(position, radius = 0.5) {
        const gridX = Math.floor((position.x + this.width) / 2);
        const gridZ = Math.floor((position.z + this.height) / 2);

        // Check if position is outside level bounds
        if (gridX < 0 || gridX >= this.width || gridZ < 0 || gridZ >= this.height) {
            return true;
        }

        // Check if position is inside a wall
        return this.levelData[gridX][gridZ] === 1;
    }

    // Pathfinding helpers
    isWalkable(x, z) {
        if (x < 0 || x >= this.width || z < 0 || z >= this.height) {
            return false;
        }
        return this.levelData[x][z] === 0;
    }

    getRandomWalkablePosition() {
        let attempts = 0;
        const maxAttempts = 100;

        while (attempts < maxAttempts) {
            const x = Math.floor(Math.random() * this.width);
            const z = Math.floor(Math.random() * this.height);

            if (this.isWalkable(x, z)) {
                return new THREE.Vector3(
                    (x - this.width / 2) * 2,
                    2,
                    (z - this.height / 2) * 2
                );
            }
            attempts++;
        }

        // Fallback to spawn point
        return this.getSpawnPoint();
    }

    // Level progression
    addEnemySpawns() {
        // TODO: Add enemy spawn points
        console.log('👾 Enemy spawns added (placeholder)');
    }

    addItemSpawns() {
        // TODO: Add item/weapon spawn points
        console.log('📦 Item spawns added (placeholder)');
    }

    addExitPortal() {
        // TODO: Add exit portal to next level
        console.log('🚪 Exit portal added (placeholder)');
    }

    // Update method for dynamic elements
    update(deltaTime) {
        // TODO: Update dynamic level elements (moving platforms, etc.)
    }

    // Cleanup
    clearLevel() {
        // Remove all existing geometry
        this.geometry.forEach(obj => {
            this.scene.remove(obj);
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
                if (Array.isArray(obj.material)) {
                    obj.material.forEach(mat => mat.dispose());
                } else {
                    obj.material.dispose();
                }
            }
        });
        this.geometry = [];

        console.log('🧹 Level cleared');
    }

    destroy() {
        this.clearLevel();
        console.log('🗑️ Level destroyed');
    }
}
