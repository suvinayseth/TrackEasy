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
    // $("#updateList").attr("disabled","disabled");

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
        // $("#updateList").attr("disabled","disabled");
        
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
        // $("#updateList").attr("disabled","disabled");
        
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

/*
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
*/

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
        // $('.settings_wrapper').tooltip();
        // $('.imageshow_wrapper').tooltip();
        $('.image_wrapper').tooltip();
        $('.eventinfo_wrapper').tooltip();
        // $('.comments_wrapper').tooltip();
        // $('.upload_wrapper').tooltip();

        $("#data_ec_"+num).text(String(mismatch_app_doc.event.category));
        $("#data_ea_"+num).text(String(mismatch_app_doc.event.action));
        $("#data_es_"+num).text(mismatch_app_doc.event.service);
        $("#data_ed_"+num).text(mismatch_app_doc.event.device);
        // $("#data_el_"+num).text(String(mismatch_app_doc.event.label));
        $("#data_el_"+num).text(String(mismatch_app_doc.event.label).replace(new RegExp(",", "g"), ' , '));

    }



    $('#getMatchData').click(function(event) {
        localStorage.setItem("matchOrMismatch", "match");
        console.log("inside #getMatchData function");
        event.preventDefault();
        $("#mismatch_list").html("");
        // $("#updateList").attr("disabled","disabled");
        $("#getMatchData_li").addClass('active')
        $("#getMismatchData_li").removeClass('active')
        var var_temp_event_service = $("#dLabel").text().slice(0,-1);
        var var_temp_event_device = $("#deviceLabel").text().slice(0,-1);
        showMatchDataByServiceAndDevice(var_temp_event_service,var_temp_event_device)
        // $("#updateList").removeAttr("disabled")
    });

    $('#getMismatchData').click(function(event) {
        localStorage.setItem("matchOrMismatch", "mismatch");
        console.log("inside #getMisatchData function");
        event.preventDefault();
        $("#mismatch_list").html("");
        // $("#updateList").attr("disabled","disabled");
        $("#getMismatchData_li").addClass('active')
        $("#getMatchData_li").removeClass('active')
        var var_temp_event_service = $("#dLabel").text().slice(0,-1);
        var var_temp_event_device = $("#deviceLabel").text().slice(0,-1);
        showMismatchDataByServiceAndDevice(var_temp_event_service,var_temp_event_device)
        // $("#updateList").removeAttr("disabled")
    });

/*    
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

*/

});