function selectPubDate(test){
	var mydate = new Date(test);
	console.log(mydate.toISOString().substring(0, 10));
   $('#datePicker').val(mydate.toISOString().substring(0, 10));
}
