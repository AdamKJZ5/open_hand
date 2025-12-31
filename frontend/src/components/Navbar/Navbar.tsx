import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {
	const navigate = useNavigate();
	const user = localStorage.getItem('token');

	const handleLogout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		navigate('/login');
	};

	return (
	    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#eee' }}>
	      <Link to="/"><h1>OpenHand</h1></Link>
	      <div>
		{user ? (
		  <button onClick={handleLogout}>Logout</button>
		) : (
		  <>
		    <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
		    <Link to="/register">Register</Link>
		  </>
		)}
	      </div>
	    </nav>
	  );
	};

export default Navbar;
