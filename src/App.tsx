import './App.scss'
import {TodoList} from "./components/TodoList/TodoList";
import {useCallback, useEffect, useState} from "react";
import todoStore from "./store/TodoStore/TodoStore";
import {observer} from "mobx-react";


const App = observer(() => {
    const [isMounted, setIsMounted] = useState(false)
    const [loadMore, setLoadMore] = useState(true)
    const {todoList, isLoading, getTodoList, totalCount, changeTodoStatus} = todoStore

    useEffect(() => {
        if (loadMore && isMounted) {
            getTodoList()
                .finally(() => {
                    setLoadMore(false)
                })
        }
    }, [loadMore, isMounted])

    const scrollHandler = (e: Event) => {
        const doc = (e.target as Document).documentElement
        if (doc.scrollHeight - (doc.scrollTop + window.innerHeight) < 100 && todoList.length < totalCount) {
            setLoadMore(true)
        }
    }
    const changeTodoStatusHandler = useCallback(async (id: number, status: boolean) => {
        await changeTodoStatus(id, status)
    }, [changeTodoStatus])

    useEffect(() => {
        setIsMounted(true)
        document.addEventListener('scroll', scrollHandler)
        return () => {
            document.removeEventListener('scroll', scrollHandler)
        }
    }, [scrollHandler])

    return (
        <div className='app'>
            <TodoList
                todoList={todoList}
                isLoading={isLoading}
                changeTodoStatusHandler={changeTodoStatusHandler}/>
        </div>
    )
})

export default App
