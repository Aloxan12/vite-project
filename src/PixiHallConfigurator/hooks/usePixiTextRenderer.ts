import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';

export const usePixiTextRenderer = (
    appRef: React.RefObject<PIXI.Application | null>,
    viewportRef: React.RefObject<Viewport | null>,
    zoom: number
) => {
    const textContainerRef = useRef<PIXI.Container | null>(null);

    useEffect(() => {
        if (!appRef.current || !viewportRef.current) return;

        const app = appRef.current;
        const vp = viewportRef.current;

        // Создаём контейнер для текста если его нет
        if (!textContainerRef.current) {
            textContainerRef.current = new PIXI.Container();
            vp.addChild(textContainerRef.current);
        }

        const container = textContainerRef.current;
        container.removeChildren();

        // Показываем информацию о масштабе
        if (zoom > 2) { // ✅ Показываем текст только при большом зуме
            const text = new PIXI.Text(`Масштаб: ${zoom.toFixed(2)}x`, {
                fontFamily: 'Arial',
                fontSize: 12 / zoom, // ✅ Масштабируем размер текста с зумом
                fill: 0x000000,
                align: 'left',
            });

            text.position.set(vp.left + 10, vp.top + 10);
            container.addChild(text);
        }
    }, [appRef, viewportRef, zoom]);

    return textContainerRef;
};
