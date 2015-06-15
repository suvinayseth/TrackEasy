# import sys
import os,os.path
import subprocess
# from pymongo import *
# from bson.objectid import ObjectId
import time
# import ast
import json
import collections
from collections import defaultdict
# import csv
# import pdb
import datetime
from Tracking.models import *



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
    """Get device, category, JSON data for an event"""
    device = event_file.split('/')[0]
    temp = os.path.join('/home/dev/Akshay/dsl.tracking.configs', event_file)
    try:
        with open(temp) as event_file_object:
            data = json.load(event_file_object)

        category = data['category']
        action = data['action']
        services = data['_cases']['service'].keys()
    except Exception as e:
        print str(e)
        print event_file
    return data, device, category, action, services


def get_labels(event_device, event_data):
    """Get the labels for an event"""
    event_label = []
    for label in event_data:
        if label == '_imports':
            for common_import in event_data[label]:
                if '.' in common_import:
                    common_imports = common_import.split('.')
                    top_level_import = common_imports[0]
                    with open('/home/dev/Akshay/dsl.tracking.configs/'+event_device+'/'+top_level_import+'.json') as data_file:
                        import_data = flatten_dict(json.load(data_file))
                        for import_label in import_data:
                            if ('.'.join(common_imports[1:]) in import_label) and (import_label not in event_label):
                                event_label.append(import_label)
                else:       
                    with open('/home/dev/Akshay/dsl.tracking.configs/'+event_device+'/'+common_import+'.json') as data_file:
                        for import_label in flatten_dict(json.load(data_file)):
                            if import_label not in event_label:
                                event_label.append(import_label)
        elif label == '_cases':
            for case in event_data[label]:
                if case not in event_label:
                    event_label.append(case)
        elif label not in event_label:
            event_label.append(label)
    return event_label


def edit_event(event_file):
    event_data, event_device, event_category, event_action, event_services = get_data(event_file)
    if event_device == 'Web':
        event_device_mongo = 'desktop'
    objects_list = tracking_events_log.objects(event__device = event_device_mongo,
        event__category = event_category,
        event__action = event_action
    )
    obj_ids = [str(var_obj['id']) for var_obj in objects_list]
    for var_obj_id in obj_ids:
        event_image_path = 'TrackEasy/static/images/'+var_obj_id+'.png'
        os.remove(event_image_path)
    objects_list.delete()
    
    event_label = get_labels(event_device, event_data)
    for event_service in event_services:
        doc_te = tracking_events(
            device = event_device_mongo,
            category = event_category,
            action = event_action,
            service = event_service,
            label = event_label
        )
        doc_te_log = tracking_events_log(event = doc_te, fe_tick_state = False, pa_tick_state = False)
        doc_te_log.save()


def add_event(event_file):
    event_data, event_device, event_category, event_action, event_services = get_data(event_file)
    if event_device == 'Web':
        event_device_mongo = 'desktop'
    objects_list = tracking_events_log.objects(event__device = event_device_mongo,
        event__category = event_category,
        event__action = event_action,
    )
    if objects_list:
        print event_device+'/'+event_category+'/'+event_action+' already exists!'
        edit_event(event_file)
    else:
        event_label = get_labels(event_device, event_data)
        for event_service in event_services:
            doc_te = tracking_events(
                device = event_device_mongo,
                category = event_category,
                action = event_action,
                service = event_service,
                label = event_label
            )
            doc_te_log = tracking_events_log(event = doc_te, fe_tick_state = False, pa_tick_state = False)
            doc_te_log.save()


