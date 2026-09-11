from django.contrib import admin
from django.urls import path

from website import views


urlpatterns = [

    path(
        "admin/",
        admin.site.urls
    ),

    path(
        "",
        views.camera_page,
        name="camera"
    ),

    path(
        "predict/",
        views.predict,
        name="predict"
    ),

]