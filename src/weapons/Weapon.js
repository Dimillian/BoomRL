export class Weapon {
    constructor(config) {
        // Basic properties
        this.name = config.name || 'Unknown Weapon';
        this.type = config.type || 'pistol';
        this.template = config.template || 'pistol';
        this.rarity = config.rarity || 'common';
        this.description = config.description || '';

        // Combat stats
        this.damage = config.damage || 25;
        this.fireRate = config.fireRate || 3; // shots per second
        this.reloadTime = config.reloadTime || 1.5; // seconds
        this.magazineSize = config.magazineSize || 12;
        this.accuracy = config.accuracy || 0.9; // 0.0 to 1.0
        this.range = config.range || 30;
        this.pelletsPerShot = config.pelletsPerShot || 1; // for shotguns

        // Current state
        this.currentAmmo = this.magazineSize;
        this.reserveAmmo = this.magazineSize * 3; // Starting ammo
        this.isReloading = false;
        this.reloadTimer = 0;
        this.fireTimer = 0;

        // Special properties
        this.modifiers = config.modifiers || [];
        this.specialEffects = this.extractSpecialEffects();

        console.log(`🔫 Created weapon: ${this.name}`);
    }

    extractSpecialEffects() {
        const effects = [];
        this.modifiers.forEach(modifier => {
            if (modifier.special) {
                effects.push(modifier.special);
            }
        });
        return effects;
    }

    // Core weapon actions
    canShoot() {
        return !this.isReloading &&
               this.currentAmmo > 0 &&
               this.fireTimer <= 0;
    }

    shoot() {
        if (!this.canShoot()) {
            return false;
        }

        // Consume ammo
        this.currentAmmo--;

        // Set fire rate timer
        this.fireTimer = 1 / this.fireRate;

        // Apply special effects
        this.applyShootEffects();

        console.log(`💥 ${this.name} fired! Ammo: ${this.currentAmmo}/${this.magazineSize}`);

        return true;
    }

    canReload() {
        return !this.isReloading &&
               this.currentAmmo < this.magazineSize &&
               this.reserveAmmo > 0;
    }

    reload() {
        if (!this.canReload()) {
            return false;
        }

        this.isReloading = true;
        this.reloadTimer = this.reloadTime;

        console.log(`🔄 Reloading ${this.name}...`);

        return true;
    }

    // Update weapon state
    update(deltaTime) {
        // Update fire rate timer
        if (this.fireTimer > 0) {
            this.fireTimer -= deltaTime;
        }

        // Update reload timer
        if (this.isReloading) {
            this.reloadTimer -= deltaTime;

            if (this.reloadTimer <= 0) {
                this.finishReload();
            }
        }
    }

    finishReload() {
        const ammoNeeded = this.magazineSize - this.currentAmmo;
        const ammoToReload = Math.min(ammoNeeded, this.reserveAmmo);

        this.currentAmmo += ammoToReload;
        this.reserveAmmo -= ammoToReload;

        this.isReloading = false;
        this.reloadTimer = 0;

        console.log(`✅ ${this.name} reloaded! Ammo: ${this.currentAmmo}/${this.magazineSize}`);
    }

    // Special effect applications
    applyShootEffects() {
        this.specialEffects.forEach(effect => {
            switch (effect) {
                case 'explosion':
                    this.createExplosion();
                    break;
                case 'fire':
                    this.createFireEffect();
                    break;
                case 'electric':
                    this.createElectricEffect();
                    break;
                case 'pierce':
                    this.createPierceEffect();
                    break;
                case 'lifesteal':
                    this.applyLifesteal();
                    break;
                case 'burst':
                    this.handleBurstFire();
                    break;
            }
        });
    }

    createExplosion() {
        console.log('💥 Explosive round detonated!');
        // TODO: Create explosion visual and damage area
    }

    createFireEffect() {
        console.log('🔥 Incendiary round ignited!');
        // TODO: Create fire particle effect
    }

    createElectricEffect() {
        console.log('⚡ Electric shot chains!');
        // TODO: Create electric chain effect
    }

    createPierceEffect() {
        console.log('🎯 Piercing shot penetrates!');
        // TODO: Implement piercing damage
    }

    applyLifesteal() {
        console.log('🩸 Vampiric shot heals player!');
        // TODO: Heal player on hit
    }

    handleBurstFire() {
        console.log('💨 Burst fire activated!');
        // TODO: Implement burst fire mechanics
    }

    // Ammo management
    addAmmo(amount) {
        this.reserveAmmo += amount;
        console.log(`📦 Added ${amount} ammo to ${this.name}. Reserve: ${this.reserveAmmo}`);
    }

    hasAmmo() {
        return this.currentAmmo > 0 || this.reserveAmmo > 0;
    }

    getTotalAmmo() {
        return this.currentAmmo + this.reserveAmmo;
    }

    // Weapon information
    getStats() {
        return {
            name: this.name,
            type: this.type,
            rarity: this.rarity,
            damage: this.damage,
            fireRate: this.fireRate,
            reloadTime: this.reloadTime,
            magazineSize: this.magazineSize,
            accuracy: this.accuracy,
            range: this.range,
            modifiers: this.modifiers.map(m => m.name),
            specialEffects: this.specialEffects
        };
    }

    getDisplayName() {
        const rarityColors = {
            'common': '#ffffff',
            'uncommon': '#00ff00',
            'rare': '#0080ff',
            'epic': '#8000ff',
            'legendary': '#ff8000'
        };

        return {
            name: this.name,
            color: rarityColors[this.rarity] || '#ffffff'
        };
    }

    getDescription() {
        let desc = this.description;

        if (this.modifiers.length > 0) {
            desc += '\n\nModifiers:';
            this.modifiers.forEach(modifier => {
                desc += `\n• ${modifier.name}: ${modifier.description}`;
            });
        }

        return desc;
    }

    // Weapon actions for player
    equip() {
        console.log(`🎯 Equipped ${this.name}`);
        // TODO: Add weapon model to scene if needed
    }

    holster() {
        console.log(`📥 Holstered ${this.name}`);
        // TODO: Remove weapon model from scene if needed
    }

    // Calculate damage with modifiers
    calculateDamage() {
        let finalDamage = this.damage;

        // Apply accuracy-based damage variation
        const accuracyVariation = (Math.random() - 0.5) * (1 - this.accuracy) * 0.5;
        finalDamage *= (1 + accuracyVariation);

        // Apply special damage bonuses
        if (this.specialEffects.includes('explosion')) {
            finalDamage *= 1.5;
        }

        if (this.specialEffects.includes('fire')) {
            finalDamage *= 1.3;
        }

        return Math.floor(finalDamage);
    }

    // Create projectile data for rendering
    createProjectile(startPosition, direction) {
        const projectiles = [];

        for (let i = 0; i < this.pelletsPerShot; i++) {
            // Add accuracy spread
            const spread = (1 - this.accuracy) * 0.1;
            const spreadX = (Math.random() - 0.5) * spread;
            const spreadY = (Math.random() - 0.5) * spread;
            const spreadZ = (Math.random() - 0.5) * spread;

            const adjustedDirection = direction.clone();
            adjustedDirection.x += spreadX;
            adjustedDirection.y += spreadY;
            adjustedDirection.z += spreadZ;
            adjustedDirection.normalize();

            projectiles.push({
                position: startPosition.clone(),
                direction: adjustedDirection,
                damage: this.calculateDamage(),
                range: this.range,
                specialEffects: this.specialEffects
            });
        }

        return projectiles;
    }

    // Upgrade weapon (for future meta-progression)
    upgrade(upgradeType) {
        switch (upgradeType) {
            case 'damage':
                this.damage = Math.floor(this.damage * 1.1);
                break;
            case 'fireRate':
                this.fireRate *= 1.1;
                break;
            case 'accuracy':
                this.accuracy = Math.min(0.99, this.accuracy * 1.05);
                break;
            case 'magazine':
                this.magazineSize = Math.floor(this.magazineSize * 1.2);
                this.currentAmmo = this.magazineSize;
                break;
            case 'reload':
                this.reloadTime *= 0.9;
                break;
        }

        console.log(`⬆️ Upgraded ${this.name} (${upgradeType})`);
    }
}
