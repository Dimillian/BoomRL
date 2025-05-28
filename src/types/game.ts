import * as THREE from 'three';

// =============================================================================
// Core Game Types
// =============================================================================

export interface GameConfig {
  debug?: boolean;
  maxFPS?: number;
  renderDistance?: number;
}

export interface GameState {
  isRunning: boolean;
  isPaused: boolean;
  currentLevel: number;
  score: number;
}

// =============================================================================
// Player Types
// =============================================================================

export interface PlayerStats {
  health: number;
  maxHealth: number;
  speed: number;
  runSpeed: number;
  jumpHeight: number;
}

export interface PlayerState {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  isGrounded: boolean;
  isCrouching: boolean;
  isRunning: boolean;
  pitch: number;
  yaw: number;
}

export interface MovementInput {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  run: boolean;
  crouch: boolean;
}

// =============================================================================
// Weapon System Types
// =============================================================================

export type WeaponType = 'pistol' | 'shotgun' | 'assault' | 'smg' | 'sniper' | 'energy';
export type WeaponRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type SpecialEffect = 'explosion' | 'pierce' | 'fire' | 'chain' | 'lifesteal' | 'burst';

export interface WeaponTemplate {
  name: string;
  type: WeaponType;
  damage: number;
  fireRate: number;
  reloadTime: number;
  magazineSize: number;
  accuracy: number;
  range: number;
  pelletsPerShot?: number;
  description: string;
}

export interface WeaponRarityData {
  name: string;
  color: string;
  statMultiplier: number;
  chance: number;
  modifierCount: number;
}

export interface WeaponModifier {
  name: string;
  description: string;
  statChanges: Partial<Record<keyof WeaponStats, number>>;
  special?: SpecialEffect;
}

export interface WeaponStats {
  damage: number;
  fireRate: number;
  reloadTime: number;
  magazineSize: number;
  accuracy: number;
  range: number;
  pelletsPerShot?: number;
}

export interface WeaponConfig extends WeaponStats {
  name: string;
  type: WeaponType;
  template: WeaponType;
  rarity: WeaponRarity;
  description: string;
  modifiers: WeaponModifier[];
}

export interface WeaponState {
  currentAmmo: number;
  reserveAmmo: number;
  isReloading: boolean;
  reloadTimer: number;
  fireTimer: number;
}

export interface Projectile {
  position: THREE.Vector3;
  direction: THREE.Vector3;
  damage: number;
  range: number;
  specialEffects: SpecialEffect[];
}

// =============================================================================
// Level System Types
// =============================================================================

export type CellType = 0 | 1; // 0 = floor, 1 = wall

export interface LevelConfig {
  width: number;
  height: number;
  wallHeight: number;
  wallDensity: number;
  spawnClearRadius: number;
}

export interface LevelData {
  grid: CellType[][];
  spawnPoint: THREE.Vector3;
  enemySpawns: THREE.Vector3[];
  itemSpawns: THREE.Vector3[];
  exitPortal?: THREE.Vector3;
}

export interface LevelGeometry {
  floor: THREE.Mesh;
  walls: THREE.Mesh[];
  ceiling: THREE.Mesh;
  lights: THREE.Light[];
}

// =============================================================================
// Enemy System Types (for future implementation)
// =============================================================================

export type EnemyType = 'zombie' | 'demon' | 'elite' | 'boss';

export interface EnemyStats {
  health: number;
  maxHealth: number;
  damage: number;
  speed: number;
  attackRange: number;
  attackCooldown: number;
}

export interface EnemyConfig {
  type: EnemyType;
  stats: EnemyStats;
  model?: string;
  ai: AIBehavior;
}

export type AIBehavior = 'patrol' | 'chase' | 'guard' | 'ranged';

export interface EnemyState {
  position: THREE.Vector3;
  health: number;
  target?: THREE.Vector3;
  lastAttack: number;
  behavior: AIBehavior;
}

// =============================================================================
// UI System Types
// =============================================================================

export interface HUDElements {
  health: HTMLElement | null;
  ammo: HTMLElement | null;
  weapon: HTMLElement | null;
  crosshair: HTMLElement | null;
}

export interface UIState {
  isMenuVisible: boolean;
  isHUDVisible: boolean;
  isLoading: boolean;
  currentScreen: 'menu' | 'game' | 'gameOver' | 'levelComplete' | 'upgrades' | 'stats';
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  message: string;
  type: NotificationType;
  duration: number;
}

// =============================================================================
// Input System Types
// =============================================================================

export interface InputState {
  keys: Record<string, boolean>;
  mouseButtons: Record<number, boolean>;
  mouseDelta: { x: number; y: number };
  mousePosition: { x: number; y: number };
}

export interface InputConfig {
  mouseSensitivity: number;
  invertY: boolean;
  keyBindings: Record<string, string>;
}

// =============================================================================
// Meta-Progression Types (for future implementation)
// =============================================================================

export type CurrencyType = 'scrap' | 'energy' | 'parts';

export interface Currency {
  scrap: number;
  energy: number;
  parts: number;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: Partial<Currency>;
  effect: UpgradeEffect;
  maxLevel: number;
  currentLevel: number;
}

export interface UpgradeEffect {
  type: 'health' | 'speed' | 'damage' | 'reload' | 'starting-weapon';
  value: number;
  isPercentage: boolean;
}

export interface PlayerProgression {
  level: number;
  experience: number;
  currency: Currency;
  upgrades: Record<string, Upgrade>;
  unlockedWeapons: WeaponType[];
  statistics: GameStatistics;
}

export interface GameStatistics {
  totalRuns: number;
  bestLevel: number;
  totalKills: number;
  totalShots: number;
  totalDamage: number;
  totalPlayTime: number;
  weaponUsage: Record<WeaponType, number>;
}

// =============================================================================
// Event System Types
// =============================================================================

export type GameEvent =
  | 'game:start'
  | 'game:pause'
  | 'game:resume'
  | 'game:stop'
  | 'game:shoot'
  | 'game:reload'
  | 'game:interact'
  | 'game:aimStart'
  | 'game:aimEnd'
  | 'player:death'
  | 'player:levelUp'
  | 'level:complete'
  | 'level:generate'
  | 'enemy:spawn'
  | 'enemy:death'
  | 'weapon:pickup'
  | 'weapon:upgrade';

export interface GameEventData {
  timestamp: number;
  source?: string;
  data?: unknown;
}

// =============================================================================
// Utility Types
// =============================================================================

export interface Vector2D {
  x: number;
  y: number;
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface Bounds {
  min: Vector3D;
  max: Vector3D;
}

export interface Ray {
  origin: THREE.Vector3;
  direction: THREE.Vector3;
}

export interface RaycastHit {
  point: THREE.Vector3;
  normal: THREE.Vector3;
  distance: number;
  object: THREE.Object3D;
}

// =============================================================================
// Configuration Types
// =============================================================================

export interface BoomRLConfig {
  game: GameConfig;
  graphics: GraphicsConfig;
  audio: AudioConfig;
  input: InputConfig;
  debug: DebugConfig;
}

export interface GraphicsConfig {
  renderScale: number;
  shadowMapSize: number;
  antialias: boolean;
  vsync: boolean;
  maxLights: number;
}

export interface AudioConfig {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  uiVolume: number;
}

export interface DebugConfig {
  showFPS: boolean;
  showColliders: boolean;
  showLightHelpers: boolean;
  godMode: boolean;
  infiniteAmmo: boolean;
}
