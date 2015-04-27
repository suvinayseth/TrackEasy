
# Create your views here.

from models import *
from django.shortcuts import render_to_response,redirect
from django.shortcuts import render
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt
from django.template import RequestContext
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse
from django.http import HttpResponse
from pymongo import *
import bson
from bson.objectid import ObjectId
from bson.json_util import dumps
import json
import datetime
import time
from forms import UploadForm
import os
import collections
from collections import defaultdict


service_map_dict = {
	'All':'all',
	'Rent':'rent',
	'Buy':'buy',
	'New Projects':'new-projects',
	'PG & Hostels':'pg',
	'Home Loans':'home-loans',
	'Sell or Rent Property':'sell or rent property',
	'Serviced Apartments':'serviced-apartments',
	'Rental Agreements':'rental-agreements',
	'Land':'land',
	'Plot Projects':'plot-projects',
	'Agents':'agents',
	'all':'all',
	'rent':'rent',
	'buy':'buy',
	'new projects':'new-projects',
	'pg & hostels':'pg',
	'home loans':'home-loans',
	'sell or rent property':'sell or rent property',
	'serviced apartments':'serviced-apartments',
	'rental agreements':'rental-agreements',
	'land':'land',
	'plot projects':'plot-projects',
	'agents':'agents',
	'new-projects':'new-projects',
	'home-loans':'home-loans',
	'serviced-apartments':'serviced-apartments',
	'rental-agreements':'rental-agreements',
	'land':'land',
	'plot-projects':'plot-projects'
}
device_map_dict = {
	'All':'all',
	'Mobile Web':'mobile',
	'Desktop':'desktop',
	'Android':'android',
	'IOS':'ios',
	'mobile web':'mobile',
	'all':'all',
	'mobile':'mobile',
	'desktop':'desktop',
	'android':'android',
	'ios':'ios'
}


@csrf_exempt
def track_app(request):
	
	# print request
	if request.POST:
		# print request.POST
		# print request.POST['event_category']
		if request.POST['name']=='add_event':
			data={}
			data['is_duplicate']=1

			if(len(tracking_events_log.objects(event__category = request.POST['event_category'], event__action = request.POST['event_action'], event__service = service_map_dict[request.POST['event_service']], event__device = device_map_dict[request.POST['event_device']]))==0 ):
				te = tracking_events(
					category = request.POST['event_category'],
					action = request.POST['event_action'],
					service = service_map_dict[request.POST['event_service']],
					label = [i.strip() for i in request.POST['event_label'].split(',')],
					device = device_map_dict[request.POST['event_device']]
					)
				doc_te = tracking_events_log(
					event = te
					)
				doc_te.save()
				data['is_duplicate']=0

			elif(len(tracking_events_log.objects(event__category = request.POST['event_category'], event__action = request.POST['event_action'], event__service = service_map_dict[request.POST['event_service']], event__device = device_map_dict[request.POST['event_device']]))>0):
				data['is_duplicate']=1

			return HttpResponse(json.dumps(data), content_type="application/json")


	if request.is_ajax() and not request.POST:
		if request.GET['name']=='getDataByServiceAndDevice':
			data={}
			print 'this is GET request AJAX',request.GET
			data['backlog']=[]
			data['approved']=[]
			# TODO : validate data
			print 'if match starts'
			print service_map_dict[request.GET['service']] != 'all' , device_map_dict[request.GET['device']] != 'all',service_map_dict[request.GET['service']] == 'all',device_map_dict[request.GET['device']] == 'all'
			if(service_map_dict[request.GET['service']] != 'all' and device_map_dict[request.GET['device']] != 'all'):
				print 'if 1'
				for var_te in tracking_events_log.objects(event__service=service_map_dict[request.GET['service']],event__device=device_map_dict[request.GET['device']]).order_by('id'):
					if(var_te['fe_tick_state']==True and var_te['pa_tick_state']==True):
						data['approved'].append(var_te.to_json())
					else:
						data['backlog'].append(var_te.to_json())
			elif(service_map_dict[request.GET['service']] == 'all' and device_map_dict[request.GET['device']] != 'all'):
				print 'if 2'
				for var_te in tracking_events_log.objects(event__device=device_map_dict[request.GET['device']]).order_by('id'):
					if(var_te['fe_tick_state']==True and var_te['pa_tick_state']==True):
						data['approved'].append(var_te.to_json())
					else:
						data['backlog'].append(var_te.to_json())
			elif(service_map_dict[request.GET['service']] != 'all' and device_map_dict[request.GET['device']] == 'all'):
				print 'if 3'
				for var_te in tracking_events_log.objects(event__service=service_map_dict[request.GET['service']]).order_by('id'):
					if(var_te['fe_tick_state']==True and var_te['pa_tick_state']==True):
						data['approved'].append(var_te.to_json())
					else:
						data['backlog'].append(var_te.to_json())
			elif(service_map_dict[request.GET['service']] == 'all' and device_map_dict[request.GET['device']] == 'all'):
				print 'if 4'
				for var_te in tracking_events_log.objects().order_by('id'):
					if(var_te['fe_tick_state']==True and var_te['pa_tick_state']==True):
						data['approved'].append(var_te.to_json())
					else:
						data['backlog'].append(var_te.to_json())
			print json.dumps(data)
			return HttpResponse(json.dumps(data), content_type="application/json")
	
	if request.is_ajax() and request.GET and request.GET['name']=='get_suggestion_data':
		print request
		suggestions = suggestion_data.objects[0].to_json()
		return HttpResponse(suggestions, content_type="application/json")

	form = UploadForm()
	print form
	return render_to_response('Tracking/trackeasy.html',
		{'form': form},
		context_instance=RequestContext(request))



