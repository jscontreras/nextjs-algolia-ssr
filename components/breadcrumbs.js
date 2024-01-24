import Link from "next/link";
import React from "react";

export function BreadCrumbs(props) {
  return (
    <div className="bg-slate-50 p-3 mt-2 flex items-center flex-wrap">
      <ul className="flex items-center">
        <li className="inline-flex items-center">
          <Link href={'/'} className="text-gray-600 hover:text-blue-500">
            <span >
              <svg className="w-5 h-auto fill-current mx-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1z" /></svg>
            </span>
          </Link>
          <span className="mx-4 h-auto text-gray-400 font-medium">/</span>
        </li>

       {props.items.map((item, key, arr) => (
         <li key={key} className="inline-flex items-center">
           <Link href={item.url} className="text-gray-600 hover:text-blue-500">
             <span >
               {item.title}
             </span>
         </Link>
           {key < arr.length - 1 && <span >/</span>}
         </li>
       ))}
      </ul>
    </div>
  )
}