from Tracking.models import *
import csv


# trim out leading and trailing spaces, dash-to-underscore, check for duplication every time you are saving an event
# exclude page_url stuff
with open('./Tracking/custom_upload_events/Event Track Rent  - Desktop.csv', 'rb') as csvfile:
	spamreader = csv.reader(csvfile, delimiter=',', quotechar='|')
	ticker=0
	for row in spamreader:
		print ticker+1
		if(row[2] and row[4]):
			print 'inside if0'
			var_event_category = row[2].strip().replace('-','_')
			var_event_service = 'rent'
			var_event_device = 'desktop'
			var_event_action = row[4].strip()
			print var_event_category,var_event_service,var_event_device,var_event_action
			print 'Page_URLs' not in var_event_category
			if 'Page_URLs' not in var_event_category:
				print 'inside if1'
				if(len(tracking_event.objects(event_category = var_event_category, event_action = var_event_action, event_service = var_event_service, event_device = var_event_device))==0 ):
					print 'inside if2'
					doc_te = tracking_event.objects.create(
						event_category = var_event_category,
						event_action = var_event_action,
						event_service = var_event_service,
						event_label = 'to be uploaded',
						event_device = var_event_device,
						fe_tick_state = True,
						pa_tick_state = True,
						fe_checked_date = datetime.now(),
						pa_checked_date = datetime.now()
						)
					doc_te.save()
				else:
					print 'didn\'t add this entry-- possible duplication'

