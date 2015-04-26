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

    $("#nav_tab_mismatch").addClass("active");
    $("#nav_tab_trackeasy").removeClass("active");
    $("#nav_tab_misbehave").removeClass("active");
    $("#updateList").attr("disabled","disabled");

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

    
    $('.service_list').click(function(event) {
        console.log("service selected");
        // var var_service = $(this).text();
        // var var_device = $("#deviceLabel").text().slice(0,-1);
        event.preventDefault();
        $("#dLabel").text($(this).text()+'▼');
        $("#mismatch_list").html("");
        $("#getMatchData_li").removeClass('active')
        $("#getMismatchData_li").removeClass('active')
        $("#updateList").attr("disabled","disabled");
        
    });

    $('.device_list').click(function(event) {
        console.log("device selected");
        // var var_service =$("#dLabel").text().slice(0,-1);
        // var var_device = $(this).text();
        event.preventDefault();
        $("#deviceLabel").text($(this).text()+'▼');
        $("#mismatch_list").html("");
        $("#getMatchData_li").removeClass('active')
        $("#getMismatchData_li").removeClass('active')
        $("#updateList").attr("disabled","disabled");
        
    });




    var showMatchDataByServiceAndDevice = function(var_service, var_device) {
        console.log("inside showMatchDataByServiceAndDevice function with service",var_service, var_device);
        $("#overlay").show()
        $.ajax({
            type: "GET",
            url: "/trackeasy/mismatch/",
            data: {
                'name': 'get_audit_data',
                'service': var_service,
                'device': var_device
            },
            success: function(data) {
                console.log("Ajax: GET success with service selection and device selection ", var_service, var_device);
                console.log(data)
                $("#getMatchData_li").addClass('active')
                $("#getMismatchData_li").removeClass('active')
                $("#mismatch_list").html("");
                for (var i = data.match.length - 1; i >= 0; i--) {
                    createList(jQuery.parseJSON(data.match[i]));
                };
                $("#overlay").hide()
                $.ajax({
                    type: "GET",
                    url: "/trackeasy/mismatch/",
                    data: {
                        'name': 'get_mismatch_update_details',
                    },
                    success: function(data) {
                        console.log("Ajax: GET success with service selection and device selection ", var_service, var_device);
                        alert("data latest to "+"today morning")
                        
                    },
                    error: function(err) {
                        console.log("Ajax: Get error: ", err);
                    }
                })
            },
            error: function(err) {
                console.log("Ajax: Get error: ", err);
                $("#overlay").hide()
            }
        })
    }
    
    var showMismatchDataByServiceAndDevice = function(var_service, var_device) {
        console.log("inside showMismatchDataByServiceAndDevice function with service",var_service, var_device);
        $("#overlay").show()
        $.ajax({
            type: "GET",
            url: "/trackeasy/mismatch/",
            data: {
                'name': 'get_audit_data',
                'service': var_service,
                'device': var_device
            },
            success: function(data) {
                console.log("Ajax: GET success with service selection and device selection ", var_service, var_device);
                console.log(data)
                $("#getMismatchData_li").addClass('active')
                $("#getMatchData_li").removeClass('active')
                $("#mismatch_list").html("");
                for (var i = data.mismatch.length - 1; i >= 0; i--) {
                    createList(jQuery.parseJSON(data.mismatch[i]));
                };
                $("#overlay").hide()
                $.ajax({
                    type: "GET",
                    url: "/trackeasy/mismatch/",
                    data: {
                        'name': 'get_mismatch_update_details',
                    },
                    success: function(data) {
                        console.log("Ajax: GET success with service selection and device selection ", var_service, var_device);
                        alert("data latest to "+"today morning")
                        
                    },
                    error: function(err) {
                        console.log("Ajax: Get error: ", err);
                    }
                })
            },
            error: function(err) {
                console.log("Ajax: Get error: ", err);
            }
        })
    }

    var showLatestMatchDataByServiceAndDevice = function(var_service, var_device) {
        console.log("inside showMatchDataByServiceAndDevice function with service",var_service, var_device);
        $("#overlay").show()
        $.ajax({
            type: "GET",
            url: "/trackeasy/mismatch/",
            data: {
                'name': 'get_latest_match_audit_data',
                'service': var_service,
                'device': var_device
            },
            success: function(data) {
                console.log("Ajax: GET success with service selection and device selection ", var_service, var_device);
                console.log(data)
                $("#getMatchData_li").addClass('active')
                $("#getMismatchData_li").removeClass('active')
                $("#mismatch_list").html("");
                for (var i = data.match.length - 1; i >= 0; i--) {
                    createList(jQuery.parseJSON(data.match[i]));
                };
                $("#overlay").hide()
                $.ajax({
                    type: "GET",
                    url: "/trackeasy/mismatch/",
                    data: {
                        'name': 'get_mismatch_update_details',
                    },
                    success: function(data) {
                        console.log("Ajax: GET success with service selection and device selection ", var_service, var_device);
                        alert("data latest to "+"now")
                        
                    },
                    error: function(err) {
                        console.log("Ajax: Get error: ", err);
                    }
                })
            },
            error: function(err) {
                console.log("Ajax: Get error: ", err);
                $("#overlay").hide()
            }
        })
    }
    
    var showLatestMismatchDataByServiceAndDevice = function(var_service, var_device) {
        console.log("inside showMismatchDataByServiceAndDevice function with service",var_service, var_device);
        $("#overlay").show()
        $.ajax({
            type: "GET",
            url: "/trackeasy/mismatch/",
            data: {
                'name': 'get_latest_mismatch_audit_data',
                'service': var_service,
                'device': var_device
            },
            success: function(data) {
                console.log("Ajax: GET success with service selection and device selection ", var_service, var_device);
                console.log(data)
                $("#getMismatchData_li").addClass('active')
                $("#getMatchData_li").removeClass('active')
                $("#mismatch_list").html("");
                for (var i = data.mismatch.length - 1; i >= 0; i--) {
                    createList(jQuery.parseJSON(data.mismatch[i]));
                };
                $("#overlay").hide()
                $.ajax({
                    type: "GET",
                    url: "/trackeasy/mismatch/",
                    data: {
                        'name': 'get_mismatch_update_details',
                    },
                    success: function(data) {
                        console.log("Ajax: GET success with service selection and device selection ", var_service, var_device);
                        alert("data latest to "+"now")
                        
                    },
                    error: function(err) {
                        console.log("Ajax: Get error: ", err);
                    }
                })
            },
            error: function(err) {
                console.log("Ajax: Get error: ", err);
            }
        })
    }


    var createList = function (mismatch_app_doc) {

        console.log("creating list entry");
        var num = mismatch_app_doc._id.$oid;
        $("#mismatch_list").append('\
            <div class="jumbotron" style="padding-top: 0px;padding-left:10px;padding-right:10px;padding-bottom:5px;background-color:#C0C0C0;margin-bottom:40px;">\
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
                            <div style="margin-top:37px;">\
                                <span class="image_wrapper" data-toggle="tooltip" data-placement="top" data-original-title="Event Image">\
                                    <div class="btn-group">\
                                        <button type="button" id="imageLabel" data-target="#" href="http://example.com" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false" class="btn btn-primary glyphicon glyphicon-picture">\
                                                <span class="caret"></span>\
                                        </button>\
                                        <ul class="dropdown-menu" role="menu" aria-labelledby="imageLabel">\
                                            <li id="imageshow_'+num+'" class="imageshow" data-toggle="modal" data-target="#myShowImageModal"><a>Show</a></li>\
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


        // $('.pa_confirm').tooltip();
        // $('.fe_confirm_wrapper').tooltip();
        // $('.edit_wrapper').tooltip();
        // $('.duplicate').tooltip();
        // $('.delete').tooltip();
        $('.settings_wrapper').tooltip();
        // $('.imageshow_wrapper').tooltip();
        $('.image_wrapper').tooltip();
        $('.eventinfo_wrapper').tooltip();
        // $('.comments_wrapper').tooltip();
        // $('.upload_wrapper').tooltip();

        $("#data_ec_"+num).text(String(mismatch_app_doc.event.category).replace('_','-'));
        $("#data_ea_"+num).text(String(mismatch_app_doc.event.action).replace('_','-'));
        $("#data_es_"+num).text(mismatch_app_doc.event.service);
        $("#data_ed_"+num).text(mismatch_app_doc.event.device);
        $("#data_el_"+num).text(String(mismatch_app_doc.event.label).replace(new RegExp(",", "g"), ' , '));

    }



    $('#getMatchData').click(function(event) {
        localStorage.setItem("matchOrMismatch", "match");
        console.log("inside #getMatchData function");
        event.preventDefault();
        $("#mismatch_list").html("");
        $("#updateList").attr("disabled","disabled");
        $("#getMatchData_li").addClass('active')
        $("#getMismatchData_li").removeClass('active')
        var var_temp_event_service = $("#dLabel").text().slice(0,-1);
        var var_temp_event_device = $("#deviceLabel").text().slice(0,-1);
        showMatchDataByServiceAndDevice(var_temp_event_service,var_temp_event_device)
        $("#updateList").removeAttr("disabled")
    });

    $('#getMismatchData').click(function(event) {
        localStorage.setItem("matchOrMismatch", "mismatch");
        console.log("inside #getMisatchData function");
        event.preventDefault();
        $("#mismatch_list").html("");
        $("#updateList").attr("disabled","disabled");
        $("#getMismatchData_li").addClass('active')
        $("#getMatchData_li").removeClass('active')
        var var_temp_event_service = $("#dLabel").text().slice(0,-1);
        var var_temp_event_device = $("#deviceLabel").text().slice(0,-1);
        showMismatchDataByServiceAndDevice(var_temp_event_service,var_temp_event_device)
        $("#updateList").removeAttr("disabled")
    });

    $('#updateList').click(function(event) {
        console.log("inside #updateList function");
        event.preventDefault();
        var var_temp_event_service = $("#dLabel").text().slice(0,-1);
        var var_temp_event_device = $("#deviceLabel").text().slice(0,-1);
        if($("#getMatchData_li").hasClass("active") || $("#getMismatchData_li").hasClass("active")){
                if(localStorage.getItem("matchOrMismatch")=='match'){
                    showLatestMatchDataByServiceAndDevice(var_temp_event_service,var_temp_event_device)
                }
                else{
                    showLatestMismatchDataByServiceAndDevice(var_temp_event_service,var_temp_event_device)
                }
            }
        else{
            alert("Select Match or Mismatch tab first, before updating.")
        }
    });

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
        var var_temp_event_service = $("#dLabel").text().slice(0,-1);
        var var_temp_event_device = $("#deviceLabel").text().slice(0,-1);
        var var_temp_edit_event_service = $("#editModalServiceDropdown").text().slice(0,-1);
        var var_temp_edit_event_device = $("#editModalDeviceDropdown").text().slice(0,-1);
        if($('#editeventCategory').val().trim()=="" || $('#editeventAction').val().trim()=="" || $('#editeventLabel').val().trim()==""){
            alert('Leave no field blank')
        }
        else{
            $.ajax({
                type: "POST",
                url: "/trackeasy/edit/",
                data: {
                    'name': 'editEvent', 
                    'event_category': $('#editeventCategory').val().trim().replace('-','_'),
                    'event_action': $('#editeventAction').val().trim().replace('-','_'),
                    'event_service': var_temp_edit_event_service,
                    'event_label': $('#editeventLabel').val().trim().replace('-','_'),
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
                                                
                    }
                    $("#mismatch_list").html("");
                    if(localStorage.getItem("matchOrMismatch")=='match'){
                        showMatchDataByServiceAndDevice(var_temp_event_service,var_temp_event_device)
                    }
                    else{
                        showMismatchDataByServiceAndDevice(var_temp_event_service,var_temp_event_device)
                    }
                },
                error: function(err) {
                    console.log("error: ", err);
                }
            })
        }
    });


    $(document).on('click', '.imageupload', function (){
        console.log(" upload Event Image clicked");
        var id = $(this).attr('id');
        id = id.split('_');
        id = id[id.length-1];
        // service setting needs to be done on form submit
        var_temp_event_service = $("#dLabel").text().slice(0,-1);
        localStorage.setItem("eventsDisplayService", var_temp_event_service);

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
                // console.log(data,typeof(data),data.fe_date,'haha',jQuery.parseJSON(data.comments[0]).author)
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
                'author': $('#commentAuthor').val(),
                'comment': $('#eventComment').val(),
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

    $(document).on('click', '.delete', function (){
        $("#overlay").show()
        var box= confirm("Are you sure you want to do this?");
        var var_temp_event_service = $("#dLabel").text().slice(0,-1);
        var var_temp_event_device = $("#deviceLabel").text().slice(0,-1);
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
                    if(localStorage.getItem("matchOrMismatch")=='match'){
                        showMatchDataByServiceAndDevice(var_temp_event_service,var_temp_event_device)
                    }
                    else{
                        showMismatchDataByServiceAndDevice(var_temp_event_service,var_temp_event_device)
                    }
                    $("#overlay").hide()
                },
                error: function(err) { 
                    console.log("error: ", err);
                }
            })
        }
        else{
            $("#overlay").hide()
        } 
    })

});