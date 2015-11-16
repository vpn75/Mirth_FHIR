function parseXML(xml) {
	//Initialize name object and given array to hold multiple names
	var name = {};
	name.given = [];
	console.log(xml);
	
	$(xml).find('name').each(function() {					
		name.family = $(this).find('family').attr('value');
		name.suffix = $(this).find('suffix').attr('value');
		
		//Iterate through given names
		$(this).find('given').each(function() {
			val = $(this).attr('value');
			//Add each given name to our holding array for output later
			name.given.push(val);
		});					
	})  ;					
	
	$(xml).find('gender').each(function() {
		$(this).find('coding').each(function() {
			//console.log(this);
			var gender = $(this).find('code').attr('value');
			$("#gender").text("Gender: " + gender);
			//console.log(gender);
		});
	});
	
	var dob = $(xml).find('birthDate').attr('value');
	var full_given = '';
	var full_name = name.family + ", ";
	//console.log(name.given);
	
	//Iterate through given names and add for output
	name.given.forEach(function(given) {
		full_name += given + " ";
	})

	//Logic to handle suffix if available
	if (name.suffix) {
		full_name += name.suffix;
	}

	//DOM updates
	$("#name").text(full_name);
	$("#name").css({"font-weight": "bold"});
	$("#dob").text("DOB: " + dob);
	$('#mrnlist').empty();

	//Iterate through multiple identifiers for output in HTML table
	var ids = $(xml).find('identifier').each(function() {
		var mrn = $(this).find('value').attr('value');
		var elem = '';
		$(this).find('assigner').each(function(){
			var aa = $(this).find('reference').attr('value');
			elem = '<tr><td>' + aa + '</td>';
		});
		elem += '<td>' + mrn + '</td>';
		$(elem).appendTo("#mrnlist");
	});				
}				

function parseJSON(data) {
	var full_name = data.name[0].family + ", ";

	data.name[0].given.forEach(function (given) {
		full_name += given + " ";
	})

	var gender = data.gender.coding[0].code;
	var sex = (gender == "M") ? "Male":"Female";

	//DOM updates
	$("#name").text(full_name);
	$("#name").css({"font-weight":"bold"});
	$("#dob").text("DOB: " + data.birthDate);
	$("#gender").text(sex).css({"font-style": "italic"});
	//$("#gender").css({"font-style": "italic"});
	$('#mrnlist').empty();

	console.log(data);
	
	data.identifier.forEach(function (x) {
		var mrn = x.value;
		var aa = x.assigner.reference;

		var elem = '';
		elem += '<tr><td>' + aa + '</td>';
		elem += '<td>' + mrn + '</td></tr>';
		$(elem).appendTo("#mrnlist");
	})


}

$(document).ready(function() {
	console.log("Executing AJAX query");
	
	//Hide patient details panel until search is performed
	$('#patient_details').hide();
	
	$('form').submit(function(e) {
		e.preventDefault();
		console.log("Submitted with mrn: " + $('#inputMRN').val())
		
		$('#patient_details').show();
		$.ajax({
			url: "http://10.173.13.192:9001/Patient/" + $('#inputMRN').val(),
			type: 'GET',
			success: parseJSON,
			error: function (error, textStatus) {console.log("Reason: " + textStatus); }
		});
		//Clear mrn input after search is complete
		$('#inputMRN').val('');
	});	
});
