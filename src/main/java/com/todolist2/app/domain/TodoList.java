package com.todolist2.app.domain;

import com.google.appengine.api.datastore.Entity;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * TodoList Model
 * User: romel
 * Date: 07/07/13
 * Time: 07:07 PM
 */
public class TodoList {

    private static final String TUTORIAL_ENTITY     = "TodoList";
    private static final String TASK                = "task";
    private static final String STATUS              = "status";
    private static final String CREATED             = "created";
    private static final String MODIFIED            = "modified";

    private static SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");

    private Entity entity = new Entity(TUTORIAL_ENTITY);




    // Todo - for created
    public TodoList(final String task){
        entity.setProperty(TASK,task);
        entity.setProperty(STATUS,false);
        entity.setProperty(CREATED,new Date());
        entity.setProperty(MODIFIED,new Date());
    }

    public String getTask() {
        return (String) entity.getProperty(TASK);
    }

    public Boolean getStatus() {
        return (Boolean) entity.getProperty(STATUS);
    }

    public String getCreated() {
        return formatter.format((Date) entity.getProperty(CREATED));
    }
    public String getModified() {
        return formatter.format((Date) entity.getProperty(MODIFIED));
    }

    public Entity getEntity() {
        return entity;
    }

}
