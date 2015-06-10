from Tracking.models import *

data=tracking_events_log.objects()
actions=[]
categories=[]
labels=[]
base_labels=[]

for var_data in data:
	actions.append(var_data.event.action)
	categories.append(var_data.event.category)

actions = list(set(actions))
categories = list(set(categories))
labels=['uid','sid','timeStamp','clid','count','service','device','referrer','action','page_type','city','url','previous_page_type','location_type','polygon_id','polygon_name','index_view_type',]
base_labels = ['uid','sid','count','timeStamp','device']

suggestion_data_doc = suggestion_data.objects[0]
temp_actions = suggestion_data_doc.actions
temp_actions.extend(actions)
temp_actions = list(set(temp_actions))
temp_categories = suggestion_data_doc.categories
temp_categories.extend(categories)
temp_categories = list(set(temp_categories))
temp_labels = suggestion_data_doc.labels
temp_labels.extend(labels)
temp_labels = list(set(temp_labels))
temp_base_labels = suggestion_data_doc.base_labels
temp_base_labels.extend(base_labels)
temp_base_labels = list(set(temp_base_labels))

suggestion_data_doc.actions = temp_actions
suggestion_data_doc.categories = temp_categories
suggestion_data_doc.labels = temp_labels
suggestion_data_doc.base_labels = temp_base_labels
suggestion_data_doc.save()