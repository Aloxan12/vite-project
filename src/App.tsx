import './App.scss'
import {TodoList} from "./components/TodoList/TodoList";
import {useCallback, useEffect, useState} from "react";
import todoStore from "./store/TodoStore/TodoStore";
import {observer} from "mobx-react";
import {Search} from "./components/Search/Search";
import {StreetSearch} from "./components/StreetSearch/StreetSearch.tsx";


const App = observer(() => {
    const [loadMore, setLoadMore] = useState(false)
    const {todoList, isLoading, getTodoList, totalCount, changeTodoStatus, setSearch} = todoStore

    const getTodoListHandler = useCallback(async (search: string)=>{
            await setSearch(search)
    },[setSearch])

    useEffect(() => {
        if (loadMore) {
            getTodoList()
                .finally(() => {
                    setLoadMore(false)
                })
        }
    }, [getTodoList, loadMore])

    const scrollHandler = useCallback((e: Event) => {
        const doc = (e.target as Document).documentElement
        if (doc.scrollHeight - (doc.scrollTop + window.innerHeight) < 100 && todoList.length < totalCount) {
            setLoadMore(true)
        }
    },[todoList.length, totalCount])

    const changeTodoStatusHandler = useCallback(async (id: number, status: boolean) => {
        await changeTodoStatus(id, status)
    }, [changeTodoStatus])

    useEffect(() => {
        document.addEventListener('scroll', scrollHandler)
        return () => {
            document.removeEventListener('scroll', scrollHandler)
        }
    }, [scrollHandler])

    return (
        <div className='app'>
            <StreetSearch />
            <Search
                setSearch={getTodoListHandler}/>
            <TodoList
                todoList={todoList}
                isLoading={isLoading}
                changeTodoStatusHandler={changeTodoStatusHandler}/>
        </div>
    )
})
export default App
