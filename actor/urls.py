from django.conf.urls import include, url
from django.contrib import admin
from django.views.generic import TemplateView
from .views import ActorListView, ActorDetailView

urlpatterns = [
    url(r'^(?P<actor_id>\d+)$', ActorDetailView.as_view(), name='actor_detail'),
    url(r'^', ActorListView.as_view(), name='actor_list'),
]