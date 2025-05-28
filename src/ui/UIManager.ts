import type { UIState, NotificationType, WeaponRarity, GameEvent } from '@/types/game';

interface UIElements {
    menu: HTMLElement | null;
    hud: HTMLElement | null;
    loading: HTMLElement | null;
    instructions: HTMLElement | null;
}

export class UIManager {
    private elements: UIElements;
    private state: UIState;

    constructor() {
        this.elements = {
            menu: document.getElementById('menu'),
            hud: document.getElementById('ui'),
            loading: document.getElementById('loading'),
            instructions: document.getElementById('instructions')
        };

        this.state = {
            isMenuVisible: true,
            isHUDVisible: false,
            isLoading: false,
            currentScreen: 'menu'
        };

        console.log('🖥️ UIManager initialized');
    }

    // Menu management
    public showMenu(): void {
        this.elements.menu?.classList.remove('hidden');
        this.state.isMenuVisible = true;
        this.state.currentScreen = 'menu';
    }

    public hideMenu(): void {
        this.elements.menu?.classList.add('hidden');
        this.state.isMenuVisible = false;
    }

    public isMenuVisible(): boolean {
        return this.state.isMenuVisible;
    }

    // HUD management
    public showHUD(): void {
        this.elements.hud?.classList.remove('hidden');
        this.state.isHUDVisible = true;
        this.state.currentScreen = 'game';
    }

    public hideHUD(): void {
        this.elements.hud?.classList.add('hidden');
        this.state.isHUDVisible = false;
    }

    // Loading screen
    public showLoading(): void {
        this.elements.loading?.classList.remove('hidden');
        this.state.isLoading = true;
    }

    public hideLoading(): void {
        this.elements.loading?.classList.add('hidden');
        this.state.isLoading = false;
    }

    // Instructions panel
    public showInstructions(): void {
        this.elements.instructions?.classList.remove('hidden');
    }

    public hideInstructions(): void {
        this.elements.instructions?.classList.add('hidden');
    }

    // Game state displays
    public showGameOver(): void {
        this.createGameOverScreen();
        this.state.currentScreen = 'gameOver';
    }

    public showLevelComplete(): void {
        this.createLevelCompleteScreen();
        this.state.currentScreen = 'levelComplete';
    }

    public showUpgrades(): void {
        this.createUpgradeScreen();
        this.state.currentScreen = 'upgrades';
    }

    public showStats(): void {
        this.createStatsScreen();
        this.state.currentScreen = 'stats';
    }

    // HUD updates
    public updateHealth(health: number, maxHealth: number = 100): void {
        const healthElement = document.getElementById('healthValue');
        if (healthElement) {
            healthElement.textContent = Math.ceil(health).toString();

            // Color based on health percentage
            const percentage = health / maxHealth;
            if (percentage > 0.6) {
                healthElement.style.color = '#00ff00';
            } else if (percentage > 0.3) {
                healthElement.style.color = '#ffff00';
            } else {
                healthElement.style.color = '#ff0000';
            }
        }
    }

    public updateAmmo(current: number, reserve: number): void {
        const ammoElement = document.getElementById('ammoValue');
        if (ammoElement) {
            ammoElement.textContent = `${current}/${reserve}`;
        }
    }

    public updateWeapon(weaponName: string, rarity: WeaponRarity = 'common'): void {
        const weaponElement = document.getElementById('weaponName');
        if (weaponElement) {
            weaponElement.textContent = weaponName.toUpperCase();

            // Color based on rarity
            const rarityColors: Record<WeaponRarity, string> = {
                'common': '#ffffff',
                'uncommon': '#00ff00',
                'rare': '#0080ff',
                'epic': '#8000ff',
                'legendary': '#ff8000'
            };

            weaponElement.style.color = rarityColors[rarity];
        }
    }

