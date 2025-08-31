import { useSelector } from 'react-redux'
import { selectCurrentUser, selectCurrentToken } from './authSlice'
import { Link } from 'react-router-dom'

const Welcome = () => {
	const user = useSelector(selectCurrentUser)
	const token = useSelector(selectCurrentToken)

	const welcome = user ? `welcome ${user}!` : `welcome!`
	const tokenAbbr = `${token.slice(0, 9)}...`

	const content = (
		<section className={'welcome'}>
			<h1>{welcome}</h1>
			<p>Token : {tokenAbbr}</p>
			<p>
				<Link to={'/ProfileContainer'}> Go to Profile page </Link>
			</p>
		</section>
	)

	return content
}

export default Welcome
