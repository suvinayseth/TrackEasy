from django.db import models
from django import forms
from mongoengine import *
from datetime import datetime
# Create your models here.

class tracking_events_comments(EmbeddedDocument):
    author = StringField(required=True)
    comment_datetime = DateTimeField(required=True, default=datetime.now)
    comment = StringField(required=True)


class tracking_events(EmbeddedDocument):
	category = StringField(required=True)
	action = StringField(required=True)
	service = StringField(required=True)
	device = StringField(required=True)
	label = ListField(StringField(required=True))
	

class tracking_events_log(Document):
	event = EmbeddedDocumentField(tracking_events)
	event_creation_date = DateTimeField(required=True, default=datetime.now)
	fe_tick_state = BooleanField(required=True, default=False)
	pa_tick_state = BooleanField(required=True, default=False)
	fe_checked_date_latest = DateTimeField(required=False)
	pa_checked_date = DateTimeField(required=False)
	event_image_path = StringField(required=False)
	event_comments = ListField(EmbeddedDocumentField(tracking_events_comments))

class tracking_events_audit(Document):
	event = EmbeddedDocumentField(tracking_events)
	has_mongo_match = BooleanField(required=True, default=False)

class tracking_events_alert(Document):
	event = EmbeddedDocumentField(tracking_events)
	total_count = IntField(required=True,default=0)
	unique_count = IntField(required=True, default=0)
	date = DateTimeField(required=True)

class trackeasy_update_details(Document):
	trackeasy = DateTimeField(required=True)


