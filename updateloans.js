function updateLoan(id){
    $.ajax({
        url: '/user/' + id,
        type: 'PUT',
        data: $('#loan-book').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};

