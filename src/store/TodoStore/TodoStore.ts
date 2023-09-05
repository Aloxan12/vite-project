import {action, makeAutoObservable, observable} from 'mobx'
import {ITodo} from "../../types/todo";
import {api} from "../../api/api";

class TodoStore {

    todoList: ITodo[] = []

    page: number = 1

    totalCount: number = 1

    isLoading: boolean = false

    setPage(page: number){
        this.page = page
    }

    setIsLoading(loading: boolean){
        this.isLoading = loading
    }

    setTotalCount(totalCount: number){
        this.totalCount = totalCount
    }

    setTodoList(todoList: ITodo[]){
        this.todoList = todoList
    }

    setNextPageTodoList(todoList: ITodo[]){
        this.todoList = [...this.todoList, ...todoList]
    }

    getTodoList = async (reset?:boolean) => {
        this.setIsLoading(true)
        try {
            const result = await api.get('todos', { params: { _page: this.page } });
            const totalCount = await result?.headers['x-total-count']
            const todoList = await result.data;
            if (todoList && reset) {
                this.setTotalCount(Number(totalCount) || 0)
                this.setTodoList(todoList);
                this.setPage(1)
                return
            }
            if (todoList) {
                this.setTotalCount(Number(totalCount) || 0)
                this.setNextPageTodoList(todoList);
                this.setPage(this.page + 1)
                return
            }
        } catch (e) {
            console.log(e);
        }
        this.setIsLoading(false)
    }
    getTodoListByTitle = async (search: string) => {
        this.setIsLoading(true)
        try {
            const result = await api.get('todos', { params: { _page: 1, title: search } });
            const totalCount = await result?.headers['x-total-count']
            const todoList = await result.data;
            if (todoList) {
                this.setTotalCount(Number(totalCount) || 0)
                this.setTodoList(todoList);
                this.setPage(1)
            }
        } catch (e) {
            console.log(e);
        }
        this.setIsLoading(false)
    }

    changeTodoStatus = async (id: number, status: boolean) => {
        this.setIsLoading(true)
        try {
            const result = await api.patch(`todos/${id}/`, { completed: status });
            const todoData = await result.data;
            if (todoData) {
                const newTodoList = this.todoList.map(todo => todo.id === todoData.id ? todoData : todo)
                this.setTodoList(newTodoList);
                this.setPage(this.page + 1)
            }
        } catch (e) {
            console.log(e);
        }
        this.setIsLoading(false)
    }

    constructor() {
        makeAutoObservable(this,{
            todoList: observable,
            isLoading: observable,
            page: observable,
            totalCount: observable,
            getTodoListByTitle: action,
            setTodoList: action,
            setNextPageTodoList: action,
            setPage: action,
            getTodoList: action,
            changeTodoStatus: action,
            setTotalCount: action,
        });
    }
}

const todoStore = new TodoStore();
export default todoStore;