function updateAuthor(id){
    $.ajax({
        url: '/author/' + id,
        type: 'PUT',
        data: $('#update-author').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};

