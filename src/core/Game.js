import * as THREE from 'three';
import { Player } from '../entities/Player.js';
import { Level } from '../levels/Level.js';
import { WeaponSystem } from '../weapons/WeaponSystem.js';

export class Game {
    constructor(inputManager, uiManager) {
        this.inputManager = inputManager;
        this.uiManager = uiManager;

        // Three.js core
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.clock = new THREE.Clock();

        // Game entities
        this.player = null;
        this.level = null;
        this.weaponSystem = null;

        // Game state
        this.isRunning = false;
        this.gameLoop = null;

        // Initialize Three.js
        this.initThreeJS();
    }

    initThreeJS() {
        console.log('🎲 Initializing Three.js...');

        // Scene
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x000000, 10, 100);

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75, // FOV
            window.innerWidth / window.innerHeight, // Aspect ratio
            0.1, // Near clipping plane
            1000 // Far clipping plane
        );

        // Renderer
        const canvas = document.getElementById('gameCanvas');
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: false // Retro look
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Lighting
        this.setupLighting();

        console.log('✅ Three.js initialized');
    }

    setupLighting() {
        // Ambient light for basic visibility
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);

        // Directional light (like sunlight)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);

        // Point light for dynamic lighting
        const pointLight = new THREE.PointLight(0xff4444, 1, 50);
        pointLight.position.set(0, 5, 0);
        this.scene.add(pointLight);
    }

    async start() {
        console.log('🎮 Starting game systems...');

        try {
            // Initialize weapon system
            this.weaponSystem = new WeaponSystem();

            // Generate level
            this.level = new Level(this.scene);
            await this.level.generate();

            // Create player
            this.player = new Player(this.camera, this.inputManager, this.weaponSystem);
            this.player.setPosition(this.level.getSpawnPoint());

            // Start game loop
            this.isRunning = true;
            this.gameLoop = this.update.bind(this);
            this.gameLoop();

            console.log('✅ Game started successfully');

        } catch (error) {
            console.error('❌ Failed to start game:', error);
            throw error;
        }
    }

    update() {
        if (!this.isRunning) return;

        const deltaTime = this.clock.getDelta();

        // Update game systems
        if (this.player) {
            this.player.update(deltaTime);
        }

        if (this.level) {
            this.level.update(deltaTime);
        }

        if (this.weaponSystem) {
            this.weaponSystem.update(deltaTime);
        }

        // Update UI
        this.updateUI();

        // Render scene
        this.renderer.render(this.scene, this.camera);

        // Continue loop
        requestAnimationFrame(this.gameLoop);
    }

    updateUI() {
        if (!this.player) return;

        // Update HUD elements
        const healthElement = document.getElementById('healthValue');
        const ammoElement = document.getElementById('ammoValue');
        const weaponElement = document.getElementById('weaponName');

        if (healthElement) {
            healthElement.textContent = Math.ceil(this.player.health);
        }

        if (ammoElement && this.player.currentWeapon) {
            const weapon = this.player.currentWeapon;
            ammoElement.textContent = `${weapon.currentAmmo}/${weapon.reserveAmmo}`;
        }

        if (weaponElement && this.player.currentWeapon) {
            weaponElement.textContent = this.player.currentWeapon.name.toUpperCase();
        }
    }

    stop() {
        console.log('⏹️ Stopping game...');
        this.isRunning = false;

        if (this.player) {
            this.player.destroy();
            this.player = null;
        }

        if (this.level) {
            this.level.destroy();
            this.level = null;
        }
    }

    handleResize() {
        if (!this.camera || !this.renderer) return;

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // Game event handlers
    onPlayerDeath() {
        console.log('💀 Player died');
        this.stop();
        this.uiManager.showGameOver();
    }

    onLevelComplete() {
        console.log('🎉 Level completed');
        // Generate next level
        this.generateNextLevel();
    }

    async generateNextLevel() {
        console.log('🗺️ Generating next level...');

        if (this.level) {
            this.level.destroy();
        }

        this.level = new Level(this.scene);
        await this.level.generate();

        // Reset player position
        if (this.player) {
            this.player.setPosition(this.level.getSpawnPoint());
        }
    }
}