@csrf_exempt
def edit(request):
	# print "Inside edit"
	# print request.POST['name']
	if(request.is_ajax() and request.POST['name']=='fe_confirm'):
		doc_id = bson.objectid.ObjectId(request.POST['id'])
		doc = tracking_events_log.objects.get(id=doc_id)
		if(request.POST['status']=='true'):
			status = True
		elif(request.POST['status']=='false'):
			status=False
		doc.fe_tick_state = status
		doc.fe_checked_date_latest = datetime.datetime.now
		doc.save()

	elif(request.is_ajax() and request.POST['name']=='pa_confirm'):
		doc_id = bson.objectid.ObjectId(request.POST['id'])
		doc = tracking_events_log.objects.get(id=doc_id)
		doc.pa_tick_state = True
		doc.pa_checked_date = datetime.datetime.now
		doc.save()

	elif(request.is_ajax() and request.POST['name']=='editEvent'):
		data={}
		data['is_duplication']=1
		flag=0
		var_objects = tracking_events_log.objects(event__category = request.POST['event_category'], event__action = request.POST['event_action'], event__service = service_map_dict[request.POST['event_service']], event__device = device_map_dict[request.POST['event_device']])
		if len(var_objects)==0:
			flag=1
		elif len(var_objects)==1 and var_objects[0].id == request.POST['id']:
			flag=1
		else:
			flag=0

		if flag:
			doc_id = bson.objectid.ObjectId(request.POST['id'])
			doc = tracking_events_log.objects.get(id=doc_id)
			doc.event.category = request.POST['event_category']
			doc.event.action = request.POST['event_action']
			print 'post request from edit',request.POST['event_service']
			doc.event.service = service_map_dict[request.POST['event_service']]
			doc.event.device = device_map_dict[request.POST['event_device']]
			doc.event.label = [i.strip() for i in request.POST['event_label'].split(',')]
			doc.event_creation_date = datetime.datetime.now
			doc.save()
			data['is_duplication']=0
		else:
			data['is_duplication']=1

		return HttpResponse(json.dumps(data), content_type="application/json")

	elif(request.is_ajax() and request.POST['name']=='deleteEvent'):
		# print 'trugn to delete'
		doc_id = bson.objectid.ObjectId(request.POST['id'])
		doc = tracking_events_log.objects.get(id=doc_id)
		if(doc.event_image_path!=None):
			os.remove(doc.event_image_path)
		doc.delete()

	elif(request.is_ajax() and request.POST['name']=='duplicateEvent'):
		doc_id = bson.objectid.ObjectId(request.POST['id'])
		doc = tracking_events_log.objects.get(id=doc_id)
		te = tracking_events(
			category = doc['event_category'],
			action = doc['event_action'],
			service = service_map_dict[doc['event_service']],
			label = [i.strip() for i in doc['event_label'].split(',')],
			device = device_map_dict[doc['event_device']]
			)
		duplicate_doc = tracking_events_log(
			event=te
			)
		duplicate_doc.save()

	elif(request.is_ajax() == False and request.method == 'POST'):
		if 'upload_file' in request.FILES and 'uploadeventId' in request.POST:
			print 'print post and files',request.FILES.keys(),request.POST.keys(), 'upload_file' in request.FILES, 'uploadeventId' in request.POST
			form = UploadForm(request.POST, request.FILES)
			doc_id = bson.objectid.ObjectId(request.POST['uploadeventId']) 
			if form.is_valid():
				var_image=request.FILES['upload_file'].read()
				event_image_filename = request.POST['uploadeventId']+".png"
				event_image_filepath = 'TrackEasy/static/images/'+event_image_filename
				fh = open(event_image_filepath, "wb")
				fh.write(var_image)
				fh.close()
				doc = tracking_events_log.objects.get(id=doc_id)
				doc.event_image_path = event_image_filepath
				doc.save()
				return redirect('/trackeasy/')
			else:
				return redirect('/trackeasy/')

	elif(request.is_ajax() and request.method == 'GET' ):
		print 'print getting event info',request.GET
		form = UploadForm(request.POST, request.FILES)
		doc_id = bson.objectid.ObjectId(request.GET['id'])
		doc = tracking_events_log.objects.get(id=doc_id) 
		fe_date = doc.fe_checked_date_latest
		pa_date = doc.pa_checked_date
		print 'dates', fe_date, pa_date

	# print data
	return render_to_response('Tracking/trackeasy.html')



