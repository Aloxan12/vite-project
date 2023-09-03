import cls from './AppCheckbox.module.scss'
import {memo} from "react";

interface IAppCheckboxProps {
    text?: string
    value: boolean
    onChange?: (value: boolean) => void
    id: string
}

export const AppCheckbox = memo(({id, value, onChange, text}: IAppCheckboxProps) => {
    return (
        <div className={cls.checkboxWrap}>
            <input id={id} className={cls.checkbox} name={id} type="checkbox"
                   checked={value}
                   onChange={(e) => onChange?.(e.currentTarget.checked)}/>
            <label htmlFor={id} className={cls["checkbox-label"]}>{text}</label>
        </div>
    );
})