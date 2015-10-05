from django.shortcuts import render
from django.views.generic import TemplateView
from django.shortcuts import render_to_response
from django.http import JsonResponse, HttpResponse
from .models import Actor, FilmActor
from django.db import connection

# Create your views here.
class ActorListView(TemplateView):
    template_name = "list.html"

    def alphabet(self):
        return list(letter for letter in 'abcdefghijklmnopqrstuvwxyz'.upper())

    def get(self, request, *args, **kwargs):
        context = self.get_context_data(**kwargs)
        context['alphabet'] = self.alphabet()
        return self.render_to_response(context)

    def post(self,request, *args, **kwargs):

        query_letter = request.POST.get('q')
        actors = Actor.objects.filter(last_name__startswith=query_letter).values('actor_id','first_name','last_name','last_update')

        if request.is_ajax():
            return JsonResponse({'data':list(actors)})

        context = self.get_context_data(**kwargs)
        context['selected'] = query_letter
        context['alphabet'] = self.alphabet()
        context['actor_list'] = actors
        return self.render_to_response(context)


class ActorDetailView(TemplateView):
    template_name = "actor.html"

    def get(self, request, *args, **kwargs):
        actor_id = kwargs['actor_id']

        cursor = connection.cursor()
        cursor.execute('SELECT film_info, first_name, last_name FROM actor_info WHERE actor_id = %s LIMIT 1', [actor_id])
        row = cursor.fetchone()

        keys = ['film_info','first_name','last_name']

        actor_info=dict()
        for key, value in zip(keys, row):
            actor_info[key]=value

        if request.is_ajax():
            return JsonResponse({'data':actor_info})

        context = self.get_context_data(**kwargs)

        context['actor_info'] = actor_info
        return self.render_to_response(context)