package com.todolist2.app.service;

import com.google.appengine.api.datastore.DatastoreService;

/**
 * DatastoreServiceFactoryInterface
 * User: romel
 * Date: 10/06/13
 * Time: 03:52 AM
 */
public interface DatastoreServiceFactoryInterface {
    public DatastoreService getDatastoreService();
}
