import React from 'react';
import logo from './logo.svg';
import _ from 'lodash';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../node_modules/font-awesome/css/font-awesome.min.css'

var possibleCombinationSum = function(arr, n) {
  if (arr.indexOf(n) >= 0) { return true; }
  if (arr[0] > n) { return false; }
  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  }
  var listSize = arr.length, combinationsCount = (1 << listSize)
  for (var i = 1; i < combinationsCount ; i++ ) {
    var combinationSum = 0;
    for (var j=0 ; j < listSize ; j++) {
      if (i & (1 << j)) { combinationSum += arr[j]; }
    }
    if (n === combinationSum) { return true; }
  }
  return false;
};
const Stars = (props) => {
  return(
  	<div className="col-5">
    	{_.range(props.randomNumber).map(i => <i key={i} className="fa fa-star"></i>)}
    </div>
  )
}

const Button = (props) => {
	let button;
  switch(props.answerIsCorrect) {
  	case true:
    	button = <button className="btn btn-success" onClick={props.acceptAnswer}><i className="fa fa-check"></i></button>
      break
    case false:
    	button = <button className="btn btn-danger"><i className="fa fa-times"></i></button>
      break
    default:
    	button = <button className="btn" disabled={props.numbersClicked.length === 0} onClick={props.checkAnswer}>=</button>
    break;
  }
  return(
  	<div className="col-2 text-center">
    	{button}
      <br />
      <br />
      <button className="btn btn-warning btn-sm" onClick={props.redraw} disabled={props.draws === 0}><i className="fa fa-retweet"></i>{props.draws}</button>
    </div>
  )
}

const Answer = (props) => {
	return(
  	<div className="col-5 text-center">
    	{props.numbersClicked.map((number, i) => <span key={i} onClick={() => props.declickingNumber(number)}>{number}</span>)}
    </div>
  )
}

const Numbers = (props) => {
	const numberClassName = (number) => {
  	if (props.numbersClicked.indexOf(number) >= 0){
    	return 'selected';
    }
    if (props.numbersUsed.indexOf(number) >= 0){
    	return 'used';
    }
  }
  return(
  	<div className="card text-center">
    	<div>
  			{Numbers.list.map(i => <span key={i} className={numberClassName(i)} onClick={() => props.clickingNumber(i)}>{i}</span>)}
  		</div>
    </div>
  )
}
Numbers.list = _.range(1, 10);
const DoneFrame = (props) => {
	return(
  	<div className="text-center">
    	<h2>{props.doneStatus}</h2>
    </div>
  )
}
class Game extends React.Component{
	static randomNumber = () => {
  	return 1 + (Math.floor(Math.random() * 9));
  }
  state = {
  	numbersClicked:[],
    numbersUsed:[],
    randomNumber: Game.randomNumber(),
    answerIsCorrect: null,
    draws: 5,
    doneStatus: null
  }
  clickingNumber = (clickedNumber) => {
    if (this.state.numbersUsed.indexOf(clickedNumber) >= 0){
    	return;
    }
    if (this.state.numbersClicked.indexOf(clickedNumber) >= 0){
    	return;
    }
  	this.setState(prevState => ({
    	answerIsCorrect: null,
      numbersClicked: prevState.numbersClicked.concat(clickedNumber)
    }))
  }
  declickingNumber = (declickedNumber) => {
  	this.setState(prevState => ({
    	answerIsCorrect: null,
      numbersClicked: prevState.numbersClicked.filter(number => number !== declickedNumber)
    }))
  }
  checkAnswer = () => {
  	this.setState(prevState => ({
    	answerIsCorrect: prevState.randomNumber === prevState.numbersClicked.reduce((total, n) => total + n, 0)
    }))
  }
  acceptAnswer = () => {
  this.setState(prevState => ({
  	numbersUsed: prevState.numbersUsed.concat(prevState.numbersClicked),
    numbersClicked: [],
    answerIsCorrect: null,
    randomNumber: Game.randomNumber()
  }), this.updateDoneStatus)
  }
  redraw = () => {
  	if (this.state.draws === 0){return;}
    this.setState(prevState => ({
    	randomNumber: Game.randomNumber(),
      numbersClicked: [],
    	answerIsCorrect: null,
      draws: prevState.draws - 1
    }), this.updateDoneStatus)
  }
	possibleSolutions = (state) => {
  	let numbersLeft = _.range(1, 10).filter(number => state.numbersUsed.indexOf(number) === -1)

  return possibleCombinationSum(numbersLeft, state.randomNumber)
  }

  updateDoneStatus = () => {
  	this.setState(prevState => {
    	if (prevState.numbersUsed.length === 9){
      	return {doneStatus: 'Done, nice!'}
      }
      if(prevState.draws === 0 && !this.possibleSolutions(prevState)){
      	return {doneStatus: 'Game Over!'}
      }
    })
  }
  render(){
  	return(
    	<div className="container">
      	<h3>Play Nine</h3>
        <hr />
        <div className="row">
      	  <Stars randomNumber={this.state.randomNumber} />
        	<Button numbersClicked={this.state.numbersClicked} checkAnswer={this.checkAnswer} answerIsCorrect={this.state.answerIsCorrect} acceptAnswer={this.acceptAnswer} redraw={this.redraw} draws={this.state.draws}/>
          <Answer numbersClicked={this.state.numbersClicked} declickingNumber={this.declickingNumber}/>
      	</div>
        <br />
        {this.state.doneStatus ? <DoneFrame doneStatus={this.state.doneStatus}/>:
        <Numbers numbersClicked={this.state.numbersClicked} numbersUsed={this.state.numbersUsed} clickingNumber={this.clickingNumber}/>
        }
      </div>
    )
  }
}
class App extends React.Component{
	render(){
  	return(
    <div>
    	<Game />
    </div>
    )
  }
}

export default App;
