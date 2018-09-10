function deleteBook(id){
    $.ajax({
        url: '/library/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