@csrf_exempt
def get_info(request):
	print "Inside get_info"
	
	if(request.is_ajax() and request.method == 'GET'):
		if (request.GET['name']=='geteventinfo'):
			print 'print getting event info',request.GET
			doc_id = bson.objectid.ObjectId(request.GET['id'])
			doc = tracking_events_log.objects.get(id=doc_id) 
			fe_date = str(doc.fe_checked_date_latest)
			pa_date = str(doc.pa_checked_date)
			creation_date = str(doc.event_creation_date)
			print 'dates', fe_date, pa_date
			data={}
			data['fe_date']=fe_date
			data['pa_date']=pa_date
			data['creation_date']=creation_date
			data['comments']=[]
			for var_index in range(len(doc.event_comments)):
				data['comments'].append(doc.event_comments[var_index].to_json())

			# data = [fe_date, pa_date]
			print 'printed'
			# data = data.to_json()
			print json.dumps(data)
			return HttpResponse(json.dumps(data), content_type="application/json")

	elif(request.is_ajax() and request.method == 'POST'):
		if (request.POST['name']=='addComment'):
			print 'print adding Comment',request.POST
			doc_id = bson.objectid.ObjectId(request.POST['id'])
			doc = tracking_events_log.objects.get(id=doc_id)
			comment_doc = tracking_events_comments(author=request.POST['author'],comment=request.POST['comment']) 
			doc.event_comments.append(comment_doc)
			doc.save()

	# print data
	return render_to_response('Tracking/trackeasy.html')



