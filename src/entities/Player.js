import * as THREE from 'three';

export class Player {
    constructor(camera, inputManager, weaponSystem) {
        this.camera = camera;
        this.inputManager = inputManager;
        this.weaponSystem = weaponSystem;

        // Player stats
        this.health = 100;
        this.maxHealth = 100;
        this.speed = 5;
        this.runSpeed = 8;
        this.jumpHeight = 5;

        // Position and movement
        this.position = new THREE.Vector3(0, 1.8, 0);
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.isGrounded = true;
        this.isCrouching = false;
        this.isRunning = false;

        // Camera controls
        this.pitch = 0;
        this.yaw = 0;
        this.maxPitch = Math.PI / 2 - 0.1;

        // Weapon
        this.currentWeapon = null;

        // Initialize
        this.init();

        console.log('🦸 Player initialized');
    }

    init() {
        // Set initial camera position
        this.camera.position.copy(this.position);

        // Get starting weapon
        this.currentWeapon = this.weaponSystem.getStartingWeapon();

        // Bind input events
        this.bindEvents();
    }

    bindEvents() {
        // Listen for input events
        document.addEventListener('game:shoot', () => this.shoot());
        document.addEventListener('game:reload', () => this.reload());
        document.addEventListener('game:interact', () => this.interact());
        document.addEventListener('game:aimStart', () => this.startAiming());
        document.addEventListener('game:aimEnd', () => this.stopAiming());
    }

    update(deltaTime) {
        this.handleMovement(deltaTime);
        this.handleLook(deltaTime);
        this.updateWeapon(deltaTime);
        this.updateCamera();
    }

    handleMovement(deltaTime) {
        const input = this.inputManager.getMovementInput();

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
        this.isRunning = input.run;
        const currentSpeed = this.isRunning ? this.runSpeed : this.speed;

        // Apply movement
        if (direction.length() > 0) {
            this.velocity.x = direction.x * currentSpeed;
            this.velocity.z = direction.z * currentSpeed;
        } else {
            // Apply friction when not moving
            this.velocity.x *= 0.9;
            this.velocity.z *= 0.9;
        }

        // Handle jumping
        if (input.jump && this.isGrounded) {
            this.velocity.y = this.jumpHeight;
            this.isGrounded = false;
        }

        // Apply gravity
        if (!this.isGrounded) {
            this.velocity.y -= 20 * deltaTime; // Gravity
        }

        // Handle crouching
        this.isCrouching = input.crouch;
        const targetHeight = this.isCrouching ? 1.4 : 1.8;
        this.position.y = THREE.MathUtils.lerp(this.position.y, targetHeight, 10 * deltaTime);

        // Update position
        this.position.add(this.velocity.clone().multiplyScalar(deltaTime));

        // Simple ground collision (assuming ground is at y = 0)
        if (this.position.y <= 1.8) {
            this.position.y = 1.8;
            this.velocity.y = 0;
            this.isGrounded = true;
        }
    }

    handleLook(deltaTime) {
        const mouseDelta = this.inputManager.getMouseDelta();

        // Update yaw (horizontal rotation)
        this.yaw -= mouseDelta.x;

        // Update pitch (vertical rotation)
        this.pitch -= mouseDelta.y;
        this.pitch = THREE.MathUtils.clamp(this.pitch, -this.maxPitch, this.maxPitch);

        // Apply rotations to camera
        this.camera.rotation.order = 'YXZ';
        this.camera.rotation.x = this.pitch;
        this.camera.rotation.y = this.yaw;
    }

    updateCamera() {
        // Update camera position to follow player
        this.camera.position.copy(this.position);

        // Add some camera bob when moving
        if (this.velocity.length() > 0.1) {
            const bobAmount = this.isRunning ? 0.02 : 0.01;
            const bobSpeed = this.isRunning ? 15 : 10;
            const bob = Math.sin(Date.now() * bobSpeed * 0.001) * bobAmount;
            this.camera.position.y += bob;
        }
    }

    updateWeapon(deltaTime) {
        if (this.currentWeapon) {
            this.currentWeapon.update(deltaTime);
        }
    }

    // Combat actions
    shoot() {
        if (this.currentWeapon && this.currentWeapon.canShoot()) {
            console.log(`💥 Shooting ${this.currentWeapon.name}`);
            this.currentWeapon.shoot();

            // Create muzzle flash effect
            this.createMuzzleFlash();

            // Perform raycast to check for hits
            this.performShootRaycast();
        }
    }

    reload() {
        if (this.currentWeapon && this.currentWeapon.canReload()) {
            console.log(`🔄 Reloading ${this.currentWeapon.name}`);
            this.currentWeapon.reload();
        }
    }

    interact() {
        console.log('🤝 Interacting...');
        // TODO: Implement interaction system
    }

    startAiming() {
        console.log('🎯 Started aiming');
        // TODO: Implement aiming mechanics
    }

    stopAiming() {
        console.log('🎯 Stopped aiming');
        // TODO: Implement aiming mechanics
    }

    performShootRaycast() {
        // Create raycaster from camera position and direction
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);

        // TODO: Check for intersections with enemies and environment
        // For now, just log the shot
        console.log('🔫 Raycast performed');
    }

    createMuzzleFlash() {
        // TODO: Create visual muzzle flash effect
        console.log('✨ Muzzle flash created');
    }

    // Health and damage
    takeDamage(amount) {
        this.health -= amount;
        this.health = Math.max(0, this.health);

        console.log(`💔 Player took ${amount} damage. Health: ${this.health}`);

        if (this.health <= 0) {
            this.die();
        }
    }

    heal(amount) {
        this.health += amount;
        this.health = Math.min(this.maxHealth, this.health);

        console.log(`💚 Player healed ${amount}. Health: ${this.health}`);
    }

    die() {
        console.log('💀 Player died');
        document.dispatchEvent(new CustomEvent('player:death'));
    }

    // Utility methods
    setPosition(position) {
        this.position.copy(position);
        this.camera.position.copy(position);
    }

    getPosition() {
        return this.position.clone();
    }

    getLookDirection() {
        const direction = new THREE.Vector3(0, 0, -1);
        direction.applyQuaternion(this.camera.quaternion);
        return direction;
    }

    // Weapon management
    equipWeapon(weapon) {
        if (this.currentWeapon) {
            this.currentWeapon.holster();
        }

        this.currentWeapon = weapon;
        this.currentWeapon.equip();

        console.log(`🔫 Equipped ${weapon.name}`);
    }

    // Cleanup
    destroy() {
        console.log('🧹 Player destroyed');
    }
}
