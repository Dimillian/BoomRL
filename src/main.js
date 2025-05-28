import * as THREE from 'three';
import { Game } from './core/Game.js';
import { InputManager } from './core/InputManager.js';
import { UIManager } from './ui/UIManager.js';

class BoomRL {
    constructor() {
        this.game = null;
        this.inputManager = null;
        this.uiManager = null;
        this.isRunning = false;

        this.init();
    }

    async init() {
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

    setupMenus() {
        const startButton = document.getElementById('startGame');
        const upgradesButton = document.getElementById('showUpgrades');
        const statsButton = document.getElementById('showStats');

        startButton.addEventListener('click', () => {
            this.startGame();
        });

        upgradesButton.addEventListener('click', () => {
            this.uiManager.showUpgrades();
        });

        statsButton.addEventListener('click', () => {
            this.uiManager.showStats();
        });

        // ESC key to show menu
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Escape') {
                this.toggleMenu();
            }
        });
    }

    async startGame() {
        if (this.isRunning) return;

        console.log('🚀 Starting new game...');

        this.uiManager.hideMenu();
        this.uiManager.showLoading();

        try {
            await this.game.start();
            this.isRunning = true;
            this.uiManager.hideLoading();
            this.uiManager.showHUD();

            // Request pointer lock for FPS controls
            const canvas = document.getElementById('gameCanvas');
            canvas.requestPointerLock();

        } catch (error) {
            console.error('❌ Failed to start game:', error);
            this.uiManager.hideLoading();
            this.uiManager.showMenu();
        }
    }

    toggleMenu() {
        if (this.uiManager.isMenuVisible()) {
            if (this.isRunning) {
                this.uiManager.hideMenu();
                this.uiManager.showHUD();
                const canvas = document.getElementById('gameCanvas');
                canvas.requestPointerLock();
            }
        } else {
            this.uiManager.showMenu();
            this.uiManager.hideHUD();
            document.exitPointerLock();
        }
    }

    stopGame() {
        if (!this.isRunning) return;

        console.log('⏹️ Stopping game...');
        this.game.stop();
        this.isRunning = false;
        this.uiManager.hideHUD();
        this.uiManager.showMenu();
        document.exitPointerLock();
    }
}

// Initialize the game when the page loads
window.addEventListener('DOMContentLoaded', () => {
    new BoomRL();
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.boomRL && window.boomRL.game) {
        window.boomRL.game.handleResize();
    }
});

// Prevent context menu on right click
document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});

console.log('🎯 BoomRL loading...');
