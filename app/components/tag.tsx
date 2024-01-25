import "tailwindcss/tailwind.css"
import { useState ,useEffect} from 'react';

export const Tags = ()=>{
    const [tag,setTag] = useState("");
    const handleButtonClick =  (e:any) => {
        setTag(e.target.textContent);
    }; 
    useEffect(()=>{console.log(tag)},[tag])
    return(
        <div className="flex flex-col ">
            <button onClick={handleButtonClick} className="bg-blue-300 text-white cursor-pointer hover:bg-blue-500 my-1">html</button>
            <button onClick={handleButtonClick} className="bg-blue-300 text-white cursor-pointer hover:bg-blue-500 my-1">css</button>
            <button onClick={handleButtonClick} className="bg-blue-300 text-white cursor-pointer hover:bg-blue-500 my-1">js</button>
            <button onClick={handleButtonClick} className="bg-blue-300 text-white cursor-pointer hover:bg-blue-500 my-1">ts</button>
            <button onClick={handleButtonClick} className="bg-blue-300 text-white cursor-pointer hover:bg-blue-500 my-1">java</button>

        </div>
    );
}

