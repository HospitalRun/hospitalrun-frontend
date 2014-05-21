function EAN(EANnumber){

	this.EANnumber = EANnumber+"";

	this.valid = function(){
		return valid(this.EANnumber);
	};
	
	this.encoded = function (){
		if(valid(this.EANnumber)){
			return createUPC(this.EANnumber);
		}
		return "";
	}

	//The L (left) type of encoding
	var Lbinary = {
	0: "0001101",
	1: "0011001",
	2: "0010011",
	3: "0111101",
	4: "0100011",
	5: "0110001",
	6: "0101111",
	7: "0111011",
	8: "0110111",
	9: "0001011"}

	//The G type of encoding
	var Gbinary = {
	0: "0100111",
	1: "0110011",
	2: "0011011",
	3: "0100001",
	4: "0011101",
	5: "0111001",
	6: "0000101",
	7: "0010001",
	8: "0001001",
	9: "0010111"}

	//The R (right) type of encoding
	var Rbinary = {
	0: "1110010",
	1: "1100110",
	2: "1101100",
	3: "1000010",
	4: "1011100",
	5: "1001110",
	6: "1010000",
	7: "1000100",
	8: "1001000",
	9: "1110100"}

	//The left side structure in EAN-13
	var EANstruct = {
	0: "LLLLLL",
	1: "LLGLGG",
	2: "LLGGLG",
	3: "LLGGGL",
	4: "LGLLGG",
	5: "LGGLLG",
	6: "LGGGLL",
	7: "LGLGLG",
	8: "LGLGGL",
	9: "LGGLGL"}

	//The start bits
	var startBin = "101";
	//The end bits
	var endBin = "101";
	//The middle bits
	var middleBin = "01010";
	
	//Regexp to test if the EAN code is correct formated
	var regexp = /^[0-9]{13}$/;

	//Create the binary representation of the EAN code
	//number needs to be a string
	function createUPC(number){
		//Create the return variable
		var result = "";

		//Get the first digit (for later determination of the encoding type)
		var firstDigit = number[0];
		
		//Get the number to be encoded on the left side of the EAN code
		var leftSide = number.substr(1,7);
		
		//Get the number to be encoded on the right side of the EAN code
		var rightSide = number.substr(7,6);
		
		
		//Add the start bits
		result += startBin;
		
		//Add the left side
		result += encode(leftSide,EANstruct[firstDigit]);
		
		//Add the middle bits
		result += middleBin;
		
		//Add the right side
		result += encode(rightSide,"RRRRRR");
		
		//Add the end bits
		result += endBin;
		
		return result;
	}

	//Convert a numberarray to the representing 
	function encode(number,struct){	
		//Create the variable that should be returned at the end of the function
		var result = "";
		
		//Loop all the numbers
		for(var i = 0;i<number.length;i++){
			//Using the L, G or R encoding and add it to the returning variable
			if(struct[i]=="L"){
				result += Lbinary[number[i]];
			}
			else if(struct[i]=="G"){
				result += Gbinary[number[i]];
			}
			else if(struct[i]=="R"){
				result += Rbinary[number[i]];
			}
		}
		return result;
	}

	//Calulate the checksum digit
	function checksum(number){
		var result = 0;
		
		for(var i=0;i<12;i+=2){result+=parseInt(number[i])}
		for(var i=1;i<12;i+=2){result+=parseInt(number[i])*3}

		return (10 - (result % 10)) % 10;
	}

	function valid(number){
		if(number.search(regexp)==-1){
			return false;
		}
		else{
			return number[12] == checksum(number);
		}
	}
}


function UPC(UPCnumber){
	
	this.ean = new EAN("0"+UPCnumber);
	
	this.valid = function(){
		return this.ean.valid();
	}
	
	this.encoded = function(){
		return this.ean.encoded();
	}
	
}