export class UIManager {
    constructor() {
        this.elements = {
            menu: document.getElementById('menu'),
            hud: document.getElementById('ui'),
            loading: document.getElementById('loading'),
            instructions: document.getElementById('instructions')
        };

        console.log('🖥️ UIManager initialized');
    }

    // Menu management
    showMenu() {
        this.elements.menu.classList.remove('hidden');
    }

    hideMenu() {
        this.elements.menu.classList.add('hidden');
    }

    isMenuVisible() {
        return !this.elements.menu.classList.contains('hidden');
    }

    // HUD management
    showHUD() {
        this.elements.hud.classList.remove('hidden');
    }

    hideHUD() {
        this.elements.hud.classList.add('hidden');
    }

    // Loading screen
    showLoading() {
        this.elements.loading.classList.remove('hidden');
    }

    hideLoading() {
        this.elements.loading.classList.add('hidden');
    }

    // Instructions panel
    showInstructions() {
        this.elements.instructions.classList.remove('hidden');
    }

    hideInstructions() {
        this.elements.instructions.classList.add('hidden');
    }

    // Game state displays
    showGameOver() {
        this.createGameOverScreen();
    }

    showLevelComplete() {
        this.createLevelCompleteScreen();
    }

    showUpgrades() {
        this.createUpgradeScreen();
    }

    showStats() {
        this.createStatsScreen();
    }

    // HUD updates
    updateHealth(health, maxHealth = 100) {
        const healthElement = document.getElementById('healthValue');
        if (healthElement) {
            healthElement.textContent = Math.ceil(health);

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

    updateAmmo(current, reserve) {
        const ammoElement = document.getElementById('ammoValue');
        if (ammoElement) {
            ammoElement.textContent = `${current}/${reserve}`;
        }
    }

    updateWeapon(weaponName, rarity = 'common') {
        const weaponElement = document.getElementById('weaponName');
        if (weaponElement) {
            weaponElement.textContent = weaponName.toUpperCase();

            // Color based on rarity
            const rarityColors = {
                'common': '#ffffff',
                'uncommon': '#00ff00',
                'rare': '#0080ff',
                'epic': '#8000ff',
                'legendary': '#ff8000'
            };

            weaponElement.style.color = rarityColors[rarity] || '#ffffff';
        }
    }

    // Dynamic screen creation
    createGameOverScreen() {
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
        document.getElementById('restartGame').addEventListener('click', () => {
            document.body.removeChild(gameOverDiv);
            this.triggerRestart();
        });

        document.getElementById('backToMenu').addEventListener('click', () => {
            document.body.removeChild(gameOverDiv);
            this.showMenu();
        });
    }

    createLevelCompleteScreen() {
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
        setTimeout(() => {
            if (document.getElementById('levelComplete')) {
                document.body.removeChild(levelCompleteDiv);
                this.triggerContinue();
            }
        }, 3000);

        document.getElementById('continueGame').addEventListener('click', () => {
            document.body.removeChild(levelCompleteDiv);
            this.triggerContinue();
        });
    }

    createUpgradeScreen() {
        console.log('🔧 Showing upgrade screen (placeholder)');
        // TODO: Implement upgrade screen
    }

    createStatsScreen() {
        console.log('📊 Showing stats screen (placeholder)');
        // TODO: Implement stats screen
    }

    // Event triggers
    triggerRestart() {
        document.dispatchEvent(new CustomEvent('game:restart'));
    }

    triggerContinue() {
        document.dispatchEvent(new CustomEvent('game:continue'));
    }

    // Notification system
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            border: 2px solid ${type === 'error' ? '#ff0000' : '#00ff00'};
            color: ${type === 'error' ? '#ff0000' : '#00ff00'};
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

    // Cleanup
    destroy() {
        console.log('🧹 UIManager cleaned up');
    }
}
