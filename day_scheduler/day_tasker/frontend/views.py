from django.shortcuts import render, redirect
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.response import Response
from .forms import UserRegistrationForm
from django.http import HttpResponseRedirect
from django.contrib.auth.models import User


# Create your views here.

#React handles frontend by targeting index.html
def index(request):
    if request.user.is_authenticated:
        return render(request, 'index.html')
    else:
        return redirect('/')

def home(request):
    #only show home page if user is not logged in
    if not request.user.is_authenticated:
        return render(request, 'home.html')
    else:
        return redirect('/Today')

#return the username of currently loged in user
@api_view(('GET',))
def username(request):
    user = request.user.username

    return Response({
        'username': user
    })


def registerForm(request):

    #if a user is logged in do not let them register
    if request.user.is_authenticated:
        return HttpResponseRedirect('/')


    #if POST update database and redirect
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)

        if form.is_valid():
            #create user
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = User.objects.create_user(username, password=password)
            

            return HttpResponseRedirect('/')
    #otherwise return blank form for user to populate
    else:
        form = UserRegistrationForm()
    
    return render(request, 'register.html', {'form': form})

        