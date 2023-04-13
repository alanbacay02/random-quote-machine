import './App.css';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// Creates an array `colorArray` used to store different color styles for the app and its elements.
const colorArray = [
	{ 
		// red
		backgroundColor: '#ef4444'
	},
	{ 
		// blue
		backgroundColor: '#4792f5'
	},
	{ 
		// yellow
		backgroundColor: '#d1ab13'
	},
	{ 
		// green
		backgroundColor: '#16a34a'
	},
	{ 
		// indigo
		backgroundColor: '#6366f1'
	},
	{ 
		// purple
		backgroundColor: '#a855f7'
	},
	{
		// light green
		backgroundColor: '#27c28e'
	}
];

// Creates a function `QuoteBox` that accepts props `handleNewQuoteClick` which is a function, `currentQuote` which is an object, and `fadeState` which is a string used to apply a class name to components.
function QuoteBox( {handleNewQuoteClick, currentQuote, appColor, fadeState} ) {
	// Returns a child element `QuoteDisplay` with props `quote`, and three button elements.
	return (
		<div className="p-4 mt-48 lg:mt-44">
			<div id="quote-box" className="flex flex-col max-w-xl rounded-md mx-auto text-center bg-white">
				<div id="quote" className={`fade-wrapper ${fadeState} flex flex-row justify-center p-7 pb-1 m-0 break-words`}>
					<p id="text" className="text-[19px] md:text-[23px] xl:text-[26px] m-0"><i className="fa fa-quote-left"></i> {currentQuote.quote}</p>
				</div>
				<div className={`fade-wrapper ${fadeState} flex flex-row justify-end pr-10 pb-3 xl:pt-1`}>
					<p id="author" className="text-[15px] md:text-[19px] xl:text-[20px]"> - {currentQuote.author}</p>
				</div>
				<div className="flex flex-row justify-between p-4 m-0">
					<a id="tweet-quote" href={`https://twitter.com/intent/tweet?text=${currentQuote.quote} - ${currentQuote.author}`} rel="noreferrer" target="_blank" className="text-[15px] md:text-[18px] item-center py-1 px-2 rounded-md text-white transition-colors duration-[1500ms]" style={appColor}>
						<i className="fa-brands fa-twitter my-auto"></i>
					</a>
					<button id="new-quote" className="text-[15px] md:text-[18px] py-1 px-2 rounded-md text-white transition-colors duration-[1500ms]" style={appColor} onClick={handleNewQuoteClick}>New Quote</button>
				</div>
			</div>
			<div className="flex max-w-xl justify-end space-x-1 mx-auto my-2 pr-2 opacity-80">
				<a href="https://alanbacay.dev/" rel="noreferrer" target="_blank" className="text-[15px] text-white mt-0 pt-0">©alanbacay</a>
				<a href="https://github.com/alanbacay02" rel="noreferrer" target="blank" className="text-[18px] px-1 rounded-md bg-white"><i className="fa-brands fa-github"></i></a>
				<a href="https://www.linkedin.com/in/alan-neale-bacay-ii-60aa48258/" rel="noreferrer" target="_blank" className="text-[18px] px-1 rounded-md bg-white"><i className="fa-brands fa-linkedin-in"></i></a>
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
	]),
	appColor: PropTypes.oneOfType([
		PropTypes.string.isRequired,
		PropTypes.object.isRequired
	]),
	fadeState: PropTypes.string.isRequired
};

// Creates a parent component `App` that keeps track of the overall state and handles the overall logic.
export default function App() {
	// Creates `quotes` state to store quotes.
	const [quotes, setQuotes] = useState([]);
	// Creates `currentQuoteAuthor` state to keep track of the current quote object which will store the quote and its author.
	const [currentQuoteAuthor, setCurrentQuoteAuthor] = useState({});
	// Creates `appColor` state to keep track of components color. Color is randomly generated from `colorArray`.
	const [appColor, setAppColor] = useState(colorArray[Math.floor(Math.random() * colorArray.length)]);
	// creates `isFading` to handle fade status.
	const [isFading, setIsFading] = useState(false);
	// creates `fadeTransition` to hande fade transition property.
	const [fadeTransition, setFadeTransition] = useState('fade-in');
	// Sets body color and text color to values from `appColor` state. There is a problem with tailwind css not rendering update onClick so default css is used.
	document.body.style = `background-color: ${appColor.backgroundColor}; color: ${appColor.backgroundColor};`;
	// Using tailwind, sets a transition between colors and assigns it to body `className`.
	document.body.className = 'transition-colors duration-[1500ms]';

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
				// Sets `isFading` to true to prevent user from changing quotes during transition.
				setIsFading(true);
				setTimeout(() => {
					// Assigns `initialQuote` to `currentQuote`.
					setCurrentQuoteAuthor(initialQuote);
					// Stores `quoteData` to `quotes` state.
					setQuotes(quoteData);
					// Sets `fadeTransition` value to `fade-in`.
					setFadeTransition('fade-in');
					// Sets `isFading` to false.
					setIsFading(false);
				}, 1000);
				// Sets `fadeTransition` value to `fade-out`.
				return setFadeTransition('fade-out');
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
		// Checks if quote and author text is still transitioning.
		if (isFading) {
			return;
		}
		// Sets `isFading` to true to prevent user from chaning quotes mid transition.
		setIsFading(true);
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
		// Generates a new app color and assigns it to `newAppColor`.
		let newAppColor = colorArray[Math.floor(Math.random() * colorArray.length)];
		// Checks if `newAppColor` is equal to the previous `appColor` and generate new one while true.
		while (appColor === newAppColor) {
			newAppColor = colorArray[Math.floor(Math.random() * colorArray.length)];
		}
		// Assigns `newAppColor` to `appColor` state.
		setAppColor(newAppColor);
		setTimeout(() => {
			// Assigns `newQuote` to `currentQuote`.
			setCurrentQuoteAuthor(newQuote);
			// Sets `fadeTransition` value to `fade-in`.
			setFadeTransition('fade-in');
			// Sets `isFading` to false.
			setIsFading(false);
		}, 1000);
		// Sets `fadeTransition` value to `fade-out`.
		setFadeTransition('fade-out');
	}
	
	// Function to `handleError` messages.
	function handleError(errorMessage) {
		setCurrentQuoteAuthor({quote: errorMessage, author: ''});
		throw new Error('Warning! Error occured at line: ' + new Error().lineNumber);
	}

	// Returns a child element <QuoteBox /> where function `handleNewQuoteClick`, `currentQuote` is passed in as props and `fadeState` which is a string used to apply a class name to components.
	return (
		<div className="App">
			<QuoteBox handleNewQuoteClick={handleNewQuoteClick} currentQuote={currentQuoteAuthor} appColor={appColor} fadeState={fadeTransition}/>
		</div>
	);
}