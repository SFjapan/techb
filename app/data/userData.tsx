import { collection, getDocs } from "firebase/firestore"
import { auth, firestore } from "@/lib/firebase/config"
export const getUid = () => {
    return auth.currentUser?.uid;
}
export const getUserName = async (Uid:string): Promise<string | null>=>{
   const users =  await getDocs(collection(firestore,'users'))
   let userName : string | null = null;
   users.forEach((e)=>{
    if(e.data().Uid == Uid){
        userName =  e.data().userName as string;
    }
   });
   return userName;
}
