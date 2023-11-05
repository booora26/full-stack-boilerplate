import { Dispatch, ReactNode, SetStateAction, createContext, useState } from "react";

interface User {
id?: number,
email?: string,
isAuthenticated: boolean;
}

interface AuthContextType {
    user: User | undefined,
    setUser: (user: User) => Dispatch<SetStateAction<User>>,
}

const unAuthenticatedUser: User = {
isAuthenticated: false
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function UserContext ({ children }: { children: ReactNode }) {
    const [user, setUser] = useState(unAuthenticatedUser);

    return (

        <AuthContext.Provider value={[user, setUser]}> {children} </AuthContext.Provider>
    
    
    );
}