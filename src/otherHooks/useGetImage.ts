import {useEffect, useState} from "react";

export const useGetImage = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null); // Подложка
    // Загружаем подложку
    useEffect(() => {
        const loadImage = () => {
            const img = new Image();
            img.src = "/Стадион_Екатеринбург_Арена.svg"; // Путь к подложке
            // img.src = "/Лужники.svg"; // Путь к подложке
            img.onload = () => setImage(img);
        };
        loadImage();
    }, []);

    // useEffect(() => {
    //     fetch("/Стадион_Екатеринбург_Арена.svg")
    //         .then(res => res.text())
    //         .then(svgText => {
    //             const parser = new DOMParser();
    //             const doc = parser.parseFromString(svgText, "image/svg+xml");
    //
    //             doc.querySelectorAll("circle").forEach(el => el.remove());
    //
    //             const cleanedSvg = new XMLSerializer().serializeToString(doc);
    //             const blob = new Blob([cleanedSvg], { type: "image/svg+xml" });
    //             const url = URL.createObjectURL(blob);
    //
    //             const img = new Image();
    //             img.src = url;
    //             img.onload = () => setImage(img);
    //         });
    // }, []);


    return {image}
}