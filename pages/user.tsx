import "tailwindcss/tailwind.css"
import { addDoc, doc, getDoc, setDoc, getDocs, collection, query, where,deleteDoc,onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firebaseApp, firestore } from "@/lib/firebase/config";
import {  useEffect, useState } from "react";
import { useRouter } from "next/router";
export default function User() {
    //ユーザー情報
    const [username, setUserName] = useState('');
    const [age, setAge] = useState('');
    const [sex, setSex] = useState('');
    const [hideage, setHideAge] = useState(false);
    const auth = getAuth(firebaseApp);
    const Uid: string | undefined = auth.currentUser?.uid;
    const router = useRouter();
    const [posts, setPosts] = useState([{ id:'',username: '', title: '', tag: '', body: '', date: '', postId: 0, like: 0, comments: [{ body: "", date: "", parentId: "", userName: "" }]||null }]);
    const [snapshoted,setSnapshoted] = useState(false);
    useEffect(()=>{
        const getPosts = async() =>{
            const querySnapshot = await getDocs(collection(firestore,'users'));
            //documentID判別
            let documentID: string = "";
            let prevName : string ="";
            querySnapshot.forEach((doc) => {
                //Uidが同じならdocumentID更新
                if (doc.data().Uid == Uid) {
                    documentID = doc.id;
                    prevName = doc.data().userName;
                }
            })
        
            const q = query(collection(firestore,'blog'),where("userName", "==",prevName));
            const docs =await getDocs(q); 
            const postsData = docs.docs.map((doc) => ({id:doc.id, username: doc.data().userName, title: doc.data().title, tag: doc.data().tag, body: doc.data().body, date: doc.data().date, postId: doc.data().postId, like: doc.data().like, comments: doc.data().comments }));
            setPosts(postsData);
            setSnapshoted(false);
        }
        getPosts();
    },[snapshoted,Uid])
    
    const postUser = async () => {
        try {
            // 必要なすべてのフィールドが記入されていることを確認
            if (!username || !age || !sex) {
                alert("入力してください");
                return;
            }
            if (!Uid) return;
            //usersコレクションすべて取得
            const querySnapshot = await getDocs(collection(firestore,'users'));
            //documentID判別
            let documentID: string = "";
            let prevName : string ="";
            querySnapshot.forEach((doc) => {
                //Uidが同じならdocumentID更新
                if (doc.data().Uid == Uid) {
                    documentID = doc.id;
                    prevName = doc.data().userName;
                }
            })
            //更新か登録
            if (documentID) {
                const postdoc = doc(firestore, 'users', documentID);
                const UserDoc = await getDoc(postdoc);
                //更新したらブログやコメントのuserNameも更新できるように
                updateUserNames(prevName,username);
                //登録済みなら更新
                if (UserDoc.exists()) {
                    await setDoc(postdoc, {
                        userName: username,
                        age: age,
                        hideage: hideage,
                        sex: sex,
                        Uid: Uid
                    })
                    alert("更新しました!!");
                    
                }
            } else {
                await addDoc(collection(firestore,'users'), {
                    userName: username,
                    age: age,
                    hideage: hideage,
                    sex: sex,
                    Uid: Uid
                })
                alert("登録しました!!");
            }
            router.push("/")

        } catch (error) {
            alert('エラーです' + error)
        }
    }

    const updateUserNames = async(prevname:string,targetname:string)=>{
        const posts = await getDocs(collection(firestore,'blog'));
        let postdocs:string[] =[];
        let commentids:string[][] = [];
        posts.docs.map((e,index)=>{
            if(e.data().userName == prevname){
                postdocs.push(e.id);
            }
            if(e.data().comments){
                let ids:string[]=[];
                Object.keys(e.data().comments).map((result)=>{
                    if(e.data().comments[result].userName == prevname){
                        ids.push(result);
                    }
                })
                commentids[index] = ids;

            }
        })
        postdocs.forEach(async(element,index) => {
            const targetdoc =doc(firestore,'blog',element)
            const updatedoc = await getDoc(targetdoc);
            //コメントの有無
            if(updatedoc.data()?.comments){
                let targetcomments:{body:string,date:string,parentID:string,userName:string}[] = [];
                Object.keys(updatedoc.data()?.comments).map((result,index)=>{
                    targetcomments.push(updatedoc.data()?.comments[result]);
                    targetcomments[index].userName = targetname;
                })
                setDoc(targetdoc,{
                    Uid:updatedoc.data()?.Uid,
                    body:updatedoc.data()?.body,
                    date:updatedoc.data()?.date,
                    postId:updatedoc.data()?.postId,
                    tag:updatedoc.data()?.tag,
                    title:updatedoc.data()?.title,
                    userName:targetname,
                    like:updatedoc.data()?.like,
                    comments:targetcomments
                });
            }else{
                setDoc(targetdoc,{
                    Uid:updatedoc.data()?.Uid,
                    body:updatedoc.data()?.body,
                    date:updatedoc.data()?.date,
                    postId:updatedoc.data()?.postId,
                    tag:updatedoc.data()?.tag,
                    title:updatedoc.data()?.title,
                    userName:targetname,
                    like:updatedoc.data()?.like,
                });
            }
        });
    }

    const deletePost = async(e:any)=>{
        const yes = window.confirm("削除しますか?")
        if(!yes)return;
        const parentID = e.target.closest(".id").id;
        const targetdoc = doc(firestore, 'blog', parentID);
        await deleteDoc(targetdoc);
    }

    useEffect(()=>{
        try{
            onSnapshot(collection(firestore,'blog'),(snapshot)=>{
                setSnapshoted(true);
            })
        }catch(error){console.log(error)}
    },[])



    return (
        <div className="flex flex-col justify-center items-center">
            <h1 className="text-center font-bold text-4xl">ユーザー情報登録</h1>
            <input type="text" placeholder="表示される名前(12文字以内)" maxLength={12} onChange={(e) => setUserName(e.target.value)} className="border-2 border-solid border-gray-200 w-[400px]" />
            <input type="number" placeholder="年齢" onChange={(e) => { setAge(e.target.value) }} className="border-2 border-gray-200 border-solid" />
            <div className="flex justify-center">
                <input type="checkbox" onChange={(e) => setHideAge(e.target.checked)} />年齢非公開
            </div>
            <select name="sex" id="sex" onChange={(e) => setSex(e.target.value)}>
                <option value="">性別</option>
                <option value="男性">男性</option>
                <option value="女性">女性</option>
                <option value="なし">なし</option>
            </select>
            <button className="" onClick={() => postUser()}>登録</button>
            {posts?
                <div className="flex flex-col">
                    {posts.map((e,index)=>(
                        <div key={index} className="border-2 border-gray-200 rounded-md my-3">
                            <div className="id flex relative" id={e.id}>
                                {e.username}<br/>
                                <button className="absolute right-2 text-red-500" onClick={(e)=>deletePost(e)}>削除</button>
                            </div>
                            <pre>{e.body}</pre>
                            <p className="text-right">{e.date}</p>
                        </div>
                        
                    ))}
                </div>:
                <></>}
        </div>
    );
}

