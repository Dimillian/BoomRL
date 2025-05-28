# BoomRL 🎮💥

A browser-based roguelike Doom-style shooter with retro graphics, procedural generation, and meta-progression.

## 🎯 Game Concept

BoomRL combines the fast-paced action of classic Doom with roguelike mechanics, creating an infinitely replayable experience in your browser. Fight through procedurally generated levels, collect epic weapons, and use meta-progression to become stronger with each run.

## 🚀 Features

### Core Gameplay
- **Doom-style Combat**: Fast-paced first-person shooter mechanics
- **Retro Graphics**: Classic 90s aesthetic with modern browser technology
- **Procedural Generation**: Every level is unique with randomized layouts
- **Progressive Difficulty**: Each level increases challenge and rewards

### Roguelike Elements
- **Meta-progression**: Collect resources to unlock permanent upgrades
- **Random Loot**: Discover weapons and powerups with varying rarities
- **Permadeath**: Each run is a fresh start with accumulated upgrades
- **Risk/Reward**: Push deeper for better loot but higher danger

### Weapon System
- **Weapon Tiers**: Common, Rare, Epic, Legendary weapons
- **Random Stats**: Damage, fire rate, reload speed, and special effects
- **Doom-inspired Arsenal**: Shotguns, assault rifles, plasma weapons, and more
- **Weapon Modifications**: Random enchantments and special properties

### Progression Systems
- **Run Resources**: Collect scrap, energy cores, and weapon parts
- **Permanent Upgrades**: Health, speed, damage, reload speed
- **Unlock System**: New weapons, abilities, and starting loadouts
- **Achievement System**: Challenges that reward progression currency

## 🛠️ Technology Stack

- **Engine**: Three.js for 3D graphics
- **Audio**: Web Audio API / Howler.js
- **Build Tool**: Vite for fast development
- **Language**: JavaScript (ES6+)
- **Styling**: CSS3 with modern features
- **Deployment**: GitHub Pages ready

## 🏃‍♂️ Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/BoomRL.git
   cd BoomRL
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

## 🎮 Controls

- **WASD**: Move
- **Mouse**: Look around
- **Left Click**: Shoot
- **R**: Reload
- **E**: Interact/Pickup
- **Tab**: Inventory/Stats
- **Escape**: Pause menu

## 🏗️ Project Structure

```
BoomRL/
├── src/
│   ├── core/           # Core game systems
│   ├── entities/       # Player, enemies, items
│   ├── levels/         # Level generation
│   ├── weapons/        # Weapon system
│   ├── audio/          # Sound management
│   ├── ui/             # User interface
│   └── utils/          # Utility functions
├── assets/
│   ├── models/         # 3D models
│   ├── textures/       # Image assets
│   ├── audio/          # Sound effects & music
│   └── sprites/        # 2D UI elements
├── public/             # Static assets
└── docs/               # Documentation
```

## 🎨 Art Style

- **Low-poly 3D models** with pixel-perfect textures
- **Retro color palette** with high contrast
- **Sprite-based UI** elements
- **Particle effects** for impacts and explosions
- **Dynamic lighting** for atmosphere

## 🔮 Roadmap

### Phase 1: Core Foundation ✅
- [x] Project setup and basic Three.js scene
- [x] Player movement and camera controls
- [x] Basic shooting mechanics
- [x] Simple level geometry

### Phase 2: Game Mechanics
- [ ] Enemy AI and combat
- [ ] Weapon system with random generation
- [ ] Health and damage system
- [ ] Basic UI and HUD

### Phase 3: Roguelike Features
- [ ] Procedural level generation
- [ ] Loot system and item rarities
- [ ] Meta-progression and upgrades
- [ ] Save system for progression

### Phase 4: Polish & Enhancement
- [ ] Audio system and sound effects
- [ ] Particle effects and visual polish
- [ ] Performance optimization
- [ ] Mobile controls support

### Phase 5: Advanced Features
- [ ] Character classes
- [ ] Boss encounters
- [ ] Leaderboards
- [ ] Social features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by classic Doom and modern roguelike games
- Three.js community for excellent documentation
- Retro gaming community for inspiration

---

**Start your browser, lock and load! 🔫**
