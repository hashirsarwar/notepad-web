from django.shortcuts import render
from django.http import HttpResponse
from django.core.mail import send_mail
from notepad_web_app.models import Document, User
from notepad_web import settings
import json

def process_documents(request):
	if request.method == 'POST':
		document_body = request.POST['document']
		user_id = request.POST['user_id']
		user = User.objects.get(pk=user_id)
		document = Document()
		document.user = user
		document.body = document_body
		document.save()
		return HttpResponse(status=200, content=document.id)
	
	if request.method == 'GET':
		user_id = request.GET['user_id']
		user = User.objects.get(pk=user_id)
		doc_id = request.GET['document_id']
		document = Document.objects.get(pk=doc_id, user=user)
		return HttpResponse(status=200, content=document.body)

	if request.method == 'PUT':
		decoded_json = request.body.decode('utf-8')
		data = json.loads(decoded_json)
		old_doc = Document.objects.get(pk=data['doc_id'])
		user = old_doc.user
		old_doc.delete()
		new_doc = Document()
		new_doc.user = user
		new_doc.body = data['doc_body']
		new_doc.save()
		return HttpResponse(status=200, content=new_doc.id)

	if request.method == 'DELETE':
		doc_id = request.body.decode('utf-8')
		Document.objects.get(pk=doc_id).delete()
		return HttpResponse(status=200)

def process_email(request):
	if request.method == 'POST':
		document_body = request.POST['document']
		user_id = request.POST['user_id']
		email_to = request.POST['email_to']
		user = User.objects.get(pk=user_id)
		name = user.name
		send_mail('Document from ' + name,
				  document_body,
				  settings.EMAIL_HOST_USER,
				  [email_to])
		return HttpResponse(status=200)
