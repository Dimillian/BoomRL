export class InputManager {
    constructor() {
        // Key states
        this.keys = {};
        this.mouseButtons = {};
        this.mouseDelta = { x: 0, y: 0 };
        this.mousePosition = { x: 0, y: 0 };

        // Mouse sensitivity
        this.mouseSensitivity = 0.002;

        // Bind event listeners
        this.bindEvents();

        console.log('🎮 InputManager initialized');
    }

    bindEvents() {
        // Keyboard events
        document.addEventListener('keydown', (event) => {
            this.keys[event.code] = true;
            this.handleKeyDown(event);
        });

        document.addEventListener('keyup', (event) => {
            this.keys[event.code] = false;
            this.handleKeyUp(event);
        });

        // Mouse events
        document.addEventListener('mousedown', (event) => {
            this.mouseButtons[event.button] = true;
            this.handleMouseDown(event);
        });

        document.addEventListener('mouseup', (event) => {
            this.mouseButtons[event.button] = false;
            this.handleMouseUp(event);
        });

        document.addEventListener('mousemove', (event) => {
            this.handleMouseMove(event);
        });

        // Pointer lock events
        document.addEventListener('pointerlockchange', () => {
            this.handlePointerLockChange();
        });

        // Prevent default actions for game keys
        document.addEventListener('keydown', (event) => {
            // Prevent default for game controls
            const gameKeys = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyR', 'KeyE', 'Space', 'ShiftLeft'];
            if (gameKeys.includes(event.code)) {
                event.preventDefault();
            }
        });
    }

    handleKeyDown(event) {
        // Handle immediate key press actions
        switch (event.code) {
            case 'KeyR':
                this.triggerReload();
                break;
            case 'KeyE':
                this.triggerInteract();
                break;
        }
    }

    handleKeyUp(event) {
        // Handle key release actions if needed
    }

    handleMouseDown(event) {
        // Handle immediate mouse press actions
        switch (event.button) {
            case 0: // Left click
                this.triggerShoot();
                break;
            case 2: // Right click
                this.triggerAim();
                break;
        }
    }

    handleMouseUp(event) {
        // Handle mouse release actions
        switch (event.button) {
            case 2: // Right click
                this.triggerAimRelease();
                break;
        }
    }

    handleMouseMove(event) {
        if (document.pointerLockElement) {
            // Use movement deltas when pointer is locked
            this.mouseDelta.x = event.movementX * this.mouseSensitivity;
            this.mouseDelta.y = event.movementY * this.mouseSensitivity;
        } else {
            // Use absolute position when pointer is not locked
            this.mousePosition.x = event.clientX;
            this.mousePosition.y = event.clientY;
        }
    }

    handlePointerLockChange() {
        const isLocked = document.pointerLockElement !== null;
        console.log(isLocked ? '🔒 Pointer locked' : '🔓 Pointer unlocked');
    }

    // Input state getters
    isKeyPressed(keyCode) {
        return !!this.keys[keyCode];
    }

    isMouseButtonPressed(button) {
        return !!this.mouseButtons[button];
    }

    getMouseDelta() {
        const delta = { ...this.mouseDelta };
        this.mouseDelta.x = 0;
        this.mouseDelta.y = 0;
        return delta;
    }

    getMousePosition() {
        return { ...this.mousePosition };
    }

    // Movement input helpers
    getMovementInput() {
        return {
            forward: this.isKeyPressed('KeyW'),
            backward: this.isKeyPressed('KeyS'),
            left: this.isKeyPressed('KeyA'),
            right: this.isKeyPressed('KeyD'),
            jump: this.isKeyPressed('Space'),
            run: this.isKeyPressed('ShiftLeft'),
            crouch: this.isKeyPressed('ControlLeft')
        };
    }

    // Action triggers (for immediate actions)
    triggerShoot() {
        document.dispatchEvent(new CustomEvent('game:shoot'));
    }

    triggerReload() {
        document.dispatchEvent(new CustomEvent('game:reload'));
    }

    triggerInteract() {
        document.dispatchEvent(new CustomEvent('game:interact'));
    }

    triggerAim() {
        document.dispatchEvent(new CustomEvent('game:aimStart'));
    }

    triggerAimRelease() {
        document.dispatchEvent(new CustomEvent('game:aimEnd'));
    }

    // Utility methods
    setMouseSensitivity(sensitivity) {
        this.mouseSensitivity = sensitivity;
    }

    resetMouseDelta() {
        this.mouseDelta.x = 0;
        this.mouseDelta.y = 0;
    }

    // Cleanup
    destroy() {
        // Remove all event listeners if needed
        console.log('🧹 InputManager cleaned up');
    }
}
