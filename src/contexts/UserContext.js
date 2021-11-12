import React, {useState, createContext} from 'react';


const UserContext = createContext();

const UserProvider =(props)=>{

	const [user, setUser] = useState({})

	return (
		<UserContext.Provider value={[user,setUser]}>
			{props.children}
		</UserContext.Provider>
	)
}


export {UserProvider, UserContext}