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
# from Tracking.models import *
from Tracking.mongo_config import *


def exec_cron_sync_alerts():
    print 'done imports, mongo connections made'

    last_updated_time = trackeasy_update_coll.find_one()
    h = last_updated_time['trackeasy']
    ts_h = int(time.mktime(h.timetuple()) * 1000)
    hutcd = datetime.datetime.utcfromtimestamp(ts_h / 1000)
    hutcoid = ObjectId.from_datetime(hutcd)

    new_te_logs = trackeasy_coll.find({'_id': {'$gte': hutcoid}})
    for doc_te_log in new_te_logs:
        trackeasy_alert_coll.remove({'event': doc_te_log['event']})
        trackeasy_alert_coll.insert({'event': doc_te_log['event'], 'total_count': 0, 'unique_count': 0, 'date' = datetime.datetime.now().date() - datetime.timedelta(days = 2)})

    te_alert_distinct_events = trackeasy_alert_coll.find().distinct('event')
    te_log_distinct_events = trackeasy_coll.find().distinct('event')
    for event in te_alert_distinct_events:
        if event not in te_log_distinct_events:
            trackeasy_alert_coll.remove({'event.device': event['device'], 'event.category': event['category'], 'event.service': event['service'], 'event.action': event['action']})

    print 'new events synced'

    # remove for today-31st date
    old_date = datetime.datetime.now().date() - datetime.timedelta(days = 31)
    trackeasy_alert_coll.remove({'date': old_date})

    trackeasy_overall_data = trackeasy_coll.find({'fe_tick_state':True,'pa_tick_state':True})
    trackeasy_distinct_categories = trackeasy_overall_data.distinct('event.category')
    trackeasy_overall_data = None
    print 'trackeasy_data_loaded', trackeasy_distinct_categories

    y = datetime.datetime.now().date() - datetime.timedelta(days = 1)
    t = datetime.datetime.now().date()
    ts_y =  int(time.mktime(y.timetuple()) * 1000)
    ts_t =  int(time.mktime(t.timetuple()) * 1000)
    yutcd = datetime.datetime.utcfromtimestamp(ts_y / 1000)
    tutcd = datetime.datetime.utcfromtimestamp(ts_t / 1000)
    yutcoid = ObjectId.from_datetime(yutcd)
    tutcoid = ObjectId.from_datetime(tutcd)

    if trackeasy_alert_coll.find({'date': y}).count() == 0:

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


    if trackeasy_update_coll.count() != 0:
        trackeasy_update_coll.remove({})
    trackeasy_update_coll.insert({'trackeasy_last_updated': datetime.datetime.now()})


if __name__ == '__main__':
    exec_cron_sync_alerts()