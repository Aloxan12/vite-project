import {ChangeEvent, memo, useEffect, useState} from 'react';
import cls from './Search.module.scss'

interface Search{
    placeholder?: string,
    setSearch:(search: string)=> void
}

export const Search = memo(({ placeholder, setSearch}:Search ) => {
    const [searchIn, setSearchIn] = useState('')

    useEffect(() => {
        const handler = setTimeout(() => {
            setSearch(searchIn)
        }, 500)
        return () => {
            clearTimeout(handler)
        }
    }, [setSearch, searchIn])

    const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchIn(e.target.value)
    }
    return (
        <input
            placeholder={placeholder || 'Поиск'}
            type="text"
            value={searchIn}
            className={cls.inputSearch}
            onChange={changeHandler}
        />

    );
})