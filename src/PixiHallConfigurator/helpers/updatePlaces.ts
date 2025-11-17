import {PlacesIds, SeatData} from "../PixiHallConfigurator.tsx";

export const updatePlaces = (currentPlaces: PlacesIds, newPlaces: SeatData[]) => {
    const ids = newPlaces.map(item => item.seatId);

    const allExist = ids.every(seatId => seatId.toString() in currentPlaces);

    if (allExist) {
        const updatedItems = { ...currentPlaces };
        ids.forEach(seatId => {
            delete updatedItems[seatId.toString()];
        });
        return updatedItems;
    } else {
        const updatedItems = { ...currentPlaces };
        newPlaces.forEach(item => {
            updatedItems[item.seatId.toString()] = item;
        });
        return updatedItems;
    }
}