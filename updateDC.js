var idforTD = 1;

function AddNode(RowNum) {
		
		var table = document.getElementById("BatteryTable").getElementsByTagName("tbody")[0];
		var LocationCode = document.getElementById("locationField").value;
		var targetrow;

		var LocationForShow = LocationCode;
		var res = LocationCode.match(/[a-zA-Z]{1,2}[0-9]{1,4}-[0-9]{1,2}[0-9a-zA-Z]*/g);
		LocationCode = res[0];
		LocationCode = LocationCode.replace(/HV|HC/gi, "H"); 
		

		$('#BatteryTable tbody').append('<tr id='+idforTD+'><td><input type="checkbox" class="checkboxAll" /></td>'+'<td>'+ LocationForShow + '</td><td>'+colorCheck("Loading...")+'Loading...&zwnj;<p  class="tooltiptext">Loading....</p></font></td>'+ '</td><td>Not clear</td><td></td></tr>');


	
		
		var BattHTML;
		

		$.ajax({
				url:"BattCheck.php", //the page containing php script
				type: "POST", //request type
				data: { LocationCode : LocationCode , rowID : idforTD},
				success:function(result){
					//alert(result);
					result = result.split(",");
					if( document.getElementById(result[1]) )
					{
						
						targetrow = document.getElementById(result[1]);
						BattHTML = colorCheck(result[0]);
						document.getElementById("BatteryTable").rows[targetrow.rowIndex].cells[2].innerHTML = BattHTML+result[0]+"&zwnj;<p  class='tooltiptext'>"+result[3]+"</p>"+'</font>';
						document.getElementById("BatteryTable").rows[targetrow.rowIndex].cells[3].innerHTML = result[4];
						
						
						$("#BatteryTable").trigger("update");
					}

				}
		});
		//$("#BatteryTable").tablesorter();
		document.getElementById('locationField').value='';		

		$("#BatteryTable").trigger("update");

		idforTD++;
}
					

function CheckBattAll() {
					
						
		var BattTable = document.getElementById("BatteryTable");
		var LocationCode;
		var OldLocation;
		var BattHTML;
		var targetrow;
		var res;
		

						 
		for (var i = 1 , row; row = BattTable.rows[i]; i++) {
				LocationCode = row.cells[1].innerText || row.cells[1].textContent;
				res = LocationCode.match(/[a-zA-Z]{1,2}[0-9]{1,4}-[0-9a-zA-Z]{1,2}[0-9a-zA-Z]*/g);
				LocationCode = res[0];
				LocationCode = LocationCode.replace(/HV|HC/gi, "H"); 

				var x = BattTable.rows[i].cells;
				var rowID = BattTable.rows[i].id;
				x[2].innerHTML = colorCheck("Loading...")+'Loading...<span  class="tooltiptext">Loading....</span></font>';
				//alert(LocationCode);	
				$.ajax({
						url:"BattCheck.php",
						type: "POST",
						data: { LocationCode : LocationCode , rowID : rowID},
						success:function(result){
							result = result.split(",");
							if( document.getElementById(result[1]) )
							{
								
								targetrow = document.getElementById(result[1]);
								//alert(targetrow.rowIndex);
								BattHTML = colorCheck(result[0]);
								/*BattTable.rows[targetrow.rowIndex].cells[2].innerHTML = BattHTML+result[0]+" <span class='tooltiptext'>"+result[3]+"</span>"+'</font>';
								document.getElementById("BatteryTable").rows[targetrow.rowIndex].cells[3].innerHTML = result[4];*/

								BattTable.rows[targetrow.rowIndex].cells[2].innerHTML = BattHTML+result[0]+"&zwnj;<p  class='tooltiptext'>"+result[3]+"</p>"+'</font>';
								BattTable.rows[targetrow.rowIndex].cells[3].innerHTML = result[4];
								
								
								$("#BatteryTable").trigger("update");

							}
							else
							{
								//alert("Cannot found "+result[0]);
							}
							//alert(result[0]+" "+ result[1]);
							/*OldLocation = document.getElementById("BatteryTable").rows[result[1]].cells[1].innerText;
							if(OldLocation == result[2]){

								BattHTML = colorCheck(result[0]);

								
									BattTable.rows[result[1]].cells[2].innerHTML = BattHTML+result[0]+" V"+'</font>';
								

							}*/
	
						}
				});					
		}

		$("#BatteryTable").trigger("update");
}

function colorCheck(battVoltage) {
		
		if(battVoltage > 49.0){
				return '<font class="greenDC">';
		}
		else if(battVoltage > 47.0){
				return '<font class="orangeDC">';
		}
		else{
				return '<font class="redDC">';
		}

}


