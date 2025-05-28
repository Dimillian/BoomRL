import type { WeaponTemplate, WeaponRarityData, WeaponModifier, WeaponType, WeaponRarity } from '@/types/game';
import { Weapon } from './Weapon';

export class WeaponSystem {
    private readonly weaponTemplates: Record<string, WeaponTemplate>;
    private readonly rarities: Record<WeaponRarity, WeaponRarityData>;
    private readonly modifiers: Record<string, WeaponModifier>;

    constructor() {
        this.weaponTemplates = this.initializeWeaponTemplates();
        this.rarities = this.initializeRarities();
        this.modifiers = this.initializeModifiers();

        console.log('🔫 WeaponSystem initialized');
    }

    private initializeWeaponTemplates(): Record<string, WeaponTemplate> {
        return {
            pistol: {
                name: 'Pistol',
                type: 'pistol',
                damage: 25,
                fireRate: 3, // shots per second
                reloadTime: 1.5,
                magazineSize: 12,
                accuracy: 0.9,
                range: 30,
                description: 'A reliable sidearm'
            },
            shotgun: {
                name: 'Shotgun',
                type: 'shotgun',
                damage: 80,
                fireRate: 1,
                reloadTime: 2.5,
                magazineSize: 6,
                accuracy: 0.6,
                range: 15,
                pelletsPerShot: 6,
                description: 'Devastating at close range'
            },
            assaultRifle: {
                name: 'Assault Rifle',
                type: 'assault',
                damage: 35,
                fireRate: 8,
                reloadTime: 2.0,
                magazineSize: 30,
                accuracy: 0.8,
                range: 50,
                description: 'Balanced automatic weapon'
            },
            submachineGun: {
                name: 'SMG',
                type: 'smg',
                damage: 20,
                fireRate: 12,
                reloadTime: 1.8,
                magazineSize: 25,
                accuracy: 0.7,
                range: 25,
                description: 'High rate of fire'
            },
            sniperRifle: {
                name: 'Sniper Rifle',
                type: 'sniper',
                damage: 150,
                fireRate: 0.5,
                reloadTime: 3.0,
                magazineSize: 5,
                accuracy: 0.95,
                range: 100,
                description: 'Precision long-range weapon'
            },
            plasmaRifle: {
                name: 'Plasma Rifle',
                type: 'energy',
                damage: 60,
                fireRate: 4,
                reloadTime: 2.2,
                magazineSize: 20,
                accuracy: 0.85,
                range: 60,
                description: 'Advanced energy weapon'
            }
        };
    }

    private initializeRarities(): Record<WeaponRarity, WeaponRarityData> {
        return {
            common: {
                name: 'Common',
                color: '#ffffff',
                statMultiplier: 1.0,
                chance: 0.5,
                modifierCount: 0
            },
            uncommon: {
                name: 'Uncommon',
                color: '#00ff00',
                statMultiplier: 1.15,
                chance: 0.25,
                modifierCount: 1
            },
            rare: {
                name: 'Rare',
                color: '#0080ff',
                statMultiplier: 1.35,
                chance: 0.15,
                modifierCount: 2
            },
            epic: {
                name: 'Epic',
                color: '#8000ff',
                statMultiplier: 1.6,
                chance: 0.08,
                modifierCount: 3
            },
            legendary: {
                name: 'Legendary',
                color: '#ff8000',
                statMultiplier: 2.0,
                chance: 0.02,
                modifierCount: 4
            }
        };
    }

    private initializeModifiers(): Record<string, WeaponModifier> {
        return {
            // Damage modifiers
            explosive: {
                name: 'Explosive',
                description: 'Rounds explode on impact',
                statChanges: { damage: 1.5 },
                special: 'explosion'
            },
            piercing: {
                name: 'Piercing',
                description: 'Shots penetrate targets',
                statChanges: { damage: 1.2 },
                special: 'pierce'
            },
            incendiary: {
                name: 'Incendiary',
                description: 'Sets targets on fire',
                statChanges: { damage: 1.3 },
                special: 'fire'
            },

            // Fire rate modifiers
            rapid: {
                name: 'Rapid',
                description: 'Increased fire rate',
                statChanges: { fireRate: 1.4 }
            },
            burst: {
                name: 'Burst',
                description: 'Fires in bursts',
                statChanges: { fireRate: 1.2, accuracy: 1.1 },
                special: 'burst'
            },

            // Accuracy modifiers
            precise: {
                name: 'Precise',
                description: 'Improved accuracy',
                statChanges: { accuracy: 1.3 }
            },
            stabilized: {
                name: 'Stabilized',
                description: 'Reduced recoil',
                statChanges: { accuracy: 1.2, fireRate: 1.1 }
            },

            // Reload modifiers
            quickLoad: {
                name: 'Quick-Load',
                description: 'Faster reload',
                statChanges: { reloadTime: 0.7 }
            },
            extended: {
                name: 'Extended',
                description: 'Larger magazine',
                statChanges: { magazineSize: 1.5 }
            },

            // Special modifiers
            vampiric: {
                name: 'Vampiric',
                description: 'Heals on hit',
                statChanges: { damage: 1.1 },
                special: 'lifesteal'
            },
            electric: {
                name: 'Electric',
                description: 'Chains between enemies',
                statChanges: { damage: 1.25 },
                special: 'chain'
            }
        };
    }

