import { Link } from "react-router-dom";

export const WelcomePage = (): JSX.Element => (
	<>
		<article className="card welcome-card">
			<div className="card__item">
				<h1 className="heading">Benvingut/da!</h1>
				<p className="text__body">
					Aquí podràs calcular el cost del teu projecte escollint serveis.
				</p>
			</div>
		</article>
		<Link to="/budget">
			<button className="button__text">Entrar a la calculadora</button>
		</Link>
	</>
);
