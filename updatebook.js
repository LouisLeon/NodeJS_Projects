function updateBook(id){
    $.ajax({
        url: '/library/' + id,
        type: 'PUT',
        data: $('#update-book').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};