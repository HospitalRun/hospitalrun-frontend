function ITF14(ITF14number){

	this.ITF14number = ITF14number+"";

	this.valid = function(){
		return valid(this.ITF14number);
	};
	
	this.encoded = function (){
		if(valid(this.ITF14number)){
			return encode(this.ITF14number);
		}
		return "";
	}

	//The structure for the all digits, 1 is wide and 0 is narrow
	var digitStructure = {
	 "0":"00110"
	,"1":"10001"
	,"2":"01001"
	,"3":"11000"
	,"4":"00101"
	,"5":"10100"
	,"6":"01100"
	,"7":"00011"
	,"8":"10010"
	,"9":"01010"}

	//The start bits
	var startBin = "1010";
	//The end bits
	var endBin = "11101";
	
	//Regexp for a valid ITF14 code
	var regexp = /^[0-9]{13,14}$/;

	//Convert a numberarray to the representing 
	function encode(number){	
		//Create the variable that should be returned at the end of the function
		var result = "";
		
		//If checksum is not already calculated, do it
		if(number.length == 13){
			number += checksum(number);
		}
		
		//Always add the same start bits
		result += startBin;	
		
		//Calculate all the digit pairs
		for(var i=0;i<14;i+=2){
			result += calculatePair(number.substr(i,2));
		}
		
		//Always add the same end bits
		result += endBin;
		
		return result;
	}
	
	//Calculate the data of a number pair
	function calculatePair(twoNumbers){
		var result = "";
		
		var number1Struct = digitStructure[twoNumbers[0]];
		var number2Struct = digitStructure[twoNumbers[1]];
		
		//Take every second bit and add to the result
		for(var i=0;i<5;i++){
			result += (number1Struct[i]=="1") ? "111" : "1";
			result += (number2Struct[i]=="1") ? "000" : "0";
		}
		return result;
	}

	//Calulate the checksum digit
	function checksum(numberString){
		var result = 0;
		
		for(var i=0;i<13;i++){result+=parseInt(numberString[i])}

		return result % 10;
	}

	function valid(number){
		if(number.search(regexp)==-1){
			return false;
		}
		//Check checksum if it is already calculated
		else if(number.length==14){
			return number[13] == checksum(number);
		}
		return true;
	}
}