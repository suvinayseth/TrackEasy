# import sys
# import os
import subprocess
# from pymongo import *
# from bson.objectid import ObjectId
import time
import ast
import json
import collections
from collections import defaultdict
# import csv
import pdb
import datetime
from Tracking.models import *


print 'Imports done'

def flatten_dict(dictionary, parent_key = '', sep = '.'):
    items = []
    for key, value in dictionary.items():
        new_key = parent_key + sep + key if parent_key else key
        if isinstance(value, collections.MutableMapping):
            items.extend(flatten_dict(value, new_key, sep = sep).items())
        else:
            items.append((new_key, value))
    return dict(items)


p = subprocess.Popen("cd /home/dev/Akshay/dsl.tracking.configs;ls -d */", shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
temp = p.communicate()[0]
list_devices = temp.split("/\n")[0:-1]
# p = None

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
                dict_categories[device][category][var_file] = json.load(data_file)

print 'Data loaded'

# This can be put in the previous loop; it is currently separate for debugging purposes
count = 0
for device in list_devices:
    for category in dict_categories[device]:
        for var_file in dict_categories[device][category]:
            event_device = device
            event_category = category
            event_action = dict_categories[device][category][var_file]['action']

            # Change this when services are added in the JSON files
            event_service = 'service'

            event_label = []
            for label in dict_categories[device][category][var_file]:
                if label == '_imports':
                    for common_import in dict_categories[device][category][var_file][label]:

                # Remove this try-except block when 'search_info.filters' is removed from '_imports' in all JSON
                        try:
                            for label in dict_common_imports[device][common_import + '.json'].keys():
                                if label not in event_label:
                                    event_label.append(label)
                        except:
                            pass

                elif label == '_cases':
                    for case in dict_categories[device][category][var_file][label].keys():
                        if case not in event_label:
                            event_label.append(case)
                elif label not in event_label:
                    event_label.append(label)
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
                