<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ page session="false" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>TodoList II</title>

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="<c:url value="/favicon.ico" />">

    <!-- Bootstrap -->
    <link rel="stylesheet" media="screen" href="<c:url value="/resources2/library-vendor/bootstrap/css/bootstrap.min.css" />" >
    <link rel="stylesheet" href="<c:url value="/resources2/library-vendor/bootstrap/css/bootstrap-responsive.min.css" />" >

    <!-- Font-awesome -->
    <link rel="stylesheet" href="<c:url value="/resources2/library-vendor/font-awesome/css/font-awesome.min.css" />">

    <!-- Google Code Prettify -->
    <link rel="stylesheet" href="<c:url value="/resources2/library-vendor/google-code-prettify/prettify.css" />">
    <link rel="stylesheet" href="<c:url value="/resources2/library-vendor/google-code-prettify/desert.css" />">

</head>
<body>
<!-- Todo ********************** Start Content ******************************** -->


<div class="container-fluid">

    <h4>TodoList Ajax App - SpringMVC - Google App Engine:    <small>Version 1: Crear, Listar, Editar y Borrar Registros.</small></h4>

    <ul>
        <li>Versión 1: Crear, Listar, Editar y Borrar Registros.</li>
        <li>Versión 2: Buscar, Filtros y Transacciones.</li>
        <li>Versión 3: Paginar.</li>
        <li>Versión 4: Implementar un 2º Modelo (Usuarios - Google Account - User hasMany TodosList), lo que seria equivalente a implementar un grupo de entidades significativo.</li>
    </ul>


    <div class="row-fluid">
        <div class="span12">
            <div style="overflow: hidden;">
                <div id="message-success" style="background-color: #ECFFDB; margin-bottom: 20px; border-radius: 6px; padding: 10px 10px 10px 25px; border:1px solid #A2D246; display:none;"> ¡Se ha registrado satisfactoriamente!</div>
                <div id="message-error" style="background-color: #FFD1D1; margin-bottom: 20px; border-radius: 6px; padding: 10px 10px 10px 25px; border:1px solid red; display:none;">¡Ha ocurrido algun error!</div>
            </div>
        </div>
    </div>

    <div class="row-fluid">
        <div class="span12">

            <form id="NewTaskForm" action="#" method="post" accept-charset="utf-8">

                <div class="control-group">
                    <label class="control-label" for="task">Nueva Tarea</label>
                    <div class="controls">
                        <div class="input-prepend" style="display: inline;">
                            <span class="add-on"><i class="icon-tasks"></i></span><input type="text" id="task" name="task" placeholder="Eje: Estudiar Spring MVC">
                        </div>
                        <div style="display:none;  margin-top: 5px; margin-left: 7px;" class="help-inline">Requerido</div>
                    </div>
                </div>

                <input class="btn" type="submit" value="Registrar">

            </form>

        </div>
    </div>


    <hr>

    <div class="row-fluid">
        <div class="span12">

            <div id="results"></div>


        </div>
    </div>

</div>



<!-- Modal para borrar una tarea
---------------------------------------------------------------------------------------------------------------->
<div class="modal hide fade" id="delete-task-modal"  style="position: fixed;"  >
    <div class="alert alert-block alert-error"  style="margin-bottom: 0; border-bottom-left-radius: 0; border-bottom-right-radius: 0;">
        <h4 class="alert-heading">¿Realmente quieres borrar esta tarea?</h4>
        <h5 id="delete-task-name" class="muted" style=" margin-bottom: 0; "></h5>
    </div>
    <!-- Form footer
    ------------------------------------>
    <div class="modal-footer">
        <button  id="delete-task" class="btn btn-danger" >Confirmar</button>
        <button class="btn" data-dismiss="modal" >Cancelar</button>
    </div>
</div>



<!-- Modal para editar una tarea
=====================================-->
<div class="modal hide fade" id="edit-task-modal">
    <!-- Form header
    ------------------------------------>
    <div class="modal-header">
        <a href="#" class="close" data-dismiss="modal" style="border: none;float: right;"><img src="<c:url value="/resources2/app/img/x.png" />" title="Cancelar" style="width: 24px;"></a>
        <h3>Editar la terea</h3>
    </div>

    <!-- Form body
    ------------------------------------>
    <div class="modal-body">
        <form id="edit-task-form" action="#" method="post" accept-charset="utf-8" novalidate="novalidate" style="margin-bottom: 0;">

            <!-- Mensages post ajax request
            ------------------------------------>
            <div class="alert alert-success" style="display:none">
                <button type="button" class="close" data-dismiss="alert">x</button>
                ¡Se ha editado la tarea!
            </div>
            <div class="alert alert-error fade in" style="display:none">
                <button type="button" class="close" data-dismiss="alert">x</button>
                ¡Ha ocurrido algun error!
            </div>

            <!-- Form inputs
            ------------------------------------>
            <label style="display: none;" for="edit-task-key-string-input">Key String</label>
            <input id="edit-task-key-string-input" name="keyString" type="text" style="display: none;" >


            <div class="control-group">
                <label class="control-label" for="edit-task-input">Editar Tarea</label>
                <div class="controls">
                    <div class="input-prepend" style="display: inline;">
                        <span class="add-on"><i class="icon-user"></i></span><input type="text" id="edit-task-input" name="task" placeholder="Eje: Vivir en Londres">
                    </div>
                    <span style="display:none;  margin-top: 5px; margin-left: 7px;" class="help-inline">Requerido</span>
                </div>
            </div>

            <!--- Todo -> for keep the standard bootstrap template and enter-key still be available option, submit action is javascript event  -->
            <input style="width: 0;height: 0;border: 0;padding: 0;" class="btn" type="submit" value="Editar">

        </form>
    </div>

    <!-- Form footer
    ------------------------------------>
    <div class="modal-footer">
        <button id="edit-task-button" class="btn btn-primary">Actualizar</button>
        <button class="btn" data-dismiss="modal" >Cancelar</button>
    </div>
</div>




<!-- Todo ********************** Ends Content ********************************* -->
<div id="js">
    <!-- Js -->
    <!-- jQuery Core -->
    <script src="<c:url value="/resources2/library-vendor/jquery/jquery-1.10.1.min.js" />"></script>

    <!-- jQuery Validation -->
    <script src="<c:url value="/resources2/library-vendor/jquery/validation/jquery.validate.min.js" />"  type="text/javascript" ></script>

    <!-- jQuery Validation Additional Methods -->
    <script src="<c:url value="/resources2/library-vendor/jquery/validation/additional-methods.min.js" />"  type="text/javascript" ></script>

    <!-- Bootstrap -->
    <script src="<c:url value="/resources2/library-vendor/bootstrap/js/bootstrap.min.js" />" type="text/javascript"></script>

    <!-- Google Code Prettify -->
    <script src="<c:url value="/resources2/library-vendor/google-code-prettify/prettify.js" />" type="text/javascript"></script>

    <!-- App Base -->
    <script src="<c:url value="/resources2/app/js/app.js" />"  type="text/javascript" ></script>

    <!-- App -->
    <script src="<c:url value="/resources2/app/js/app.todolist.js" />"  type="text/javascript" ></script>

    <!-- End Js -->
</div>


</body>
</html>

