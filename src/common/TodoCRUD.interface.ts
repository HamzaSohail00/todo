import { UserDocument } from '../todos/dto/document.user.dto';
import {
	CreateTodoDTO,
	TodoFindQuery,
	UpdateTodoDTO,
} from '../todos/dto/todo.dto';

export interface TodoCRUD {
	create: (resource: CreateTodoDTO, user: UserDocument) => Promise<any>;
	getAll: (query: TodoFindQuery, user: UserDocument) => Promise<any>;
	getById: (id: string) => Promise<any>;
	deleteById: (id: string) => Promise<any>;
	updateById: (resource: UpdateTodoDTO, id: string) => Promise<any>;
}
