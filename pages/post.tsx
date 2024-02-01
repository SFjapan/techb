import "tailwindcss/tailwind.css"
import { addDoc,getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { blogCollection ,firebaseApp} from "@/lib/firebase/config";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getUserName } from "@/app/data/userData";
import { tags } from "@/app/data/tags";
import { List } from "reactstrap";
import { getDate } from "@/app/data/date";
export default function Post(){
    //データ
    const [title,setTitle] = useState('');
    const [tag,setTag] = useState('');
    const [body,setBody] = useState('');
    const router = useRouter();
    const [loadedData,setLoaded] = useState(false);
    const auth = getAuth(firebaseApp);
    const [lastPostID,setLastPostID] = useState("")
    let size:Array<string> = new Array();
    const getSize = async () =>{
        await getDocs(blogCollection).then((e)=>{
            e.docs.map((e)=>{
                size.push(e.data().postId);
            })
        });
        if(size.length <= 0)setLastPostID("1");
        else setLastPostID(String(Number(size[size.length-1]) + 1));
    }
    getSize();
    const postBlog = async()=>{
        try{
            if(!loadedData){alert("入力してください");return;}
            
            await addDoc(blogCollection, {
                userName:await getUserName(auth.currentUser?.uid as string),
                title:title,
                tag:tag,
                body:body,
                date:getDate(),
                Uid:getAuth(firebaseApp).currentUser?.uid,
                postId:lastPostID,
                like:0

            });
            alert('送信完了' + lastPostID);
            router.push("/");
        } catch (error) {
            alert('エラーです' + error);
        }
    }
    useEffect(()=>{
        if(!(title == "" || tag == "" || body == "")){
            setLoaded(true);
        }
    },[title,body,tag])
    return(
        <div className="flex flex-col justify-center items-center">
            <input type="text" placeholder="title"  onChange={(e)=>setTitle(e.target.value)} className="border-2 border-solid border-gray-200"/>
            <select name="tag" id="tag"  onChange={(e)=>setTag(e.target.value)} className="border-2 border-solid border-black rounded-sm">
                <option value="">言語やフレームワークの選択</option>
                {
                    tags.map((item,index)=>(
                        <option value={item} key={index} className="text-center">{item}</option>
                    ))
                }
            </select>
            <textarea rows={10} cols={100} placeholder="body"  onChange={(e)=>setBody(e.target.value)} className="border-2 border-solid border-gray-200"/>
            <button className="" onClick={()=>postBlog()}>投稿</button>
        </div>
    );
}

