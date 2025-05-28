import * as THREE from 'three';
import type { GameState, GameConfig } from '@/types/game';
import { Player } from '@entities/Player';
import { Level } from '@levels/Level';
import { WeaponSystem } from '@weapons/WeaponSystem';
import { InputManager } from '@core/InputManager';
import { UIManager } from '@ui/UIManager';

export class Game {
    // Core Three.js objects
    private readonly scene: THREE.Scene;
    private readonly camera: THREE.PerspectiveCamera;
    private readonly renderer: THREE.WebGLRenderer;
    private readonly clock: THREE.Clock = new THREE.Clock();

    // Game systems
    private readonly inputManager: InputManager;
    private readonly uiManager: UIManager;
    private weaponSystem: WeaponSystem | null = null;

    // Game entities
    private player: Player | null = null;
    private level: Level | null = null;

    // Game state
    private gameState: GameState;
    private gameLoop: (() => void) | null = null;

    // Configuration
    private readonly config: GameConfig;

    constructor(inputManager: InputManager, uiManager: UIManager, config?: Partial<GameConfig>) {
        this.inputManager = inputManager;
        this.uiManager = uiManager;

        // Default configuration
        this.config = {
            debug: false,
            maxFPS: 60,
            renderDistance: 100,
            ...config
        };

        // Initialize game state
        this.gameState = {
            isRunning: false,
            isPaused: false,
            currentLevel: 1,
            score: 0
        };

        // Initialize Three.js
        const { scene, camera, renderer } = this.initThreeJS();
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;

        console.log('🎮 Game initialized');
    }

    private initThreeJS(): { scene: THREE.Scene; camera: THREE.PerspectiveCamera; renderer: THREE.WebGLRenderer } {
        console.log('🎲 Initializing Three.js...');

        // Scene
        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x000000, 10, this.config.renderDistance || 100);

        // Camera
        const camera = new THREE.PerspectiveCamera(
            75, // FOV
            window.innerWidth / window.innerHeight, // Aspect ratio
            0.1, // Near clipping plane
            1000 // Far clipping plane
        );

        // Renderer
        const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        if (!canvas) {
            throw new Error('Game canvas element not found');
        }

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: false // Retro look
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Setup lighting
        this.setupLighting(scene);

        console.log('✅ Three.js initialized');

        return { scene, camera, renderer };
    }

    private setupLighting(scene: THREE.Scene): void {
        // Ambient light for basic visibility
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        scene.add(ambientLight);

        // Directional light (like sunlight)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        scene.add(directionalLight);

        // Point light for dynamic lighting
        const pointLight = new THREE.PointLight(0xff4444, 1, 50);
        pointLight.position.set(0, 5, 0);
        scene.add(pointLight);
    }

    public async start(): Promise<void> {
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

            // Setup event listeners
            this.setupEventListeners();

            // Start game loop
            this.gameState.isRunning = true;
            this.gameLoop = this.update.bind(this);
            this.gameLoop();

            console.log('✅ Game started successfully');

        } catch (error) {
            console.error('❌ Failed to start game:', error);
            throw error;
        }
    }

    private setupEventListeners(): void {
        // Player death
        document.addEventListener('player:death', () => {
            this.onPlayerDeath();
        });

        // Level complete
        document.addEventListener('level:complete', () => {
            this.onLevelComplete();
        });

        // Game restart
        document.addEventListener('game:start', () => {
            this.restart();
        });
    }

    private update(): void {
        if (!this.gameState.isRunning || this.gameState.isPaused) return;

        const deltaTime = this.clock.getDelta();

        // Cap delta time to prevent large jumps
        const maxDelta = 1 / (this.config.maxFPS || 60);
        const cappedDelta = Math.min(deltaTime, maxDelta);

        // Update game systems
        if (this.player) {
            this.player.update(cappedDelta);
        }

        if (this.level) {
            this.level.update(cappedDelta);
        }

        if (this.weaponSystem) {
            this.weaponSystem.update(cappedDelta);
        }

        // Update UI
        this.updateUI();

        // Render scene
        this.renderer.render(this.scene, this.camera);

        // Continue loop
        if (this.gameState.isRunning) {
            requestAnimationFrame(this.gameLoop!);
        }
    }

    private updateUI(): void {
        if (!this.player || !this.uiManager) return;

        // Update health
        this.uiManager.updateHealth(this.player.getHealth(), this.player.getMaxHealth());

        // Update ammo
        const currentWeapon = this.player.getCurrentWeapon();
        if (currentWeapon) {
            this.uiManager.updateAmmo(currentWeapon.getCurrentAmmo(), currentWeapon.getReserveAmmo());
            this.uiManager.updateWeapon(currentWeapon.getName(), currentWeapon.getRarity());
        }
    }

    public stop(): void {
        console.log('⏹️ Stopping game...');
        this.gameState.isRunning = false;

        if (this.player) {
            this.player.destroy();
            this.player = null;
        }

        if (this.level) {
            this.level.destroy();
            this.level = null;
        }

        if (this.weaponSystem) {
            this.weaponSystem.destroy();
            this.weaponSystem = null;
        }
    }

    public pause(): void {
        this.gameState.isPaused = true;
        console.log('⏸️ Game paused');
    }

    public resume(): void {
        this.gameState.isPaused = false;
        console.log('▶️ Game resumed');
    }

    public restart(): void {
        console.log('🔄 Restarting game...');
        this.stop();
        this.gameState = {
            isRunning: false,
            isPaused: false,
            currentLevel: 1,
            score: 0
        };
        this.start();
    }

    public handleResize(): void {
        if (!this.camera || !this.renderer) return;

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // Game event handlers
    private onPlayerDeath(): void {
        console.log('💀 Player died');
        this.stop();
        this.uiManager.showGameOver();
    }

    private onLevelComplete(): void {
        console.log('🎉 Level completed');
        this.gameState.currentLevel++;
        this.generateNextLevel();
    }

    private async generateNextLevel(): Promise<void> {
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

        this.uiManager.showNotification(`Level ${this.gameState.currentLevel} started!`, 'info');
    }

    // Getters
    public getGameState(): GameState {
        return { ...this.gameState };
    }

    public getPlayer(): Player | null {
        return this.player;
    }

    public getLevel(): Level | null {
        return this.level;
    }

    public getWeaponSystem(): WeaponSystem | null {
        return this.weaponSystem;
    }

    public getScene(): THREE.Scene {
        return this.scene;
    }

    public getCamera(): THREE.PerspectiveCamera {
        return this.camera;
    }

    public getRenderer(): THREE.WebGLRenderer {
        return this.renderer;
    }

    // Debug methods
    public setDebugMode(enabled: boolean): void {
        this.config.debug = enabled;
        console.log(`🐛 Debug mode ${enabled ? 'enabled' : 'disabled'}`);
    }

    // Cleanup
    public destroy(): void {
        console.log('🧹 Destroying game...');
        this.stop();

        // Dispose Three.js objects
        this.renderer.dispose();

        // Clear scene
        while (this.scene.children.length > 0) {
            const child = this.scene.children[0];
            this.scene.remove(child);

            // Dispose geometries and materials
            if (child instanceof THREE.Mesh) {
                child.geometry?.dispose();
                if (Array.isArray(child.material)) {
                    child.material.forEach(material => material.dispose());
                } else {
                    child.material?.dispose();
                }
            }
        }
    }
}
