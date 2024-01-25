//メインページ
//メールアドレス自体はgmailを使ってユーザーの情報は個別に作成可能にする
import "tailwindcss/tailwind.css"
import { getAuth,GoogleAuthProvider,signInWithPopup,signOut} from "firebase/auth"
import { useState ,useEffect} from 'react';
import { useRouter } from "next/router";
import { firebaseApp } from "@/lib/firebase/config";
import { Tags} from "@/app/components/tag";
export default function Index(){
    //ユーザーのemail,password
     
    const router = useRouter();
    const [selectTag,setTag] = useState("");
    const [logined,setLogin] = useState(false);
    //フォームのボタンを押したとき
    const doLogin = async () => {
        const auth = getAuth(firebaseApp);
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
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
                <div className="user px-3 hover:bg-blue-600 cursor-pointer font-bold">{logined?<button>ユーザー情報登録</button>:"ログインしてください"}</div>
                <div className="inform px-3 hover:bg-blue-600 cursor-pointer ">{logined?<button>通知</button>:"通知なし"}</div>

            </div>     
            <div className="main bg-white h-screen flex justify-center ">
                <div className="tags w-1/4 mx-5 my-5 text-center border-solid border-2 border-gray-100 rounded-md"><Tags/></div>
                <div className="blogs w-2/4 mx-5 my-5 text-center">blogs</div>
                <div className="recommendAccounts w-1/4 mx-5 my-5 text-center">recommend</div>
            </div>       
        </div>
    );
}