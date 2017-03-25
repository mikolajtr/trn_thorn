from django.conf.urls import url

from bargains import views

urlpatterns = [
    url(r'^get_bargains', views.get_bargains, name='get_bargains')
]