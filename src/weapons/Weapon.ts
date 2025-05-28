import * as THREE from 'three';
import type { WeaponConfig, WeaponState, WeaponModifier, WeaponRarity, WeaponType, Projectile, SpecialEffect } from '@/types/game';

export class Weapon {
    // Basic properties
    private readonly name: string;
    private readonly type: WeaponType;
    private readonly rarity: WeaponRarity;
    private readonly description: string;

    // Combat stats
    private readonly damage: number;
    private readonly fireRate: number; // shots per second
    private readonly reloadTime: number; // seconds
    private readonly magazineSize: number;
    private readonly accuracy: number; // 0.0 to 1.0
    private readonly range: number;
    private readonly pelletsPerShot: number; // for shotguns

    // Current state
    private state: WeaponState;

    // Special properties
    private readonly modifiers: WeaponModifier[];
    private readonly specialEffects: SpecialEffect[];

    constructor(config: WeaponConfig) {
        // Basic properties
        this.name = config.name || 'Unknown Weapon';
        this.type = config.type || 'pistol';
        this.rarity = config.rarity || 'common';
        this.description = config.description || '';

        // Combat stats
        this.damage = config.damage || 25;
        this.fireRate = config.fireRate || 3;
        this.reloadTime = config.reloadTime || 1.5;
        this.magazineSize = config.magazineSize || 12;
        this.accuracy = config.accuracy || 0.9;
        this.range = config.range || 30;
        this.pelletsPerShot = config.pelletsPerShot || 1;

        // Initialize state
        this.state = {
            currentAmmo: this.magazineSize,
            reserveAmmo: this.magazineSize * 3, // Starting ammo
            isReloading: false,
            reloadTimer: 0,
            fireTimer: 0
        };

        // Special properties
        this.modifiers = config.modifiers || [];
        this.specialEffects = this.extractSpecialEffects();

        console.log(`🔫 Created weapon: ${this.name}`);
    }

    private extractSpecialEffects(): SpecialEffect[] {
        const effects: SpecialEffect[] = [];
        this.modifiers.forEach(modifier => {
            if (modifier.special) {
                effects.push(modifier.special);
            }
        });
        return effects;
    }

    // Core weapon actions
    public canShoot(): boolean {
        return !this.state.isReloading &&
               this.state.currentAmmo > 0 &&
               this.state.fireTimer <= 0;
    }

    public shoot(): boolean {
        if (!this.canShoot()) {
            return false;
        }

        // Consume ammo
        this.state.currentAmmo--;

        // Set fire rate timer
        this.state.fireTimer = 1 / this.fireRate;

        // Apply special effects
        this.applyShootEffects();

        console.log(`💥 ${this.name} fired! Ammo: ${this.state.currentAmmo}/${this.magazineSize}`);

        return true;
    }

    public canReload(): boolean {
        return !this.state.isReloading &&
               this.state.currentAmmo < this.magazineSize &&
               this.state.reserveAmmo > 0;
    }

    public reload(): boolean {
        if (!this.canReload()) {
            return false;
        }

        this.state.isReloading = true;
        this.state.reloadTimer = this.reloadTime;

        console.log(`🔄 Reloading ${this.name}...`);

        return true;
    }

    // Update weapon state
    public update(deltaTime: number): void {
        // Update fire rate timer
        if (this.state.fireTimer > 0) {
            this.state.fireTimer -= deltaTime;
        }

        // Update reload timer
        if (this.state.isReloading) {
            this.state.reloadTimer -= deltaTime;

            if (this.state.reloadTimer <= 0) {
                this.finishReload();
            }
        }
    }

    private finishReload(): void {
        const ammoNeeded = this.magazineSize - this.state.currentAmmo;
        const ammoToReload = Math.min(ammoNeeded, this.state.reserveAmmo);

        this.state.currentAmmo += ammoToReload;
        this.state.reserveAmmo -= ammoToReload;

        this.state.isReloading = false;
        this.state.reloadTimer = 0;

        console.log(`✅ ${this.name} reloaded! Ammo: ${this.state.currentAmmo}/${this.magazineSize}`);
    }

