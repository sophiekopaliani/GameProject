window.location="#main-page1";

var player1_score = 0;
var player1_word = "";
var player2_score = 0;
var player2_word = "";
var player1_totalScore =0;
var player2_totalScore =0;
var player1_cards = null;
var player2_cards = null;
var table_cards = "a";

var tableCardsBoolArray = [];
var letterBoxesBoolArr = [];
var myResponse = [];

function displayLetterInBox(position,letter) {
	
	var letterBoxes = document.getElementsByClassName("letter-box-text");
	letterBoxes[position].innerHTML =  letter;
}

function setListenersForMyCards() {
	var myCards = document.getElementsByClassName("my-card");
	var myChosenLetter = "";
}

function setListeners() {

	var tableCardsArr = document.getElementsByClassName("choosable_card");
	
	var letterBoxesArr = document.getElementsByClassName("table-boxes");

	/*you can olso click on number, in this case 
	 selectedLetter will be number, but chosen letter 
	 still a letter that the number represented */
	var chosenLetter = "";

	for (var i = 0; i < tableCardsArr.length; i++) {
		
		tableCardsArr[i].onclick = function(e){
			var selectedLetter = e.target.innerHTML;
			
			for (var j = 0; j < player1_cards.length; j++) {
				if(player1_cards[j][0]== selectedLetter||
					player1_cards[j][1] == selectedLetter){
					if(!tableCardsBoolArray[j+7]) {
						chosenLetter = player1_cards[j][0];
						myResponse.push(selectedLetter);
						tableCardsBoolArray[j+7] =true;
						break;
					}
				}
			}

			for (var j = 0; j < table_cards.length; j++) {
				if(table_cards[j][0]== selectedLetter||
					table_cards[j][1] == selectedLetter){
					if(!tableCardsBoolArray[j]) {
						chosenLetter = table_cards[j][0];
						myResponse.push(selectedLetter);
						tableCardsBoolArray[j] =true;
						break;
					}
				}
			}

			for (var i = 0; i < letterBoxesBoolArr.length; i++) {
				if(!letterBoxesBoolArr[i]&&tableCardsBoolArray[j]) {
					letterBoxesBoolArr[i] = true;

					displayLetterInBox(i,chosenLetter);
					break;
				} 
			}

		}
	};
}

function displayResults() {
	alert("player1:  "+player1_score+"   word:   " +player1_word+"      "+
		"player2:  "+player2_score+"   word:   " +player2_word);
	var x = document.getElementsByClassName("result");
	player1_totalScore+=player1_score;
	player2_totalScore+=player2_score;
	x[0].innerHTML = player1_totalScore;
	x[1].innerHTML = player2_totalScore;
}



function isLegit(wordArray) {
	var word = "";
	for (var i = 0; i < wordArray.length; i++) {
		word += wordArray[i];
	}
	for (var i = 0; i < words.length; i++) {
		currentScore = wordCanBeMade(words[i], wordArray);
		if(currentScore!=0 && words[i]==word) {
			player1_score = currentScore;
		}
		
	}
	player1_word = word;
}

function getRandomCards(cardsNum){
	var arr = [];
	var shuffledLetters = shuffle(letters);

	for (var i = 0; i < cardsNum; i++) {
		arr.push(letters[i]);
	}
	return arr;	
}


function shuffle(array) {
	for (var i = array.length-1; i >=0; i--) {
        var randomIndex = Math.floor(Math.random()*(i+1)); 
        var itemAtIndex = array[randomIndex]; 
        array[randomIndex] = array[i]; 
        array[i] = itemAtIndex;
    }
    return array;
}

function displayCards(element_id, cards) {
	var element = document.getElementById(element_id);
	var elementChildren = element.children;

	for (var i = 0; i < elementChildren.length; i++) {
		var child = elementChildren[i];
		var grandChildren = child.children;
		grandChildren[0].innerHTML = cards[i][0];
		grandChildren[1].innerHTML = cards[i][1];
	}
}

function hideCards(){
	var element = document.getElementById('player2');
	var classChildren = element.children;
	for (var i = 0; i < classChildren.length; i++) {
		var child = classChildren[i];
		var grandChildren = child.children;
		grandChildren[0].innerHTML = '';
		grandChildren[1].innerHTML = '';
	}
}

function submitAnswer(){
	
	computerResult();
	isLegit(myResponse);
	displayCards('player2', player2_cards);	
	displayResults();	
}

function nextRoundStart(){
	tableCardsBoolArray = [false,false,false,false,false,false,false];
	letterBoxesBoolArr = [false,false,false,false,false,false,false,false,false];
	myResponse = [];
	player1_score = "0";
	player2_score = "0";
	hideCards();

	table_cards = getRandomCards(7);
	displayCards('table-cards', table_cards);
	player1_cards = getRandomCards(2);	
	player2_cards = getRandomCards(2);
	displayCards('player1', player1_cards);	
	
	setListeners();


	

}



function computerResult() {
	var existingLetters = [];
	for (var i = 0; i < table_cards.length; i++) {
		existingLetters.push(table_cards[i][0]);
	}
	for (var i = 0; i < player2_cards.length; i++) {
		existingLetters.push(player2_cards[i][0]);
	}
	var wordList = getWordListByDificulty();

	for (var i = 0; i < wordList.length; i++) {
		var currentScore = wordCanBeMade(wordList[i], existingLetters);
		if (currentScore > player2_score) {
			player2_score = currentScore;
			player2_word = wordList[i];
		}
	}
}

function getWordListByDificulty() {
	var rangeValue = document.getElementById("Range-ID").value;
	var wordsLength = words.length;
	var shuffledWords = shuffle(words);
	var customWords=[];
	var wordsN = wordsLength*rangeValue/100;
	for (var i = 0; i < wordsN; i++) {
		customWords.push(shuffledWords[i]);
	}
	return customWords;
}

function wordCanBeMade(dictionaryWord, _existingLetters) {

	var score = 0;
	var existingLetters = _existingLetters.slice();
	for (var i = 0; i < dictionaryWord.length; i++) {
		var currentCharachter = dictionaryWord[i];
		var currentCharachterIndex = existingLetters.indexOf(currentCharachter);
		var bool = currentCharachterIndex == -1;

		if (bool)
			return 0;
		else{
			existingLetters.splice(currentCharachterIndex, 1);
			var letterScore = getLetterScore(currentCharachter);
			score += letterScore;
		}
	} 
	
	return score;
}

function getLetterScore(letter) {
	var sc = 0;
	for (var i = 0; i < letters.length; i++) {
		
		if(letters[i][0]==letter) {
			return parseInt(letters[i][1]);
		}
	}	
	return 0;
}






























