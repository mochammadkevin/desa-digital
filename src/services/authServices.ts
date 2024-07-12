import { auth, firestore } from "../firebase/clientApp";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

type LoginData = {
  email: string;
  password: string;
};

type RegisterData = {
  email: string;
  password: string;
  role: string;
};

//Login dengan Firebase
export const login = async ({ email, password }: LoginData): Promise<any> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message || "An error occurred during authentication");
  }  
};

//Register dengan Firebase dan menyimpannya dii Firestore
export const register = async ({ email, password, role }: RegisterData): Promise<any> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Menyimpan data pengguna ke Firestore
    await setDoc(doc(firestore, "users", user.uid), {
      email: user.email,
      role: role
    });

    return user;
  } catch (error: any) {
    throw new Error(error.message || "An error occurred during authentication");
  }
};
