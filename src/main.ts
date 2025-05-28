import { Game } from '@core/Game';
import { InputManager } from '@core/InputManager';
import { UIManager } from '@ui/UIManager';

class BoomRL {
    private game: Game | null = null;
    private inputManager: InputManager | null = null;
    private uiManager: UIManager | null = null;
    private isRunning: boolean = false;

    constructor() {
        this.init();
    }

    private async init(): Promise<void> {
        console.log('🎮 Initializing BoomRL...');

        // Initialize UI Manager
        this.uiManager = new UIManager();

        // Initialize Input Manager
        this.inputManager = new InputManager();

        // Initialize Game
        this.game = new Game(this.inputManager, this.uiManager);

        // Setup menu interactions
        this.setupMenus();

        console.log('✅ BoomRL initialized successfully!');
    }

    private setupMenus(): void {
        const startButton = document.getElementById('startGame');
        const upgradesButton = document.getElementById('showUpgrades');
        const statsButton = document.getElementById('showStats');

        startButton?.addEventListener('click', () => {
            this.startGame();
        });

        upgradesButton?.addEventListener('click', () => {
            this.uiManager?.showUpgrades();
        });

        statsButton?.addEventListener('click', () => {
            this.uiManager?.showStats();
        });

        // ESC key to show menu
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.code === 'Escape') {
                this.toggleMenu();
            }
        });
    }

    private async startGame(): Promise<void> {
        if (this.isRunning) return;

        console.log('🚀 Starting new game...');

        this.uiManager?.hideMenu();
        this.uiManager?.showLoading();

        try {
            await this.game?.start();
            this.isRunning = true;
            this.uiManager?.hideLoading();
            this.uiManager?.showHUD();

            // Request pointer lock for FPS controls
            const canvas = document.getElementById('gameCanvas');
            canvas?.requestPointerLock();

        } catch (error) {
            console.error('❌ Failed to start game:', error);
            this.uiManager?.hideLoading();
            this.uiManager?.showMenu();
        }
    }

    private toggleMenu(): void {
        if (this.uiManager?.isMenuVisible()) {
            if (this.isRunning) {
                this.uiManager.hideMenu();
                this.uiManager.showHUD();
                const canvas = document.getElementById('gameCanvas');
                canvas?.requestPointerLock();
            }
        } else {
            this.uiManager?.showMenu();
            this.uiManager?.hideHUD();
            document.exitPointerLock();
        }
    }
}

// Initialize the game when the page loads
window.addEventListener('DOMContentLoaded', () => {
    new BoomRL();
});

// Handle window resize
window.addEventListener('resize', () => {
    // Type assertion for global game instance
    const boomRL = (window as any).boomRL;
    if (boomRL?.game) {
        boomRL.game.handleResize();
    }
});

// Prevent context menu on right click
document.addEventListener('contextmenu', (event: Event) => {
    event.preventDefault();
});

console.log('🎯 BoomRL loading...');
