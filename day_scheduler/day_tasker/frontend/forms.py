from django import forms
from django.contrib.auth.models import User, AnonymousUser

class UserRegistrationForm(forms.Form):
    username = forms.CharField(max_length=150, label='', widget=forms.TextInput(attrs={'placeholder': 'Username'}))
    password = forms.CharField(widget=forms.PasswordInput(), label='')
    confirm_password=forms.CharField(widget=forms.PasswordInput(), label='')

    password.widget.attrs.update({'placeholder': 'Password', 'autocomplete': 'new-password'})
    confirm_password.widget.attrs.update({'placeholder': 'Confirm Password', 'autocomplete': 'new-password'})

    class Meta: 
        model = User


    def clean(self):
        cleaned_data = super(UserRegistrationForm, self).clean()
        password = cleaned_data.get("password")
        confirm_password = cleaned_data.get("confirm_password")

        if User.objects.filter(username=self.cleaned_data['username']).exists():
            raise forms.ValidationError(
                "That username is taken please try another username and try again. "
            )

        if password != confirm_password:
            raise forms.ValidationError(
                "Passwords do not match. Please try again"
            )