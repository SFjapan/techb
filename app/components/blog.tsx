import "tailwindcss/tailwind.css"
import { getDoc, getDocs, doc, onSnapshot, orderBy, query, where, collection } from "firebase/firestore";
import { setDoc } from "firebase/firestore";
import { firebaseApp, firestore } from "@/lib/firebase/config";
import { useState, useEffect } from "react";
import { getDate } from "../data/date";
import { getUserName } from "../data/userData";
import { auth } from "@/lib/firebase/config";
import Link from "next/link";
import Image from "next/image";
interface BlogListProps {
    tag: string;
}
import comment_img from "@/imgs/comments-svgrepo-com.png"
import cross_img from "@/imgs/cross-svgrepo-com.png"
import heart_img from "@/imgs/heart-svgrepo-com (1).png"

export const BlogList: React.FC<BlogListProps> = ({ tag }) => {
    const [posts, setPosts] = useState([{ username: '', title: '', tag: '', body: '', date: '', postId: 0, like: 0, comments: [{ body: "", date: "", parentId: "", userName: "" }]||null }]);
    // const [comments, setComments] = useState([{ username: '', body: '', date: '',targetId:0 }]);
    const [modal, setModal] = useState(false);
    const [comment, setComment] = useState("");
    const [parentID, setParentID] = useState("");
    //モダルでコメント投信画面表示送信したら消える
    const getPost = async (e: any) => {
        const parentID = e.target.closest(".parent").id;
        setParentID(parentID);
        setModal(true);
    }

    //コメント送信
    const addComment = async () => {
        const userName = await getUserName(auth.currentUser?.uid as string);
        if (parentID == "" || !comment || !userName) {
            setModal(false);
            setComment("");
            return;
        }
        //blogコレクションすべて取得
        const querySnapshot = await getDocs(collection(firestore, 'blog'));
        //documentID判別
        let documentID: string = "";
        querySnapshot.forEach((doc) => {
            //postidが同じならdocumentID更新
            if (doc.data().postId == parentID) {
                documentID = doc.id;
            }
        })
        const postdoc = doc(firestore, 'blog', documentID);
        const targetDoc = await getDoc(postdoc);
        let commentId = 0;
        //コメントのフィールドがあるなし
        if (targetDoc.data()?.comments) {
            //ある時は追記
            let targetComments = [{}];
            Object.keys(targetDoc.data()?.comments).map((result, index) => {
                targetComments[index] = targetDoc.data()?.comments[result];
            })
            targetComments[targetComments.length] = {
                userName: userName,
                parentID: parentID,
                body: comment,
                date: getDate()
            }

            await setDoc(postdoc, {
                userName: targetDoc.data()?.userName,
                title: targetDoc.data()?.title,
                tag: targetDoc.data()?.tag,
                body: targetDoc.data()?.body,
                date: targetDoc.data()?.date,
                Uid: targetDoc.data()?.Uid,
                postId: targetDoc.data()?.postId,
                comments: targetComments,
                like: targetDoc.data()?.like
            });


        } else {
            //ないときは作る
            await setDoc(postdoc, {
                userName: targetDoc.data()?.userName,
                title: targetDoc.data()?.title,
                tag: targetDoc.data()?.tag,
                body: targetDoc.data()?.body,
                date: targetDoc.data()?.date,
                Uid: targetDoc.data()?.Uid,
                postId: targetDoc.data()?.postId,
                like:targetDoc.data()?.like,
                comments: {
                    1: {
                        userName: await getUserName(auth.currentUser?.uid as string),
                        parentID: parentID,
                        body: comment,
                        date: getDate()
                    }

                }
            });
        }
        setModal(false);
        setComment("");
    }

    //タグでの読み込み
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const q = tag
                    ? query(collection(firestore, 'blog'), where("tag", "==", tag), orderBy('date', 'desc'))
                    : query(collection(firestore, 'blog'), orderBy('date', 'desc'));
                let querySnapshot = await getDocs(q);
                const postsData = querySnapshot.docs.map((doc) => ({ username: doc.data().userName, title: doc.data().title, tag: doc.data().tag, body: doc.data().body, date: doc.data().date, postId: doc.data().postId, like: doc.data().like, comments: doc.data().comments }));
                setPosts(postsData);
            } catch (error) {
                console.error("Error fetching posts: ", error);
            }
        };
        fetchPosts();
    }, [tag])
    //読み込み
    useEffect(() => {
        try {
            onSnapshot(collection(firestore, 'blog'), async (snapshot) => {
                const q = tag
                    ? query(collection(firestore, 'blog'), where("tag", "==", tag), orderBy('date', 'desc'))
                    : query(collection(firestore, 'blog'), orderBy('date', 'desc'));

                const querySnapshot = await getDocs(q);
                const postsData = querySnapshot.docs.map((doc) => {
                    if(doc.data()?.comments){
                        return({
                            username: doc.data()?.userName,
                            title: doc.data()?.title,
                            tag: doc.data()?.tag,
                            body: doc.data()?.body,
                            date: doc.data()?.date,
                            postId: doc.data()?.postId,
                            like: doc.data()?.like,
                            comments: doc.data()?.comments
                        });
                    }else{
                        return({
                            username: doc.data()?.userName,
                            title: doc.data()?.title,
                            tag: doc.data()?.tag,
                            body: doc.data()?.body,
                            date: doc.data()?.date,
                            postId: doc.data()?.postId,
                            like: doc.data()?.like,
                            comments:null
                        });
                    }
                    
                });

                setPosts(postsData);
            })

        } catch (error) {
            console.log(error);
        }
    }, [tag]);

    //いいね
    const addLike = async (e: any) => {
        const parentID =e.target.closest(".parent").id;
        const blogs = await getDocs(collection(firestore, 'blog'));
        let documentID: string = "";
        blogs.forEach(element => {
            if (element.data().postId === parentID) {
                documentID = element.id;
            }
        });
        const postdoc = doc(firestore, 'blog', documentID);
        const targetDoc = await getDoc(postdoc);
        console.log(parentID);
        if (targetDoc.data()?.comments) {
            setDoc(postdoc, {
                userName: targetDoc.data()?.userName,
                title: targetDoc.data()?.title,
                tag: targetDoc.data()?.tag,
                body: targetDoc.data()?.body,
                date: targetDoc.data()?.date,
                Uid: targetDoc.data()?.Uid,
                postId: targetDoc.data()?.postId,
                comments: targetDoc.data()?.comments,
                like: targetDoc.data()?.like + 1
            })
        } else {
            setDoc(postdoc, {
                userName: targetDoc.data()?.userName,
                title: targetDoc.data()?.title,
                tag: targetDoc.data()?.tag,
                body: targetDoc.data()?.body,
                date: targetDoc.data()?.date,
                Uid: targetDoc.data()?.Uid,
                postId: targetDoc.data()?.postId,
                like: targetDoc.data()?.like + 1
            })
        }

    }


    return (
        <div className="relative object-cover">
            <div className={`${modal ? "block" : "hidden"} fixed flex flex-col left-1/4 border-2 border-solid border-blue-400 rounded-md object-cover w-[60%] h-[60%] shadow-xl bg-slate-300`}>
                <div className="header flex">
                    <h1 className="text-4xl text-left px-3">コメント</h1>
                    <button className="absolute right-0" onClick={() => setModal(false)}><Image src={cross_img} width={32} height={32} alt="cross" /></button>
                </div>
                <div className="context px-4 py-2 ">
                    <textarea rows={10} onChange={(e) => setComment(e.target.value)} value={comment} className="border-2 border-solid border-black resize-y w-full"></textarea>
                </div>
                <button onClick={() => addComment()}>投稿</button>
            </div>
            {
                posts.map((post, index) => (
                    <div id={String(post.postId)} key={index} className="parent my-4 flex flex-col ">
                        <div className="content border-2 border-gray-200 border-sloid">
                            <h1 className="text-2xl ">{post.username}</h1>
                            <Link href={{ pathname: '/', query: { tag: `${post.tag}` } }} className="text-blue-300">#{post.tag}</Link>
                            <h2 id="title">タイトル:{post.title}</h2>
                            <pre>
                                {post.body}
                            </pre>

                            <p className="text-right">{post.date}</p>
                            <div className="flex justify-end items-center">
                                <button className=" border-2 border-solid border-gray-200 rounded-md w-5 h-5 text-center" onClick={(e) => getPost(e)}><Image src={comment_img} alt="comment" width={32} height={32} /></button>
                                <button className=" hover:text-red-500 hover:font-black flex items-center" onClick={(e) => addLike(e)}><Image src={heart_img} alt="heart" width={32} height={32} />{post.like}</button>
                            </div>
                        </div>

                        <div className="flex flex-col justify-end">
                            {post.comments && Object.keys(post.comments).map((result: any) => (
                                <div key={result} className="border-2 border-blue-200 rounded-md">
                                    <p>{post.comments[result].userName}</p>
                                    <pre>{post.comments[result].body}</pre>
                                    <p className="text-right">{post.comments[result].date}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                ))
            }
        </div >
    );
}
