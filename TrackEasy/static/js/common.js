$(function(){

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