def delete_event(event_file):
    temp = event_file.split('/')
    event_device = temp[0]
    event_category = temp[1]
    event_action = temp[2].rstrip('.json')
    if event_device == 'Web':
        event_device_mongo = 'desktop'
    objects_list = tracking_events_log.objects(event__device = event_device_mongo,
        event__category = event_category,
        event__action = event_action,
    )
    if objects_list:
        obj_ids = [str(var_obj['id']) for var_obj in objects_list]
        for var_obj_id in obj_ids:
            event_image_path = 'TrackEasy/static/images/'+var_obj_id+'.png'
            os.remove(event_image_path)
        objects_list.delete()
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
def exec_cron_sync_log():
    print 'done imports'
    # trackeasy_con = MongoClient(host='localhost',port=27017)
    # trackeasy_db='vasu'
    # trackeasy_coll = trackeasy_con[trackeasy_db]['tracking_events_log']
    # print 'mongo connections made'

    p = subprocess.Popen("cd /home/dev/Akshay/dsl.tracking.configs;git checkout test_trackeasy;git fetch;git diff test_trackeasy origin/test_trackeasy --name-status ", shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    lines = p.stdout.readlines()
    p = None
    lines = [line.strip().split('\t') for line in lines if 'A\t' in line or 'D\t' in line or 'M\t' in line]

    tracking_updates={}
    tracking_updates=defaultdict(lambda:[],tracking_updates)
    for line in lines:
        tracking_updates[line[0]].append(line[1])
    if len(lines)>=1:
        p = subprocess.Popen("cd /home/dev/Akshay/dsl.tracking.configs;git checkout test_trackeasy;git pull origin test_trackeasy", shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        p.stdout.readlines()
        p = None

        if [var_file for status in tracking_updates for var_file in tracking_updates[status] if len(var_file.split('/'))==2]:
            # p = subprocess.Popen("cd /home/dev/Akshay/dsl.tracking.configs;ls -d */", shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
            # temp = p.communicate()[0]
            # list_devices = temp.split("/\n")[0:-1]
            # # p = None

            list_devices = ['Web']

            dict_common_imports = {}
            dict_common_imports = defaultdict(lambda: defaultdict(), dict_common_imports)
            for device in list_devices:
                p = subprocess.Popen("cd /home/dev/Akshay/dsl.tracking.configs/"+device+";ls *.json", shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
                temp = p.communicate()[0].strip()
                var_files = temp.split("\n")
                for var_file in var_files:
                    with open('/home/dev/Akshay/dsl.tracking.configs/'+device+'/'+var_file) as data_file:
                        dict_common_imports[device][var_file] = flatten_dict(json.load(data_file))


            dict_categories = {}
            for device in list_devices:
                p = subprocess.Popen("cd /home/dev/Akshay/dsl.tracking.configs/"+device+";ls -d */", shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
                temp = p.communicate()[0].strip()
                dict_categories[device] = dict((category, dict()) for category in temp.split("/\n"))
                for category in dict_categories[device]:
                    p = subprocess.Popen("cd /home/dev/Akshay/dsl.tracking.configs/"+device+"/"+category+";ls *.json", shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
                    temp_1 = p.communicate()[0].strip()
                    var_files = temp_1.split("\n")
                    for var_file in var_files:
                        with open('/home/dev/Akshay/dsl.tracking.configs/'+device+'/'+category+'/'+var_file) as data_file:
                            try:
                                dict_categories[device][category][var_file] = json.load(data_file)
                            except Exception as e:
                                print device, category, var_file
                                print str(e)

            print 'Data loaded'

            # This can be put in the previous loop; it is currently separate for debugging purposes
            count = 0
            for device in list_devices:
                for category in dict_categories[device]:
                    for var_file in dict_categories[device][category]:
                        if device == 'Web':
                            event_device = 'desktop'
                        else:
                            event_device = device.lower()
                        event_category = category
                        event_action = dict_categories[device][category][var_file]['action']
                        list_services = []

                        event_label = []
                        for label in dict_categories[device][category][var_file]:
                            if label == '_imports':
                                for common_import in dict_categories[device][category][var_file][label]:
                                    if '.' in common_import:
                                        common_imports = common_import.split('.')
                                        top_level_import = common_imports[0]
                                        import_data = '.'.join(common_imports[1:])
                                        for import_label in dict_common_imports[device][top_level_import + '.json']:
                                            if (import_data in import_label) and (import_label not in event_label):
                                                event_label.append(import_label)
                                    else:
                                        for import_label in dict_common_imports[device][common_import + '.json']:
                                            if import_label not in event_label:
                                                event_label.append(import_label)

                            elif label == '_cases':
                                for case in dict_categories[device][category][var_file][label].keys():
                                    if case == 'service':
                                        list_services.extend(dict_categories[device][category][var_file][label][case].keys())
                                    elif case not in event_label:
                                        event_label.append(case)
                            elif label not in event_label:
                                event_label.append(label)

                        # Add event for all services
                        for event_service in list_services:
                            doc_te_logs = tracking_events_log.objects(
                                event__device = event_device,
                                event__category = event_category,
                                event__action = event_action,
                                event__service = event_service
                            )
                            if doc_te_logs:
                                doc_te_log = doc_te_logs[0]
                                doc_te_log.event.device = event_device
                                doc_te_log.event.category = event_category
                                doc_te_log.event.action = event_action
                                doc_te_log.event.service = event_service
                                doc_te_log.event.label = event_label
                            else:
                                doc_te = tracking_events(
                                    device = event_device,
                                    category = event_category,
                                    action = event_action,
                                    service = event_service,
                                    label = event_label
                                )
                                doc_te_log = tracking_events_log(
                                    event = doc_te,
                                    fe_tick_state = True,
                                    pa_tick_state = True,
                                    fe_checked_date_latest = datetime.now(),
                                    pa_checked_date = datetime.now()
                                )
                            doc_te_log.save()
                            count += 1

            print str(count) + ' objects saved'
        else:
            update_TE_DB(tracking_updates)


if __name__ == '__main__':
    exec_cron_sync_log()
