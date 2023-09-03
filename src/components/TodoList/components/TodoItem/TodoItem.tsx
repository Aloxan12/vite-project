import cls from './TodoItem.module.scss'
import {ITodo} from "../../../../types/todo";
import {memo} from "react";
import { faker } from '@faker-js/faker';
import {AppCheckbox} from "../../../Checkbox/AppCheckbox";
import Avatar from '../../../../assets/avatar.png'
import Corner from '../../../../assets/corner.svg'

interface ITodoItemProps{
    todo: ITodo
}

const dateOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: "short",
    hour:'2-digit',
    minute:'2-digit',
    hour12: true
}
const USDate = new Intl.DateTimeFormat("en-US", dateOptions)
export const TodoItem = memo(({todo}:ITodoItemProps) => {
    const fakePastDate = faker.date.past();
    const fakeFutureDate = faker.date.future();
    const description = faker.lorem.sentence(20)

    return (
        <div className={cls.todoItemWrapBg}>
            <div className={cls.todoItemWrap}>
                <div className={cls.title}>
                    <AppCheckbox id={`${todo.id}`} value={todo.completed} />
                    {todo.title} Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur impedit quod reprehenderit sapiente sit tenetur voluptatibus. Doloremque optio repudiandae ullam?
                </div>
                <div className={cls.date}>
                    <div className={cls.dateItem}>{USDate.format(fakePastDate)}</div>
                    <div className={cls.dateItem}>{USDate.format(fakeFutureDate)}</div>
                </div>
                <div className={cls.description}>
                    {description}
                </div>
                <div className={cls.footer}>
                    <div className={cls.tags}>
                        <div className={cls.firstTag}>Entity title</div>
                        <div className={cls.secondTag}>
                            Front-end
                            <img src={Corner} alt='corner' className={cls.corner}/>
                        </div>
                    </div>
                    <div className={cls.avatar}>
                        <img src={Avatar} alt="avatar"/>
                    </div>
                </div>
            </div>
        </div>
    );
})