    // Dynamic screen creation
    private createGameOverScreen(): void {
        const gameOverDiv = document.createElement('div');
        gameOverDiv.id = 'gameOver';
        gameOverDiv.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 200;
            pointer-events: all;
        `;

        gameOverDiv.innerHTML = `
            <h1 style="font-size: 3rem; color: #ff0000; margin-bottom: 2rem; text-shadow: 0 0 20px #ff0000;">
                GAME OVER
            </h1>
            <p style="font-size: 1.2rem; margin-bottom: 2rem;">
                You have been terminated.
            </p>
            <button class="menu-button" id="restartGame">RESTART</button>
            <button class="menu-button" id="backToMenu">MAIN MENU</button>
        `;

        document.body.appendChild(gameOverDiv);

        // Add event listeners
        const restartButton = document.getElementById('restartGame');
        const menuButton = document.getElementById('backToMenu');

        restartButton?.addEventListener('click', () => {
            document.body.removeChild(gameOverDiv);
            this.triggerRestart();
        });

        menuButton?.addEventListener('click', () => {
            document.body.removeChild(gameOverDiv);
            this.showMenu();
        });
    }

    private createLevelCompleteScreen(): void {
        const levelCompleteDiv = document.createElement('div');
        levelCompleteDiv.id = 'levelComplete';
        levelCompleteDiv.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 200;
            pointer-events: all;
        `;

        levelCompleteDiv.innerHTML = `
            <h1 style="font-size: 3rem; color: #00ff00; margin-bottom: 2rem; text-shadow: 0 0 20px #00ff00;">
                LEVEL COMPLETE
            </h1>
            <p style="font-size: 1.2rem; margin-bottom: 2rem;">
                Proceeding to next level...
            </p>
            <button class="menu-button" id="continueGame">CONTINUE</button>
        `;

        document.body.appendChild(levelCompleteDiv);

        // Auto-continue after 3 seconds
        const timeoutId = setTimeout(() => {
            const element = document.getElementById('levelComplete');
            if (element) {
                document.body.removeChild(levelCompleteDiv);
                this.triggerContinue();
            }
        }, 3000);

        const continueButton = document.getElementById('continueGame');
        continueButton?.addEventListener('click', () => {
            clearTimeout(timeoutId);
            document.body.removeChild(levelCompleteDiv);
            this.triggerContinue();
        });
    }

    private createUpgradeScreen(): void {
        console.log('🔧 Showing upgrade screen (placeholder)');
        // TODO: Implement upgrade screen
    }

    private createStatsScreen(): void {
        console.log('📊 Showing stats screen (placeholder)');
        // TODO: Implement stats screen
    }

    // Event triggers
    private triggerRestart(): void {
        this.dispatchGameEvent('game:start');
    }

    private triggerContinue(): void {
        this.dispatchGameEvent('game:start');
    }

    private dispatchGameEvent(eventType: GameEvent, data?: unknown): void {
        document.dispatchEvent(new CustomEvent(eventType, { detail: data }));
    }

    // Notification system
    public showNotification(message: string, type: NotificationType = 'info', duration: number = 3000): void {
        const notification = document.createElement('div');

        const getNotificationColor = (notificationType: NotificationType): string => {
            switch (notificationType) {
                case 'error': return '#ff0000';
                case 'warning': return '#ffff00';
                case 'success': return '#00ff00';
                case 'info':
                default: return '#00ff00';
            }
        };

        const color = getNotificationColor(type);

        notification.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            border: 2px solid ${color};
            color: ${color};
            padding: 15px;
            font-size: 14px;
            z-index: 300;
            animation: slideIn 0.3s ease-out;
        `;

        notification.textContent = message;
        document.body.appendChild(notification);

        // Remove after duration
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(() => {
                    if (notification.parentNode) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }
        }, duration);
    }

    // State getters
    public getState(): UIState {
        return { ...this.state };
    }

    public getCurrentScreen(): UIState['currentScreen'] {
        return this.state.currentScreen;
    }

    // Cleanup
    public destroy(): void {
        console.log('🧹 UIManager cleaned up');
    }
}
