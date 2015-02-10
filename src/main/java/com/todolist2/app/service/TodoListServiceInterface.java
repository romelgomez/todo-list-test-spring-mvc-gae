package com.todolist2.app.service;


import com.todolist2.app.domain.TodoList;
import org.springframework.ui.ModelMap;

import java.util.ArrayList;

/**
 * Todo Interfaz TodolistService
 * User: romel
 * Date: 25/05/13
 * Time: 05:12 PM
 */

public interface TodoListServiceInterface {

    public ArrayList<ModelMap>  getTodoList();
    public ModelMap             save(TodoList todoList);
    public ModelMap             editTodoList(ModelMap model);
    public ModelMap             deleteTodoList(ModelMap model);

}
