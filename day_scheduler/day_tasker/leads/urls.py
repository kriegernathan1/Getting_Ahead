from rest_framework import routers
from .api import LeadViewSet, TaskViewSet

router = routers.DefaultRouter()
router.register('/leads', LeadViewSet, 'leads')
router.register('/tasks', TaskViewSet, 'tasks')


urlpatterns = router.urls
