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

	$("#nav_tab_misbehave").addClass("active");
	$("#nav_tab_trackeasy").removeClass("active");
	$("#nav_tab_mismatch").removeClass("active");
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

	var now = new Date();
	var yesterday = new Date();
	yesterday.setDate(now.getDate() - 1);

	$('#dp1').datepicker({
		onRender: function(date) {
			return date.valueOf() >= yesterday.valueOf() ? 'disabled' : '';
		}
	});
    $('#dp1').on('changeDate', function(ev) {
        $(this).datepicker('hide');
        $("#dp1").val(moment($("#dp1").val()).format('DD/MM/YYYY'));
    });
    
	$('#dp2').datepicker({
		onRender: function(date) {
			return date.valueOf() >= yesterday.valueOf() ? 'disabled' : '';
		}
	});
    $('#dp2').on('changeDate', function(ev) {
        $(this).datepicker('hide');
        $("#dp2").val(moment($("#dp2").val()).format('DD/MM/YYYY'));
    });

	$('#dp3').datepicker({
		onRender: function(date) {
			return date.valueOf() >= yesterday.valueOf() ? 'disabled' : '';
		}
	});
    $('#dp3').on('changeDate', function(ev) {
        $(this).datepicker('hide');
        $("#dp3").val(moment($("#dp3").val()).format('DD/MM/YYYY'));
    });
    
	$('#dp4').datepicker({
		onRender: function(date) {
			return date.valueOf() >= yesterday.valueOf() ? 'disabled' : '';
		}
	});
    $('#dp4').on('changeDate', function(ev) {
        $(this).datepicker('hide');
        $("#dp4").val(moment($("#dp4").val()).format('DD/MM/YYYY'));
    });


	$('.service_list').click(function(event) {
        console.log("service selected");
        var_service = $(this).text();
        var_device = $("#deviceLabel").text().slice(0,-1);
        event.preventDefault();
        $("#behavior_list").html("");
        $("#dLabel").text($(this).text()+'▼');
        $("#updateList").attr("disabled","disabled")
    });

    $('.device_list').click(function(event) {
        console.log("device selected");
        var_service =$("#dLabel").text().slice(0,-1);
        var_device = $(this).text();
        event.preventDefault();
        $("#behavior_list").html("");
        $("#deviceLabel").text($(this).text()+'▼');
        $("#updateList").attr("disabled","disabled")
    });


    var createList = function (behavior_data) {

        console.log("creating list entry");
        num = behavior_data._id.$oid;
        $("#behavior_list").append('\
            <div class="jumbotron" style="padding-top: 0px;padding-left:10px;padding-right:10px;padding-bottom:5px;background-color:#C0C0C0;margin-bottom:40px;">\
                <div class="row " style="padding-top: 0px;" >\
                    <div id='+num+' class="col-md-12" style="padding-top:20px;padding-left:0px;padding-right:0px;padding-bottom:20px;">\
                        <div class="col-md-8" style="width:63%;padding-right:5px;padding-left:0px;">\
                            <div class="col-md-2">\
                                <h4> Device </h4>\
                                <div class="highlight" style="padding:0px 9px;margin-bottom:0px;border:2px;">\
                                    <p id="data_ed_'+num+'" ></p>\
                                </div>\
                            </div>\
                            <div class="col-md-2" style="padding-left:0px;">\
                                <h4> Service </h4>\
                                <div class="highlight" style="padding:0px 9px;margin-bottom:0px;border:2px;">\
                                    <p id="data_es_'+num+'" ></p>\
                                </div>\
                            </div>\
                            <div class="col-md-4" style="padding-left:0px;">\
                                <h4> Event Category </h4>\
                                <div class="highlight" style="padding:0px 9px;margin-bottom:0px;border:2px;">\
                                    <p id="data_ec_'+num+'" ></p>\
                                </div>\
                            </div>\
                            <div class="col-md-4" style="padding-left:0px;">\
                                <h4> Event Action </h4>\
                                <div class="highlight" style="padding:0px 9px;margin-bottom:0px;border:2px;">\
                                    <p id="data_ea_'+num+'" ></p>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="col-md-2" style="width:8%;padding-left:7px;padding-right:7px;">\
                            <h4> #TR1 </h4>\
                            <div class="highlight" style="padding:0px 9px;margin-bottom:0px;border:2px;">\
                                <p id="data_TR1_'+num+'" ></p>\
                            </div>\
                        </div>\
                        <div class="col-md-2" style="width:8%;padding-left:7px;padding-right:7px;">\
                            <h4> #TR2 </h4>\
                            <div class="highlight" style="padding:0px 9px;margin-bottom:0px;border:2px;">\
                                <p id="data_TR2_'+num+'" ></p>\
                            </div>\
                        </div>\
                        <div class="col-md-2" style="width:12%;padding-left:0px;padding-right:0px;">\
                            <h4> Delta </h4>\
                            <div class="highlight" style="padding:0px 9px;margin-bottom:0px;border:2px;">\
                                <p id="data_delta_'+num+'" ></p>\
                            </div>\
                        </div>\
                        <div class="col-md-4" style="padding-left:5px;padding-right:0px;width:8%;margin-left:5px;">\
                            <div style="margin-top:37px;">\
                                <span class="image_wrapper" data-toggle="tooltip" data-placement="top" data-original-title="Event Image">\
                                    <div class="btn-group">\
                                        <button type="button" id="imageLabel" data-target="#" href="http://example.com" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false" class="btn btn_mb btn-primary glyphicon glyphicon-picture">\
                                                <span class="caret"></span>\
                                        </button>\
                                        <ul class="dropdown-menu" role="menu" aria-labelledby="imageLabel">\
                                            <li id="imageshow_'+num+'" class="imageshow" data-toggle="modal" data-target="#myShowImageModal"><a>Show</a></li>\
                                        </ul>\
                                    </div>\
                                </span>\
                                <span class="eventinfo_wrapper" data-toggle="tooltip" data-placement="bottom" data-original-title="Show event info">\
                                    <button id="eventinfo_'+num+'" class="btn btn_mb btn-primary eventinfo glyphicon glyphicon-info-sign" data-toggle="modal" data-target="#myShowEventInfoModal">\
                                    </button>\
                                </span>\
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

        $("#data_ec_"+num).text(String(behavior_data.event.category));
        $("#data_ea_"+num).text(String(behavior_data.event.action));
        $("#data_es_"+num).text(behavior_data.event.service);
        $("#data_ed_"+num).text(behavior_data.event.device);
        $("#data_el_"+num).text(String(behavior_data.event.label));
        $("#data_TR1_"+num).text(behavior_data.count_TR1);
        $("#data_TR2_"+num).text(behavior_data.count_TR2);
        

        if(behavior_data.count_TR2-behavior_data.count_TR1>0){
            $("#data_delta_"+num).text(String(behavior_data.count_TR2-behavior_data.count_TR1)+"    ("+String(parseInt(100*(behavior_data.count_TR2-behavior_data.count_TR1)/behavior_data.count_TR1))+"%)"+ "  ▲");    
        }
        else{
            $("#data_delta_"+num).text(String(behavior_data.count_TR2-behavior_data.count_TR1)+"    ("+String(parseInt(100*(behavior_data.count_TR2-behavior_data.count_TR1)/behavior_data.count_TR1))+"%)"+ "  ▼");
        }
        

    }

    $('#getList').click(function(event) {
        console.log("inside #updateList function");
        event.preventDefault();
        var TR1FromDate = $('#dp1').val();
        var TR1ToDate = $('#dp2').val();
        var TR2FromDate = $('#dp3').val();
        var TR2ToDate = $('#dp4').val();
        var var_temp_event_service = $("#dLabel").text().slice(0,-1);
        var var_temp_event_device = $("#deviceLabel").text().slice(0,-1);
        
        if($('#dp1').val() && $('#dp2').val() && $('#dp3').val() && $('#dp4').val()){
            
            if(moment(TR2ToDate,'DD-MM-YYYY')>=moment(TR2FromDate,'DD-MM-YYYY') && 
                moment(TR2FromDate,'DD-MM-YYYY')>=moment(TR1ToDate,'DD-MM-YYYY') && 
                moment(TR1ToDate,'DD-MM-YYYY')>=moment(TR1FromDate,'DD-MM-YYYY')
            ){

                $("#overlay").show()
                $.ajax({
                    type: "GET",
                    url: "/trackeasy/misbehave/",
                    data: {
                        'name': 'get_updated_data',
                        'service': var_temp_event_service,
                        'device': var_temp_event_device,
                        'TR1_fromDate': TR1FromDate,
                        'TR1_toDate': TR1ToDate,
                        'TR2_fromDate': TR2FromDate,
                        'TR2_toDate': TR2ToDate,
                    },
                    success: function(data) {
                        console.log("Ajax: GET success with service selection and device selection ", var_temp_event_service, var_temp_event_device);
                        console.log(data)
                        $("#behavior_list").html("");
                        data.audit_data.sort(function(x,y){
                                            var perc_x = 0
                                            var prec_y = 0
                                            if (x.count_TR1==0 && y.count_TR2!=0){
                                                return 0 - Math.abs(100*(y.count_TR2-y.count_TR1)/y.count_TR1)
                                            }
                                            else if(x.count_TR1!=0 && y.count_TR2==0){
                                                return Math.abs(100*(x.count_TR2-x.count_TR1)/x.count_TR1) - 0
                                            }
                                            else if(x.count_TR1==0 && y.count_TR2==0){
                                                return 0
                                            }
                                            else{
                                                return Math.abs(100*(x.count_TR2-x.count_TR1)/x.count_TR1) - Math.abs(100*(y.count_TR2-y.count_TR1)/y.count_TR1)
                                            }
                                            
                                            })
                        for (var i = data.audit_data.length - 1; i >= 0; i--) {
                            createList(data.audit_data[i]);
                        };
                        $.ajax({
                            type: "GET",
                            url: "/trackeasy/misbehave/",
                            data: {
                                'name': 'get_misbehave_update_details',
                            },
                            success: function(data) {
                                console.log("Ajax: GET success with service selection and device selection ", var_temp_event_service, var_temp_event_device);
                                alert("data latest to "+"today morning")
                                
                            },
                            error: function(err) {
                                console.log("Ajax: Get error: ", err);
                            }
                        })
                        $("#overlay").hide()
                        $("#updateList").removeAttr("disabled");
                    },
                    error: function(err) {
                        console.log("Ajax: GET error: ", err);
                        $("#overlay").hide()
                        $("#updateList").removeAttr("disabled");
                    }
                })
            }
            else{
                alert("Time ranges must be in order and no overlaps are allowed. Time range 2 is required to be in future of Time range 1")
                $("#overlay").hide()
            }
        }
        else{
            alert("Set date-durations first, leave no date blank")
            $("#overlay").hide()
        }
    });
    
    $('#updateList').click(function(event) {
        $("#overlay").show()
        console.log("inside #updateList function");
        event.preventDefault();
        var TR1FromDate = $('#dp1').val();
        var TR1ToDate = $('#dp2').val();
        var TR2FromDate = $('#dp3').val();
        var TR2ToDate = $('#dp4').val();
        var var_temp_event_service = $("#dLabel").text().slice(0,-1);
        var var_temp_event_device = $("#deviceLabel").text().slice(0,-1);
        if($('#dp1').val() && $('#dp2').val() && $('#dp3').val() && $('#dp4').val()){
            if(moment(TR2ToDate,'DD-MM-YYYY')>=moment(TR2FromDate,'DD-MM-YYYY') && 
                moment(TR2FromDate,'DD-MM-YYYY')>=moment(TR1ToDate,'DD-MM-YYYY') && 
                moment(TR1ToDate,'DD-MM-YYYY')>=moment(TR1FromDate,'DD-MM-YYYY')
            ){

                $.ajax({
                    type: "GET",
                    url: "/trackeasy/misbehave/",
                    data: {
                        'name': 'get_latest_data',
                        'service': var_temp_event_service,
                        'device': var_temp_event_device,
                        'TR1_fromDate': TR1FromDate,
                        'TR1_toDate': TR1ToDate,
                        'TR2_fromDate': TR2FromDate,
                        'TR2_toDate': TR2ToDate,
                    },
                    success: function(data) {
                        console.log("Ajax: GET success with service selection and device selection ", var_temp_event_service, var_temp_event_device);
                        console.log(data)
                        $("#behavior_list").html("");
                        data.audit_data.sort(function(x,y){
                                            var perc_x = 0
                                            var prec_y = 0
                                            if (x.count_TR1==0 && y.count_TR2!=0){
                                                return 0 - Math.abs(100*(y.count_TR2-y.count_TR1)/y.count_TR1)
                                            }
                                            else if(x.count_TR1!=0 && y.count_TR2==0){
                                                return Math.abs(100*(x.count_TR2-x.count_TR1)/x.count_TR1) - 0
                                            }
                                            else if(x.count_TR1==0 && y.count_TR2==0){
                                                return 0
                                            }
                                            else{
                                                return Math.abs(100*(x.count_TR2-x.count_TR1)/x.count_TR1) - Math.abs(100*(y.count_TR2-y.count_TR1)/y.count_TR1)
                                            }
                                            
                                            })
                        for (var i = data.audit_data.length - 1; i >= 0; i--) {
                            createList(data.audit_data[i]);
                        };
                        $.ajax({
                            type: "GET",
                            url: "/trackeasy/misbehave/",
                            data: {
                                'name': 'get_misbehave_update_details',
                            },
                            success: function(data) {
                                console.log("Ajax: GET success with service selection and device selection ", var_temp_event_service, var_temp_event_device);
                                alert("data latest to "+"now")
                                
                            },
                            error: function(err) {
                                console.log("Ajax: Get error: ", err);
                            }
                        })
                        $("#overlay").hide()
                    },
                    error: function(err) {
                        console.log("Ajax: GET error: ", err);
                    }
                })
            }
            else{
                alert("Time ranges must be in order and no overlaps are allowed. Time range 2 is required to be in future of Time range 1")
                $("#overlay").hide()
            }
        }
        else{
            alert("Set date-durations first, leave no date blank")
            $("#overlay").hide()
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

});