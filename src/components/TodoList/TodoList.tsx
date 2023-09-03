import cls from './TodoList.module.scss'
import {TodoListHeader} from "./components/TodoListHeader/TodoListHeader";
import {TodoItem} from "./components/TodoItem/TodoItem";
import {ITodo} from "../../types/todo";
import {memo} from "react";

interface ITodoListProps{
    todoList: ITodo[]
    isLoading: boolean
}

export const TodoList = memo(({todoList, isLoading}:ITodoListProps) => {
    return (
        <div className={cls.todoListWrap}>
            <TodoListHeader count={todoList.length}/>
            {todoList.map((todo)=> <TodoItem todo={todo} key={todo.id}/>)}
            {isLoading && <div>Loading...</div>}
        </div>
    );
})