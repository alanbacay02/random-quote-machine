import './App.css';
import quotes from './quotes.json';

function QuoteGenerator() {
	return (
		<div>
			<p>{quotes[0].quote}{quotes[0].author}</p>
		</div>
	);
}

function QuoteBox() {
	return (
		<div>
			<QuoteGenerator />
			<button>Generate Quote</button>
			<button>facebook button</button>
			<button>twitter button</button>
		</div>
	);
}

export default function App() {
	return (
		<div className="App">
			<QuoteBox />
		</div>
	);
}