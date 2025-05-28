export class MathUtils {
    // Random number between min and max (inclusive)
    static randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    // Random integer between min and max (inclusive)
    static randomIntBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Clamp value between min and max
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    // Linear interpolation
    static lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    // Distance between two points
    static distance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }

    // Angle between two points
    static angleBetween(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    }

    // Convert degrees to radians
    static degToRad(degrees) {
        return degrees * (Math.PI / 180);
    }

    // Convert radians to degrees
    static radToDeg(radians) {
        return radians * (180 / Math.PI);
    }

    // Weighted random selection
    static weightedRandom(items, weights) {
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        let random = Math.random() * totalWeight;

        for (let i = 0; i < items.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                return items[i];
            }
        }

        return items[items.length - 1];
    }
}
