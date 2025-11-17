import { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { SpatialIndex } from '../SpatialIndex';
import { SeatData } from '../PixiHallConfigurator';
import {debounce} from "../../otherHooks/debounce.ts";

interface UsePixiInteractionProps {
    appRef: React.RefObject<PIXI.Application | null>;
    viewportRef: React.RefObject<Viewport | null>;
    spatialIndexRef: React.RefObject<SpatialIndex>;
    onSeatClick?: (value: SeatData) => void;
    onSeatHover?: (value: SeatData) => void;
    onSeatLeave?: () => void;
    activeTab: 'seat' | 'row' | 'sect';
    radius: number;
    setTooltipData: React.Dispatch<React.SetStateAction<{ x: number; y: number; text: string } | null>>;
}

export const usePixiInteraction = ({
                                       appRef,
                                       viewportRef,
                                       spatialIndexRef,
                                       onSeatClick,
                                       onSeatHover,
                                       onSeatLeave,
                                       activeTab,
                                       radius,
                                       setTooltipData,
                                   }: UsePixiInteractionProps) => {
    const lastHoveredSeatRef = useRef<string | null>(null);
    const debouncedHoverRef = useRef<ReturnType<typeof debounce> | null>(null);
    const radiusTotal = radius + 5;

    // Setup interaction handlers
    useEffect(() => {
        if (!appRef.current || !viewportRef.current) return;

        const app = appRef.current;
        const vp = viewportRef.current;
        const canvas = app.canvas as HTMLCanvasElement;

        // ✅ Дебаунс для ховера
        debouncedHoverRef.current = debounce((worldX: number, worldY: number) => {
            const nearestSeat = spatialIndexRef.current?.findNearest(
                worldX,
                worldY,
                radiusTotal || 15
            );

            if (nearestSeat) {
                const seatIdStr = nearestSeat.seatId.toString();
                if (lastHoveredSeatRef.current !== seatIdStr) {
                    lastHoveredSeatRef.current = seatIdStr;
                    onSeatHover?.(nearestSeat);

                    // Tooltip
                    const tooltipText =
                        activeTab === 'sect'
                            ? nearestSeat.sector
                            : activeTab === 'row'
                                ? `${nearestSeat.sector} ${nearestSeat.row}`
                                : `${nearestSeat.sector} ${nearestSeat.row} ${nearestSeat.number}`;

                    setTooltipData({
                        x: 0,
                        y: 0,
                        text: tooltipText,
                    });
                }
            } else if (lastHoveredSeatRef.current !== null) {
                lastHoveredSeatRef.current = null;
                onSeatLeave?.();
                setTooltipData(null);
            }
        }, 8);

        // ✅ Обработчик mousemove на canvas
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.clientX - rect.left;
            const clientY = e.clientY - rect.top;

            // ✅ Конвертируем экранные координаты в мировые
            const worldPos = vp.toWorld(new PIXI.Point(clientX, clientY));

            if (debouncedHoverRef.current) {
                debouncedHoverRef.current(worldPos.x, worldPos.y);
            }

            // Обновляем позицию tooltip
            setTooltipData((prev) =>
                prev ? { ...prev, x: clientX, y: clientY } : null
            );
        };

        // ✅ Обработчик mouseout
        const handleMouseOut = () => {
            if (lastHoveredSeatRef.current !== null) {
                lastHoveredSeatRef.current = null;
                onSeatLeave?.();
            }
            setTooltipData(null);
        };

        // ✅ Обработчик click
        const handleClick = (e: MouseEvent) => {
            if (!vp) return;

            const rect = canvas.getBoundingClientRect();
            const clientX = e.clientX - rect.left;
            const clientY = e.clientY - rect.top;

            // ✅ Конвертируем в мировые координаты
            const worldPos = vp.toWorld(new PIXI.Point(clientX, clientY));

            const nearestSeat = spatialIndexRef.current?.findNearest(
                worldPos.x,
                worldPos.y,
                radiusTotal || 15
            );

            if (nearestSeat && onSeatClick) {
                onSeatClick(nearestSeat);
            }
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseout', handleMouseOut);
        canvas.addEventListener('click', handleClick);

        return () => {
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseout', handleMouseOut);
            canvas.removeEventListener('click', handleClick);
            debouncedHoverRef.current?.cancel();
        };
    }, [appRef, viewportRef, spatialIndexRef, onSeatClick, onSeatHover, onSeatLeave, activeTab, radius, setTooltipData, radiusTotal]);

    // Reset hover on tab change
    useEffect(() => {
        if (lastHoveredSeatRef.current !== null) {
            lastHoveredSeatRef.current = null;
            onSeatLeave?.();
            setTooltipData(null);
        }
    }, [activeTab, onSeatLeave]);
};
