# from leads.models import Lead , Task
# from .serializers import taskSerializer
# from .serializers import leadSerializer , taskSerializer
from Tasks.models import  Task
from rest_framework import viewsets, permissions
from .serializers import taskSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, mixins
from django.contrib.auth.models import User, AnonymousUser
from rest_framework.authentication import SessionAuthentication, BasicAuthentication



# class LeadViewSet(viewsets.ModelViewSet):
#     queryset = Lead.objects.all()
#     permission_classes = [
#         permissions.AllowAny
#     ]

#     serializer_class = leadSerializer


class TaskViewSet(viewsets.ModelViewSet, mixins.CreateModelMixin):
    # queryset = Task.objects.all()
    permission_classes = [
        permissions.IsAuthenticated
    ]

    authentication_classes = [SessionAuthentication, BasicAuthentication]

    serializer_class = taskSerializer

    def get_queryset(self):
        user = self.request.user
        return Task.objects.filter(created_by=user)
    
    # def perfrom_create(self, serializer_class):
    #     print("perform create called")
    #     serializer_class.save(created_by=self.request.user)




