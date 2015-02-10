package com.todolist2.app.controller;

import com.todolist2.app.domain.TodoList;
import com.todolist2.app.service.TodoListServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;


/**
 * TodoListController
 * User: romel
 * Date: 07/07/13
 * Time: 03:13 PM
 */

@Controller
@RequestMapping("/")
public class TodoListController {

    TodoListServiceInterface todoListService;

    @Autowired
    public TodoListController(TodoListServiceInterface todoListService){
        this.todoListService = todoListService;
    }

    @RequestMapping(method = RequestMethod.GET)
    public String index() {
        return "TodoList/index";
    }

    @RequestMapping(value = "add", method=RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public ModelMap add(@RequestBody ModelMap model) {

        String task     = model.get("task").toString();

        TodoList todoList = new TodoList(task);

        model.clear();

        return todoListService.save(todoList);
    }

    @RequestMapping(value = "getTodoList", method=RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public ModelMap getTodoList() {

        ModelMap  model = new ModelMap();

        model.addAttribute("tasks",todoListService.getTodoList());

        return model;

    }

    @RequestMapping(value = "deleteTask", method=RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public ModelMap deleteTask(@RequestBody ModelMap model) {
        return  todoListService.deleteTodoList(model); // todoListService.getTodo();
    }


    @RequestMapping(value = "editTask", method=RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public ModelMap editTask(@RequestBody ModelMap model){
        return  todoListService.editTodoList(model);
    }


}
