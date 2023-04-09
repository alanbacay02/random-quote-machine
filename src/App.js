import './App.css';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// Creates a function `QuoteBox` that accepts props `handleNewQuoteClick` which is a function and `currentQuote` which is an object.
function QuoteBox( {handleNewQuoteClick, currentQuote} ) {
	// Returns a child element `QuoteDisplay` with props `quote`, and three button elements.
	return (
		<div className="p-4 mt-48">
			<div id="quote-box" className="flex flex-col w-sm max-w-xl rounded-md mx-auto text-center">
				<div id="quote" className="flex flex-row justify-center px-4 pt-3 pb-2 m-0 break-words">

					<p id="text" className="text-[20px] md:text-base m-0"><i className="fa fa-quote-left"></i> {currentQuote.quote}</p>
				</div>
				<div className="flex flex-row justify-end pt-0 pr-4 pb-3">
					<p id="author" className="text-[15px]">{currentQuote.author}</p>
				</div>
				<div className="flex flex-row justify-between py-3 px-3 m-0">
					<a id="tweet-quote" href={`https://twitter.com/intent/tweet?text=${currentQuote.quote + ' - ' + currentQuote.author}`} rel="noreferrer" target="_blank">
						<i className="fa-brands fa-twitter"></i>
					</a>
					<button id="new-quote" onClick={handleNewQuoteClick}>Generate Quote</button>
				</div>
			</div>
		</div>
	);
}
// Validates `QuoteBox` props handleNewQuoteClick` that it is a function, and props `currentQuote` is an object or string.
QuoteBox.propTypes = {
	handleNewQuoteClick: PropTypes.func.isRequired,
	currentQuote: PropTypes.oneOfType([
		PropTypes.string.isRequired,
		PropTypes.object.isRequired
	])
};

// Creates a parent component `App` that keeps track of the overall state and handles the overall logic.
export default function App() {
	// Creates `quotes` state to store quotes.
	const [quotes, setQuotes] = useState('');
	// Creates `currentQuoteAuthor` state to keep track of the current quote object which will store the quote and its author.
	const [currentQuoteAuthor, setCurrentQuoteAuthor] = useState('');
	
	// Fetches data from API on initialization of the app, stores `quoteData` in `quotes` state and generates a random quote.
	useEffect(() => {
		// Creates an asynchronous function to fetch quote data from API.
		async function fetchData() {
			try {
				// Creates const `response` to fetch data from API.
				const response = await fetch('./quotes.json');
				// Creates const `quoteData` that will store quote data on response from API.
				const quoteData = await response.json();
				// Checks if `quoteData` has any quotes stored in it.
				if (!quoteData[0]) {
					// Returns an error message if there are no quotes found in `quoteData`.
					handleError('Uh oh! There are no quotes found. Please try again later!');
					return;
				}
				// Generates a random quote and assigns it to `newQuote`.
				let initialQuote = quoteData[Math.floor(Math.random() * quoteData.length)];
				// Declares `iterationCount` to keep track of iterations in while loop for regenerating quote.
				let iterationCount = 0;
				// Regenerates a new random quote if quote found is null or empty.
				while (!initialQuote.quote) {
					// Iterates `iterationCount`.
					iterationCount++;
					// Logs an error to the console if an empty quote is found.
					console.log('Error. Empty quote found Quote: ', initialQuote.quote, '\nIndex: ', quoteData.indexOf(initialQuote));
					// Regenerates new quote and assigns it to `initialQuote`.
					initialQuote = quoteData[Math.floor(Math.random() * quoteData.length)];
					// If iteration count exceeds length of `quoteData` an error is thrown as there are no quotes available.
					if (iterationCount >= quoteData.length) {
						handleError('Uh oh! There are no quotes found. Please try again later!');
						return;
					}
				}
				// Assigns `newQuote` to `currentQuote`.
				setCurrentQuoteAuthor(initialQuote);
				// Stores `quoteData` to `quotes` state.
				return setQuotes(quoteData);
			} catch (error) {
				// Sets `currentQuote` state to display an error message if API is unreachable.
				handleError('Uh oh! An error occured while retrieving quotes. Please try again later!');
			}
		}
		// Calls our async function `fetchData`.
		fetchData();
	}, []);

	// Generates a new quote when user clicks on generate quote button.
	function handleNewQuoteClick() {
		// Checks if `quotes` has any quotes stored in it.
		if (!quotes[0]) {
			// Returns an error message if there are no quotes found in `quotes`.
			return handleError('Uh oh! There are no quotes found. Please try again later!');
		}
		// creates a const `newQuote` which will store our newly generated quote object from `quote`.
		let newQuote = quotes[Math.floor(Math.random() * quotes.length)];
		// Declares `iterationCount` to keep track of iterations in while loop for regenerating quote.
		let iterationCount = 0;
		// Regenerates a new random quote if quote found is null or empty.
		while (!newQuote.quote) {
			// Iterates `iterationCount`.
			iterationCount++;
			// Logs an error to the console if an empty quote is found.
			console.log('Error. Empty quote found Quote: ', newQuote.quote, 'Index: ', quotes.indexOf(newQuote));
			// Regenerates new quote and assigns it to `newQuote`.
			newQuote = quotes[Math.floor(Math.random() * quotes.length)];
			// If iteration count exceeds length of `quotes` an error is thrown as there are no quotes available.
			if (iterationCount >= quotes.length) {
				return handleError('Uh oh! There are no quotes found. Please try again later!');
			}
		}
		// Assigns `newQuote` to `currentQuote`.
		return setCurrentQuoteAuthor(newQuote);
	}
	
	// Function to `handleError` messages.
	function handleError(errorMessage) {
		setCurrentQuoteAuthor({quote: errorMessage, author: ''});
		throw new Error('Warning! Error occured at line: ' + new Error().lineNumber);
	}

	// Returns a child element <QuoteBox /> where function `handleNewQuoteClick` and `currentQuote` is passed in as props
	return (
		<div className="App">
			<QuoteBox handleNewQuoteClick={handleNewQuoteClick} currentQuote={currentQuoteAuthor}/>
		</div>
	);
}