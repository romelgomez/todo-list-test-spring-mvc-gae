package com.todolist2.app.service;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import org.springframework.stereotype.Service;

/**
 * DatastoreServiceFactory Implementation
 * User: romel
 * Date: 10/06/13
 * Time: 03:47 AM
 * To change this template use File | Settings | File Templates.
 */

@Service
public class DatastoreServiceFactoryImplementation implements DatastoreServiceFactoryInterface {

    private DatastoreService datastoreService = DatastoreServiceFactory.getDatastoreService();

    public DatastoreService getDatastoreService(){
        return datastoreService;
    }

}