function DeleteRow()
{
	var x = document.getElementsByClassName("checkboxAll");
	var i;
	var len = x.length;
	for (i = 1; i < len; i++) {
		 if(x[i].type == "checkbox"){
				
				if(x[i].checked == true)
				{
					 document.getElementById("BatteryTable").deleteRow(i);
					 i--;
					 len--;
				}	
		 }
	}

	document.getElementById("chkall").checked = false;
	$("#BatteryTable").trigger("update");
	//$("#BatteryTable").tablesorter();
}

$(".checkboxAll").change(function() {

   var checkbox = $("input[class=checkboxAll]");

   if( $(this).prop( "checked" )  == true ) {

       checkbox.prop( "checked", true );

   } else {

       checkbox.prop( "checked", false );

   }

});


$(document).ready(function() 
{ 

		document.getElementById('pasteDiv').addEventListener('paste', handlePaste);
		document.getElementById('BatteryTable').addEventListener('copy', handleCopy);
        $("#BatteryTable").tablesorter({
			headers: {
						 0: { sorter: false, parser: false }
			}
		});

	

		


		

} 
); 






function getCurrentDate()
{
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	var Ho = today.getHours(); 
	var Min = today.getMinutes(); 
	var Sec = today.getSeconds(); 

	if( Ho < 10){
		Ho = '0'+Ho;
	}
	if( Min < 10){
		Min = '0'+Min;
	}
	if( Sec < 10){
		Sec = '0'+Sec;
	}

	if(dd<10) {
		dd='0'+dd
	} 

	if(mm<10) {
		mm='0'+mm
	} 

	today = Ho+':'+Min+" "+dd+'/'+mm+'/'+yyyy;
	return today;
}




function handleCopy (e) {

       
		 var textArea = document.createElement("textarea");
		 var longestLen = 0;
		 var beforeFilter = new Array();
		 var nodeAndbatt = new Array();
		 textArea.style.position = 'fixed';
		 textArea.style.top = 0;
		 textArea.style.left = 0;
		 textArea.style.width = '2em';
         textArea.style.height = '2em';
		 textArea.style.padding = 0;
		 textArea.style.border = 'none';
	     textArea.style.outline = 'none';
		 textArea.style.boxShadow = 'none';
		 textArea.style.background = 'transparent';


		var selObj = window.getSelection();
		var selectedText = selObj.toString();

		var pos;
        

		beforeFilter = selectedText.split("\n");
		
		for(var i = 0; i < beforeFilter.length;i++)
		{
				pos = beforeFilter[i].indexOf("\u200C");
				if(pos != -1)
				{
					var t = beforeFilter[i].substr(0, pos+1);
					t = t.trim();
					nodeAndbatt.push(t);
				}
		}
			
	
		selectedText = nodeAndbatt;

		
		var n;
		var resultText = "";
		
	
		for( var i = 0 ; i < selectedText.length; i++)
		{
			
			n = selectedText[i].search("	");
			
			if(n != 0)
			{

				selectedText[i] = setCharAt(selectedText[i],n," Batt ------------ ");
				
			}
		
				selectedText[i] = selectedText[i] + " V";
			
		}
		for( var i = 0; i < selectedText.length; i++)
		{
			if(longestLen < selectedText[i].length)
			{
				longestLen = selectedText[i].length;
			}
		}
		for( var i = 0; i < selectedText.length; i++)
		{
			if(selectedText[i].length < longestLen)
			{
				var battIndex = selectedText[i].indexOf("Batt ");
				var differen = longestLen - selectedText[i].length;
				var battStr = "Batt ";
				for(var j = 0 ;j < differen; j++)
				{
					battStr = battStr + '-';
				}

				 selectedText[i] = selectedText[i].replace("Batt ",battStr);
			}
			resultText = resultText + selectedText[i] + "\n";
		}

		
        textArea.value = resultText;
		document.body.appendChild(textArea);
		textArea.select();

		try {
				var successful = document.execCommand("copy");
				var msg = successful ? 'successful' : 'unsuccessful';
				//alert('Copying text command was ' + msg);
		} catch (err) {
				alert('Oops, unable to copy');
		}

	    document.body.removeChild(textArea);


		
}

function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
}

function handlePaste (e) {
	


		var clipboardData, pastedData;

		// Stop data actually being pasted into div
		e.stopPropagation();
    e.preventDefault();

		// Get pasted data via clipboard API
    clipboardData = e.clipboardData || window.clipboardData;
    pastedData = clipboardData.getData('Text');
	

	 strReplace(pastedData);
	
	
	//$('#pasteArea').val('res');
	
    
    // Do whatever with pasteddata
 
}

