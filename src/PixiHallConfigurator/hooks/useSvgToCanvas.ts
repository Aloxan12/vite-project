import { useCallback } from 'react';

export const useSvgToCanvas = () => {
    const svgToCanvas = useCallback(
        (svgUrl: string, scale: number = 2): Promise<HTMLImageElement> => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = 'anonymous';

                img.onload = () => {
                    // Создаём canvas с увеличенным размером
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width * scale;
                    canvas.height = img.height * scale;

                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        reject(new Error('Failed to get canvas context'));
                        return;
                    }

                    // ✅ Включаем сглаживание для резкого текста
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';

                    // Масштабируем и рисуем
                    ctx.scale(scale, scale);
                    ctx.drawImage(img, 0, 0);

                    // Конвертируем в HTMLImageElement
                    const resultImg = new Image();
                    resultImg.src = canvas.toDataURL('image/png');
                    resultImg.onload = () => resolve(resultImg);
                    resultImg.onerror = () =>
                        reject(new Error('Failed to convert canvas to image'));
                };

                img.onerror = () => reject(new Error('Failed to load SVG'));
                img.src = svgUrl;
            });
        },
        []
    );

    return { svgToCanvas };
};
