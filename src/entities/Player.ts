import * as THREE from 'three';
import type { PlayerStats, PlayerState, MovementInput, GameEvent } from '@/types/game';
import type { InputManager } from '@core/InputManager';
import type { WeaponSystem } from '@weapons/WeaponSystem';
import type { Weapon } from '@weapons/Weapon';

export class Player {
    // Core dependencies
    private readonly camera: THREE.PerspectiveCamera;
    private readonly inputManager: InputManager;
    private readonly weaponSystem: WeaponSystem;

    // Player stats
    private stats: PlayerStats;
    private state: PlayerState;

    // Camera control
    private readonly maxPitch: number = Math.PI / 2 - 0.1;

    // Weapon
    private currentWeapon: Weapon | null = null;

    constructor(camera: THREE.PerspectiveCamera, inputManager: InputManager, weaponSystem: WeaponSystem) {
        this.camera = camera;
        this.inputManager = inputManager;
        this.weaponSystem = weaponSystem;

        // Initialize player stats
        this.stats = {
            health: 100,
            maxHealth: 100,
            speed: 5,
            runSpeed: 8,
            jumpHeight: 5
        };

        // Initialize player state
        this.state = {
            position: new THREE.Vector3(0, 1.8, 0),
            velocity: new THREE.Vector3(0, 0, 0),
            isGrounded: true,
            isCrouching: false,
            isRunning: false,
            pitch: 0,
            yaw: 0
        };

        this.init();
        console.log('🦸 Player initialized');
    }

    private init(): void {
        // Set initial camera position
        this.camera.position.copy(this.state.position);

        // Get starting weapon
        this.currentWeapon = this.weaponSystem.getStartingWeapon();

        // Bind input events
        this.bindEvents();
    }

    private bindEvents(): void {
        // Listen for input events
        document.addEventListener('game:shoot', () => this.shoot());
        document.addEventListener('game:reload', () => this.reload());
        document.addEventListener('game:interact', () => this.interact());
        document.addEventListener('game:aimStart', () => this.startAiming());
        document.addEventListener('game:aimEnd', () => this.stopAiming());
    }

    public update(deltaTime: number): void {
        this.handleMovement(deltaTime);
        this.handleLook();
        this.updateWeapon(deltaTime);
        this.updateCamera();
    }

    private handleMovement(deltaTime: number): void {
        const input: MovementInput = this.inputManager.getMovementInput();

        // Calculate movement direction
        const direction = new THREE.Vector3();

        if (input.forward) direction.z -= 1;
        if (input.backward) direction.z += 1;
        if (input.left) direction.x -= 1;
        if (input.right) direction.x += 1;

        // Normalize direction to prevent faster diagonal movement
        direction.normalize();

        // Apply camera rotation to movement direction
        direction.applyQuaternion(this.camera.quaternion);
        direction.y = 0; // Keep movement on horizontal plane
        direction.normalize();

        // Determine speed
        this.state.isRunning = input.run;
        const currentSpeed = this.state.isRunning ? this.stats.runSpeed : this.stats.speed;

        // Apply movement
        if (direction.length() > 0) {
            this.state.velocity.x = direction.x * currentSpeed;
            this.state.velocity.z = direction.z * currentSpeed;
        } else {
            // Apply friction when not moving
            this.state.velocity.x *= 0.9;
            this.state.velocity.z *= 0.9;
        }

        // Handle jumping
        if (input.jump && this.state.isGrounded) {
            this.state.velocity.y = this.stats.jumpHeight;
            this.state.isGrounded = false;
        }

        // Apply gravity
        if (!this.state.isGrounded) {
            this.state.velocity.y -= 20 * deltaTime; // Gravity
        }

        // Handle crouching
        this.state.isCrouching = input.crouch;
        const targetHeight = this.state.isCrouching ? 1.4 : 1.8;
        this.state.position.y = THREE.MathUtils.lerp(this.state.position.y, targetHeight, 10 * deltaTime);

        // Update position
        this.state.position.add(this.state.velocity.clone().multiplyScalar(deltaTime));

        // Simple ground collision (assuming ground is at y = 0)
        if (this.state.position.y <= 1.8) {
            this.state.position.y = 1.8;
            this.state.velocity.y = 0;
            this.state.isGrounded = true;
        }
    }

