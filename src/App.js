import './App.css';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// Creates a component `QuoteDisplay` that accepts an object `quote` as props.
function QuoteDisplay( {quote} ) {
	// Returns two paragraph elements where `quote.quote` is our quote to display and `quote.author` is the author of the quote.
	return (
		<div>
			<p>{quote.quote}</p>
			<p> - {quote.author}</p>
		</div>
	);
}
// Validates `QuoteDisplay` props `quote` that it is an object.
QuoteDisplay.propTypes = {
	quote: PropTypes.object.isRequired
};

// Creates a function `QuoteBox` that accepts props `handleNewQuoteClick` which is a function and `currentQuote` which is an object.
function QuoteBox( {handleNewQuoteClick, currentQuote} ) {
	// Returns a child element `QuoteDisplay` with props `quote`, and three button elements.
	return (
		<div>
			<QuoteDisplay quote={currentQuote} />
			<button onClick={handleNewQuoteClick}>Generate Quote</button>
			<button>facebook button</button>
			<button>twitter button</button>
		</div>
	);
}
// Validates `QuoteBox` props handleNewQuoteClick` that it is a function, and props `currentQuote` is an object.
QuoteBox.propTypes = {
	handleNewQuoteClick: PropTypes.func.isRequired,
	currentQuote: PropTypes.object.isRequired
};

// Creates a parent component `App` that keeps track of the overall state and handles the overall logic.
export default function App() {
	// Creates `currentQuoteAuthor` state to keep track of the current quote object which will store the quote and its author.
	const [currentQuoteAuthor, setCurrentQuoteAuthor] = useState('');
	
	// Generates a quote on initialization of the app.
	useEffect(() => {
		// Creates an asynchronous function to fetch quote data from API.
		async function fetchData() {
			try {
				// Creates const `response` to fetch data from API.
				const response = await fetch('./quotes.json');
				// Creates const `quoteData` that will store quote data on response from API.
				const quoteData = await response.json();
				// Generates a random quote and assigns it to `currentQuote` state.
				setCurrentQuoteAuthor(quoteData[Math.floor(Math.random() * quoteData.length)]);
			} catch (error) {
				// Logs an error to the console if API is unreachable.
				console.log('Error retrieving quotes:', error);
				// Sets `currentQuote` state to display an error message if API is unreachable.
				setCurrentQuoteAuthor({quote: 'Uh oh! An error occured while retrieving quotes. Please try again later!', author: ''});
			}
		}
		// Calls our async function `fetchData`.
		fetchData();
	}, []);

	// Generates a new quote when user clicks on generate quote button.
	async function handleNewQuoteClick() {
		try {
			const response = await fetch('./quotes.json');
			const quoteData = await response.json();
			// creates a const `newQuote` which will store our newly generated quote object from `quoteData`.
			let newQuote = quoteData[Math.floor(Math.random() * quoteData.length)];
			// Generates a new quote if `newQuote` is same as the previous quote in state `currentQuoteAuthor` and overwrites it to `newQuote`.
			while (newQuote.quote == currentQuoteAuthor.quote) {
				newQuote = quoteData[Math.floor(Math.random() * quoteData.length)];
			}

			// Updates `currentQuoteAuthor` state with our new random quote in `newQuote`.
			setCurrentQuoteAuthor(newQuote);
		} catch (error) {
			// Logs to console an error message and updates `currentQuoteAuthor` with an error message if API is unreachable.
			console.log('Error retrieving quotes:', error);
			setCurrentQuoteAuthor({quote: 'Uh oh! An error occured while retrieving quotes. Please try again later!', author: ''});
		}
	}

	// Returns a child element <QuoteBox /> where function `handleNewQuoteClick` and `currentQuote` is passed in as props
	return (
		<div className="App">
			<QuoteBox handleNewQuoteClick={handleNewQuoteClick} currentQuote={currentQuoteAuthor}/>
		</div>
	);
}