import cls from './TodoListHeader.module.scss'
import AddIcon from '../../../../assets/add_bold.svg'
import {memo} from "react";

interface ITodoListHeaderProps {
    count: number
}

export const TodoListHeader = memo(
    ({count}: ITodoListHeaderProps) => {
        return (
            <div className={cls.headerWrap}>
                <span className={cls.title}>Today</span>
                <div className={cls.actions}>
                    <img src={AddIcon} alt="add"/>
                    <div className={cls.count}>
                        {count}
                    </div>
                </div>
            </div>
        );
    }
)