import './App.css';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

function QuoteDisplay( {quote} ) {
	return (
		<div>
			<p>{quote.quote}</p>
			<p> - {quote.author}</p>
		</div>
	);
}
QuoteDisplay.propTypes = {
	quote: PropTypes.object.isRequired
};

function QuoteBox( {handleNewQuoteClick, currentQuote} ) {
	return (
		<div>
			<QuoteDisplay quote={currentQuote} />
			<button onClick={handleNewQuoteClick}>Generate Quote</button>
			<button>facebook button</button>
			<button>twitter button</button>
		</div>
	);
}
QuoteBox.propTypes = {
	handleNewQuoteClick: PropTypes.func.isRequired,
	currentQuote: PropTypes.object.isRequired
};

export default function App() {
	// Creates state to keep track of current quote.
	const [currentQuoteAuthor, setCurrentQuoteAuthor] = useState('');
	
	useEffect(() => {
		async function fetchData() {
			try {
				const response = await fetch('./quotes.json');
				const quoteData = await response.json();
				setCurrentQuoteAuthor(quoteData[Math.floor(Math.random() * quoteData.length)]);
			} catch (error) {
				console.log('Error retrieving quotes:', error);
				setCurrentQuoteAuthor({quote: 'Uh oh! An error occured while retrieving quotes. Please try again later!', author: ''});
			}
		}
		fetchData();
	}, []);

	function handleNewQuoteClick() {
		async function fetchDataOnClick() {
			try {
				const response = await fetch('./quotes.json');
				const newQuoteData = await response.json();
				let newQuote = newQuoteData[Math.floor(Math.random() * newQuoteData.length)];
				while (newQuote.quote == currentQuoteAuthor.quote) {
					newQuote = newQuoteData[Math.floor(Math.random() * newQuoteData.length)];
				}
				setCurrentQuoteAuthor(newQuote);
			} catch (error) {
				console.log('Error retrieving quotes:', error);
				setCurrentQuoteAuthor({quote: 'Uh oh! An error occured while retrieving quotes. Please try again later!', author: ''});
			}
		}
		fetchDataOnClick();
	}
	
	return (
		<div className="App">
			{/* Returns a child element <QuoteBox /> where function `handleNewQuoteClick` and `currentQuote` is passed in as props */}
			<QuoteBox handleNewQuoteClick={handleNewQuoteClick} currentQuote={currentQuoteAuthor}/>
		</div>
	);
}