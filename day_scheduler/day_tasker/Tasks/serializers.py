from rest_framework import serializers
# from leads.models import Lead, Task
from Tasks.models import  Task
from django.contrib.auth.models import User
from rest_framework.fields import CurrentUserDefault


# class leadSerializer(serializers.ModelSerializer):
#     class Meta: 
#         model = Lead
#         fields = '__all__'

class taskSerializer(serializers.ModelSerializer):

    class Meta:
        model = Task
        fields = '__all__'
        extra_kwargs = {
            'created_by': {
                'default': serializers.CreateOnlyDefault(
                    serializers.CurrentUserDefault()
                ),
                # perhaps add 'read_only': True here too.
            }
        }
        

