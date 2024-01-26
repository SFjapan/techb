import "tailwindcss/tailwind.css"
import { collection, getDocs, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { getDatabase,onChildAdded,push ,ref } from "firebase/database";
import { blogCollection, firebaseApp, firestore } from "@/lib/firebase/config";
import { useState, useEffect,createContext,useContext } from "react";
import { auth } from "@/lib/firebase/config";
import Link from "next/link";
interface BlogListProps {
    tag: string;
  }

export const BlogList: React.FC<BlogListProps> = ({ tag })  => {
    const [posts, setPosts] = useState([{username:'',title:'',tag:'',body:'',date:''}]);
    console.log(tag);
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                let q = query(blogCollection ,orderBy('date','desc'));
                if(tag){
                    q =  query(blogCollection,where("tag","==",tag) ,orderBy('date','desc'));
                }
                
                const querySnapshot = await getDocs(q);
                const postsData = querySnapshot.docs.map((doc) => ({username:doc.data().userName, title:doc.data().title,tag:doc.data().tag,body:doc.data().body,date:doc.data().date  }));
                setPosts(postsData);
            } catch (error) {
                console.error("Error fetching posts: ", error);
            }
        };
        fetchPosts();
    }, [tag])
    useEffect(()=>{
        try {
            onSnapshot(blogCollection,async (snapshot)=>{
                let q = query(blogCollection,orderBy('date','desc'));
                if(tag){
                    q =  query(blogCollection,where("tag","==",tag),orderBy('date','desc'));
                }
                
                const querySnapshot = await getDocs(q);
                const postsData = querySnapshot.docs.map((doc) => ({username:doc.data().userName, title:doc.data().title,tag:doc.data().tag,body:doc.data().body,date:doc.data().date  }));
                setPosts(postsData);
            })
            console.log("snapshot")
        } catch (error) {
            console.log(error);
        }
    },[])
    return (
        <div className="flex flex-col justify-center">
            {posts.map((post,index) => (
                <div key={index} className="border-2 border-solid border-gray-200 rounded-md my-4 ">
                    <h1 className="text-2xl ">{post.username} </h1>
                    <Link href={{pathname:'/',query:{tag:`${post.tag}`}}} className="text-blue-300">#{post.tag}</Link>
                    <h2>タイトル:{post.title}</h2>
                    {post.body.split("\n").map((e)=>(
                        <p>{e}</p>
                    ))}
                    <p className="text-right">{post.date}</p>
                </div>
        ))}
        </div>
    );
}
