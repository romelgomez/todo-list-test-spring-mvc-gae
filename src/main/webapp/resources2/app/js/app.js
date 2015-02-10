var validation_states = ['warning','info','success','error'];


/*
 Todo        - Esta lógica se asegura de resetear el formulario a su estado original.
 @author     - romel
 @date       - 23/06/13
 @time       - 10:37 PM
 @parameters - {"form_id":{"type":"String","description":"El id del formulario"}}
 @returns    - null
 */
var reset_form = function(parameters){
    var form_id = parameters.form_id;
    $('#'+form_id)[0].reset();
    var inputs = $("#"+form_id+" input");
    $(inputs).each(function(k,element){
        $(validation_states).each(function(k2,state){
            if($("#"+element.id).parents('.control-group').hasClass(state)){
                $('#'+element.id).parents('.control-group').removeClass(state).find(".help-inline").fadeOut();
            }
        });
    });
    return null;
};


/*
 Todo        - Usada para procesar la solicitud del usuario, llamar la solicitud ajax
 @author     - romel
 @date       - 23/06/13
 @time       - 10:44 PM
 @parameters -
 @returns    - null
 */
var request = function(parameters){

    /*
     obj = {};

     var input_ids = [{"id":"a","name":"a"},{"id":"b","name":"b"},{"id":"c","name":"c"}];

     $.each(input_ids,function(index,input){
        obj[input.name] = $('#'+input.id).val();
     });

     console.log(obj)

    */

    if(parameters.request_type == "form"){

        var data = {};

        $.each(parameters.data.form.inputs,function(index,input){
            data[input.name] = $('#'+input.id).val();
        });

        parameters.data = data;

        ajaxRequest(parameters);
    }
    if(parameters.request_type == "custon"){
        ajaxRequest(parameters);
    }
    return null;

};

/*
 Todo        - Usada para ejecutar la solicitud ajax, las funciones o retrollamadas que se ejecutan durante la solicitud ajax son referenciadas desde config_obj o el objeto de configuración.
 @author     - romel
 @date       - 23/06/13
 @time       - 10:47 PM
 @parameters -
 @returns    - null
 */
var ajaxRequest = function(parameters){

    var ajax_request_parameters ={
        type: parameters.type,
        url: parameters.url,
        contentType: "application/json; charset=UTF-8",
        dataType: 'json',
        data: JSON.stringify(parameters.data),
        global: false
    };

    if(parameters.console_log){
        ajax_request_parameters.complete = function(response){

            // TODO -> debug as JSON
            var json =  JSON.stringify($.parseJSON(response.responseText), null, "\t");
            $('#debug').text(json);

            parameters.callbacks.complete(response);
        };

        $.ajax(ajax_request_parameters);
    }else{
        ajax_request_parameters.complete = function(response){
            parameters.callbacks.complete(response);
        };

        $.ajax(ajax_request_parameters);
    }

    return null;
};





/*
 Todo        - Establece opciones adicionales recurrentes para validar un formulario
 @author     - romel
 @date       - 23/06/13
 @time       - 11:02 PM
 @parameters - {"form_id":{"type":"String","description":"Id del formulario"},"validate_options":{"type":"object","description":"opciones adicionales personalizadas, en funcion al formulario"}}
 @returns    - object
 */
var validate = function(parameters){

    var forn_id             = parameters.forn_id;
    var validate_options    = parameters.validate_options;

    validate_options.errorPlacement = function(error, element){
        $(element).parents('.control-group').find(".help-inline").fadeIn().html($(error).html());
    };

    validate_options.highlight = function(element){

        $(validation_states).each(function(k2,state){
            if($(element).parents('.control-group').hasClass(state)){
                $(element).parents('.control-group').removeClass(state);
            }
        });
        $(element).parents('.control-group').addClass('warning');

    };

    validate_options.unhighlight = function(element){

        $(validation_states).each(function(k2,state){
            if($(element).parents('.control-group').hasClass(state)){
                $(element).parents('.control-group').removeClass(state);
            }
        });
        $(element).parents('.control-group').addClass('success');

    };

    return $("#"+forn_id).validate(validate_options);
};


/*
 Todo        - Funciones variadas
 @author     - romel
 @date       - 09/07/13
 @time       - 02:54 AM
 */


function capitaliseFirstLetter(string){ return string.charAt(0).toUpperCase() + string.slice(1); }

function str_replace(string, change_this, for_this) {
    return string.split(change_this).join(for_this);
}

function random_number(inferior,superior){
    var numPosibilidades = superior - inferior;
    var aleat;
    aleat = Math.random() * numPosibilidades;
    aleat = Math.round(aleat);
    return parseInt(inferior) + aleat
}

function clean_obj(data){
    var face_1 = str_replace(data,'<!--','');
    return str_replace(face_1,'-->','');
}

$.validator.addMethod("noSpecialChars", function(value, element) {
    return this.optional(element) || /^[a-z0-9\x20]+$/i.test(value);
}, "Username must contain only letters, numbers, or underscore.");