@csrf_exempt
def mismatch_app(request):
	print "Inside mismatch app"

	if request.is_ajax() and request.GET:
		
		if request.GET['name']=='get_latest_match_audit_data':
			
			data={}
			print 'this is GET request AJAX',request.GET
			data['match']=[]
			
			analytics_con = MongoClient('mongodb://dsl_read:dsl@localhost:3338/analytics',read_preference = ReadPreference.SECONDARY)
			analytics_db = 'analytics'
			trackeasy_con = MongoClient(host='localhost',port=27017)
			trackeasy_db='vasu'
			trackeasy_coll = trackeasy_con[trackeasy_db]['tracking_events_log']
			print 'mongo connections made'
			
			y = datetime.datetime.now().date() - datetime.timedelta(days = 2)
			ts_y =  int(time.mktime(y.timetuple())*1000)
			yutcd = datetime.datetime.utcfromtimestamp(ts_y/1000)
			yutcoid = ObjectId.from_datetime(yutcd)
			
			if(service_map_dict[request.GET['service']] != 'all' and device_map_dict[request.GET['device']] != 'all'):
				
				trackeasy_overall_data = trackeasy_coll.find({'fe_tick_state':True,'pa_tick_state':True, 'event.service':service_map_dict[request.GET['service']], 'event.device':device_map_dict[request.GET['device']]})
				trackeasy_distinct_categories = trackeasy_overall_data.distinct('event.category')
				print 'trackeasy_data_loaded', trackeasy_distinct_categories
				trackeasy_overall_data = None
				
				for var_category in trackeasy_distinct_categories:
					print var_category
					var_analytics_coll = analytics_con[analytics_db][var_category]
					print 'category\'s collection loaded'
					ticker=0
					for var_te in trackeasy_coll.find({'fe_tick_state':True,'pa_tick_state':True,'event.category':var_category, 'event.service':service_map_dict[request.GET['service']], 'event.device':device_map_dict[request.GET['device']]}):
						print ticker+1
						if var_analytics_coll.find_one({'_id':{'$gte':yutcoid},'service':var_te['event']['service'], 'action':var_te['event']['action'], 'device':var_te['event']['device']})!=None:
							data['match'].append(dumps(var_te))
							print 'match'
						ticker+=1
			
			elif(service_map_dict[request.GET['service']] == 'all' and device_map_dict[request.GET['device']] != 'all'):
				
				trackeasy_overall_data = trackeasy_coll.find({'fe_tick_state':True,'pa_tick_state':True, 'event.device':device_map_dict[request.GET['device']]})
				trackeasy_distinct_categories = trackeasy_overall_data.distinct('event.category')
				print 'trackeasy_data_loaded', trackeasy_distinct_categories
				trackeasy_overall_data = None
				
				for var_category in trackeasy_distinct_categories:
					print var_category
					var_analytics_coll = analytics_con[analytics_db][var_category]
					print 'category\'s collection loaded'
					ticker=0
					for var_te in trackeasy_coll.find({'fe_tick_state':True,'pa_tick_state':True,'event.category':var_category, 'event.device':device_map_dict[request.GET['device']]}):
						print ticker+1
						if var_analytics_coll.find_one({'_id':{'$gte':yutcoid},'service':var_te['event']['service'], 'action':var_te['event']['action'], 'device':var_te['event']['device']})!=None:
							data['match'].append(dumps(var_te))
							print 'match'
						ticker+=1
			
			elif(service_map_dict[request.GET['service']] != 'all' and device_map_dict[request.GET['device']] == 'all'):
				
				trackeasy_overall_data = trackeasy_coll.find({'fe_tick_state':True,'pa_tick_state':True, 'event.service':service_map_dict[request.GET['service']]})
				trackeasy_distinct_categories = trackeasy_overall_data.distinct('event.category')
				print 'trackeasy_data_loaded', trackeasy_distinct_categories
				trackeasy_overall_data = None
				
				for var_category in trackeasy_distinct_categories:
					print var_category
					var_analytics_coll = analytics_con[analytics_db][var_category]
					print 'category\'s collection loaded'
					ticker=0
					for var_te in trackeasy_coll.find({'fe_tick_state':True,'pa_tick_state':True,'event.category':var_category, 'event.service':service_map_dict[request.GET['service']]}):
						print ticker+1
						if var_analytics_coll.find_one({'_id':{'$gte':yutcoid},'service':var_te['event']['service'], 'action':var_te['event']['action'], 'device':var_te['event']['device']})!=None:
							data['match'].append(dumps(var_te))
							print 'match'
						ticker+=1
			
			elif(service_map_dict[request.GET['service']] == 'all' and device_map_dict[request.GET['device']] == 'all'):
				
				trackeasy_overall_data = trackeasy_coll.find({'fe_tick_state':True,'pa_tick_state':True})
				trackeasy_distinct_categories = trackeasy_overall_data.distinct('event.category')
				print 'trackeasy_data_loaded', trackeasy_distinct_categories
				trackeasy_overall_data = None
				
				for var_category in trackeasy_distinct_categories:
					print var_category
					var_analytics_coll = analytics_con[analytics_db][var_category]
					print 'category\'s collection loaded'
					ticker=0
					for var_te in trackeasy_coll.find({'fe_tick_state':True,'pa_tick_state':True,'event.category':var_category}):
						print ticker+1
						if var_analytics_coll.find_one({'_id':{'$gte':yutcoid},'service':var_te['event']['service'], 'action':var_te['event']['action'], 'device':var_te['event']['device']})!=None:
							data['match'].append(dumps(var_te))
							print 'match'
						
			print json.dumps(data)
			return HttpResponse(json.dumps(data), content_type="application/json")

		if request.GET['name']=='get_latest_mismatch_audit_data':
			
			data={}
			print 'this is GET request AJAX',request.GET
			data['mismatch']=[]
			
			analytics_con = MongoClient('mongodb://dsl_read:dsl@localhost:3338/analytics',read_preference = ReadPreference.SECONDARY)
			analytics_db = 'analytics'
			trackeasy_con = MongoClient(host='localhost',port=27017)
			trackeasy_db='vasu'
			trackeasy_coll = trackeasy_con[trackeasy_db]['tracking_events_log']
			print 'mongo connections made'
			
			y = datetime.datetime.now().date() - datetime.timedelta(days = 2)
			ts_y =  int(time.mktime(y.timetuple())*1000)
			yutcd = datetime.datetime.utcfromtimestamp(ts_y/1000)
			yutcoid = ObjectId.from_datetime(yutcd)
			
			if(service_map_dict[request.GET['service']] != 'all' and device_map_dict[request.GET['device']] != 'all'):
				
				trackeasy_overall_data = trackeasy_coll.find({'fe_tick_state':True,'pa_tick_state':True, 'event.service':service_map_dict[request.GET['service']], 'event.device':device_map_dict[request.GET['device']]})
				trackeasy_distinct_categories = trackeasy_overall_data.distinct('event.category')
				print 'trackeasy_data_loaded', trackeasy_distinct_categories
				trackeasy_overall_data = None
				
				for var_category in trackeasy_distinct_categories:
					print var_category
					var_analytics_coll = analytics_con[analytics_db][var_category]
					print 'category\'s collection loaded'
					ticker=0
					for var_te in trackeasy_coll.find({'fe_tick_state':True,'pa_tick_state':True,'event.category':var_category, 'event.service':service_map_dict[request.GET['service']], 'event.device':device_map_dict[request.GET['device']]}):
						print ticker+1
						if var_analytics_coll.find_one({'_id':{'$gte':yutcoid},'service':var_te['event']['service'], 'action':var_te['event']['action'], 'device':var_te['event']['device']})==None:
							data['mismatch'].append(dumps(var_te))
							print 'mismatch'
						ticker+=1
			
			elif(service_map_dict[request.GET['service']] == 'all' and device_map_dict[request.GET['device']] != 'all'):
				
				trackeasy_overall_data = trackeasy_coll.find({'fe_tick_state':True,'pa_tick_state':True, 'event.device':device_map_dict[request.GET['device']]})
				trackeasy_distinct_categories = trackeasy_overall_data.distinct('event.category')
				print 'trackeasy_data_loaded', trackeasy_distinct_categories
				trackeasy_overall_data = None
				
				for var_category in trackeasy_distinct_categories:
					print var_category
					var_analytics_coll = analytics_con[analytics_db][var_category]
					print 'category\'s collection loaded'
					ticker=0
					for var_te in trackeasy_coll.find({'fe_tick_state':True,'pa_tick_state':True,'event.category':var_category, 'event.device':device_map_dict[request.GET['device']]}):
						print ticker+1
						if var_analytics_coll.find_one({'_id':{'$gte':yutcoid},'service':var_te['event']['service'], 'action':var_te['event']['action'], 'device':var_te['event']['device']})==None:
							data['mismatch'].append(dumps(var_te))
							print 'mismatch'
						ticker+=1
			
			elif(service_map_dict[request.GET['service']] != 'all' and device_map_dict[request.GET['device']] == 'all'):
				
				trackeasy_overall_data = trackeasy_coll.find({'fe_tick_state':True,'pa_tick_state':True, 'event.service':service_map_dict[request.GET['service']]})
				trackeasy_distinct_categories = trackeasy_overall_data.distinct('event.category')
				print 'trackeasy_data_loaded', trackeasy_distinct_categories
				trackeasy_overall_data = None
				
				for var_category in trackeasy_distinct_categories:
					print var_category
					var_analytics_coll = analytics_con[analytics_db][var_category]
					print 'category\'s collection loaded'
					ticker=0
					for var_te in trackeasy_coll.find({'fe_tick_state':True,'pa_tick_state':True,'event.category':var_category, 'event.service':service_map_dict[request.GET['service']]}):
						print ticker+1
						if var_analytics_coll.find_one({'_id':{'$gte':yutcoid},'service':var_te['event']['service'], 'action':var_te['event']['action'], 'device':var_te['event']['device']})==None:
							data['mismatch'].append(dumps(var_te))
							print 'mismatch'
						ticker+=1
			
			elif(service_map_dict[request.GET['service']] == 'all' and device_map_dict[request.GET['device']] == 'all'):
				
				trackeasy_overall_data = trackeasy_coll.find({'fe_tick_state':True,'pa_tick_state':True})
				trackeasy_distinct_categories = trackeasy_overall_data.distinct('event.category')
				print 'trackeasy_data_loaded', trackeasy_distinct_categories
				trackeasy_overall_data = None
				
				for var_category in trackeasy_distinct_categories:
					print var_category
					var_analytics_coll = analytics_con[analytics_db][var_category]
					print 'category\'s collection loaded'
					ticker=0
					for var_te in trackeasy_coll.find({'fe_tick_state':True,'pa_tick_state':True,'event.category':var_category}):
						print ticker+1
						if var_analytics_coll.find_one({'_id':{'$gte':yutcoid},'service':var_te['event']['service'], 'action':var_te['event']['action'], 'device':var_te['event']['device']})==None:
							data['mismatch'].append(dumps(var_te))
							print 'mismatch'
						
			print json.dumps(data)
			return HttpResponse(json.dumps(data), content_type="application/json")
		
		if request.GET['name']=='get_audit_data':
			data={}
			print 'this is GET request AJAX',request.GET
			data['match']=[]
			data['mismatch']=[]

			if(service_map_dict[request.GET['service']] != 'all' and device_map_dict[request.GET['device']] != 'all'):
				for var_te in tracking_events_log.objects(event__service=service_map_dict[request.GET['service']],event__device=device_map_dict[request.GET['device']],fe_tick_state=True, pa_tick_state=True).order_by('id'):
					try:
						temp = tracking_events_audit.objects(event=json.loads(var_te.event.to_json()))[0]
						if temp.has_mongo_match :
							data['match'].append(var_te.to_json())
						elif temp.has_mongo_match==False :
							data['mismatch'].append(var_te.to_json())
					except:
						data['mismatch'].append(var_te.to_json())
			elif(service_map_dict[request.GET['service']] == 'all' and device_map_dict[request.GET['device']] != 'all'):
				for var_te in tracking_events_log.objects(event__device=device_map_dict[request.GET['device']],fe_tick_state=True, pa_tick_state=True).order_by('id'):
					try:
						temp = tracking_events_audit.objects(event=json.loads(var_te.event.to_json()))[0]
						if temp.has_mongo_match:
							data['match'].append(var_te.to_json())
						elif temp.has_mongo_match==False:
							data['mismatch'].append(var_te.to_json())
					except:
						data['mismatch'].append(var_te.to_json())
			elif(service_map_dict[request.GET['service']] != 'all' and device_map_dict[request.GET['device']] == 'all'):
				for var_te in tracking_events_log.objects(event__service=service_map_dict[request.GET['service']],fe_tick_state=True, pa_tick_state=True).order_by('id'):
					try:
						temp = tracking_events_audit.objects(event=json.loads(var_te.event.to_json()))[0]
						if temp.has_mongo_match:
							data['match'].append(var_te.to_json())
						elif temp.has_mongo_match==False:
							data['mismatch'].append(var_te.to_json())
					except:
						data['mismatch'].append(var_te.to_json())
			elif(service_map_dict[request.GET['service']] == 'all' and device_map_dict[request.GET['device']] == 'all'):
				for var_te in tracking_events_log.objects(fe_tick_state=True, pa_tick_state=True).order_by('id'):
					try:
						temp = tracking_events_audit.objects(event=json.loads(var_te.event.to_json()))[0]
						if temp.has_mongo_match:
							data['match'].append(var_te.to_json())
						elif temp.has_mongo_match==False:
							data['mismatch'].append(var_te.to_json())
					except:
						data['mismatch'].append(var_te.to_json())
			return HttpResponse(json.dumps(data), content_type="application/json")

		
			
	return render_to_response('Tracking/mismatch.html',
		context_instance=RequestContext(request))
	

