$(function(){

    $('<div id="overlay"/>').css({
            position: 'fixed',
            top: 0,
            left: 0,
            display: 'block',
            width: $(window).width() + 'px',
            height: $(window).height() + 'px',
            background: 'url(/static/gif/ajax-loader-circle.gif) no-repeat center'
        }).hide().appendTo('body');


    $("#nav_tab_trackeasy").addClass("active");
    $("#nav_tab_mismatch").removeClass("active");
    $("#nav_tab_misbehave").removeClass("active");

    
    if(localStorage.getItem("eventsDisplayService") == null){
        localStorage.setItem("eventsDisplayService", "All");
        $("#dLabel").text('All'+'▼');    
    }
    else{
        $("#dLabel").text(localStorage.getItem("eventsDisplayService")+'▼');
    }

    if(localStorage.getItem("eventsDisplayDevice") == null){
        localStorage.setItem("eventsDisplayDevice", "All");
        $("#deviceLabel").text('All'+'▼');    
    }
    else{
        $("#deviceLabel").text(localStorage.getItem("eventsDisplayDevice")+'▼');
    }
    


    var showDataByServiceAndDevice = function(var_service, var_device) {
        $("#overlay").show()
        console.log("inside showDataByServiceAndDevice function with service",var_service, var_device);
        $.ajax({
            type: "GET",
            url: "/trackeasy/",
            data: {
                'name': 'getDataByServiceAndDevice',
                'service': var_service,
                'device': var_device
            },
            success: function(data) {
                console.log("Ajax: GET success with service selection and device selection ", var_service, var_device);
                console.log(data)
                for (var i = data.backlog.length - 1; i >= 0; i--) {
                    createBackLog(jQuery.parseJSON(data.backlog[i]));
                };
                for (var i = data.approved.length - 1; i >= 0; i--) {
                    createApproved(jQuery.parseJSON(data.approved[i]));
                };
                $("#overlay").hide()
            },
            error: function(err) {
                console.log("Ajax: Get error: ", err);
                $("#overlay").hide()
            }
        })
    }

    showDataByServiceAndDevice(localStorage.getItem("eventsDisplayService"),localStorage.getItem("eventsDisplayDevice"));

    

    $('.service_list').click(function(event) {
        console.log("service selected");
        var_service = $(this).text();
        var_device = $("#deviceLabel").text().slice(0,-1);
        event.preventDefault();
        $("#backlog_docs").html("");
        $("#approved_docs").html("");
        $("#dLabel").text($(this).text()+'▼');
        showDataByServiceAndDevice(var_service,var_device);
        localStorage.setItem("eventsDisplayService", var_service);
        localStorage.setItem("eventsDisplayDevice", var_device);
    });

    $('.device_list').click(function(event) {
        console.log("device selected");
        var_service =$("#dLabel").text().slice(0,-1);
        var_device = $(this).text();
        event.preventDefault();
        $("#backlog_docs").html("");
        $("#approved_docs").html("");
        $("#deviceLabel").text($(this).text()+'▼');
        showDataByServiceAndDevice(var_service,var_device);
        localStorage.setItem("eventsDisplayService", var_service);
        localStorage.setItem("eventsDisplayDevice", var_device);
    });

    var createBackLog = function (backlog_doc) {

        console.log("creating Backlog entry");
        num = backlog_doc._id.$oid;
        $("#backlog_docs").append('\
            <div class="jumbotron" style="padding-top: 0px;padding-left:0px;padding-right:10px;padding-bottom:5px;background-color:#C0C0C0;margin-bottom:40px;">\
                <div class="row " style="padding-top: 0px;" >\
                    <div id='+num+' class="col-md-12" style="padding-top:20px;padding-left:0px;padding-right:0px;padding-bottom:20px;">\
                        <div class="col-md-8" style="width:72%;padding-right:5px;">\
                            <div class="col-md-2">\
                                <h4> Device </h4>\
                                <div class="highlight" style="padding:0px 9px;margin-bottom:0px;border:2px;">\
                                    <p id="data_ed_'+num+'" ></p>\
                                </div>\
                            </div>\
                            <div class="col-md-2">\
                                <h4> Service </h4>\
                                <div class="highlight" style="padding:0px 9px;margin-bottom:0px;border:2px;">\
                                    <p id="data_es_'+num+'" ></p>\
                                </div>\
                            </div>\
                            <div class="col-md-4">\
                                <h4> Event Category </h4>\
                                <div class="highlight" style="padding:0px 9px;margin-bottom:0px;border:2px;">\
                                    <p id="data_ec_'+num+'" ></p>\
                                </div>\
                            </div>\
                            <div class="col-md-4">\
                                <h4> Event Action </h4>\
                                <div class="highlight" style="padding:0px 9px;margin-bottom:0px;border:2px;">\
                                    <p id="data_ea_'+num+'" ></p>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="col-md-4" style="padding-left:5px;padding-right:0px;width:28%;">\
                            <div>\
                                <input id="fe_tick_status_'+num+'" type="checkbox" class="fe_confirm" style="margin-top: 46px; font-size:200%">\
                                <span class="fe_confirm_wrapper" data-toggle="tooltip" data-placement="bottom" data-original-title="Confirm from FE side">&nbsp;FE ✓&nbsp;&nbsp;</span>\
                                <button id="pa_confirm_status_'+num+'" class="btn btn-primary pa_confirm" data-toggle="tooltip" data-placement="bottom" data-original-title="Confirm from PA side">\
                                    <span>PA ✓</span>\
                                </button>\
                                <span class="image_wrapper" data-toggle="tooltip" data-placement="top" data-original-title="Event Image">\
                                    <div class="btn-group">\
                                        <button type="button" id="imageLabel" data-target="#" href="http://example.com" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false" class="btn btn-primary glyphicon glyphicon-picture">\
                                                <span class="caret"></span>\
                                        </button>\
                                        <ul class="dropdown-menu" role="menu" aria-labelledby="imageLabel">\
                                            <li id="imageshow_'+num+'" class="imageshow" data-toggle="modal" data-target="#myShowImageModal"><a>Show</a></li>\
                                            <li id="imageupload_'+num+'" class="imageupload" data-toggle="modal" data-target="#myUploadModal"><a>Upload</a></li>\
                                        </ul>\
                                    </div>\
                                </span>\
                                <span class="eventinfo_wrapper" data-toggle="tooltip" data-placement="bottom" data-original-title="Show event info">\
                                    <button id="eventinfo_'+num+'" class="btn btn-primary eventinfo glyphicon glyphicon-info-sign" data-toggle="modal" data-target="#myShowEventInfoModal">\
                                    </button>\
                                </span>\
                            </div>\
                        </div>\
                        <div class="col-md-12">\
                            <div class="col-md-12">\
                                <h4> Event Label </h4>\
                                <div class="highlight" style="padding:0px 9px;margin-bottom:0px;border:2px;">\
                                    <p id="data_el_'+num+'" ></p>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                </div>\
            </div>');


        $('.pa_confirm').tooltip();
        $('.fe_confirm_wrapper').tooltip();
        // $('.edit_wrapper').tooltip();
        // $('.duplicate').tooltip();
        // $('.delete').tooltip();
        // $('.settings_wrapper').tooltip();
        // $('.imageshow_wrapper').tooltip();
        $('.image_wrapper').tooltip();
        $('.eventinfo_wrapper').tooltip();
        // $('.comments_wrapper').tooltip();
        // $('.upload_wrapper').tooltip();

        $("#data_ec_"+num).text(String(backlog_doc.event.category));
        $("#data_ea_"+num).text(String(backlog_doc.event.action));
        $("#data_es_"+num).text(backlog_doc.event.service);
        $("#data_ed_"+num).text(backlog_doc.event.device);
        $("#data_el_"+num).text(String(backlog_doc.event.label));
        if(backlog_doc.fe_tick_state){
            $("#fe_tick_status_"+num).prop('checked', true);

        }
        else{
            $("#fe_tick_status_"+num).prop('checked', false);
            $("#pa_confirm_status_"+num).addClass("disabled"); 

        }

    }




    var createApproved = function (approved_doc) {

        num = approved_doc._id.$oid;
        console.log("creating approved entry");
        $("#approved_docs").append('\
            <div class="jumbotron" style="padding-top: 0px;padding-left:0px;padding-right:10px;padding-bottom:5px;background-color:#C0C0C0;margin-bottom:40px;">\
                <div class="row " style="padding-top: 0px;" >\
                    <div class="col-md-12" style="padding-top:20px;padding-left:0px;padding-right:0px;padding-bottom:20px;">\
                        <div class="col-md-8" style="width:72%;padding-right:5px;">\
                            <div class="col-md-2">\
                                <h4> Device </h4>\
                                <div class="highlight" style="padding:0px 9px;margin-bottom:0px;border:2px;">\
                                    <p id="data_ed_'+num+'" ></p>\
                                </div>\
                            </div>\
                            <div class="col-md-2">\
                                <h4> Service </h4>\
                                <div class="highlight" style="padding:0px 9px;margin-bottom:0px;border:2px;">\
                                    <p id="data_es_'+num+'" ></p>\
                                </div>\
                            </div>\
                            <div class="col-md-4">\
                                <h4> Event Category </h4>\
                                <div class="highlight" style="padding:0px 9px;margin-bottom:0px;border:2px;">\
                                    <p id="data_ec_'+num+'" ></p>\
                                </div>\
                            </div>\
                            <div class="col-md-4">\
                                <h4> Event Action </h4>\
                                <div class="highlight" style="padding:0px 9px;margin-bottom:0px;border:2px;">\
                                    <p id="data_ea_'+num+'" ></p>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="col-md-4" style="padding-left:5px;padding-right:0px;width:28%;">\
                            <div style="margin-top:37px;">\
                                <span class="image_wrapper" data-toggle="tooltip" data-placement="top" data-original-title="Event Image">\
                                    <div class="btn-group">\
                                        <button type="button" id="imageLabel" data-target="#" href="http://example.com" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false" class="btn btn-primary glyphicon glyphicon-picture">\
                                                <span class="caret"></span>\
                                        </button>\
                                        <ul class="dropdown-menu" role="menu" aria-labelledby="imageLabel">\
                                            <li id="imageshow_'+num+'" class="imageshow" data-toggle="modal" data-target="#myShowImageModal"><a>Show</a></li>\
                                            <li id="imageupload_'+num+'" class="imageupload" data-toggle="modal" data-target="#myUploadModal"><a>Upload</a></li>\
                                        </ul>\
                                    </div>\
                                </span>\
                                <span class="eventinfo_wrapper" data-toggle="tooltip" data-placement="bottom" data-original-title="Show event info">\
                                    <button id="eventinfo_'+num+'" class="btn btn-primary eventinfo glyphicon glyphicon-info-sign" data-toggle="modal" data-target="#myShowEventInfoModal">\
                                    </button>\
                                </span>\
                            </div>\
                        </div>\
                        <div class="col-md-12">\
                            <div class="col-md-12">\
                                <h4> Event Label </h4>\
                                <div class="highlight" style="padding:0px 9px;margin-bottom:0px;border:2px;">\
                                    <p id="data_el_'+num+'"></p>\
                                </div>\
                        </div>\
                    </div>\
                </div>\
            </div>');



        // $('.duplicate').tooltip();
        // $('.delete').tooltip();
        // $('.settings_wrapper').tooltip();
        // $('.imageshow_wrapper').tooltip();
        $('.image_wrapper').tooltip();
        $('.eventinfo_wrapper').tooltip();
        $("#data_ec_"+num).text(String(approved_doc.event.category));
        $("#data_ea_"+num).text(String(approved_doc.event.action));
        $("#data_es_"+num).text(approved_doc.event.service);
        $("#data_ed_"+num).text(approved_doc.event.device);
        $("#data_el_"+num).text(String(approved_doc.event.label));

    }

    $(document).on('click', '.gitSync', function (){
        console.log('inside gitSync function');
        $.ajax({
            type: "POST",
            url: "/trackeasy/edit/",
            data: {
                'name': 'git_sync'
            },
            success: function(data) {
                console.log("synced with github");
                // console.log(data)
            },
            error: function(err) { 
                console.log("error: ", err);
            }
        })

    })    

    $(document).on('change', '.fe_confirm', function (){
        var box= confirm("Are you sure you want to do this?");
        if(box==true){
            console.log(" inside fe confirm event handler");
            var id = $(this).attr('id');
            id = id.split('_');
            id = id[id.length-1];
            var status = $("#"+$(this).attr('id')).prop('checked')
            $.ajax({
                type: "POST",
                url: "/trackeasy/edit/",
                data: {
                    'id' : id,
                    'status': status,
                    'name': 'fe_confirm'
                },
                success: function() {
                    console.log("fe confirm event handler Success");
                    if(status){
                       $("#pa_confirm_status_"+id).removeClass("disabled"); 
                    }
                    else{
                        $("#pa_confirm_status_"+id).addClass("disabled");

                    }
                },
                error: function(err) { 
                    console.log("error: ", err);
                }
            }) 
        }       
        else {
            if($("#"+$(this).attr('id')).prop('checked')==true)
                $("#"+$(this).attr('id')).prop('checked',false)
            else
                $("#"+$(this).attr('id')).prop('checked',true)


        }
    })


    $(document).on('click', '.pa_confirm', function (){
        var box= confirm("Are you sure you want to do this?");
        if(box==true){
            console.log(" inside pa confirm event handler");
            var id = $(this).attr('id');
            id = id.split('_');
            id = id[id.length-1];
            // var status = $("#"+$(this).attr('id')).prop('checked')
            $.ajax({
                type: "POST",
                url: "/trackeasy/edit/",
                data: {
                    'id' : id,
                    'name': 'pa_confirm'
                },
                success: function() {
                    console.log(" pa confirm event handler success");
                    // window.location.reload();
                    $("#backlog_docs").html("");
                    $("#approved_docs").html("");
                    showDataByServiceAndDevice($("#dLabel").text().slice(0,-1),$("#deviceLabel").text().slice(0,-1));

                },
                error: function(err) { 
                    console.log("error: ", err);
                }
            })
        } 
    })


    $(document).on('click', '.imageupload', function (){
        console.log(" upload Event Image clicked");
        var id = $(this).attr('id');
        id = id.split('_');
        id = id[id.length-1];
        // service setting needs to be done on form submit
        var_temp_event_service = $("#dLabel").text().slice(0,-1);
        var_temp_event_device = $("#deviceLabel").text().slice(0,-1);
        localStorage.setItem("eventsDisplayService", var_temp_event_service);
        localStorage.setItem("eventsDisplayDevice", var_temp_event_device);
        $('#uploadeventService').html("");
        $('#uploadeventService').append("<input type='hidden' name='uploadeventId' value="+id+">");
    })


    $(document).on('click', '.imageshow', function (){
        console.log(" Show Event Image clicked");
        var id = $(this).attr('id');
        id = id.split('_');
        id = id[id.length-1];
        console.log(id)
        $('#showImageModalBody').html("");
        $('#showImageModalBody').append("<img src='/static/images/"+ id + ".png'>");
    })


    $(document).on('click', '.eventinfo', function (){
        console.log(" Show Event Info clicked");
        var id = $(this).attr('id');
        id = id.split('_');
        id = id[id.length-1];
        console.log(id)
        $.ajax({
            type: "GET",
            url: "/trackeasy/get_info/",
            data: {
                'id': id,
                'name':'geteventinfo'
            },
            success: function(data) {
                console.log("Ajax: GET success for event info ", id);
                console.log(data)
                $('#showEventDatetimeInfo').html("");
                $('#showEventDatetimeInfo').html('\
                    <div class="col-md-12">\
                            <div class="col-md-6">\
                                <h4> FE Confirm DateTime </h4>\
                                <div class="highlight">\
                                    <p>'+data.fe_date.split('.')[0]+'</p>\
                                </div>\
                            </div>\
                            <div class="col-md-6">\
                                <h4> PA Confirm DateTime </h4>\
                                <div class="highlight">\
                                    <p>'+data.pa_date.split('.')[0]+'</p>\
                                </div>\
                            </div>\
                    </div>');

                $('#showEventComments').html("");
                if(data.comments.length>0){
                    for (var i = data.comments.length - 1; i >= 0; i--) {
                    $('#showEventComments').append('\
                        <div class="col-md-12">\
                            <div class="col-md-6">\
                                <p> Author </p>\
                                <div class="highlight">\
                                    <p>'+jQuery.parseJSON(data.comments[i]).author+'</p>\
                                </div>\
                            </div>\
                            <div class="col-md-6">\
                                <p> Comment </p>\
                                <div class="highlight">\
                                    <p>'+jQuery.parseJSON(data.comments[i]).comment+'</p>\
                                </div>\
                            </div>\
                        </div>')
                    };
                }
                else{
                    $('#showEventComments').html('\
                        <div class="col-md-12">\
                            <p>No comments</p>\
                        </div>')
                }
                
                $(".addCommentButton").attr("id", "addCommentButton_" + id);

                
            },
            error: function(err) {
                console.log("Ajax: Get error: ", err);
            }
        })
    })

    $('.addCommentButton').click(function(event) {
        console.log("inside add Comment function");
        event.preventDefault();
        var id = $(this).attr('id');
        id = id.split('_');
        id = id[id.length-1];
        console.log(id);
        $.ajax({
            type: "POST",
            url: "/trackeasy/get_info/",
            data: {
                'name': 'addComment', 
                'author': $('#commentAuthor').val().trim(),
                'comment': $('#eventComment').val().trim(),
                'id':id
            },
            success: function(data) {
                console.log(" Ajax: POST Success for editing event");
                // $('#showEventComments').html("");
                $('#myShowEventInfoModal').modal('hide');
                $('#commentAuthor').val("")
                $('#eventComment').val("")

            },
            error: function(err) {
                console.log("error: ", err);
            }
        })
    });

    


});