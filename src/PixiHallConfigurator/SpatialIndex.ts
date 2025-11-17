import {SeatData} from "./PixiHallConfigurator.tsx";

export class SpatialIndex {
    private grid: Map<string, any[]> = new Map();
    private cellSize = 50;

    buildIndex(places: SeatData[]) {
        this.grid.clear();
        places.forEach((place) => {
            if (place.coodrinates) {
                const key = this.getCellKey(place.coodrinates.x, place.coodrinates.y);
                if (!this.grid.has(key)) {
                    this.grid.set(key, []);
                }
                this.grid.get(key)!.push(place);
            }
        });
    }

    findNearest(x: number, y: number, radius: number):null | SeatData {
        // const cellKey = this.getCellKey(x, y);
        const neighbors = this.getNearbyCells(x, y, radius);
        let nearest: null | SeatData = null;
        let minDist = radius * radius;

        neighbors.forEach((key) => {
            const places = this.grid.get(key) || [];
            places.forEach((place) => {
                if (place.coodrinates) {
                    const dx = place.coodrinates.x - x;
                    const dy = place.coodrinates.y - y;
                    const dist = dx * dx + dy * dy;
                    if (dist < minDist) {
                        minDist = dist;
                        nearest = place;
                    }
                }
            });
        });

        return nearest;
    }

    private getCellKey(x: number, y: number): string {
        return `${Math.floor(x / this.cellSize)},${Math.floor(y / this.cellSize)}`;
    }

    private getNearbyCells(x: number, y: number, radius: number): string[] {
        const cells: string[] = [];
        const cellRadius = Math.ceil(radius / this.cellSize);
        const centerCell = this.getCellKey(x, y);
        const [cx, cy] = centerCell.split(',').map(Number);

        for (let i = cx - cellRadius; i <= cx + cellRadius; i++) {
            for (let j = cy - cellRadius; j <= cy + cellRadius; j++) {
                cells.push(`${i},${j}`);
            }
        }

        return cells;
    }

    clearCache() {
        // Optional: add caching logic if needed
    }
}
