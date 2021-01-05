
// import { Button } from 'arwes'
import { useState, useEffect } from 'react';
import {
	useRouteMatch,
	Link,
	useLocation
} from "react-router-dom";

import helper from '../helpers/api.js';

import Element from './Element';

import {Loading, Link as L} from 'arwes';


const Ressource = (props) => {
	let { url, path } = useRouteMatch();
	const location = useLocation();

	let ressource = path.slice(1);
	const [elements, setElements] = useState([]);
	const [prevNext, setPrevNext] = useState({});
	const [isLoaded, setIsLoaded] = useState(false);
	const [isListView, setIsListView] = useState(true);

	useEffect(()=>{
		const searchParams = new URLSearchParams(location.search);
		const page = searchParams.get('page')
		helper.API(`/getAll${capitalize(ressource)}${page? '?page='+page : ''}`, {
			method: 'GET'
		})
		.then(async (result) => {
			setPrevNext({previous: result.previous, next: result.next});
			setElements([...result.results]);

			if (!isLoaded)
				setIsLoaded(true);
		})
	}, [isLoaded]);

	useEffect(() => {
		setIsLoaded(false)
	}, [location]);

	useEffect(()=>{
		if (path.match(new RegExp('\/'+ressource)))
			setIsListView(true);
		else
			setIsListView(false);

		setIsLoaded(false);
	}, [ressource, path]);

	return (
		<div>
			<L href={`/${ressource}`}><h2 style={{marginBottom: 0}}>{ ressource }</h2> (click for a detailed report)</L>

			{isListView &&
				<div>
					<div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItem: 'baseline'}}>
						{isLoaded && elements && elements.map((e, index) => (
								<div key={index} style={{padding: '10px', maxWidth: '500px'}}>
									<Link to={`${url}/${getRessourceID(e.url)}`} style={{color: 'inherit'}}>
										<Element ressource={ressource} data={e} abstract={true}/>
									</Link>
								</div>
						))}
						{!isLoaded &&
							<Loading animate />
						}



					</div>

					{isLoaded &&
						<div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', alignItem: 'baseline'}}>
							{prevNext && prevNext.previous &&
								<div>
									<Link to={prevNext.previous} style={{color: 'inherit'}}>
										PRECEDENT
									</Link>
								</div>
							}
							{prevNext && prevNext.next &&
								<div>
									<Link to={`${url}${prevNext.next}`} style={{color: 'inherit'}}>
										NEXT
									</Link>
								</div>
							}
						</div>
					}

				</div>

			}

		</div>
	)
}


const capitalize = r => r.charAt(0).toUpperCase() + r.slice(1);

const urlParams = Object.fromEntries(new URLSearchParams(window.location.search));

const getRessourceID = (url)=>{
	return url.match(/[0-9]\/$/);
}


export default Ressource
