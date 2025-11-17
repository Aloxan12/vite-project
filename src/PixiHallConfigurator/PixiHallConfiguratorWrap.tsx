import {useCallback, useEffect, useMemo, useState} from 'react';
import {PixiHallConfigurator, PlacesIds, SeatData} from "./PixiHallConfigurator.tsx";
import {useGetImage} from "../otherHooks/useGetImage.ts";
import { useGetPlaces } from '../otherHooks/useGetPlaces.ts';
import {getRow} from "./helpers/getRow.ts";
import {getSector } from './helpers/getSector.ts';
import {updatePlaces} from "./helpers/updatePlaces.ts";
import {useSvgToCanvas} from "./hooks/useSvgToCanvas.ts";

type Tab = 'seat' | 'row' | 'sect'

const svgUrl = 'https://pre-dev.kassir.grpc.fox-dev.ru//files/download/30f045da4ee56c8af93397e540b76458b77e34da'

const SVG_SCALE = 3;

export const PixiHallConfiguratorWrap = () => {
    const placesData: SeatData[] = useGetPlaces()
    // const { image }  = useGetImage()
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [places, setPlaces] = useState<SeatData[]>([])
    const [selectedPlaces, setSelectedPlaces] = useState<PlacesIds>({})
    const [hoveredPlaces, setHoveredPlaces] = useState<PlacesIds>({});
    const [activeTab, setActiveTab] = useState<Tab>('row')
    const { svgToCanvas } = useSvgToCanvas();


    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const loadImage = async () => {
            try {
                setIsLoading(true);

                // ✅ Конвертируем SVG в canvas с масштабом 3x для резкости
                const canvasImage = await svgToCanvas(svgUrl, SVG_SCALE);
                setImage(canvasImage);
                setError(null);
            } catch (err) {
                console.error('Failed to load SVG:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
                setIsLoading(false);
            } finally {
                setIsLoading(false);
            }
        };

        if (svgUrl) {
            loadImage();
        }
    }, [svgUrl, svgToCanvas]);


    console.log('selectedPlaces', selectedPlaces)


    useEffect(() => {
        if(!places.length && placesData){
            setPlaces(placesData)
        }
    },[placesData, places])


    const onSeatClickHandler = useCallback(
        (value: SeatData) =>{
            switch (activeTab) {
                case 'seat': {
                    return setSelectedPlaces(prev => {
                        if (prev[value.seatId.toString()]) {
                            const newPlaces = { ...prev };
                            delete newPlaces[value.seatId.toString()];
                            return newPlaces;
                        } else {
                            return { ...prev, [value.seatId.toString()]: value };
                        }
                    })
                }
                case 'row': {
                    const currentRow: SeatData[] = getRow(value, places);
                    return setSelectedPlaces(prev => updatePlaces(prev, currentRow));
                }
                case 'sect': {
                    const currentRow: SeatData[] = getSector(value, places);
                    return setSelectedPlaces(prev => updatePlaces(prev, currentRow));
                }
                default: {
                    return setSelectedPlaces(prev => prev);
                }
            }
        },
        [activeTab, places]
    );

    const onSeatHoverHandler = useCallback(
        (value: SeatData) => {
            switch (activeTab) {
                case 'seat': {
                    return setHoveredPlaces({ [value.seatId.toString()]: value });
                }
                case 'row': {
                    const currentRow = getRow(value, places);
                    return setHoveredPlaces(updatePlaces({}, currentRow));
                }
                case 'sect': {
                    const currentSect = getSector(value, places);
                    return setHoveredPlaces(updatePlaces({}, currentSect));
                }
                default:
                    return setHoveredPlaces({});
            }
        },
        [activeTab, places]
    );

    const onSeatLeaveHandler = useCallback(() => {
        setHoveredPlaces({});
    }, []);

    const scaledPlaces = useMemo(() => {
        return places.map((seat) => ({
            ...seat,
            coodrinates: seat.coodrinates
                ? {
                    x: seat.coodrinates.x * SVG_SCALE,
                    y: seat.coodrinates.y * SVG_SCALE,
                }
                : seat.coodrinates,
        }));
    }, [places]);

    if (isLoading) {
        return <div>Загрузка схемы...</div>;
    }

    if (error) {
        return <div>Ошибка загрузки: {error}</div>;
    }

    return (
        <PixiHallConfigurator
            places={scaledPlaces}
            image={image}
            selectedPlaces={selectedPlaces}
            hoveredPlaces={hoveredPlaces}
            onSeatClick={onSeatClickHandler}
            onSeatHover={onSeatHoverHandler}
            onSeatLeave={onSeatLeaveHandler}
            activeTab={activeTab}
            containerWidth={800}
            containerHeight={600}
            meta={{}}
        />
    );
}