    // Generate a random weapon
    public generateRandomWeapon(): Weapon {
        // Select random weapon template
        const templateKeys = Object.keys(this.weaponTemplates);
        const randomTemplate = templateKeys[Math.floor(Math.random() * templateKeys.length)];
        const template = this.weaponTemplates[randomTemplate];

        // Determine rarity
        const rarity = this.rollRarity();

        // Generate weapon
        return this.createWeapon(template, rarity);
    }

    private rollRarity(): WeaponRarity {
        const roll = Math.random();
        let cumulativeChance = 0;

        for (const [rarityKey, rarity] of Object.entries(this.rarities)) {
            cumulativeChance += rarity.chance;
            if (roll <= cumulativeChance) {
                return rarityKey as WeaponRarity;
            }
        }

        return 'common'; // Fallback
    }

    private createWeapon(template: WeaponTemplate, rarityKey: WeaponRarity = 'common'): Weapon {
        const rarity = this.rarities[rarityKey];

        // Clone template stats
        const stats = { ...template };

        // Apply rarity multiplier
        stats.damage = Math.floor(stats.damage * rarity.statMultiplier);
        stats.fireRate = stats.fireRate * rarity.statMultiplier;
        stats.accuracy = Math.min(0.99, stats.accuracy * rarity.statMultiplier);
        stats.range = stats.range * rarity.statMultiplier;

        // Add random modifiers based on rarity
        const modifiers = this.rollModifiers(rarity.modifierCount);

        // Apply modifiers to stats
        modifiers.forEach(modifier => {
            Object.entries(modifier.statChanges).forEach(([stat, multiplier]) => {
                if (multiplier !== undefined && (stats as any)[stat] !== undefined) {
                    (stats as any)[stat] = Math.floor((stats as any)[stat] * multiplier);
                }
            });
        });

        // Generate weapon name
        const weaponName = this.generateWeaponName(template, rarity, modifiers);

        // Create and return weapon instance
        return new Weapon({
            ...stats,
            name: weaponName,
            rarity: rarityKey,
            modifiers: modifiers,
            template: template.type
        });
    }

    private rollModifiers(count: number): WeaponModifier[] {
        const modifiers: WeaponModifier[] = [];
        const availableModifiers = Object.keys(this.modifiers);

        for (let i = 0; i < count; i++) {
            const randomModifier = availableModifiers[Math.floor(Math.random() * availableModifiers.length)];
            const modifier = this.modifiers[randomModifier];

            // Avoid duplicate modifiers
            if (!modifiers.find(m => m.name === modifier.name)) {
                modifiers.push(modifier);
            }
        }

        return modifiers;
    }

    private generateWeaponName(template: WeaponTemplate, rarity: WeaponRarityData, modifiers: WeaponModifier[]): string {
        let name = '';

        // Add rarity prefix for higher rarities
        if (rarity.name !== 'Common') {
            name += rarity.name + ' ';
        }

        // Add modifier prefix
        if (modifiers.length > 0) {
            name += modifiers[0].name + ' ';
        }

        // Add base name
        name += template.name;

        // Add additional modifier suffix
        if (modifiers.length > 1) {
            name += ' of ' + modifiers[1].name;
        }

        return name;
    }

    // Get starting weapon for new players
    public getStartingWeapon(): Weapon {
        const pistolTemplate = this.weaponTemplates.pistol;
        return this.createWeapon(pistolTemplate, 'common');
    }

    // Get weapon by specific type and rarity
    public getWeapon(type: WeaponType, rarity: WeaponRarity = 'common'): Weapon {
        const template = Object.values(this.weaponTemplates).find(t => t.type === type);
        if (!template) {
            console.error(`Weapon type ${type} not found`);
            return this.getStartingWeapon();
        }

        return this.createWeapon(template, rarity);
    }

    // Weapon crafting/upgrading
    public upgradeWeapon(weapon: Weapon, materialCount: number): void {
        // TODO: Implement weapon upgrading system
        console.log(`🔧 Upgrading ${weapon.getName()} with ${materialCount} materials`);
    }

    // Getters
    public getWeaponTemplates(): Record<string, WeaponTemplate> {
        return { ...this.weaponTemplates };
    }

    public getRarities(): Record<WeaponRarity, WeaponRarityData> {
        return { ...this.rarities };
    }

    public getModifiers(): Record<string, WeaponModifier> {
        return { ...this.modifiers };
    }

    // Update system (for cooldowns, etc.)
    public update(_deltaTime: number): void {
        // Update any system-wide weapon mechanics
    }

    // Cleanup
    public destroy(): void {
        console.log('🧹 WeaponSystem cleaned up');
    }
}
