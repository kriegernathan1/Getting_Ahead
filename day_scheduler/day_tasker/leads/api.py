from leads.models import Lead , Task
from rest_framework import viewsets, permissions
from .serializers import leadSerializer , taskSerializer

class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]

    serializer_class = leadSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]

    authentication_classes = []

    serializer_class = taskSerializer

    