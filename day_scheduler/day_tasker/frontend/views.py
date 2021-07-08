from django.shortcuts import render

# Create your views here.

#React handles frontend by targeting index.html
def index(request):
    return render(request, 'index.html')
