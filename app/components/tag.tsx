import "tailwindcss/tailwind.css"
import Link from "next/link";
import { tags } from "../data/tags";
export const TagList = ()=>{
    return(
        <div className="flex flex-col ">
            <Link href={{pathname:'/',query:{tag:``}}} className="bg-blue-300 hover:bg-blue-500 my-1">すべて</Link>
            {tags.map((tag,index)=>(
                <Link href={{pathname:'/',query:{tag:`${tag}`}}} key={index} className="bg-blue-300 hover:bg-blue-500 my-1">{tag}</Link>
            ))}
        </div>
    );
}

