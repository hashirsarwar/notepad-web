window.onload = function () {

	var updating_doc_id = null;

	$('#save-btn').on('click', function() {
		var user_id = getCookie('user_id');
		var doc = $('.editor-area').val();

		if (doc === '') {
			showDialog('There is nothing to save', 'text-danger');
			return;
		}

		$.ajaxSetup({
        	headers: { "X-CSRFToken": getCookie("csrftoken") }
		});

		if (updating_doc_id) {
			$.ajax({
				url: 'api/documents/',
				method: 'PUT',
				data: `{ "doc_id": ${updating_doc_id}, "doc_body": "${doc}" }`,
				success: function(data) {
					// delete the row and add the updated
					// one to the top of the list.
					$(`#${updating_doc_id}`).remove();
					updating_doc_id = data;
					addDocumentRow(updating_doc_id, doc);
					showDialog('Document updated.', 'text-primary');
				},
				error: function() {
					showDialog('Internal server error.', 'text-danger');
				}
			});
		}
		else {
			$.post('api/documents/', {
				'user_id': user_id,
				'document': doc,
			}, function(data, status) {
				if (status === 'success') {
					showDialog('Document saved', 'text-success')
					updating_doc_id = data;
					addDocumentRow(data, doc);
				}
				else {
					showDialog('Internal server error', 'text-danger');
				}
			});
		}
	});

	$('#share-doc').submit(function() {
		var email = $('#email-share').val();
		var document = $('.editor-area').val();
		$('#export').modal('hide');

		if (email === '') {
			showDialog('Please enter a valid email', 'text-danger');
			return false;
		}

		if (document === '') {
			showDialog('There is nothing to share', 'text-danger');
			return false;
		}

		$.ajaxSetup({
        	headers: { "X-CSRFToken": getCookie("csrftoken") }
    	});

		$.post('api/email/', {
			'user_id': getCookie('user_id'),
			'document': document,
			'email_to': email,
		}, function(data, status) {
			if (status === 'success') {
				console.log('success');
				showDialog('Email sent successfully', 'text-primary');
			} else {
				showDialog('Internal server error', 'text-danger');
			}
		});
	});

	$('#doc-list').on('click', '.doc-item', function(e) {
		var doc_id = e.target.id;

		$.get('api/documents/', {
			'user_id': getCookie('user_id'),
			'document_id': doc_id,
		}, function(data, status) {
			$('.editor-area').val(data);
			$('#documents-list').modal('hide');
			updating_doc_id = doc_id;
		});		
	});

	$('#new-file-btn').on('click', function() {
		updating_doc_id = null;
		$('.editor-area').val('');
	});

	$('#doc-list').on('click', '.delete-doc', function(e) {
		e.stopPropagation();
		var doc_id = $(this).parent().attr('id');

		$.ajaxSetup({
        	headers: { "X-CSRFToken": getCookie("csrftoken") }
		});

		$.ajax({
			url: 'api/documents/',
			method: 'DELETE',
			data: doc_id,
			success: function(data) {
				$(`#${doc_id}`).remove();
			},
			error: function(error) {
				showDialog('Internal server error', 'text-danger');
			}
		});
	});
}

function addDocumentRow(id, doc_text) {
	$('#doc-list').prepend(`<a href="#"><li id="${id}" class="list-group-item doc-item">${doc_text}<span style="float: right;" class="text-danger delete-doc">delete</span></li></a>`);
}

function getCookie(name) {
	// Using this helper function to get cookies
	// by name because it avoids avoids iterating
	// over an entire array. So, cookies can be
	// fetched in constant time. 
	const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function showDialog(text, text_class) {
	$('#notepad-dialog').modal('show');
	$('#notepad-dialog-text').text(text);
	$('#notepad-dialog-text').removeClass();
	$('#notepad-dialog-text').addClass(text_class);
}