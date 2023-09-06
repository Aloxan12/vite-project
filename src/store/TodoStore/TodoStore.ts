import {action, makeAutoObservable, observable} from 'mobx'
import {ITodo} from "../../types/todo";
import {api} from "../../api/api";

class TodoStore {

    todoList: ITodo[] = []

    page: number = 1

    search: string = ''

    totalCount: number = 1

    isLoading: boolean = false

    setPage(page: number){
        this.page = page
    }

    setSearch = async (search: string) => {
        this.search = search
        this.page = 1
        await this.getTodoList(true)
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
            const result = await api.get('todos', { params: { _page: this.page, q: this.search || undefined } });
            const totalCount = await result?.headers['x-total-count']
            const todoList = await result.data;
            if(todoList){
                if (reset) this.setTodoList(todoList);
                if (!reset)this.setNextPageTodoList(todoList);

                this.setTotalCount(Number(totalCount) || 0)
                this.setPage(this.page + 1)
                this.setIsLoading(false)
            }
        } catch (e) {
            this.setIsLoading(false)
            console.log(e);
        }
    }

    changeTodoStatus = async (id: number, status: boolean) => {
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
    }

    constructor() {
        makeAutoObservable(this,{
            todoList: observable,
            isLoading: observable,
            page: observable,
            search: observable,
            totalCount: observable,
            setTodoList: action,
            setNextPageTodoList: action,
            setPage: action,
            setSearch: action,
            getTodoList: action,
            changeTodoStatus: action,
            setTotalCount: action,
        });
    }
}

const todoStore = new TodoStore();
export default todoStore;
