import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setIsFetching(false);
        });
        return () => unsubscribe();
    }, []);

    return { user, isFetching };
};

export default useAuth;
