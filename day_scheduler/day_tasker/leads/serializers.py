from rest_framework import serializers
from leads.models import Lead, Task


class leadSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Lead
        fields = '__all__'

class taskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'