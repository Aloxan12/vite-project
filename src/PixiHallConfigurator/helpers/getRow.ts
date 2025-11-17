import {SeatData} from "../PixiHallConfigurator.tsx";

export const getRow = (currentPlace: SeatData, places:  SeatData[]) => {
    return places.filter(place => {
        const row = currentPlace.row;
        const sector = currentPlace.sector;
        return place.row === row && place.sector === sector
    })
}