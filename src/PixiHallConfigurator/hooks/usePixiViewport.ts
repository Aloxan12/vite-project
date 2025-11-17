import { useCallback, useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';

export const usePixiViewport = (
    appRef: React.RefObject<PIXI.Application | null>,
    image: HTMLImageElement | null,
    containerWidth: number,
    containerHeight: number,
    appReady: boolean
) => {
    const viewportRef = useRef<Viewport | null>(null);
    const [viewport, setViewport] = useState({ x: 0, y: 0, scale: 1 });

    const updateViewportState = useCallback(() => {
        if (viewportRef.current) {
            setViewport({
                x: viewportRef.current.x,
                y: viewportRef.current.y,
                scale: viewportRef.current.scale.x,
            });
        }
    }, []);

    const initViewport = useCallback(() => {
        if (!appRef.current || !image || !appReady) return;

        const app = appRef.current;

        // Remove old viewport if exists
        if (viewportRef.current) {
            app.stage.removeChild(viewportRef.current);
            viewportRef.current.destroy();
        }

        try {
            const events = app.renderer.events;

            // Create new viewport
            const vp = new Viewport({
                screenWidth: containerWidth,
                screenHeight: containerHeight,
                worldWidth: image.width,
                worldHeight: image.height,
                events,
            });

            // Используем методы для конфигурации
            vp.drag()
                .pinch()
                .wheel({ smooth: 3 })
                .decelerate()
                .clampZoom({ minScale: 0.1, maxScale: 5 });

            app.stage.addChild(vp);
            viewportRef.current = vp;

            // Fit image to screen
            vp.fit();
            vp.moveCenter(image.width / 2, image.height / 2);

            // ✅ Простой вариант без параметров - PixiJS v8 автоматически оптимизирует
            const texture = PIXI.Texture.from(image);

            const sprite = new PIXI.Sprite(texture);
            sprite.width = image.width;
            sprite.height = image.height;

            // ✅ Не трогаем alphaMode - PixiJS сам это обработает

            vp.addChild(sprite);

            // Update viewport state
            vp.on('moved', updateViewportState);
            vp.on('zoomed', updateViewportState);

            updateViewportState();
        } catch (error) {
            console.error('Failed to initialize viewport:', error);
        }
    }, [appRef, image, containerWidth, containerHeight, updateViewportState, appReady]);

    useEffect(() => {
        if (image && appRef.current && appReady) {
            initViewport();
        }
    }, [image, initViewport, appRef, appReady]);

    return {
        viewport,
        viewportRef,
        initViewport,
        updateViewport: updateViewportState,
    };
};
