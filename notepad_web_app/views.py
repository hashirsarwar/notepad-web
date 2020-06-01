from django.shortcuts import render, redirect
from notepad_web_app.models import User, Document

def authentication(request):
    if request.user.is_authenticated:
        return redirect('/')
    return render(request, 'authentication.html')

def home(request):
    if not request.user.is_authenticated:
        return redirect('/auth')

    user_data = request.user.socialaccount_set.all()[0].extra_data
    user = User.objects.filter(uid=user_data['id']).first()
    user_docs = Document.objects.filter(user=user)
    reversed_docs = user_docs[::-1]
    if user == None:
        # Save a new user in database.
        user = User()
        user.name = user_data['name']
        user.uid = user_data['id']
        user.save()
    response = render(request, 'mainpage.html', {'user_name': user_data['name'],
                                                 'user_docs': reversed_docs})
    response.set_cookie('user_id', user_data['id'])
    return response