    // Special effect applications
    private applyShootEffects(): void {
        this.specialEffects.forEach(effect => {
            switch (effect) {
                case 'explosion':
                    this.createExplosion();
                    break;
                case 'fire':
                    this.createFireEffect();
                    break;
                case 'chain':
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

    private createExplosion(): void {
        console.log('💥 Explosive round detonated!');
        // TODO: Create explosion visual and damage area
    }

    private createFireEffect(): void {
        console.log('🔥 Incendiary round ignited!');
        // TODO: Create fire particle effect
    }

    private createElectricEffect(): void {
        console.log('⚡ Electric shot chains!');
        // TODO: Create electric chain effect
    }

    private createPierceEffect(): void {
        console.log('🎯 Piercing shot penetrates!');
        // TODO: Implement piercing damage
    }

    private applyLifesteal(): void {
        console.log('🩸 Vampiric shot heals player!');
        // TODO: Heal player on hit
    }

    private handleBurstFire(): void {
        console.log('💨 Burst fire activated!');
        // TODO: Implement burst fire mechanics
    }

    // Ammo management
    public addAmmo(amount: number): void {
        this.state.reserveAmmo += amount;
        console.log(`📦 Added ${amount} ammo to ${this.name}. Reserve: ${this.state.reserveAmmo}`);
    }

    public hasAmmo(): boolean {
        return this.state.currentAmmo > 0 || this.state.reserveAmmo > 0;
    }

    public getTotalAmmo(): number {
        return this.state.currentAmmo + this.state.reserveAmmo;
    }

    // Weapon information
    public getStats(): {
        name: string;
        type: WeaponType;
        rarity: WeaponRarity;
        damage: number;
        fireRate: number;
        reloadTime: number;
        magazineSize: number;
        accuracy: number;
        range: number;
        modifiers: string[];
        specialEffects: SpecialEffect[];
    } {
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

    public getDisplayName(): { name: string; color: string } {
        const rarityColors: Record<WeaponRarity, string> = {
            'common': '#ffffff',
            'uncommon': '#00ff00',
            'rare': '#0080ff',
            'epic': '#8000ff',
            'legendary': '#ff8000'
        };

        return {
            name: this.name,
            color: rarityColors[this.rarity]
        };
    }

    public getDescription(): string {
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
    public equip(): void {
        console.log(`🎯 Equipped ${this.name}`);
        // TODO: Add weapon model to scene if needed
    }

    public holster(): void {
        console.log(`📥 Holstered ${this.name}`);
        // TODO: Remove weapon model from scene if needed
    }

    // Calculate damage with modifiers
    public calculateDamage(): number {
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
    public createProjectile(startPosition: THREE.Vector3, direction: THREE.Vector3): Projectile[] {
        const projectiles: Projectile[] = [];

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
    public upgrade(upgradeType: 'damage' | 'fireRate' | 'accuracy' | 'magazine' | 'reload'): void {
        // Note: This mutates the weapon, which breaks immutability
        // In a real implementation, this should create a new weapon instance
        switch (upgradeType) {
            case 'damage':
                (this as any).damage = Math.floor(this.damage * 1.1);
                break;
            case 'fireRate':
                (this as any).fireRate *= 1.1;
                break;
            case 'accuracy':
                (this as any).accuracy = Math.min(0.99, this.accuracy * 1.05);
                break;
            case 'magazine':
                (this as any).magazineSize = Math.floor(this.magazineSize * 1.2);
                this.state.currentAmmo = this.magazineSize;
                break;
            case 'reload':
                (this as any).reloadTime *= 0.9;
                break;
        }

        console.log(`⬆️ Upgraded ${this.name} (${upgradeType})`);
    }

    // Getters
    public getName(): string {
        return this.name;
    }

    public getType(): WeaponType {
        return this.type;
    }

    public getRarity(): WeaponRarity {
        return this.rarity;
    }

    public getCurrentAmmo(): number {
        return this.state.currentAmmo;
    }

    public getReserveAmmo(): number {
        return this.state.reserveAmmo;
    }

    public getMagazineSize(): number {
        return this.magazineSize;
    }

    public isReloading(): boolean {
        return this.state.isReloading;
    }

    public getState(): WeaponState {
        return { ...this.state };
    }

    public getModifiers(): WeaponModifier[] {
        return [...this.modifiers];
    }

    public getSpecialEffects(): SpecialEffect[] {
        return [...this.specialEffects];
    }

    // Cleanup
    public destroy(): void {
        console.log(`🧹 Weapon ${this.name} destroyed`);
    }
}
