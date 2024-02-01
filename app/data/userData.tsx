import { firebaseApp, userCollection } from "@/lib/firebase/config"
import { getDocs } from "firebase/firestore"
import { auth } from "@/lib/firebase/config"
export const getUid = () => {
    return auth.currentUser?.uid;
}
export const getUserName = async (Uid:string): Promise<string | null>=>{
   const users =  await getDocs(userCollection)
   let userName : string | null = null;
   users.forEach((e)=>{
    if(e.data().Uid == Uid){
        console.log(e.data())
        userName =  e.data().userName as string;
    }
   });
   return userName;
}
