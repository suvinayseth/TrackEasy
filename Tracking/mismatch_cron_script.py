from pymongo import *
from bson.objectid import ObjectId
import datetime
import time
import ast
import json
import collections
from collections import defaultdict
import csv
import pdb

print 'done imports'

analytics_con = MongoClient('mongodb://dsl_read:dsl@localhost:3338/analytics',read_preference = ReadPreference.SECONDARY)
analytics_db = 'analytics'
trackeasy_con = MongoClient(host='localhost',port=27017)
trackeasy_db='vasu'
trackeasy_coll = trackeasy_con[trackeasy_db]['tracking_event']
print 'mongo connections made'

trackeasy_overall_data = trackeasy_coll.find({'fe_tick_state':True,'pa_tick_state':True})
trackeasy_distinct_categories = trackeasy_overall_data.distinct('event_category')
trackeasy_overall_data = None
print 'trackeasy_data_loaded', trackeasy_distinct_categories

y = datetime.datetime.now().date() - datetime.timedelta(days = 2)
# t = datetime.datetime.now().date() - datetime.timedelta(days = 1)
ts_y =  int(time.mktime(y.timetuple())*1000)
# ts_t =  int(time.mktime(t.timetuple())*1000)
yutcd = datetime.datetime.utcfromtimestamp(ts_y/1000)
# tutcd = datetime.datetime.utcfromtimestamp(ts_t/1000)
yutcoid = ObjectId.from_datetime(yutcd)
# tutcoid = ObjectId.from_datetime(tutcd)


for var_category in trackeasy_distinct_categories:
	print var_category
	var_analytics_coll = analytics_con[analytics_db][var_category]
	print 'category\'s collection loaded'
	ticker=0
	for var_te in trackeasy_coll.find({'fe_tick_state':True,'pa_tick_state':True,'event_category':var_category}):
		print ticker+1
		if var_analytics_coll.find_one({'_id':{'$gte':yutcoid},'service':var_te['event_service'], 'action':var_te['event_action'], 'device':var_te['event_device']})!=None:
			trackeasy_coll.update({'_id':var_te['_id']},{"$set":{'has_mongo_match':True}},upsert=False)
			print 'match'
		else:
			trackeasy_coll.update({'_id':var_te['_id']},{"$set":{'has_mongo_match':False}},upsert=False)
			print 'mismatch'
		ticker+=1

