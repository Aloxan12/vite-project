import './App.scss'
import {TodoList} from "./components/TodoList/TodoList";
import {useCallback, useEffect, useState} from "react";
import todoStore from "./store/TodoStore/TodoStore";
import {observer} from "mobx-react";
import {Search} from "./components/Search/Search";


const App = observer(() => {
    const [isMounted, setIsMounted] = useState(false)
    const [loadMore, setLoadMore] = useState(false)
    const {todoList, isLoading, getTodoList, totalCount, changeTodoStatus, getTodoListByTitle} = todoStore

    const getTodoListHandler = useCallback((search: string)=>{
        if(search){
            getTodoListByTitle(search)
        }else{
            getTodoList(true)
        }
    },[getTodoList, getTodoListByTitle])

    useEffect(() => {
        if (loadMore && isMounted) {
            getTodoList()
                .finally(() => {
                    setLoadMore(false)
                })
        }
    }, [loadMore, isMounted])

    const scrollHandler = (e: Event) => {
        console.log('nen')
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
            <Search
                placeholder={'Поиск (полное название)'}
                searchParam='search'
                setSearch={getTodoListHandler}/>
            <TodoList
                todoList={todoList}
                isLoading={isLoading}
                changeTodoStatusHandler={changeTodoStatusHandler}/>
        </div>
    )
})

export default App
