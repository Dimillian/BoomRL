import type { InputState, MovementInput, GameEvent } from '@/types/game';

export class InputManager {
    private keys: Record<string, boolean> = {};
    private mouseButtons: Record<number, boolean> = {};
    private mouseDelta: { x: number; y: number } = { x: 0, y: 0 };
    private mousePosition: { x: number; y: number } = { x: 0, y: 0 };

    // Configuration
    private mouseSensitivity: number = 0.002;

    constructor() {
        this.bindEvents();
        console.log('🎮 InputManager initialized');
    }

    private bindEvents(): void {
        // Keyboard events
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            this.keys[event.code] = true;
            this.handleKeyDown(event);
        });

        document.addEventListener('keyup', (event: KeyboardEvent) => {
            this.keys[event.code] = false;
            this.handleKeyUp();
        });

        // Mouse events
        document.addEventListener('mousedown', (event: MouseEvent) => {
            this.mouseButtons[event.button] = true;
            this.handleMouseDown(event);
        });

        document.addEventListener('mouseup', (event: MouseEvent) => {
            this.mouseButtons[event.button] = false;
            this.handleMouseUp(event);
        });

        document.addEventListener('mousemove', (event: MouseEvent) => {
            this.handleMouseMove(event);
        });

        // Pointer lock events
        document.addEventListener('pointerlockchange', () => {
            this.handlePointerLockChange();
        });

        // Prevent default actions for game keys
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            // Prevent default for game controls
            const gameKeys: string[] = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyR', 'KeyE', 'Space', 'ShiftLeft'];
            if (gameKeys.includes(event.code)) {
                event.preventDefault();
            }
        });
    }

    private handleKeyDown(event: KeyboardEvent): void {
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

    private handleKeyUp(): void {
        // Handle key release actions if needed
    }

    private handleMouseDown(event: MouseEvent): void {
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

    private handleMouseUp(event: MouseEvent): void {
        // Handle mouse release actions
        switch (event.button) {
            case 2: // Right click
                this.triggerAimRelease();
                break;
        }
    }

    private handleMouseMove(event: MouseEvent): void {
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

    private handlePointerLockChange(): void {
        const isLocked = document.pointerLockElement !== null;
        console.log(isLocked ? '🔒 Pointer locked' : '🔓 Pointer unlocked');
    }

    // Input state getters
    public isKeyPressed(keyCode: string): boolean {
        return !!this.keys[keyCode];
    }

    public isMouseButtonPressed(button: number): boolean {
        return !!this.mouseButtons[button];
    }

    public getMouseDelta(): { x: number; y: number } {
        const delta = { ...this.mouseDelta };
        this.mouseDelta.x = 0;
        this.mouseDelta.y = 0;
        return delta;
    }

    public getMousePosition(): { x: number; y: number } {
        return { ...this.mousePosition };
    }

    public getInputState(): InputState {
        return {
            keys: { ...this.keys },
            mouseButtons: { ...this.mouseButtons },
            mouseDelta: { ...this.mouseDelta },
            mousePosition: { ...this.mousePosition }
        };
    }

    // Movement input helpers
    public getMovementInput(): MovementInput {
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
    private triggerShoot(): void {
        this.dispatchGameEvent('game:shoot');
    }

    private triggerReload(): void {
        this.dispatchGameEvent('game:reload');
    }

    private triggerInteract(): void {
        this.dispatchGameEvent('game:interact');
    }

    private triggerAim(): void {
        this.dispatchGameEvent('game:aimStart');
    }

    private triggerAimRelease(): void {
        this.dispatchGameEvent('game:aimEnd');
    }

    private dispatchGameEvent(eventType: GameEvent, data?: unknown): void {
        document.dispatchEvent(new CustomEvent(eventType, { detail: data }));
    }

    // Utility methods
    public setMouseSensitivity(sensitivity: number): void {
        this.mouseSensitivity = sensitivity;
    }

    public getMouseSensitivity(): number {
        return this.mouseSensitivity;
    }

    public resetMouseDelta(): void {
        this.mouseDelta.x = 0;
        this.mouseDelta.y = 0;
    }

    // Cleanup
    public destroy(): void {
        // Remove all event listeners if needed
        console.log('🧹 InputManager cleaned up');
    }
}
