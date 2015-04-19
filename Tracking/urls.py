from django.conf.urls import patterns, url

from Tracking import views

urlpatterns = patterns('',
    url(r'^$', views.track_app, name='track_app'),
    url(r'^edit/$', views.edit, name='edit'),
    url(r'^get_info/$', views.get_info, name='get_info'),
    url(r'^mismatch/$', views.mismatch_app, name='mismatch_app'),
    url(r'^misbehave/$', views.misbehave_app, name='misbehave_app')
)