function strReplace(pasteData)
{
	$('#pasteArea').val('');
	pasteData = pasteData.replace(/\t/g,"%");
	var res = pasteData.match(/[a-zA-Z]{1,2}[0-9]{1,4}-[0-9a-zA-Z]{1,2}[0-9a-zA-Z][_][vV][0-9]{1,10}[\s]*[ก-๙0-9a-zA-Z]*(.*?)%/g);
	res.splice(0, 0, "PWR ");
	res.push("The AC power is off (non effect)");
	for(var i = 0; i < res.length ; i++)
	{
		res[i]=res[i].replace('%','');
		if(i > 0 & i != res.length-1)
		{
			res[i]=res[i] + ', ';
		}
		$('#pasteArea').val( $('#pasteArea').val() + res[i] + '\n');

		
	}
	//$('#pasteArea').val(res);



}

function ImportNode()
{

	

	var nodeList = $('#pasteArea').val();
	nodelist = nodeList.split("\n");
	

	var table = document.getElementById("BatteryTable").getElementsByTagName("tbody")[0];
	var LocationCode;
	var LocationForShow;
	var res;
	var BattHTML;
	var targetrow;

	for(var i = 1; i < nodelist.length - 2; i++)
	{
		LocationCode = nodelist[i];
		LocationForShow = LocationCode;
		res = LocationCode.match(/[a-zA-Z]{1,2}[0-9]{1,4}-[0-9]{1,2}[0-9a-zA-Z]*/g);
		LocationCode = res[0];
		LocationCode = LocationCode.replace(/HV|HC/gi, "H");

		
		$('#BatteryTable tbody').append('<tr id='+idforTD+'><td><input type="checkbox" class="checkboxAll" /></td>'+'<td>'+ LocationForShow + '</td><td>'+colorCheck("Loading...")+'Loading...&zwnj;<p  class="tooltiptext">Loading....</p></font></td>'+ '</td><td>Not clear</td><td></td></tr>');

		$.ajax({
				url:"BattCheck.php", //the page containing php script
				type: "POST", //request type
				data: { LocationCode : LocationCode , rowID : idforTD},
				success:function(result){
					//alert(result);
					result = result.split(",");
					if( document.getElementById(result[1]) )
					{
						targetrow = document.getElementById(result[1]);
						BattHTML = colorCheck(result[0]);
						document.getElementById("BatteryTable").rows[targetrow.rowIndex].cells[2].innerHTML = BattHTML+result[0]+"&zwnj;<p  class='tooltiptext'>"+result[3]+"</p>"+'</font>';
						document.getElementById("BatteryTable").rows[targetrow.rowIndex].cells[3].innerHTML = result[4];
						$("#BatteryTable").trigger("update");
					}

				}
		});


		$("#BatteryTable").trigger("update");
		idforTD++;
	}

	//$('#pasteArea').val('');
}






function addRemark()
{
	      $.confirm({
        title: 'ใส่ Remark นะจ๊ะ !!',
        content: '' +
        '<form action="" class="formName">' +
        '<div class="form-group" width="50">' +
        //'<label>Enter something here</label>' +
  
        '<input type="text" placeholder="Your remark" class="field size4" id="l" form-control" required/>'+

        '</div>' +
        '</form>',
        buttons: {
            formSubmit: {
                text: 'Submit',
                btnClass: 'btn-blue',
                action: function () {
                    var name = this.$content.find('.field').val();
                    if(!name){
                        $.alert('ถ้าไม่ใส่อะไรเลยก็กด Cancel สิ !!');
                        return false;
                    }
                    $.alert('Your remark is ' + name);

					var x = document.getElementsByClassName("checkboxAll");
					var i;
					var len = x.length;
					for (i = 1; i < len; i++) 
					{
							if(x[i].type == "checkbox")
							{
				
								 if(x[i].checked == true)
								{
									var res = name.match(/[a-zA-Z][0-9]{4}[0-9a-fA-F]{4}/g);
									if(res != null)
									{
				
					
										document.getElementById("BatteryTable").rows[i].cells[4].innerHTML =  '<a href="http://noc.triplet.co.th/ticket/detail.php?issue_id='+res[0]+'" target="_blank">'+name+'</a> ';
									}
					
									else
									{
										document.getElementById("BatteryTable").rows[i].cells[4].innerHTML = name;
									}
						
					
								}	
							}
					}
		
					//document.getElementById("chkall").checked = false;
					$("#BatteryTable").trigger("update");
                }
            },
            cancel: function () {
                //close
            },
        },
        onContentReady: function () {
            // bind to events
            var jc = this;
            this.$content.find('form').on('submit', function (e) {
                // if the user submits the form by pressing enter in the field.
                e.preventDefault();
                jc.$$formSubmit.trigger('click'); // reference the button and click it
            });
        }
    });
}