@csrf_exempt
def misbehave_app(request):
	print "Inside misbehave app"
	if request.is_ajax() and request.GET:
		if request.GET['name']=='get_latest_data':
			print request.GET
			print 'inside get_latest_data match'

			TR1_fromdate = request.GET['TR1_fromDate']
			TR1_todate = request.GET['TR1_toDate']

			TR2_fromdate = request.GET['TR2_fromDate']
			TR2_todate = request.GET['TR2_toDate']

			TR1_fromdate_array = TR1_fromdate.encode('utf-8').split("/")
			TR1_todate_array = TR1_todate.encode('utf-8').split("/")
			print TR1_fromdate_array,TR1_todate_array

			TR2_fromdate_array = TR2_fromdate.encode('utf-8').split("/")
			TR2_todate_array = TR2_todate.encode('utf-8').split("/")
			print TR2_fromdate_array,TR2_todate_array

			TR1_fromdate_day = TR1_fromdate_array[0]
			TR1_fromdate_month = TR1_fromdate_array[1]
			TR1_fromdate_year = TR1_fromdate_array[2]
			TR1_todate_day = TR1_todate_array[0]
			TR1_todate_month = TR1_todate_array[1]
			TR1_todate_year = TR1_todate_array[2]

			TR2_fromdate_day = TR2_fromdate_array[0]
			TR2_fromdate_month = TR2_fromdate_array[1]
			TR2_fromdate_year = TR2_fromdate_array[2]
			TR2_todate_day = TR2_todate_array[0]
			TR2_todate_month = TR2_todate_array[1]
			TR2_todate_year = TR2_todate_array[2]

			# print int(fromdate_year)
			main_y1 = datetime.datetime(int(TR1_fromdate_year), int(TR1_fromdate_month), int(TR1_fromdate_day))
			main_t1 = datetime.datetime(int(TR1_todate_year), int(TR1_todate_month), int(TR1_todate_day)) + datetime.timedelta(days=1)
			num_days_1 = (main_t1-main_y1).days

			main_y2 = datetime.datetime(int(TR2_fromdate_year), int(TR2_fromdate_month), int(TR2_fromdate_day))
			main_t2 = datetime.datetime(int(TR2_todate_year), int(TR2_todate_month), int(TR2_todate_day)) + datetime.timedelta(days=1)
			num_days_2 = (main_t2-main_y2).days

			data={}
			data['audit_data'] = []
			analytics_con = MongoClient('mongodb://dsl_read:dsl@localhost:3338/analytics',read_preference = ReadPreference.SECONDARY)
			analytics_db = 'analytics'
			trackeasy_con = MongoClient(host='localhost',port=27017)
			trackeasy_db='vasu'
			trackeasy_coll = trackeasy_con[trackeasy_db]['tracking_events_log']
			print 'mongo connections made'

			def get_count(coll,event):
				count1=0
				count2=0
				print 'num_days_1', num_days_1
				for i in xrange(num_days_1):
					print i
					y1 = main_y1 + datetime.timedelta(days=i)
					t1 = main_y1 + datetime.timedelta(days=i+1)
					print "dates are:"
					print y1,t1
					ts_y1 =  int(time.mktime(y1.timetuple())*1000)
					ts_t1 = int(time.mktime(t1.timetuple())*1000)
					yutcd1 = datetime.datetime.utcfromtimestamp(ts_y1/1000)
					tutcd1 = datetime.datetime.utcfromtimestamp(ts_t1/1000)
					yutcoid1 = ObjectId.from_datetime(yutcd1)
					tutcoid1 = ObjectId.from_datetime(tutcd1)
					print yutcoid1, tutcoid1
					count1 += len(coll.find({'_id': {'$gte': yutcoid1, '$lte': tutcoid1}, 'service': event['service'], 'device':event['device'], 'action':event['action']}).distinct('uid'))
				print 'num_days_2', num_days_2
				for i in xrange(num_days_2):
					print i
					y2 = main_y2 + datetime.timedelta(days=i)
					t2 = main_y2 + datetime.timedelta(days=i+1)
					print "dates are:"
					print y2,t2
					ts_y2 =  int(time.mktime(y2.timetuple())*1000)
					ts_t2 = int(time.mktime(t2.timetuple())*1000)
					yutcd2 = datetime.datetime.utcfromtimestamp(ts_y2/1000)
					tutcd2 = datetime.datetime.utcfromtimestamp(ts_t2/1000)
					yutcoid2 = ObjectId.from_datetime(yutcd2)
					tutcoid2 = ObjectId.from_datetime(tutcd2)
					print yutcoid2, tutcoid2
					count2 += len(coll.find({'_id': {'$gte': yutcoid2, '$lte': tutcoid2}, 'service': event['service'], 'device':event['device'], 'action':event['action']}).distinct('uid'))

				return (count1,count2)
				

			
			if(service_map_dict[request.GET['service']] != 'all' and device_map_dict[request.GET['device']] != 'all'):
				print 'if1'
				trackeasy_overall_data = trackeasy_coll.find({'fe_tick_state':True,'pa_tick_state':True, 'event.service':service_map_dict[request.GET['service']], 'event.device':device_map_dict[request.GET['device']]})

				trackeasy_distinct_categories = trackeasy_overall_data.distinct('event.category')
				print 'trackeasy_data_loaded', trackeasy_distinct_categories
				trackeasy_overall_data = None
				
				for var_category in trackeasy_distinct_categories:
					print var_category
					var_analytics_coll = analytics_con[analytics_db][var_category]
					print 'category\'s collection loaded'
					ticker=0
					
					for var_te in tracking_events_log.objects(event__service=service_map_dict[request.GET['service']],event__device=device_map_dict[request.GET['device']],fe_tick_state=True, pa_tick_state=True,event__category=var_category).order_by('id'):
						print ticker+1
						data_append = var_te.to_json()
						data_append = json.loads(data_append)
						count_TR1,count_TR2 = get_count(var_analytics_coll,var_te.event)
						data_append['count_TR1']=count_TR1
						data_append['count_TR2']=count_TR2
						data['audit_data'].append(data_append)
						data_append = None
						print count_TR1
						print count_TR2
						ticker+=1


			elif(service_map_dict[request.GET['service']] == 'all' and device_map_dict[request.GET['device']] != 'all'):
				print 'if2'
				trackeasy_overall_data = trackeasy_coll.find({'fe_tick_state':True,'pa_tick_state':True, 'event.device':device_map_dict[request.GET['device']]})
				trackeasy_distinct_categories = trackeasy_overall_data.distinct('event.category')
				print 'trackeasy_data_loaded', trackeasy_distinct_categories
				trackeasy_overall_data = None
				
				for var_category in trackeasy_distinct_categories:
					print var_category
					var_analytics_coll = analytics_con[analytics_db][var_category]
					print 'category\'s collection loaded'
					ticker=0
					
					for var_te in tracking_events_log.objects(event__device=device_map_dict[request.GET['device']],fe_tick_state=True, pa_tick_state=True,event__category=var_category).order_by('id'):
						print ticker+1
						data_append = var_te.to_json()
						data_append = json.loads(data_append)
						count_TR1,count_TR2 = get_count(var_analytics_coll,var_te.event)
						data_append['count_TR1']=count_TR1
						data_append['count_TR2']=count_TR2
						data['audit_data'].append(data_append)
						data_append = None
						print count_TR1
						print count_TR2
						ticker+=1


			elif(service_map_dict[request.GET['service']] != 'all' and device_map_dict[request.GET['device']] == 'all'):
				print 'if3'
				trackeasy_overall_data = trackeasy_coll.find({'fe_tick_state':True,'pa_tick_state':True, 'event.service':service_map_dict[request.GET['service']]})
				trackeasy_distinct_categories = trackeasy_overall_data.distinct('event.category')
				print 'trackeasy_data_loaded', trackeasy_distinct_categories
				trackeasy_overall_data = None
				
				for var_category in trackeasy_distinct_categories:
					print var_category
					var_analytics_coll = analytics_con[analytics_db][var_category]
					print 'category\'s collection loaded'
					ticker=0
					
					for var_te in tracking_events_log.objects(event__service=service_map_dict[request.GET['service']],fe_tick_state=True, pa_tick_state=True,event__category=var_category).order_by('id'):
						print ticker+1
						data_append = var_te.to_json()
						data_append = json.loads(data_append)
						count_TR1,count_TR2 = get_count(var_analytics_coll,var_te.event)
						data_append['count_TR1']=count_TR1
						data_append['count_TR2']=count_TR2
						data['audit_data'].append(data_append)
						data_append = None
						print count_TR1
						print count_TR2
						ticker+=1


			elif(service_map_dict[request.GET['service']] == 'all' and device_map_dict[request.GET['device']] == 'all'):
				print 'if4'
				trackeasy_overall_data = trackeasy_coll.find({'fe_tick_state':True,'pa_tick_state':True})
				trackeasy_distinct_categories = trackeasy_overall_data.distinct('event.category')
				print 'trackeasy_data_loaded', trackeasy_distinct_categories
				trackeasy_overall_data = None
				
				for var_category in trackeasy_distinct_categories:
					print var_category
					var_analytics_coll = analytics_con[analytics_db][var_category]
					print 'category\'s collection loaded'
					ticker=0
					
					for var_te in tracking_events_log.objects(fe_tick_state=True, pa_tick_state=True,event__category=var_category).order_by('id'):
						print ticker+1
						data_append = var_te.to_json()
						data_append = json.loads(data_append)
						count_TR1,count_TR2 = get_count(var_analytics_coll,var_te.event)
						data_append['count_TR1']=count_TR1
						data_append['count_TR2']=count_TR2
						data['audit_data'].append(data_append)
						data_append = None
						print count_TR1
						print count_TR2
						ticker+=1
			
			print json.dumps(data)
			return HttpResponse(json.dumps(data), content_type="application/json")

		if request.GET['name']=='get_updated_data':
			print 'inside get_updated_data match'

			TR1_fromdate = request.GET['TR1_fromDate']
			TR1_todate = request.GET['TR1_toDate']

			TR2_fromdate = request.GET['TR2_fromDate']
			TR2_todate = request.GET['TR2_toDate']

			TR1_fromdate_array = TR1_fromdate.encode('utf-8').split("/")
			TR1_todate_array = TR1_todate.encode('utf-8').split("/")
			print TR1_fromdate_array,TR1_todate_array

			TR2_fromdate_array = TR2_fromdate.encode('utf-8').split("/")
			TR2_todate_array = TR2_todate.encode('utf-8').split("/")
			print TR2_fromdate_array,TR2_todate_array

			TR1_fromdate_day = TR1_fromdate_array[0]
			TR1_fromdate_month = TR1_fromdate_array[1]
			TR1_fromdate_year = TR1_fromdate_array[2]
			TR1_todate_day = TR1_todate_array[0]
			TR1_todate_month = TR1_todate_array[1]
			TR1_todate_year = TR1_todate_array[2]

			TR2_fromdate_day = TR2_fromdate_array[0]
			TR2_fromdate_month = TR2_fromdate_array[1]
			TR2_fromdate_year = TR2_fromdate_array[2]
			TR2_todate_day = TR2_todate_array[0]
			TR2_todate_month = TR2_todate_array[1]
			TR2_todate_year = TR2_todate_array[2]

			# print int(fromdate_year)
			main_y1 = datetime.datetime(int(TR1_fromdate_year), int(TR1_fromdate_month), int(TR1_fromdate_day))
			main_t1 = datetime.datetime(int(TR1_todate_year), int(TR1_todate_month), int(TR1_todate_day)) + datetime.timedelta(days=1)
			num_days_1 = (main_t1-main_y1).days
			print "dates are:"
			print main_y1,main_t1
			
			main_y2 = datetime.datetime(int(TR2_fromdate_year), int(TR2_fromdate_month), int(TR2_fromdate_day))
			main_t2 = datetime.datetime(int(TR2_todate_year), int(TR2_todate_month), int(TR2_todate_day)) + datetime.timedelta(days=1)
			num_days_2 = (main_t2-main_y2).days
			print "dates are:"
			print main_y2,main_t2
			
			data={}
			data['audit_data'] = []

			def get_count_2(event):
				print 'inside count_2 function'
				count1=0
				count2=0
				for i in xrange(num_days_1):
					y1 = main_y1 + datetime.timedelta(days=i)
					print "date is:"
					print y1
					print 'event being checked is', event.to_json()
					try:
						temp = tracking_events_alert.objects(
							event__category=event.category,
							event__action=event.action,
							event__device=event.device,
							event__service=event.service,date=y1)[0]
						count1 += temp.unique_count
					except:
						count1 += 0

				for i in xrange(num_days_2):
					y2 = main_y2 + datetime.timedelta(days=i)
					print "date is:"
					print y2
					print 'event being checked is', event.to_json()
					try:
						temp = tracking_events_alert.objects(
							event__category=event.category,
							event__action=event.action,
							event__device=event.device,
							event__service=event.service,date=y2)[0]
						# temp = tracking_events_alert.objects(event=json.loads(event.to_json()),date=y2)[0]
						count2 += temp.unique_count
					except:
						count1 += 0

				return (count1,count2)
				

			if(service_map_dict[request.GET['service']] != 'all' and device_map_dict[request.GET['device']] != 'all'):
				ticker=0
				for var_te in tracking_events_log.objects(event__service=service_map_dict[request.GET['service']],event__device=device_map_dict[request.GET['device']],fe_tick_state=True, pa_tick_state=True).order_by('id'):
					print ticker+1
					count_TR1,count_TR2 = get_count_2(var_te.event)
					data_append = var_te.to_json()
					data_append = json.loads(data_append)
					data_append['count_TR1']=count_TR1
					data_append['count_TR2']=count_TR2
					data['audit_data'].append(data_append)
					data_append = None
					print count_TR1
					print count_TR2
					ticker+=1


			elif(service_map_dict[request.GET['service']] == 'all' and device_map_dict[request.GET['device']] != 'all'):
				ticker=0
				for var_te in tracking_events_log.objects(event__device=device_map_dict[request.GET['device']],fe_tick_state=True, pa_tick_state=True).order_by('id'):
					print ticker+1
					count_TR1,count_TR2 = get_count_2(var_te.event)
					data_append = var_te.to_json()
					data_append = json.loads(data_append)
					data_append['count_TR1']=count_TR1
					data_append['count_TR2']=count_TR2
					data['audit_data'].append(data_append)
					data_append = None
					print count_TR1
					print count_TR2
					ticker+=1


			elif(service_map_dict[request.GET['service']] != 'all' and device_map_dict[request.GET['device']] == 'all'):
				ticker=0
				for var_te in tracking_events_log.objects(event__service=service_map_dict[request.GET['service']],fe_tick_state=True, pa_tick_state=True).order_by('id'):
					print ticker+1
					count_TR1,count_TR2 = get_count_2(var_te.event)
					data_append = var_te.to_json()
					data_append = json.loads(data_append)
					data_append['count_TR1']=count_TR1
					data_append['count_TR2']=count_TR2
					data['audit_data'].append(data_append)
					data_append = None
					print count_TR1
					print count_TR2
					ticker+=1


			elif(service_map_dict[request.GET['service']] == 'all' and device_map_dict[request.GET['device']] == 'all'):
				ticker=0
				for var_te in tracking_events_log.objects(fe_tick_state=True, pa_tick_state=True).order_by('id'):
					print ticker+1
					count_TR1,count_TR2 = get_count_2(var_te.event)
					data_append = var_te.to_json()
					data_append = json.loads(data_append)
					data_append['count_TR1']=count_TR1
					data_append['count_TR2']=count_TR2
					data['audit_data'].append(data_append)
					data_append = None
					print count_TR1
					print count_TR2
					ticker+=1


			print json.dumps(data)
			return HttpResponse(json.dumps(data), content_type="application/json")
			

	return render_to_response('Tracking/misbehave.html',
		context_instance=RequestContext(request))
	



