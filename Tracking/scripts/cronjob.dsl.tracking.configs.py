import sys
import os.path
import subprocess
from pymongo import *
from bson.objectid import ObjectId
import time
import ast
import json
import collections
from collections import defaultdict
import csv
import pdb
import datetime
from Tracking.models import *

print 'done imports'

trackeasy_con = MongoClient(host='localhost',port=27017)
trackeasy_db='vasu'
trackeasy_coll = trackeasy_con[trackeasy_db]['tracking_events_log']
print 'mongo connections made'


def flatten_dict(dictionary, parent_key = '', sep = '.'):
    items = []
    for key, value in dictionary.items():
        new_key = parent_key + sep + key if parent_key else key
        if isinstance(value, collections.MutableMapping):
            items.extend(flatten_dict(value, new_key, sep = sep).items())
        else:
            items.append((new_key, value))
    return dict(items)


def get_data(event_file):
    """Get device, category,  JSON data for an event"""
    device = event_file.split('/')[0]
    temp = os.path.join('/home/dev/Akshay/dsl.tracking.configs', event_file)
    with open(temp) as event_file_object:
        data = json.load(event_file_object)

    # Common import modification is not possible yet
    try:
        category = data['category']
        action = data['action']
    except Exception as e:
        print 'A common import file has been modified; this functionality has not been added yet'
        print str(e)

    # Change this when services are added in the JSON files
    service = 'service'

    return data, device, category, action, service


def get_labels(event_device, event_data):
    """Get the labels for an event"""
    event_label = []
    for label in event_data:
        if label == '_imports':
            for common_import in event_data[label]:
                with open('/home/dev/Akshay/dsl.tracking.configs/'+event_device+'/'+common_import+'.json') as data_file:
                    for label in flatten_dict(json.load(data_file)):
                        if label not in event_label:
                            event_label.append(label)
        elif label == '_cases':
            for case in event_data[label]:
                if case not in event_label:
                    event_label.append(case)
        elif label not in event_label:
            event_label.append(label)
    return event_label


def edit_event(event_file):
    event_data, event_device, event_category, event_action, event_service = get_data(event_file)
    objects_list = tracking_events_log.objects(event__device = event_device,
        event__category = event_category,
        event__action = event_action,
    )
    if objects_list:
        event_log = objects_list[0]
        event_log.event.service = event_service
        event_log.event.label = get_labels(event_device, event_data)
        # Change fe_tick_state, etc?
        event_log.save()
    else:
        print event_device+'/'+event_category+'/'+event_action+' does not exist; it cannot be modified'


def add_event(event_file):
    event_data, event_device, event_category, event_action, event_service = get_data(event_file)
    objects_list = tracking_events_log.objects(event__device = event_device,
        event__category = event_category,
        event__action = event_action,
    )
    if objects_list:
        print event_device+'/'+event_category+'/'+event_action+' already exists!'
        edit_event(event_file)
    else:
        event_label = get_labels(event_device, event_data)
        doc_te = tracking_events(
            device = event_device,
            category = event_category,
            action = event_action,
            service = event_service,
            label = event_label
        )
        doc_te_log = tracking_events_log(event = doc_te)
        doc_te_log.save()
        print event_device+'/'+event_category+'/'+event_action+' added'


def delete_event(event_file):
    temp = event_file.split('/')
    event_device = temp[0]
    event_category = temp[1]
    event_action = temp[2].rstrip('.json')
    objects_list = tracking_events_log.objects(event__device = event_device,
        event__category = event_category,
        event__action = event_action,
    )
    if objects_list:
        objects_list[0].delete()
    else:
        print event_device+'/'+event_category+'/'+event_action+' does not exist; it cannot be deleted'


def update_TE_DB(tracking_updates):
    print 'updating TE DB'
    for key in tracking_updates.keys():
        if key=='A':
            for event_file in tracking_updates[key]:
                add_event(event_file)
        elif key=='M':
            for event_file in tracking_updates[key]:
                edit_event(event_file)
        elif key=='D':
            for event_file in tracking_updates[key]:
                delete_event(event_file)


# running git commands and getting info for sync b/w local and remote for dsl.tracking.configs
p = subprocess.Popen("cd /home/dev/Akshay/dsl.tracking.configs;git checkout ae31918;git fetch;git diff ae31918 origin/master --name-status ", shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
lines = p.stdout.readlines()
p=None
lines = [line.strip().split('\t') for line in lines if 'A\t' in line or 'D\t' in line or 'M\t' in line]

tracking_updates={}
tracking_updates=defaultdict(lambda:[],tracking_updates)
for line in lines:
    tracking_updates[line[0]].append(line[1])
if len(lines)>=1:
    p = subprocess.Popen("cd /home/dev/Akshay/dsl.tracking.configs;git checkout master;git pull origin master", shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    p.stdout.readlines()
    p = None

    update_TE_DB(tracking_updates)