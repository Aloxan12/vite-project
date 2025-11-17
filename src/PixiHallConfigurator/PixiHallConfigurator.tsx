import { memo, useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import { SpatialIndex } from './SpatialIndex';
import { usePixiViewport } from './hooks/usePixiViewport';
import { usePixiRenderer } from './hooks/usePixiRenderer';
import { usePixiInteraction } from './hooks/usePixiInteraction';
import { useFpsCounter } from './hooks/useFpsCounter';
import { useRadioController } from './hooks/useRadioController';
import cls from './PixiHallConfigurator.module.scss';
import {usePixiTextRenderer} from "./hooks/usePixiTextRenderer.ts";
import {useSvgToCanvas} from "./hooks/useSvgToCanvas.ts";

export interface Point {
    /**
     * @generated from protobuf field: double x = 1
     */
    x: number;
    /**
     * @generated from protobuf field: double y = 2
     */
    y: number;
}
/**
 * @generated from protobuf message middle_venue_microservice.api.v1.SeatData
 */
export interface SeatData {
    /**
     * Координаты места на схеме
     *
     * @generated from protobuf field: middle_venue_microservice.api.v1.Point coodrinates = 1
     */
    coodrinates?: Point;
    /**
     * id места
     *
     * @generated from protobuf field: uint64 seatId = 2
     */
    seatId: bigint;
    /**
     * название места
     *
     * @generated from protobuf field: string sector = 3
     */
    sector: string;
    /**
     * название ряда
     *
     * @generated from protobuf field: string row = 4
     */
    row: string;
    /**
     * название места
     *
     * @generated from protobuf field: string number = 5
     */
    number: string;
    /**
     * id категории
     *
     * @generated from protobuf field: uint64 categoryId = 6
     */
    categoryId: bigint;
}

export interface PlacesIds {
    [key: number | string]: SeatData;
}

export interface HallMeta {
    [sectorId: string]: {
        comment?: string;
        rows?: {
            [rowId: string]: {
                comment?: string;
                seats?: {
                    [seatId: string]: {
                        comment?: string;
                        connectedWith?: string[];
                    };
                };
            };
        };
    };
}

interface PixiHallConfiguratorProps {
    places: SeatData[];
    onSeatClick?: (value: SeatData) => void;
    onSeatHover?: (value: SeatData) => void;
    onSeatLeave?: () => void;
    image: HTMLImageElement | null;
    selectedPlaces: PlacesIds;
    hoveredPlaces: PlacesIds;
    containerWidth?: number;
    containerHeight?: number;
    activeTab?: 'seat' | 'row' | 'sect';
    radius?: number;
    meta?: HallMeta;
    categoryColors?: Record<string, string>;
}

const DEFAULT_CATEGORY_COLORS: Record<string, string> = {
    '1': '#0FD9D9',
    '2': '#CCE818',
    '3': '#CE16E2',
    '4': '#436A63',
    '5': '#6C33C9',
    '6': '#5757C6',
    '7': '#2D0AFF',
    '8': '#D52846',
    '9': '#8C056F',
    '10': '#14228D',
};

export const PixiHallConfigurator = memo(({
                                              places,
                                              onSeatClick,
                                              image,
                                              onSeatLeave,
                                              selectedPlaces,
                                              hoveredPlaces,
                                              onSeatHover,
                                              containerWidth = 600,
                                              containerHeight = 400,
                                              activeTab = 'seat',
                                              radius: radiusOut = 5,
                                              meta,
                                              categoryColors = DEFAULT_CATEGORY_COLORS,
                                          }: PixiHallConfiguratorProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const appRef = useRef<PIXI.Application | null>(null);
    const spatialIndexRef = useRef<SpatialIndex>(new SpatialIndex());

    const { radius, incRadius, decRadius } = useRadioController(radiusOut);
    const [tooltipData, setTooltipData] = useState<{ x: number; y: number; text: string } | null>(null);
    const [appReady, setAppReady] = useState(false);

    const fps = useFpsCounter();

    // Initialize Pixi Application (async)
    useEffect(() => {
        if (!canvasRef.current || appReady) return;

        const initApp = async () => {
            try {
                const app = new PIXI.Application();

                await app.init({
                    canvas: canvasRef.current!,
                    width: containerWidth,
                    height: containerHeight,
                    backgroundColor: 0xffffff,
                    antialias: true,
                    resolution: window.devicePixelRatio || 1,
                    autoDensity: true,
                });

                // ✅ Устанавливаем разрешение для резкости
                app.renderer.resolution = window.devicePixelRatio || 1;

                appRef.current = app;
                setAppReady(true);
            } catch (error) {
                console.error('Failed to initialize PixiJS application:', error);
            }
        };
        initApp();

        return () => {
            // ✅ Проверяем существование перед destroy
            if (appRef.current) {
                appRef.current.destroy(true, { children: true, texture: true });
                appRef.current = null;
            }
        };
    }, [containerWidth, containerHeight]);

    // Update canvas size (только если app готово)
    useEffect(() => {
        if (appRef.current && appReady) {
            appRef.current.canvas.width = containerWidth;
            appRef.current.canvas.height = containerHeight;
            appRef.current.renderer.resize(containerWidth, containerHeight);
        }
    }, [containerWidth, containerHeight, appReady]);

    // Initialize spatial index
    useEffect(() => {
        spatialIndexRef.current.buildIndex(places);
    }, [places]);

    // Viewport (zoom & pan) - только если app готово
    const {
        viewport,
        viewportRef,
    } = usePixiViewport(appRef, image, containerWidth, containerHeight, appReady);

    usePixiTextRenderer(appRef, viewportRef, viewport.scale);

    // Renderer
    const { renderSeats, visibleSeatsCount } = usePixiRenderer({
        appRef,
        viewportRef,
        places,
        selectedPlaces,
        hoveredPlaces,
        radius,
        meta,
        categoryColors,
    });

    // Interaction
    usePixiInteraction({
        appRef,
        viewportRef,
        spatialIndexRef,
        onSeatClick,
        onSeatHover,
        onSeatLeave,
        activeTab,
        radius,
        setTooltipData,
    });

    // Trigger render on changes
    useEffect(() => {
        if (appReady) {
            renderSeats();
        }
    }, [places, selectedPlaces, hoveredPlaces, viewport, radius, renderSeats, appReady]);


    return (
        <div className={cls.canvasWrap}>
            <div
                className={cls.canvasContainer}
                style={{ width: containerWidth, height: containerHeight }}
            >
                {tooltipData && (
                    <div
                        className={cls.tooltip}
                        style={{
                            position: 'absolute',
                            left: tooltipData.x,
                            top: tooltipData.y + 48 > containerHeight ? tooltipData.y - 42 : tooltipData.y + 12,
                            pointerEvents: 'none',
                        }}
                    >
                        {tooltipData.text}
                    </div>
                )}
                <canvas ref={canvasRef} />
            </div>

            <div className={cls.btnsBlock}>
                <div className={cls.btn} onClick={incRadius}>
              pluse
                </div>
                <div className={cls.btn} onClick={decRadius}>
                   minuce
                </div>
            </div>

            <div className={cls.fpsBlock}>
                FPS: {fps} | Видимых: {visibleSeatsCount} из {places?.length} |
                Zoom: {viewport.scale.toFixed(2)}
            </div>
        </div>
    );
});

PixiHallConfigurator.displayName = 'PixiHallConfigurator';

export default PixiHallConfigurator;
