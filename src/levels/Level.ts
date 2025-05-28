import * as THREE from 'three';
import type { LevelConfig, LevelData, CellType } from '@/types/game';

export class Level {
    private readonly scene: THREE.Scene;
    private levelData: CellType[][] | null = null;
    private geometry: THREE.Object3D[] = [];

    // Level configuration
    private readonly config: LevelConfig;
    private spawnPoint: THREE.Vector3;

    constructor(scene: THREE.Scene, config?: Partial<LevelConfig>) {
        this.scene = scene;

        // Default configuration
        this.config = {
            width: 20,
            height: 20,
            wallHeight: 4,
            wallDensity: 0.15,
            spawnClearRadius: 2,
            ...config
        };

        this.spawnPoint = new THREE.Vector3(0, 2, 0);

        console.log('🗺️ Level constructor initialized');
    }

    public async generate(): Promise<void> {
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

    private generateLevelData(): void {
        // Initialize grid (0 = floor, 1 = wall)
        this.levelData = [];
        for (let x = 0; x < this.config.width; x++) {
            this.levelData[x] = [];
            for (let z = 0; z < this.config.height; z++) {
                // Create walls around the border
                if (x === 0 || x === this.config.width - 1 || z === 0 || z === this.config.height - 1) {
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

    private addRandomWalls(): void {
        if (!this.levelData) return;

        const numWalls = Math.floor((this.config.width * this.config.height) * this.config.wallDensity);

        for (let i = 0; i < numWalls; i++) {
            const x = Math.floor(Math.random() * (this.config.width - 2)) + 1;
            const z = Math.floor(Math.random() * (this.config.height - 2)) + 1;

            // Don't place walls too close to spawn
            const distanceFromSpawn = Math.sqrt((x - this.config.width/2) ** 2 + (z - this.config.height/2) ** 2);
            if (distanceFromSpawn > 3) {
                this.levelData[x][z] = 1;
            }
        }
    }

    private clearSpawnArea(): void {
        if (!this.levelData) return;

        const centerX = Math.floor(this.config.width / 2);
        const centerZ = Math.floor(this.config.height / 2);
        const clearRadius = this.config.spawnClearRadius;

        for (let x = centerX - clearRadius; x <= centerX + clearRadius; x++) {
            for (let z = centerZ - clearRadius; z <= centerZ + clearRadius; z++) {
                if (x >= 0 && x < this.config.width && z >= 0 && z < this.config.height) {
                    this.levelData[x][z] = 0;
                }
            }
        }
    }

    private createFloor(): void {
        // Create a large floor plane
        const floorGeometry = new THREE.PlaneGeometry(this.config.width * 2, this.config.height * 2);
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

    private createWalls(): void {
        if (!this.levelData) return;

        const wallGeometry = new THREE.BoxGeometry(2, this.config.wallHeight, 2);
        const wallMaterial = new THREE.MeshLambertMaterial({
            color: 0x666666
        });

        for (let x = 0; x < this.config.width; x++) {
            for (let z = 0; z < this.config.height; z++) {
                if (this.levelData[x][z] === 1) {
                    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
                    wall.position.set(
                        (x - this.config.width / 2) * 2,
                        this.config.wallHeight / 2,
                        (z - this.config.height / 2) * 2
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

    private createCeiling(): void {
        // Create a ceiling for atmosphere
        const ceilingGeometry = new THREE.PlaneGeometry(this.config.width * 2, this.config.height * 2);
        const ceilingMaterial = new THREE.MeshLambertMaterial({
            color: 0x222222,
            side: THREE.DoubleSide
        });

        const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.y = this.config.wallHeight + 1;

        this.scene.add(ceiling);
        this.geometry.push(ceiling);

        console.log('🏠 Ceiling created');
    }

    private addLevelLighting(): void {
        // Add some point lights around the level
        const numLights = 5;
        const lightColor = 0xff6600;
        const lightIntensity = 0.8;
        const lightDistance = 15;

        for (let i = 0; i < numLights; i++) {
            const light = new THREE.PointLight(lightColor, lightIntensity, lightDistance);

            // Random position within the level
            const x = (Math.random() - 0.5) * (this.config.width * 1.5);
            const z = (Math.random() - 0.5) * (this.config.height * 1.5);
            const y = this.config.wallHeight - 1;

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

    private setSpawnPoint(): void {
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

    public getSpawnPoint(): THREE.Vector3 {
        return this.spawnPoint.clone();
    }

    // Collision detection
    public checkCollision(position: THREE.Vector3, _radius: number = 0.5): boolean {
        if (!this.levelData) return true;

        const gridX = Math.floor((position.x + this.config.width) / 2);
        const gridZ = Math.floor((position.z + this.config.height) / 2);

        // Check if position is outside level bounds
        if (gridX < 0 || gridX >= this.config.width || gridZ < 0 || gridZ >= this.config.height) {
            return true;
        }

        // Check if position is inside a wall
        return this.levelData[gridX][gridZ] === 1;
    }

    // Pathfinding helpers
    public isWalkable(x: number, z: number): boolean {
        if (!this.levelData) return false;

        if (x < 0 || x >= this.config.width || z < 0 || z >= this.config.height) {
            return false;
        }
        return this.levelData[x][z] === 0;
    }

    public getRandomWalkablePosition(): THREE.Vector3 {
        let attempts = 0;
        const maxAttempts = 100;

        while (attempts < maxAttempts) {
            const x = Math.floor(Math.random() * this.config.width);
            const z = Math.floor(Math.random() * this.config.height);

            if (this.isWalkable(x, z)) {
                return new THREE.Vector3(
                    (x - this.config.width / 2) * 2,
                    2,
                    (z - this.config.height / 2) * 2
                );
            }
            attempts++;
        }

        // Fallback to spawn point
        return this.getSpawnPoint();
    }

    // Level progression
    public addEnemySpawns(): void {
        // TODO: Add enemy spawn points
        console.log('👾 Enemy spawns added (placeholder)');
    }

    public addItemSpawns(): void {
        // TODO: Add item/weapon spawn points
        console.log('📦 Item spawns added (placeholder)');
    }

    public addExitPortal(): void {
        // TODO: Add exit portal to next level
        console.log('🚪 Exit portal added (placeholder)');
    }

    // Update method for dynamic elements
    public update(_deltaTime: number): void {
        // TODO: Update dynamic level elements (moving platforms, etc.)
    }

    // Getters
    public getLevelData(): LevelData | null {
        if (!this.levelData) return null;

        const levelData: LevelData = {
            grid: this.levelData.map(row => [...row]),
            spawnPoint: this.spawnPoint.clone(),
            enemySpawns: [], // TODO: Implement
            itemSpawns: [] // TODO: Implement
        };

        // TODO: Add exitPortal when implemented
        // levelData.exitPortal = exitPortalPosition;

        return levelData;
    }

    public getConfig(): LevelConfig {
        return { ...this.config };
    }

    // Cleanup
    private clearLevel(): void {
        // Remove all existing geometry
        this.geometry.forEach(obj => {
            this.scene.remove(obj);

            // Dispose of geometries and materials
            if (obj instanceof THREE.Mesh) {
                obj.geometry?.dispose();
                if (Array.isArray(obj.material)) {
                    obj.material.forEach(mat => mat.dispose());
                } else {
                    obj.material?.dispose();
                }
            }
        });
        this.geometry = [];

        console.log('🧹 Level cleared');
    }

    public destroy(): void {
        this.clearLevel();
        console.log('🗑️ Level destroyed');
    }
}
