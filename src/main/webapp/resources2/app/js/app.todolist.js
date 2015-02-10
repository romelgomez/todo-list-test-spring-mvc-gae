/**
 * Created with IntelliJ IDEA.
 * User: romel
 * Date: 21/06/13
 * Time: 02:55 PM
 */

$(document).ready(function() {


    /* ==================================================
     Organize Data
     ================================================== */

    var organize_data = function(parameters){

        var task_obj = parameters.task;

        var status                      = task_obj.entity_getProperty_status;
        var task                        = task_obj.entity_getProperty_task;
        var created                     = task_obj.entity_getProperty_created;
        var modified                    = task_obj.entity_getProperty_modified;
        var object_for_entity_process   = task_obj.object_for_entity_process;

        // Todo -> Status
        var status_info = "";
        if(status){
            status_info = 'Completado <i class="icon-check-sign"></i>';
        }else{
            status_info = 'Pendiente <i class="icon-exclamation"></i>';
        }

        // Todo -> Date, created and modified
        var created_date = 'Creada: '+ new Date(parseInt(created.toString()));
        var modified_date = 'Modificada: '+ new Date(parseInt(modified.toString()));

        // Todo -> Modified
        var  template =  '<div id="task-'+object_for_entity_process.keyString+'" class="row-fluid task">'+
            '<div class="span12">'+
            '<div class="well well-small">'+
            '<div class="row-fluid">'+
            '<div class="span12">'+
            '<div class="row-fluid">'+
            '<div class="span10">'+
            '<span style="font-size: 25px; line-height: 31px; font-family: monospace;" >'+
            '<strong class="task-title">'+task+'</strong> <br>'+
            '<small class="status-info"> '+status_info+' </small> <br>'+
            '<small> '+created_date+' </small> <br>'+
            '<small class="modified-date"> '+modified_date+' </small>'+
            '</span>'+
            '</div>'+
            '<div class="span2" style="text-align: right;">'+
            '<div class="btn-group">'+
            '<button class="btn edit"><i class="icon-edit"></i> Editar</button>'+
            '<button class="btn btn-danger delete"><i class="icon-deleted"></i> Borrar</button>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '<hr>'+
            '<div class="row-fluid">'+
            '<div class="span12">'+
            '<div class="updates"></div>'+
            '<pre class="prettyprint">'+JSON.stringify(task_obj,null,'\t')+'</pre>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '<div class="object_for_entity_process" style="display: none"><!--'+JSON.stringify(object_for_entity_process)+'--></div>'+
            '</div>';


        $("#results").prepend(template);

        deleted_todo();
        edit_todo_setup();

        prettyPrint();

    };



    /* ==================================================
     New Task
     ================================================== */

    var new_task =  function(){

        var request_parameters = {
            "request_type":"form",
            "type":"post",
            "url":"/add",
            "data":{
                "form":{
                    "id":"NewTaskForm",
                    "inputs":[
                        {"id":"task","name":"task"}
                    ]
                }
            },
            "console_log":false,
            "callbacks":{
                "complete":function(response){

                    var a = response.responseText;

                    console.log(a);

                    var task = $.parseJSON(a);

                    if(task.status){

                        // Todo ->  shows the success message
                        var message_success = $("#message-success");
                        $(message_success).fadeIn();
                        setTimeout(function(){ $(message_success).fadeOut(); }, 7000);

                        // Todo ->  prepares the new data
                        var parameters = {};
                        parameters.task = task;
                        organize_data(parameters);

                    }else{

                        // Todo ->  shows the error message in DOM
                        var message_error = $("#message-error");
                        $(message_error).fadeIn();
                        setTimeout(function(){ $(message_error).fadeOut(); }, 20000);

                        // Todo ->  shows the error exception message in console
                        console.log(task.exception);

                    }

                    var reset_form_parameters = {};
                    reset_form_parameters.form_id = "NewTaskForm";
                    reset_form(reset_form_parameters);

                }
            }
        };

        request(request_parameters);

        return null;
    };

    var new_task_validation = function(){

        var validate_parameters =  {
            "forn_id":"NewTaskForm",
            "validate_options":{
                "submitHandler": function() {
                    new_task();
                },
                "rules":{
                    "task":{
                        "required":true,
                        "maxlength":255
                    }
                },
                "messages":{
                    "task":{
                        "required":"El campo es obligatorio.",
                        "maxlength":"El campo no debe tener mas de 255 caracteres."
                    }
                }
            }


        };

        return  validate(validate_parameters);
    };

    var task_obj = new_task_validation();



    /* ==================================================
     getTodoList
     ================================================== */

    var get_todo_list = function(){

        var request_parameters = {
            "request_type":"custon",
            "type":"post",
            "url":"/getTodoList",
            "data":{},
            "console_log":false,
            "callbacks":{
                "complete":function(response){

                    var a = response.responseText;

                    var tasks_obj = $.parseJSON(a);

                    $(tasks_obj.tasks).each(function(index,obj){

                        // Todo ->  prepares the new data
                        var parameters = {};
                        parameters.task = obj;
                        organize_data(parameters);

                    });


                }
            }
        };

        request(request_parameters);

    };

    get_todo_list();

    /* ==================================================
     deleted-todo
     ================================================== */

    var deleted_todo = function(){

        var request_parameters = {
            "request_type":"custon",
            "type":"post",
            "url":"/deleteTask",
            "data":{},
            "console_log":false,
            "callbacks":{
                "complete":function(response){

                    var a = response.responseText;

                    var obj = $.parseJSON(a);

                    if(obj.status){

                        $("#task-"+obj.keyString).fadeOut('slow',function(){
                            alert("Se ha eliminado con Exito!");
                        });

                    }else{
                        alert('Ha ocurrido un error');
                        console.log(obj.Exception);
                    }

                }
            }
        };

        var delete_buttons = $("#results").find(".delete");

        if (delete_buttons.length>0) {
            $(delete_buttons).each(function(){

                $(this).off('click').on('click',function(){
                    var pure_json_obj   = $(this).parents("div.task").children().last().html();
                    var obj 			= $.parseJSON(clean_obj(pure_json_obj));

                    $("#delete-task").attr({"keyString":obj.keyString});
                    $("#delete-task-name").text(obj.task);

                    $('#delete-task-modal').modal({"backdrop":true,"keyboard":true,"show":true,"remote":false}).on('hidden',function(){
                    });

                });

                $("#delete-task").off('click').on('click',function(){
                    $('#delete-task-modal').modal('hide');

                    var request_this = {};

                    request_this.keyString  = $(this).attr("keyString");

                    request_parameters.data = request_this;

                    request(request_parameters);

                });

            });
        }

    };



    /* ==================================================
     Edit-todo
     ================================================== */

    var edit_todo_setup =  function(){

        var edit_buttons = $("#results").find(".edit");

        if (edit_buttons.length>0) {

            $(edit_buttons).each(function(){

                $(this).off('click').on('click',function(){
                    var pure_json_obj   = $(this).parents("div.task").children().last().html();
                    var obj 			= $.parseJSON(clean_obj(pure_json_obj));

                    $("#edit-task-key-string-input").attr({"value":obj.keyString});
                    $("#edit-task-input").attr({"value":obj.task});

                    $('#edit-task-modal').modal({"backdrop":true,"keyboard":true,"show":true,"remote":false}).on('hidden',function(){

                        edit_task_obj.resetForm();

                        var reset_form_parameters = {};
                        reset_form_parameters.form_id = "edit-task-form";
                        reset_form(reset_form_parameters);

                    });
                });

                $("#edit-task-button").off('click').on('click',function(){

                    $('#edit-task-form').submit();

                });

            });

        }

    };

    var edit_todo_request = function(){

        var request_parameters = {
            "request_type":"form",
            "type":"post",
            "url":"/editTask",
            "data":{
                "form":{
                    "id":"edit-task-form",
                    "inputs":[
                        {"id":"edit-task-key-string-input","name":"keyString"},
                        {"id":"edit-task-input","name":"task"}
                    ]
                }
            },
            "console_log":false,
            "callbacks":{
                "complete":function(response){

                    var a = response.responseText;

                    //console.log(a);

                    var task_obj = $.parseJSON(a);

                    if(task_obj.status){

                        // Todo ->  Task Element
                        var taskElement = $("#task-"+task_obj.sameKeyStringProperty);

                        // Todo ->  Setting Task title
                        var task = task_obj.entity.properties.task;
                        $(taskElement).find(".task-title").text(task);

                        // Todo ->  Setting Modified info
                        var modified        =  task_obj.entity.properties.modified;
                        var modified_date   = 'Modificada: '+ new Date(parseInt(modified.toString()));
                        $(taskElement).find(".modified-date").text(modified_date);

                        // Todo -> Setting Entity and Other related data response
                        var update = '<pre class="prettyprint">'+JSON.stringify(task_obj,null,'\t')+'</pre>';
                        $(taskElement).find(".updates").prepend(update);
                        prettyPrint();

                        // Todo -> Setting new data for edit and delete
                        var data = '<!--'+JSON.stringify(task_obj.object_for_entity_process)+'-->';
                        $(taskElement).find(".object_for_entity_process").html(data);


                        $('#edit-task-modal').modal('hide');


                    }else{
                        alert("Ha ocurrido un error");
                        console.log(task_obj.Exception);
                    }


                }
            }
        };

        request(request_parameters);

        return null;

    };

    var edit_todo_validation = function(){

        var validate_parameters =  {
            "forn_id":"edit-task-form",
            "validate_options":{
                "submitHandler": function() {
                    edit_todo_request();
                },
                "rules":{
                    "task":{
                        "required":true,
                        "maxlength":255
                    }
                },
                "messages":{
                    "task":{
                        "required":"El campo es obligatorio.",
                        "maxlength":"El campo no debe tener mas de 255 caracteres."
                    }
                }
            }


        };

        return  validate(validate_parameters);

    };

    var edit_task_obj = edit_todo_validation();





    /* ==================================================
     Get static todo
     ================================================== */
    /*
     var get_todo = function(){

     var request_parameters = {};

     request_parameters = {
     "request_type":"custon",
     "type":"post",
     "url":"/getTodo",
     "data":{},
     "console_log":false,
     "callbacks":{
     "complete":function(response){

     var a = response.responseText;

     //console.log(a);

     }
     }
     };

     $("#get-todo").click(function(){
     request(request_parameters);
     });

     return null;
     };

     get_todo();
     */





});