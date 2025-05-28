# BoomRL - Roguelike Doom

A browser-based roguelike Doom-style first-person shooter built with **TypeScript** and Three.js. Experience fast-paced FPS action combined with roguelike progression, featuring procedural level generation, randomized weapons with rarities, and meta-progression systems.

## 🎮 Features

### Core Gameplay
- **First-Person Shooter**: Doom-style movement and shooting mechanics
- **Procedural Levels**: Every run features unique maze-like environments
- **Weapon System**: 6 weapon types with 5 rarity levels and 10+ modifiers
- **Roguelike Elements**: Permadeath, random generation, meta-progression

### Weapon System (The Fun Part!)
- **Weapon Types**: Pistol, Shotgun, Assault Rifle, SMG, Sniper Rifle, Plasma Rifle
- **Rarity System**: Common → Uncommon → Rare → Epic → Legendary
- **Modifiers**: Explosive, Piercing, Incendiary, Vampiric, Electric, and more
- **Dynamic Stats**: Damage, fire rate, reload speed, accuracy, range, magazine size
- **Procedural Names**: "Epic Explosive Assault Rifle of Piercing"

### Progression & Meta-Game
- **Resource Collection**: Scrap metal, energy cores, weapon parts
- **Persistent Upgrades**: Health, speed, damage, reload speed improvements
- **Weapon Unlocks**: Discover new weapon types through gameplay
- **Statistics Tracking**: Performance metrics and achievement system

## 🛠️ Technology Stack

- **Language**: TypeScript (strict mode enabled)
- **3D Engine**: Three.js with full type definitions
- **Build Tool**: Vite with TypeScript support
- **Audio**: Howler.js (planned)
- **Styling**: CSS3 with retro terminal aesthetic
- **Development**: ES6 modules, path aliases, comprehensive type safety

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/dimillian/BoomRL.git
cd BoomRL

# Install dependencies
npm install

# Start development server
npm run dev
```

The game will be available at `http://localhost:5173`

### Development Commands
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production (includes TypeScript checking)
npm run preview      # Preview production build
npm run type-check   # Run TypeScript type checking
npm run lint         # Run ESLint code quality checks
```

## 🎯 Controls

- **WASD** - Movement
- **Mouse** - Look around (pointer lock)
- **Left Click** - Shoot
- **R** - Reload weapon
- **E** - Interact with objects
- **ESC** - Toggle menu
- **Shift** - Run (hold)
- **Ctrl** - Crouch (hold)
- **Space** - Jump

## 📁 Project Structure

```
BoomRL/
├── src/
│   ├── main.ts              # Entry point (TypeScript)
│   ├── types/
│   │   ├── game.ts          # Comprehensive type definitions
│   │   └── modules.d.ts     # Module declarations
│   ├── core/                # Core game systems
│   │   ├── Game.js          # Main game loop and scene
│   │   └── InputManager.js  # Input handling system
│   ├── entities/            # Game entities
│   │   └── Player.js        # Player controller
│   ├── levels/              # Level generation
│   │   └── Level.js         # Procedural level generator
│   ├── weapons/             # Weapon system
│   │   ├── WeaponSystem.js  # Weapon generation and management
│   │   └── Weapon.js        # Individual weapon class
│   ├── ui/                  # User interface
│   │   └── UIManager.js     # UI state and HUD management
│   └── utils/               # Utility functions
│       └── MathUtils.js     # Mathematical helpers
├── docs/                    # Documentation
│   ├── DEVELOPMENT.md       # Technical architecture
│   └── GAME_RULES.md        # Game design document
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite build configuration
└── package.json             # Dependencies and scripts
```

## 🔧 TypeScript Migration Status

### ✅ Completed
- [x] TypeScript configuration and build setup
- [x] Comprehensive type definitions (`src/types/game.ts`)
- [x] Main entry point converted to TypeScript
- [x] Path aliases and module resolution
- [x] Development workflow with type checking

### 🔄 In Progress
- [ ] Core systems conversion (Game, InputManager, UIManager)
- [ ] Entity systems conversion (Player)
- [ ] Level generation system conversion
- [ ] Weapon system conversion

### 🎯 Benefits of TypeScript
- **Type Safety**: Catch errors at compile time
- **Better IntelliSense**: Full autocompletion for Three.js and game objects
- **Refactoring**: Safe code changes and renames
- **Documentation**: Types serve as inline documentation
- **Scalability**: Easier to maintain and extend

## 🎪 Current Development Phase

**Phase 1**: ✅ Complete - Core FPS mechanics with playable prototype
**Phase 2**: 🚧 In Progress - TypeScript conversion and enemy AI system
**Phase 3**: 📋 Planned - Meta-progression and loot systems
**Phase 4**: 📋 Planned - Audio, effects, and optimization

## 🎲 Game Design Philosophy

### Roguelike Elements
- **Procedural Generation**: Every run is unique
- **Permadeath**: Death resets progress, encouraging risk/reward decisions
- **Meta-Progression**: Permanent upgrades provide long-term goals
- **Emergent Gameplay**: Random weapons create varied strategies

### FPS Mechanics
- **Fast-Paced**: Doom-style movement with momentum
- **Weapon Variety**: Each weapon type offers different playstyles
- **Skill-Based**: Player improvement through practice and knowledge
- **Visual Feedback**: Clear hit indicators and responsive controls

## 🐛 Development & Debugging

### Console Logging System
The game uses emoji-prefixed console logs for easy debugging:
- 🎮 Game initialization and lifecycle
- 🔫 Weapon system and combat
- 🗺️ Level generation and management
- 🖥️ UI state changes
- 💥 Combat and damage events

### TypeScript Development
```bash
# Watch for TypeScript errors
npm run type-check

# Development with hot reload
npm run dev

# Check code quality
npm run lint
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Follow TypeScript coding standards (see `.cursorrules`)
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Code Standards
- Use TypeScript strict mode
- Provide explicit types for all public APIs
- Follow the existing emoji logging system
- Write clear, descriptive commit messages
- Test changes in the browser before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

- [ ] Complete TypeScript conversion
- [ ] Enemy AI and combat system
- [ ] Audio system with spatial sound
- [ ] Visual effects and particles
- [ ] Mobile touch controls
- [ ] Multiplayer support (future consideration)

---

**Ready to experience the ultimate browser-based roguelike FPS? Clone, build, and start your BoomRL adventure! 🎮🔫**