    private handleLook(): void {
        const mouseDelta = this.inputManager.getMouseDelta();

        // Update yaw (horizontal rotation)
        this.state.yaw -= mouseDelta.x;

        // Update pitch (vertical rotation)
        this.state.pitch -= mouseDelta.y;
        this.state.pitch = THREE.MathUtils.clamp(this.state.pitch, -this.maxPitch, this.maxPitch);

        // Apply rotations to camera
        this.camera.rotation.order = 'YXZ';
        this.camera.rotation.x = this.state.pitch;
        this.camera.rotation.y = this.state.yaw;
    }

    private updateCamera(): void {
        // Update camera position to follow player
        this.camera.position.copy(this.state.position);

        // Add some camera bob when moving
        if (this.state.velocity.length() > 0.1) {
            const bobAmount = this.state.isRunning ? 0.02 : 0.01;
            const bobSpeed = this.state.isRunning ? 15 : 10;
            const bob = Math.sin(Date.now() * bobSpeed * 0.001) * bobAmount;
            this.camera.position.y += bob;
        }
    }

    private updateWeapon(deltaTime: number): void {
        if (this.currentWeapon) {
            this.currentWeapon.update(deltaTime);
        }
    }

    // Combat actions
    private shoot(): void {
        if (this.currentWeapon && this.currentWeapon.canShoot()) {
            console.log(`💥 Shooting ${this.currentWeapon.getName()}`);
            this.currentWeapon.shoot();

            // Create muzzle flash effect
            this.createMuzzleFlash();

            // Perform raycast to check for hits
            this.performShootRaycast();
        }
    }

    private reload(): void {
        if (this.currentWeapon && this.currentWeapon.canReload()) {
            console.log(`🔄 Reloading ${this.currentWeapon.getName()}`);
            this.currentWeapon.reload();
        }
    }

    private interact(): void {
        console.log('🤝 Interacting...');
        // TODO: Implement interaction system
    }

    private startAiming(): void {
        console.log('🎯 Started aiming');
        // TODO: Implement aiming mechanics
    }

    private stopAiming(): void {
        console.log('🎯 Stopped aiming');
        // TODO: Implement aiming mechanics
    }

    private performShootRaycast(): void {
        // Create raycaster from camera position and direction
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);

        // TODO: Check for intersections with enemies and environment
        // For now, just log the shot
        console.log('🔫 Raycast performed');
    }

    private createMuzzleFlash(): void {
        // TODO: Create visual muzzle flash effect
        console.log('✨ Muzzle flash created');
    }

    // Health and damage
    public takeDamage(amount: number): void {
        this.stats.health -= amount;
        this.stats.health = Math.max(0, this.stats.health);

        console.log(`💔 Player took ${amount} damage. Health: ${this.stats.health}`);

        if (this.stats.health <= 0) {
            this.die();
        }
    }

    public heal(amount: number): void {
        this.stats.health += amount;
        this.stats.health = Math.min(this.stats.maxHealth, this.stats.health);

        console.log(`💚 Player healed ${amount}. Health: ${this.stats.health}`);
    }

    private die(): void {
        console.log('💀 Player died');
        this.dispatchGameEvent('player:death');
    }

    // Utility methods
    public setPosition(position: THREE.Vector3): void {
        this.state.position.copy(position);
        this.camera.position.copy(position);
    }

    public getPosition(): THREE.Vector3 {
        return this.state.position.clone();
    }

    public getLookDirection(): THREE.Vector3 {
        const direction = new THREE.Vector3(0, 0, -1);
        direction.applyQuaternion(this.camera.quaternion);
        return direction;
    }

    // Weapon management
    public equipWeapon(weapon: Weapon): void {
        if (this.currentWeapon) {
            this.currentWeapon.holster();
        }

        this.currentWeapon = weapon;
        this.currentWeapon.equip();

        console.log(`🔫 Equipped ${weapon.getName()}`);
    }

    // Getters
    public getHealth(): number {
        return this.stats.health;
    }

    public getMaxHealth(): number {
        return this.stats.maxHealth;
    }

    public getCurrentWeapon(): Weapon | null {
        return this.currentWeapon;
    }

    public getStats(): PlayerStats {
        return { ...this.stats };
    }

    public getState(): PlayerState {
        return {
            position: this.state.position.clone(),
            velocity: this.state.velocity.clone(),
            isGrounded: this.state.isGrounded,
            isCrouching: this.state.isCrouching,
            isRunning: this.state.isRunning,
            pitch: this.state.pitch,
            yaw: this.state.yaw
        };
    }

    // Event dispatch
    private dispatchGameEvent(eventType: GameEvent, data?: unknown): void {
        document.dispatchEvent(new CustomEvent(eventType, { detail: data }));
    }

    // Cleanup
    public destroy(): void {
        console.log('🧹 Player destroyed');
    }
}
