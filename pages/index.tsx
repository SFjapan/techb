//メインページ
//メールアドレス自体はgmailを使ってユーザーの情報は個別に作成可能にする
import "tailwindcss/tailwind.css"
import { getAuth,GoogleAuthProvider,signInWithPopup} from "firebase/auth"
import { useState,useEffect } from 'react';
import { useRouter } from "next/router";
import { firebaseApp } from "@/lib/firebase/config";
import { TagList} from "@/app/components/tag";
import { BlogList } from "@/app/components/blog";
import { getUid, getUserName } from "@/app/data/userData";
export default function Index(){
    //ユーザーのemail,password
    const router = useRouter();
    const [logined,setLogin] = useState(false);
    const [userName,setUserName] = useState<string | null>('');
    const auth = getAuth(firebaseApp);
    const [Uid,setUid] = useState<string | undefined>(undefined)
    let {tag} = router.query;
    useEffect(() => {  
        //毎回ログインしなくていいように
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setLogin(true);
                setUid(getUid());                           
            } else {
                setLogin(false);
            }
        });
        // Cleanup the subscription to avoid memory leaks
        return () => unsubscribe();
    }, [auth]);

    useEffect(()=>{
        if(Uid != undefined){
           const getName = async () =>{
            setUserName(await getUserName(Uid));
           }
           getName();
        } 
        
    },[Uid,userName])

    //ログインやログアウトのボタンを押したとき
    const doLogin = async () => {
        const auth = getAuth(firebaseApp);
        const provider = new GoogleAuthProvider();
        try{
            await signInWithPopup(auth, provider);

        }catch(error){
            console.log(error);
        }   

        setLogin(true);
    };
    const doLogout = async () => {
        const auth = getAuth(firebaseApp);
        auth.signOut();
        setLogin(false);
    };

    return (
        <div className="flex flex-col bg-gray-300">
            <div className="flex justify-end items-center bg-blue-500 text-white rounded-md h-[50px]">
                <div className="login px-3 hover:bg-blue-600 cursor-pointer font-bold">{logined?<button onClick={()=>doLogout()} >ログアウト</button>:<button onClick={()=>doLogin()}>ログイン</button>}</div>
                <div className="user px-3 hover:bg-blue-600 cursor-pointer font-bold">{logined?userName?<button onClick={()=>router.push("/user")}>{userName}</button>:<button onClick={()=>router.push("/user")}>プロフィール設定</button>:"ログインしてください"}</div>
                {logined?<div className="user px-3 hover:bg-blue-600 cursor-pointer font-bold">{logined?<button onClick={()=>router.push("/post")}>投稿</button>:"ログインしてください"}</div>:<></>}
                <div className="inform px-3 hover:bg-blue-600 cursor-pointer ">{logined?<button>通知</button>:"通知なし"}</div>
            </div>     
            <div className="main bg-white h-screen flex justify-center ">
                <div className="tags w-1/4 mx-5 my-5 text-center border-solid border-2 border-gray-100 rounded-md"><TagList/></div>
                <div className="blogs w-2/4 mx-5 my-5"><BlogList tag={tag as string} /></div>
            </div>   
        </div>
    );
}