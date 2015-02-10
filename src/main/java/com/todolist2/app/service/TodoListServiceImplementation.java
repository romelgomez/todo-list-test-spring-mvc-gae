package com.todolist2.app.service;

/**
 * Todo Implementación TodoListServiceImpl
 * User: romel
 * Date: 25/05/13
 * Time: 05:30 PM
 */

import com.google.appengine.api.datastore.*;
import com.todolist2.app.domain.TodoList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.ModelMap;

import java.util.ArrayList;
import java.util.Date;
import java.util.Map;

@Service
public class TodoListServiceImplementation implements TodoListServiceInterface  {


/*
    Todo        -> Get interfaces
    @author     -> romel
    @date       -> 12/07/13
    @time       -> 10:06 PM
 */

    DatastoreService datastoreService;

    @Autowired
    public TodoListServiceImplementation(DatastoreServiceFactoryInterface datastoreServiceFactory){
        this.datastoreService = datastoreServiceFactory.getDatastoreService();
    }


/*
    Todo        -> Para desglosar la entidad en un ModelMap Obj
    @author     -> romel
    @date       -> 12/07/13
    @time       -> 10:09 PM
    @parameters -> {"entity":{"type":"Entity"}}
    @returns    -> ModelMap
 */

    private ModelMap organizeData(Entity entity){

        // Todo -> Get and Set vars
        String  task        = (String)     entity.getProperty("task");
        Boolean status      = (Boolean)    entity.getProperty("status");
        Date    created     = (Date)       entity.getProperty("created");
        Date    modified    = (Date)       entity.getProperty("modified");
        Map     properties  =              entity.getProperties();
        Key     key         =              entity.getKey();
        String  key_string  =              KeyFactory.keyToString(key);

        // Todo -> object for process edit and delete entities
        ModelMap object_for_entity_process = new ModelMap();

        object_for_entity_process.addAttribute("task",            task);
        object_for_entity_process.addAttribute("status",          status);
        object_for_entity_process.addAttribute("keyString",       key_string);

        // Todo -> data will be displayed in DOM for analysis
        ModelMap data = new ModelMap();

        data.addAttribute("entity",                         entity);
        data.addAttribute("KeyFactory_keyToString",         key_string);
        data.addAttribute("entity_getKey",                  key);
        data.addAttribute("entity_getProperty_task",        task);
        data.addAttribute("entity_getProperty_status",      status);
        data.addAttribute("entity_getProperty_created",     created);
        data.addAttribute("entity_getProperty_modified",    modified);
        data.addAttribute("entity_getProperties",           properties);
        data.addAttribute("object_for_entity_process",      object_for_entity_process);

        return data;
    }


/*
    Todo        -> Para guardar la entidad en el almacen de datos.
    @author     -> romel
    @date       -> 12/07/13
    @time       -> 10:13 PM
    @parameters -> {"todoList":{"type":"TodoList"}}
    @returns    -> ModelMap
 */


    public ModelMap save(TodoList todoList) {
        Entity entity = todoList.getEntity();

        ModelMap model = new ModelMap();

        try {

           // Todo -> save entity in dataStore
           Key key                  =    datastoreService.put(entity);
           // Todo -> get entity in dataStore
           Entity entityInAppEngine =    datastoreService.get(key);
           // Todo -> Organize Data as ModelMap Obj
           model = organizeData(entityInAppEngine);
           // Todo -> Set status of request
           model.addAttribute("status", true);

        }catch (Exception e){

           // Todo -> Set Exception message
           model.addAttribute("exception",                     e.getMessage());
           // Todo -> Set status of request
           model.addAttribute("status",                        false);

        }

        return  model;
    }

/*
    Todo        -> Para obtener todas las entidades que estan en el almacen de datos
    @author     -> romel
    @date       -> 13/07/13
    @time       -> 12:26 AM
    @parameters -> {}
    @returns    -> ArrayList<ModelMap>
 */

    public ArrayList<ModelMap> getTodoList() {

        ArrayList<ModelMap> taskLists = new ArrayList<ModelMap>();

        Query query = new Query("TodoList");

        for(Entity entity:datastoreService.prepare(query).asIterable()){

            // Todo -> Organize Data as ModelMap Obj
            ModelMap model = organizeData(entity);

            taskLists.add(model);

        }

        return taskLists;
    }

/*
    Todo        -> Para editar la entidad en el almacen de datos
    @author     -> romel
    @date       -> 13/07/13
    @time       -> 01:40 AM
    @parameters -> {"model":{"type":"ModelMap"}}
    @returns    -> ModelMap
 */

    public ModelMap editTodoList(ModelMap model){

        // Todo -> Get Properties
        String  keyStringProperty   = model.get("keyString").toString();
        String  taskProperty        = model.get("task").toString();

        model.clear();

        // Todo -> Created the key
        Key     taskKey             = KeyFactory.stringToKey(keyStringProperty);

        try {

            // Todo -> Get entity
            Entity taskEntity = datastoreService.get(taskKey);

            // Todo -> Set new values
            taskEntity.setProperty("task",taskProperty);
            taskEntity.setProperty("modified",new Date());

            // Todo - Update entity
            datastoreService.put(taskEntity);

            // Todo - get last save data
            Entity entity = datastoreService.get(taskKey);

            model.addAttribute("entity",                        entity);
            model.addAttribute("sameKeyStringProperty",         keyStringProperty);
            model.addAttribute("status",                        true);


            // Todo - for edit and deleted
            ModelMap modelMap2 = new ModelMap();

            modelMap2.addAttribute("task",entity.getProperty("task"));
            modelMap2.addAttribute("status",entity.getProperty("status"));
            modelMap2.addAttribute("keyString",keyStringProperty);

            model.addAttribute("object_for_entity_process",modelMap2);


        } catch (EntityNotFoundException e) {
            model.addAttribute("EntityNotFoundException",       e.getMessage());
            model.addAttribute("status",                        false);

        }
        catch (Exception e){
            model.addAttribute("Exception",                     e.getMessage());
            model.addAttribute("status",                        false);
        }

        return model;

    }


/*
    Todo        -> Para borrar una entidad en el almacen de datos
    @author     -> romel
    @date       -> 13/07/13
    @time       -> 01:42 AM
    @parameters -> {"model":{"type":"ModelMap"}}
    @returns    -> ModelMap
 */

    public ModelMap deleteTodoList(ModelMap model){

        // Todo -> Get Properties
        String  keyStringProperty   = model.get("keyString").toString();

        // model.clear();

        // Todo -> Created the key
        Key     taskKey             = KeyFactory.stringToKey(keyStringProperty);

        try {
            datastoreService.delete(taskKey);
            model.addAttribute("status",                        true);
        }catch (Exception e){
            model.addAttribute("Exception",                     e.getMessage());
            model.addAttribute("status",                        false);
        }


        return model;
    }

}