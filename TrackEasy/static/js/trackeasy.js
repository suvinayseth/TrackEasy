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

    

    $('#addNewEvent').click(function(event) {
        $("#overlay").show()
        console.log("inside add new event function");
        event.preventDefault();
        // TODO : validate entries
        var_temp_event_service = $("#addModalServiceDropdown").text().slice(0,-1);
        var_temp_event_device = $("#addModalDeviceDropdown").text().slice(0,-1);
        if(var_temp_event_service=='Select' || var_temp_event_device=='Select'){
            alert('Please select event service and event device first')
        }
        else{
            if($('#eventCategory').val().trim()=="" || $('#eventAction').val().trim()=="" || $('#eventLabel').val().trim()==""){
                alert('Leave no field blank')
            }
            else{
                $.ajax({
                    type: "POST",
                    url: "/trackeasy/",
                    data: {
                        'name': 'add_event',
                        'event_category': $('#eventCategory')[0].selectize.items[0].trim().replace(new RegExp("-", "g"),'_'),
                        'event_action': $('#eventAction')[0].selectize.items[0].trim().replace(new RegExp("-", "g"),'_'),
                        'event_service': var_temp_event_service,
                        'event_label': $('#eventLabel')[0].selectize.items.join(',').trim().replace(new RegExp("-", "g"),'_'),
                        'event_device': var_temp_event_device,
                    },
                    success: function(data) {
                        if(data.is_duplicate){
                            alert("Entered event already exists, please check!")
                        }
                        else{
                            console.log(" ajax : new event POST Success");
                            console.log(data)
                            $('#myModal').modal('hide');
                            $("#backlog_docs").html("");
                            $("#approved_docs").html("");
                            showDataByServiceAndDevice($("#dLabel").text().slice(0,-1),$("#deviceLabel").text().slice(0,-1));
                            document.getElementById("eventCategory").value = "";
                            document.getElementById("eventAction").value = "";
                            document.getElementById("eventLabel").value = "";
                        }
                        $("#overlay").hide()
                    },
                    error: function(err) {
                        console.log("error: ", err);
                        $("#overlay").hide()
                    }
                })
            }
            
        }
    });

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
                                <span class="settings_wrapper" data-toggle="tooltip" data-placement="right" data-original-title="Settings">\
                                    <div class="btn-group">\
                                        <button type="button" id="settingsLabel" data-target="#" href="http://example.com" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false" class="btn btn-primary glyphicon glyphicon-cog">\
                                                <span class="caret"></span>\
                                        </button>\
                                        <ul class="dropdown-menu" role="menu" aria-labelledby="settingsLabel">\
                                            <li id="edit_'+num+'" class="edit" data-toggle="modal" data-target="#myEditModal"><a>Edit</a></li>\
                                            <li id="duplicate_'+num+'" class="duplicate"><a>Duplicate</a></li>\
                                            <li id="delete_'+num+'" class="delete"><a>Delete</a></li>\
                                        </ul>\
                                    </div>\
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
        $('.settings_wrapper').tooltip();
        // $('.imageshow_wrapper').tooltip();
        $('.image_wrapper').tooltip();
        $('.eventinfo_wrapper').tooltip();
        // $('.comments_wrapper').tooltip();
        // $('.upload_wrapper').tooltip();

        $("#data_ec_"+num).text(String(backlog_doc.event.category).replace(new RegExp("_", "g"),'-'));
        $("#data_ea_"+num).text(String(backlog_doc.event.action).replace(new RegExp("_", "g"),'-'));
        $("#data_es_"+num).text(backlog_doc.event.service);
        $("#data_ed_"+num).text(backlog_doc.event.device);
        $("#data_el_"+num).text(String(backlog_doc.event.label).replace(new RegExp(",", "g"), ' , '));
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
                                <span class="settings_wrapper" data-toggle="tooltip" data-placement="right" data-original-title="Settings">\
                                    <div class="btn-group">\
                                        <button type="button" id="settingsLabel" data-target="#" href="http://example.com" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false" class="btn btn-primary glyphicon glyphicon-cog">\
                                                <span class="caret"></span>\
                                        </button>\
                                        <ul class="dropdown-menu" role="menu" >\
                                            <li id="edit_'+num+'" class="edit" data-toggle="modal" data-target="#myEditModal"><a>Edit</a></li>\
                                            <li id="duplicate_'+num+'" class="duplicate"><a>Duplicate</a></li>\
                                            <li id="delete_'+num+'" class="delete"><a>Delete</a></li>\
                                        </ul>\
                                    </div>\
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
        $('.settings_wrapper').tooltip();
        // $('.imageshow_wrapper').tooltip();
        $('.image_wrapper').tooltip();
        $('.eventinfo_wrapper').tooltip();
        $("#data_ec_"+num).text(String(approved_doc.event.category).replace(new RegExp("_", "g"),'-'));
        $("#data_ea_"+num).text(String(approved_doc.event.action).replace(new RegExp("_", "g"),'-'));
        $("#data_es_"+num).text(approved_doc.event.service);
        $("#data_ed_"+num).text(approved_doc.event.device);
        $("#data_el_"+num).text(String(approved_doc.event.label).replace(new RegExp(",", "g"), ' , '));

    }

    

    $(document).on('click', '.addEventModal', function (){
        console.log(" Add Event clicked");
        var eventServiceText = $("#dLabel").text().slice(0,-1);
        var eventDeviceText = $("#deviceLabel").text().slice(0,-1);
        console.log(eventServiceText,eventDeviceText);
        if(eventServiceText=='All'){
            eventServiceText = 'Select▼'
        }
        else{
            eventServiceText = $("#dLabel").text()
        }
        if(eventDeviceText=='All'){
            eventDeviceText = 'Select▼'
        }
        else{
            eventDeviceText = $("#deviceLabel").text()
        }
        $("#overlay").show()
        $.ajax({
            type: "GET",
            url: "/trackeasy/",
            data: {
                'name': 'get_suggestion_data',
            },
            success: function(data) {
                console.log("Ajax: GET suggestion data success");
                console.log(data)
                
                var selectize = $("#eventCategory")[0].selectize;
                selectize.clearOptions()
                selectize.clear()
                for (var i = data.categories.length - 1; i >= 0; i--) {
                    selectize.addOption({text:data.categories[i],value:data.categories[i]})
                };
                
                selectize = $("#eventAction")[0].selectize;
                selectize.clearOptions()
                selectize.clear()
                for (var i = data.actions.length - 1; i >= 0; i--) {
                    selectize.addOption({text:data.actions[i],value:data.actions[i]})
                };
                
                selectize = $("#eventLabel")[0].selectize;
                selectize.clearOptions()
                selectize.clear()
                for (var i = data.labels.length - 1; i >= 0; i--) {
                    selectize.addOption({text:data.labels[i],value:data.labels[i]})
                };
                data.base_labels.sort()
                for (var i = 0; i < data.base_labels.length; i++) {
                    selectize.addItem(data.base_labels[i],'silent')
                };
                
                $("#overlay").hide()
            },
            error: function(err) {
                console.log("Ajax: Get error: ", err);
                $("#overlay").hide()
            }
        })
        $('#addModalService').html("");
        $('#addModalService').append("\
            <div class='dropdown'>\
                <button id='addModalServiceDropdown' data-target='#' href='http://example.com' data-toggle='dropdown' aria-haspopup='true' role='button' aria-expanded='false' class='btn btn-default'>"+eventServiceText+"</button>\
                    <ul class='dropdown-menu' role='menu' aria-labelledby='dLabel'>\
                        <li class='addModalservice_list'><a href='#'>Rent</a></li>\
                        <li class='addModalservice_list'><a href='#'>Buy</a></li>\
                        <li class='addModalservice_list'><a href='#'>New Projects</a></li>\
                        <li class='addModalservice_list'><a href='#'>PG & Hostels</a></li>\
                        <li class='addModalservice_list'><a href='#'>Home Loans</a></li>\
                        <li class='addModalservice_list'><a href='#'>Sell or Rent Property</a></li>\
                        <li class='addModalservice_list'><a href='#'>Serviced Apartments</a></li>\
                        <li class='addModalservice_list'><a href='#'>Rental Agreements</a></li>\
                        <li class='addModalservice_list'><a href='#'>Land</a></li>\
                        <li class='addModalservice_list'><a href='#'>Plot Projects</a></li>\
                        <li class='addModalservice_list'><a href='#'>Agents</a></li>\
                        <li class='addModalservice_list'><a href='#'>Miscellaneous</a></li>\
            </ul></div>");
        $('#addModalDevice').html("");
        $('#addModalDevice').append("\
            <div class='dropdown'>\
                <button id='addModalDeviceDropdown' data-target='#' href='http://example.com' data-toggle='dropdown' aria-haspopup='true' role='button' aria-expanded='false' class='btn btn-default'>"+eventDeviceText+"</button>\
                    <ul class='dropdown-menu' role='menu' aria-labelledby='deviceLabel'>\
                        <li class='addModaldevice_list'><a href='#'>Mobile Web</a></li>\
                        <li class='addModaldevice_list'><a href='#'>Desktop</a></li>\
                        <li class='addModaldevice_list'><a href='#'>Android</a></li>\
                        <li class='addModaldevice_list'><a href='#'>IOS</a></li>\
                    </ul></div>");
        
        $(document).on('click', '.addModalservice_list', function(){
            console.log("add Modal dropdown service selected");
            event.preventDefault();
            $("#addModalServiceDropdown").text($(this).text()+'▼');
        });
        $(document).on('click', '.addModaldevice_list', function(){
            console.log("add Modal dropdown device selected");
            event.preventDefault();
            $("#addModalDeviceDropdown").text($(this).text()+'▼');
        });

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





    $(document).on('click', '.edit', function (){
        console.log(" edit Event clicked");
        var id = $(this).attr('id');
        id = id.split('_');
        id = id[id.length-1];
        // $("#editeventCategory").val($("#data_ec_" + id).text());
        // $("#editeventAction").val($("#data_ea_" + id).text());
        // $("#editeventLabel").val($("#data_el_" + id).text());
        var_temp_edit_event_service = $("#data_es_" + id).text() + '▼'
        var_temp_edit_event_device = $("#data_ed_" + id).text() + '▼'
        $("#overlay").show()
        $.ajax({
            type: "GET",
            url: "/trackeasy/",
            data: {
                'name': 'get_suggestion_data'
            },
            success: function(data) {
                console.log("Ajax: GET suggestion data success");
                console.log(data)
                
                var selectize = $("#editeventCategory")[0].selectize;
                selectize.clearOptions()
                selectize.clear()
                for (var i = data.categories.length - 1; i >= 0; i--) {
                    selectize.addOption({text:data.categories[i],value:data.categories[i]})
                };
                selectize.addOption({text:$("#data_ec_" + id).text(),value:$("#data_ec_" + id).text()})
                selectize.addItem($("#data_ec_" + id).text(),'silent')

                
                selectize = $("#editeventAction")[0].selectize;
                selectize.clearOptions()
                selectize.clear()
                for (var i = data.actions.length - 1; i >= 0; i--) {
                    selectize.addOption({text:data.actions[i],value:data.actions[i]})
                };
                selectize.addOption({text:$("#data_ea_" + id).text(),value:$("#data_ea_" + id).text()})
                selectize.addItem($("#data_ea_" + id).text(),'silent')

                

                selectize = $("#editeventLabel")[0].selectize;
                selectize.clearOptions()
                selectize.clear()
                for (var i = data.labels.length - 1; i >= 0; i--) {
                    selectize.addOption({text:data.labels[i],value:data.labels[i]})
                };
                var base_labels = $("#data_el_" + id).text().split(',')
                base_labels.sort()
                for (var i = 0; i < base_labels.length; i++) {
                    selectize.addOption({text:base_labels[i],value:base_labels[i]})
                };
                for (var i = 0; i < base_labels.length; i++) {
                    selectize.addItem(base_labels[i],'silent')
                };

                
                $("#overlay").hide()
            },
            error: function(err) {
                console.log("Ajax: Get error: ", err);
                $("#overlay").hide()
            }
        })
        $('#editModalService').html("");
        $('#editModalService').append("\
            <div class='dropdown'>\
                <button id='editModalServiceDropdown' data-target='#' href='http://example.com' data-toggle='dropdown' aria-haspopup='true' role='button' aria-expanded='false' class='btn btn-default'>"+var_temp_edit_event_service+"</button>\
                    <ul class='dropdown-menu' role='menu' aria-labelledby='dLabel'>\
                        <li class='editModalservice_list'><a href='#'>Rent</a></li>\
                        <li class='editModalservice_list'><a href='#'>Buy</a></li>\
                        <li class='editModalservice_list'><a href='#'>New Projects</a></li>\
                        <li class='editModalservice_list'><a href='#'>PG & Hostels</a></li>\
                        <li class='editModalservice_list'><a href='#'>Home Loans</a></li>\
                        <li class='editModalservice_list'><a href='#'>Sell or Rent Property</a></li>\
                        <li class='editModalservice_list'><a href='#'>Serviced Apartments</a></li>\
                        <li class='editModalservice_list'><a href='#'>Rental Agreements</a></li>\
                        <li class='editModalservice_list'><a href='#'>Land</a></li>\
                        <li class='editModalservice_list'><a href='#'>Plot Projects</a></li>\
                        <li class='editModalservice_list'><a href='#'>Agents</a></li>\
                        <li class='editModalservice_list'><a href='#'>Miscellaneous</a></li>\
            </ul></div>");
        $('#editModalDevice').html("");
        $('#editModalDevice').append("\
            <div class='dropdown'>\
                <button id='editModalDeviceDropdown' data-target='#' href='http://example.com' data-toggle='dropdown' aria-haspopup='true' role='button' aria-expanded='false' class='btn btn-default'>"+var_temp_edit_event_device+"</button>\
                    <ul class='dropdown-menu' role='menu' aria-labelledby='deviceLabel'>\
                        <li class='editModaldevice_list'><a href='#'>Mobile Web</a></li>\
                        <li class='editModaldevice_list'><a href='#'>Desktop</a></li>\
                        <li class='editModaldevice_list'><a href='#'>Android</a></li>\
                        <li class='editModaldevice_list'><a href='#'>IOS</a></li>\
                    </ul></div>");
        
        $(document).on('click', '.editModalservice_list', function(){
            console.log("edit Modal dropdown service selected");
            event.preventDefault();
            $("#editModalServiceDropdown").text($(this).text()+'▼');
        });
        
        $(document).on('click', '.editModaldevice_list', function(){
            console.log("edit Modal dropdown device selected");
            event.preventDefault();
            $("#editModalDeviceDropdown").text($(this).text()+'▼');
        });

        $(".editEventClass").attr("id", "editEvent_" + id);
        console.log('entry id is',id);
        console.log('edit modal save id is',$(".editEventClass").attr("id"));
    })


    $('.editEventClass').click(function(event) {
        console.log("inside edit event function");
        event.preventDefault();
        var id = $(this).attr('id');
        id = id.split('_');
        id = id[id.length-1];
        console.log(id);
        var_temp_edit_event_service = $("#editModalServiceDropdown").text().slice(0,-1);
        var_temp_edit_event_device = $("#editModalDeviceDropdown").text().slice(0,-1);
        if($('#editeventCategory').val().trim()=="" || $('#editeventAction').val().trim()=="" || $('#editeventLabel').val().trim()==""){
            alert('Leave no field blank')
        }
        else{
            $.ajax({
                type: "POST",
                url: "/trackeasy/edit/",
                data: {
                    'name': 'editEvent', 
                    'event_category': $('#editeventCategory')[0].selectize.items[0].trim().replace(new RegExp("-", "g"),'_'),
                    'event_action': $('#editeventAction')[0].selectize.items[0].trim().replace(new RegExp("-", "g"),'_'),
                    'event_service': var_temp_edit_event_service,
                    'event_label': $('#editeventLabel')[0].selectize.items.join(',').trim().replace(new RegExp("-", "g"),'_'),
                    'event_device': var_temp_edit_event_device,
                    'id':id
                },
                success: function(data) {
                    if(data.is_duplication){
                        alert("Edit is leading to Duplication.. please check entered details.")
                    }
                    else{
                        console.log(" Ajax: POST Success for editing event");
                        $('#myEditModal').modal('hide');
                        $("#backlog_docs").html("");
                        $("#approved_docs").html("");
                        showDataByServiceAndDevice($("#dLabel").text().slice(0,-1),$("#deviceLabel").text().slice(0,-1));
                    }
                    

                },
                error: function(err) {
                    console.log("error: ", err);
                }
            })
        }
    });


    $(document).on('click', '.delete', function (){
        var box= confirm("Are you sure you want to do this?");
        if(box==true){ 
            console.log("inside delete event function");
            var id = $(this).attr('id');
            id = id.split('_');
            id = id[id.length-1];
            $.ajax({
                type: "POST",
                url: "/trackeasy/edit/",
                data: {
                    'id' : id,
                    'name': 'deleteEvent'
                },
                success: function() {
                    console.log("Ajax: POST Success for deleting event");
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

    $(document).on('click', '.duplicate', function (){
        console.log("inside duplicate event function");
        var id = $(this).attr('id');
        id = id.split('_');
        id = id[id.length-1];
        $.ajax({
            type: "POST",
            url: "/trackeasy/edit/",
            data: {
                'id' : id,
                'name': 'duplicateEvent'
            },
            success: function() {
                console.log("Ajax: POST Success for duplicating event");
                // window.location.reload();
                $("#backlog_docs").html("");
                $("#approved_docs").html("");
                showDataByServiceAndDevice($("#dLabel").text().slice(0,-1),$("#deviceLabel").text().slice(0,-1));
            },
            error: function(err) { 
                console.log("error: ", err);
            }
        }) 
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