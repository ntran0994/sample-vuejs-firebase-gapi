import { firebaseAuth, firebaseOnAuthStateChanged } from "core/firebase";

export const getCurrentUser = () => {
    return new Promise((resolve) => {
        firebaseOnAuthStateChanged(firebaseAuth, (user) => {
            resolve({
                email: user.email
            });
        });
    });
}
