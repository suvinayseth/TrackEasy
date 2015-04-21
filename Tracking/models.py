from django.db import models
from django import forms
from mongoengine import *
from datetime import datetime
# Create your models here.

class tracking_event_comments(EmbeddedDocument):
    author = StringField(required=False)
    comment_datetime = DateTimeField(required=True, default=datetime.now)
    comment = StringField(required=False)

class tracking_event(Document):
	event_category = StringField(required=True)
	event_action = StringField(required=True)
	event_service = StringField(required=True)
	event_device = StringField(required=True)
	event_label = StringField(required=True)
	event_image_path = StringField(required=False)
	fe_tick_state = BooleanField(required=True, default=False)
	pa_tick_state = BooleanField(required=True, default=False)
	event_creation_date = DateTimeField(required=True, default=datetime.now)
	fe_checked_date = DateTimeField(required=False)
	pa_checked_date = DateTimeField(required=False)
	event_comments = ListField(EmbeddedDocumentField(tracking_event_comments))
	has_mongo_match = BooleanField(required=True, default=False)

class suggestion_data(Document):
	actions = ListField(StringField(required=True))
	categories = ListField(StringField(required=True))
	labels = ListField(StringField(required=True))
	base_labels = ListField(StringField(required=True))

