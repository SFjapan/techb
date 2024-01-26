import "tailwindcss/tailwind.css"
import { addDoc, collection, doc, getDoc, getFirestore, setDoc, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { userCollection, firebaseApp, firestore } from "@/lib/firebase/config";
import { use, useEffect, useState } from "react";
import { format } from "util";
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
    const postUser = async () => {
        try {
            // 必要なすべてのフィールドが記入されていることを確認
            if (!username || !age || !sex) {
                alert("入力してください");
                return;
            }
            if (!Uid) return;
            //usersコレクションすべて取得
            const querySnapshot = await getDocs(userCollection);
            //documentID判別
            let documentID: string = "";
            querySnapshot.forEach((doc) => {
                //Uidが同じならdocumentID更新
                if (doc.data().Uid == Uid) {
                    documentID = doc.id;
                }
            })
            //更新か登録
            if (documentID) {
                const postdoc = doc(firestore, 'users', documentID);
                const UserDoc = await getDoc(postdoc);
                //登録済みなら更新
                if (UserDoc.exists()) {
                    await setDoc(postdoc, {
                        name: username,
                        age: age,
                        hideage: hideage,
                        sex: sex,
                        Uid: Uid
                    })
                    alert("更新しました!!")
                }
            } else {
                await addDoc(userCollection, {
                    name: username,
                    age: age,
                    hideage: hideage,
                    sex: sex,
                    Uid: Uid
                })
                alert("登録しました!!")
            }
            router.push("/")

        } catch (error) {
            alert('エラーです' + error)
        }
    }



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
        </div>
    );
}

