from django.conf.urls import url

from authorization import views

urlpatterns = [
    url(r'^login', views.login, name='login')
]