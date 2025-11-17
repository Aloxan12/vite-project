import { useCallback, useRef, useEffect } from 'react';
import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import {PlacesIds, HallMeta, SeatData} from '../PixiHallConfigurator';

interface UsePixiRendererProps {
    appRef: React.RefObject<PIXI.Application | null>;
    viewportRef: React.RefObject<Viewport | null>;
    places: SeatData[];
    selectedPlaces: PlacesIds;
    hoveredPlaces: PlacesIds;
    radius: number;
    meta?: HallMeta;
    categoryColors: Record<string, string>;
}

export const usePixiRenderer = ({
                                    appRef,
                                    viewportRef,
                                    places,
                                    selectedPlaces,
                                    hoveredPlaces,
                                    radius,
                                    meta,
                                    categoryColors,
                                }: UsePixiRendererProps) => {
    const seatsContainerRef = useRef<PIXI.Container | null>(null);
    const visibleSeatsCountRef = useRef<number>(0);
    const isRenderingRef = useRef<boolean>(false);

    // Create connected seats map
    const connectedSeatsMap = useRef<Map<string, boolean>>(new Map()).current;
    useEffect(() => {
        connectedSeatsMap.clear();
        if (!meta) return;

        Object.entries(meta).forEach(([sector, sectorData]) => {
            Object.entries(sectorData.rows || {}).forEach(([row, rowData]) => {
                Object.entries(rowData.seats || {}).forEach(([seatId, seatData]) => {
                    if (seatData.connectedWith?.length) {
                        connectedSeatsMap.set(`${sector}:${row}:${seatId}`, true);
                    }
                });
            });
        });
    }, [meta, connectedSeatsMap]);

    // Create lookup maps
    const selectedLookup = useRef<Map<string, boolean>>(new Map()).current;
    useEffect(() => {
        selectedLookup.clear();
        Object.keys(selectedPlaces).forEach((key) => {
            selectedLookup.set(key, true);
        });
    }, [selectedPlaces, selectedLookup]);

    const hoveredLookup = useRef<Map<string, boolean>>(new Map()).current;
    useEffect(() => {
        hoveredLookup.clear();
        Object.keys(hoveredPlaces).forEach((key) => {
            hoveredLookup.set(key, true);
        });
    }, [hoveredPlaces, hoveredLookup]);

    // Get visible seats
    const getVisibleSeats = useCallback(() => {
        if (!viewportRef.current) return places;

        const vp = viewportRef.current;
        const scale = vp.scale.x;
        const margin = Math.max(100, 50 / scale);

        const topLeft = { x: vp.left, y: vp.top };
        const bottomRight = { x: vp.right, y: vp.bottom };

        return places.filter((seat) => {
            if (!seat.coodrinates) return false;
            const x = seat.coodrinates.x;
            const y = seat.coodrinates.y;
            return (
                x >= topLeft.x - margin &&
                x <= bottomRight.x + margin &&
                y >= topLeft.y - margin &&
                y <= bottomRight.y + margin
            );
        });
    }, [places, viewportRef]);

    // Convert hex color
    const hexToColorNumber = (hex: string): number => {
        if (hex.startsWith('#')) {
            return parseInt(hex.substring(1), 16);
        }
        return parseInt(hex, 16);
    };

    // Render seats
    const renderSeats = useCallback(() => {
        if (!appRef.current || !viewportRef.current || isRenderingRef.current) {
            return;
        }

        isRenderingRef.current = true;

        const app = appRef.current;
        const vp = viewportRef.current;

        // Get or create container
        if (!seatsContainerRef.current) {
            seatsContainerRef.current = new PIXI.Container();
            vp.addChild(seatsContainerRef.current);
        }

        const container = seatsContainerRef.current;
        container.removeChildren();

        const visibleSeats = getVisibleSeats();
        visibleSeatsCountRef.current = visibleSeats.length;

        // Group by category
        const categorizedSeats: Record<string, SeatData[]> = {};
        visibleSeats.forEach((seat) => {
            const categoryId = seat.categoryId.toString();
            if (!categorizedSeats[categoryId]) {
                categorizedSeats[categoryId] = [];
            }
            categorizedSeats[categoryId].push(seat);
        });

        // Render each category
        Object.entries(categorizedSeats).forEach(([categoryId, seatsInCategory]) => {
            const colorHex = categoryColors[categoryId] || '#0FD9D9';
            const colorNumber = hexToColorNumber(colorHex);

            const graphics = new PIXI.Graphics();
            container.addChild(graphics);

            // Separate by state
            const normalSeats: SeatData[] = [];
            const connectedSeats: SeatData[] = [];
            const selectedSeats: SeatData[] = [];
            const hoveredSeats: SeatData[] = [];

            seatsInCategory.forEach((seat) => {
                const seatIdStr = seat.seatId.toString();
                const isSelected = selectedLookup.has(seatIdStr);
                const isHovered = hoveredLookup.has(seatIdStr);
                const isConnected = connectedSeatsMap.get(
                    `${seat.sector}:${seat.row}:${seatIdStr}`
                );

                if (isSelected) {
                    selectedSeats.push(seat);
                } else if (isConnected) {
                    connectedSeats.push(seat);
                } else if (isHovered) {
                    hoveredSeats.push(seat);
                } else {
                    normalSeats.push(seat);
                }
            });

            const adjustedRadius = radius;
            const strokeWidth = radius < 10 ? 1 : Math.round(radius / 10) || 1;

            // ✅ Draw normal (без обводки)
            if (normalSeats.length > 0) {
                graphics.beginFill(colorNumber);
                graphics.lineStyle(0); // ✅ Без линии
                normalSeats.forEach((seat) => {
                    if (seat.coodrinates) {
                        graphics.drawCircle(
                            seat.coodrinates.x,
                            seat.coodrinates.y,
                            adjustedRadius
                        );
                    }
                });
                graphics.endFill();
            }

            // ✅ Draw connected (серая обводка)
            if (connectedSeats.length > 0) {
                graphics.lineStyle(strokeWidth * 2, 0xcccccc, 1); // ✅ Серая обводка
                graphics.beginFill(colorNumber);
                connectedSeats.forEach((seat) => {
                    if (seat.coodrinates) {
                        graphics.drawCircle(
                            seat.coodrinates.x,
                            seat.coodrinates.y,
                            adjustedRadius
                        );
                    }
                });
                graphics.endFill();
            }

            // ✅ Draw selected (чёрная толстая обводка)
            if (selectedSeats.length > 0) {
                graphics.lineStyle(strokeWidth * 2, '#000', 0.8); // ✅ Чёрная обводка, толще
                graphics.beginFill(colorNumber);
                selectedSeats.forEach((seat) => {
                    if (seat.coodrinates) {
                        graphics.drawCircle(
                            seat.coodrinates.x,
                            seat.coodrinates.y,
                            adjustedRadius
                        );
                    }
                });
                graphics.endFill();
            }

            // ✅ Draw hovered (ярче, больше)
            if (hoveredSeats.length > 0) {
                graphics.lineStyle(strokeWidth * 2, 0xffff00, 0.8); // ✅ Жёлтая обводка
                graphics.beginFill(colorNumber, 1);
                hoveredSeats.forEach((seat) => {
                    if (seat.coodrinates) {
                        graphics.drawCircle(
                            seat.coodrinates.x,
                            seat.coodrinates.y,
                            adjustedRadius + strokeWidth * 3 // ✅ Значительно больше
                        );
                    }
                });
                graphics.endFill();
            }
        });

        isRenderingRef.current = false;
    }, [
        appRef,
        viewportRef,
        getVisibleSeats,
        radius,
        categoryColors,
        selectedLookup,
        hoveredLookup,
        connectedSeatsMap,
    ]);

    return {
        renderSeats,
        visibleSeatsCount: visibleSeatsCountRef.current,
    };
};
