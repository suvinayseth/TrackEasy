from pymongo import *
from bson.objectid import ObjectId
import datetime
import time
# import ast
# import json
# import collections
# from collections import defaultdict
# import csv
# import pdb
from Tracking.models import *
from Tracking.mongo_config import *


print 'done imports, mongo connections made'

trackeasy_overall_data = trackeasy_coll.find({'fe_tick_state':True,'pa_tick_state':True})
trackeasy_distinct_categories = trackeasy_overall_data.distinct('event.category')
trackeasy_overall_data = None
print 'trackeasy_data_loaded', trackeasy_distinct_categories


for i in xrange(30):
	y = datetime.datetime.now().date() - datetime.timedelta(days = 30-i)
	t = datetime.datetime.now().date() - datetime.timedelta(days = 30-i-1)
	ts_y =  int(time.mktime(y.timetuple()) * 1000)
	ts_t =  int(time.mktime(t.timetuple()) * 1000)
	yutcd = datetime.datetime.utcfromtimestamp(ts_y / 1000)
	tutcd = datetime.datetime.utcfromtimestamp(ts_t / 1000)
	yutcoid = ObjectId.from_datetime(yutcd)
	tutcoid = ObjectId.from_datetime(tutcd)


	for var_category in trackeasy_distinct_categories:
		
		print var_category
		var_analytics_coll = analytics_con[analytics_db][var_category]
		print 'category\'s collection loaded'
		
		ticker = 0
		for var_te_log in trackeasy_coll.find({'fe_tick_state':True,'pa_tick_state':True,'event.category':var_category}):
			print ticker + 1
			
			temp_total = var_analytics_coll.find({'_id':{'$gte':yutcoid, '$lte':tutcoid},'service':var_te_log['event']['service'], 'action':var_te_log['event']['action'], 'device':var_te_log['event']['device']}).count()
			temp_distinct = len(var_analytics_coll.find({'_id':{'$gte':yutcoid, '$lte':tutcoid},'service':var_te_log['event']['service'], 'action':var_te_log['event']['action'], 'device':var_te_log['event']['device']}).distinct('uid'))
			
			te_alert_doc = tracking_events_alert(event = var_te_log['event'],
				date = y,
				total_count = temp_total,
				unique_count = temp_distinct
			)
			te_alert_doc.save()
			ticker += 1

