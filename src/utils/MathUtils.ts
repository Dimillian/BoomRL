import type { Vector2D, Vector3D } from '@/types/game';

export class MathUtils {
    // Random number between min and max (inclusive)
    public static randomBetween(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    // Random integer between min and max (inclusive)
    public static randomIntBetween(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Clamp value between min and max
    public static clamp(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    }

    // Linear interpolation
    public static lerp(start: number, end: number, factor: number): number {
        return start + (end - start) * factor;
    }

    // Distance between two 2D points
    public static distance(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }

    // Distance between two 2D vectors
    public static distanceVector2D(a: Vector2D, b: Vector2D): number {
        return this.distance(a.x, a.y, b.x, b.y);
    }

    // Distance between two 3D vectors
    public static distanceVector3D(a: Vector3D, b: Vector3D): number {
        return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
    }

    // Angle between two points
    public static angleBetween(x1: number, y1: number, x2: number, y2: number): number {
        return Math.atan2(y2 - y1, x2 - x1);
    }

    // Convert degrees to radians
    public static degToRad(degrees: number): number {
        return degrees * (Math.PI / 180);
    }

    // Convert radians to degrees
    public static radToDeg(radians: number): number {
        return radians * (180 / Math.PI);
    }

    // Weighted random selection
    public static weightedRandom<T>(items: T[], weights: number[]): T {
        if (items.length !== weights.length) {
            throw new Error('Items and weights arrays must have the same length');
        }

        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        if (totalWeight <= 0) {
            throw new Error('Total weight must be greater than 0');
        }

        let random = Math.random() * totalWeight;

        for (let i = 0; i < items.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                return items[i];
            }
        }

        return items[items.length - 1];
    }

    // Normalize a value from one range to another
    public static normalize(value: number, min: number, max: number): number {
        return (value - min) / (max - min);
    }

    // Map a value from one range to another
    public static map(value: number, fromMin: number, fromMax: number, toMin: number, toMax: number): number {
        const normalized = this.normalize(value, fromMin, fromMax);
        return this.lerp(toMin, toMax, normalized);
    }

    // Check if a number is approximately equal to another (for floating point comparison)
    public static approximately(a: number, b: number, epsilon: number = 0.0001): boolean {
        return Math.abs(a - b) < epsilon;
    }

    // Smooth step function (useful for easing)
    public static smoothStep(min: number, max: number, value: number): number {
        const x = this.clamp((value - min) / (max - min), 0, 1);
        return x * x * (3 - 2 * x);
    }

    // Random choice from array
    public static randomChoice<T>(array: T[]): T {
        if (array.length === 0) {
            throw new Error('Cannot choose from empty array');
        }
        return array[Math.floor(Math.random() * array.length)];
    }

    // Shuffle array in place (Fisher-Yates algorithm)
    public static shuffle<T>(array: T[]): T[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Create a shuffled copy of an array
    public static shuffled<T>(array: T[]): T[] {
        return this.shuffle([...array]);
    }

    // Round to specific number of decimal places
    public static round(value: number, decimals: number = 0): number {
        const factor = Math.pow(10, decimals);
        return Math.round(value * factor) / factor;
    }

    // Vector2D utilities
    public static vector2D = {
        create: (x: number = 0, y: number = 0): Vector2D => ({ x, y }),

        add: (a: Vector2D, b: Vector2D): Vector2D => ({ x: a.x + b.x, y: a.y + b.y }),

        subtract: (a: Vector2D, b: Vector2D): Vector2D => ({ x: a.x - b.x, y: a.y - b.y }),

        multiply: (a: Vector2D, scalar: number): Vector2D => ({ x: a.x * scalar, y: a.y * scalar }),

        magnitude: (v: Vector2D): number => Math.sqrt(v.x * v.x + v.y * v.y),

        normalize: (v: Vector2D): Vector2D => {
            const mag = MathUtils.vector2D.magnitude(v);
            return mag > 0 ? { x: v.x / mag, y: v.y / mag } : { x: 0, y: 0 };
        }
    };

    // Vector3D utilities
    public static vector3D = {
        create: (x: number = 0, y: number = 0, z: number = 0): Vector3D => ({ x, y, z }),

        add: (a: Vector3D, b: Vector3D): Vector3D => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z }),

        subtract: (a: Vector3D, b: Vector3D): Vector3D => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z }),

        multiply: (a: Vector3D, scalar: number): Vector3D => ({ x: a.x * scalar, y: a.y * scalar, z: a.z * scalar }),

        magnitude: (v: Vector3D): number => Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z),

        normalize: (v: Vector3D): Vector3D => {
            const mag = MathUtils.vector3D.magnitude(v);
            return mag > 0 ? { x: v.x / mag, y: v.y / mag, z: v.z / mag } : { x: 0, y: 0, z: 0 };
        },

        dot: (a: Vector3D, b: Vector3D): number => a.x * b.x + a.y * b.y + a.z * b.z,

        cross: (a: Vector3D, b: Vector3D): Vector3D => ({
            x: a.y * b.z - a.z * b.y,
            y: a.z * b.x - a.x * b.z,
            z: a.x * b.y - a.y * b.x
        })
    };
}
