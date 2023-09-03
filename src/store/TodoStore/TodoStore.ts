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
        this.todoList = [...this.todoList, ...todoList]
    }

    getTodoList = async () => {
        this.setIsLoading(true)
        try {
            const result = await api.get('todos', { params: { _page: this.page } });
            const totalCount = await result?.headers['x-total-count']
            const todoList = await result.data;
            if (todoList) {
                this.setTotalCount(Number(totalCount) || 0)
                this.setTodoList(todoList);
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
            setTodoList: action,
            setPage: action,
            getTodoList: action,
            setTotalCount: action,
        });
    }
}

const todoStore = new TodoStore();
export default todoStore;
