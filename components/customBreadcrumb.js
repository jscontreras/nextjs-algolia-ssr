import Link from 'next/link';
import React from 'react';
import { useBreadcrumb } from 'react-instantsearch-hooks-web';

export const CustomBreadcrumb = ({attributes, rootItems}) => {
  const { items, refine } = useBreadcrumb({attributes});
  return (
    <nav aria-label="breadcrumb">
      <ol className="flex flex-wrap list-none p-0 m-0">
        {
          rootItems.map((item, index) => (
            <li
              className={'text-blue-500 hover:text-blue-800 cursor-pointer'}
              key={item.label}
              aria-current={item.isLast ? 'page' : ''}
            >
              {item.label !== 'Home' ? <a onClick={() => refine(item.value)}>{item.label}</a> : <Link href={item.value}><a>&larr; {item.label}</a></Link> }
              {(index < rootItems.length -1 || items.length > 0)&& <span className="mx-2">
                <svg
                  className="fill-current w-3 h-3 inline-block"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M5 8h3.586l1.707-1.707a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-1.707-1.707H5a1 1 0 01-1-1V9a1 1 0 011-1z" />
                </svg>
              </span>}
            </li>
          ))
        }
        {items.map((item, index) => {
          item.isLast = index == items.length -1;
          return (
          <li
              className={`inline-block cursor-pointer ${item.isLast ? 'text-gray-500' : 'text-blue-500 hover:text-blue-800'} ${item.isLast ? 'font-bold' : ''
              }`}
            key={item.label}
            aria-current={item.isLast ? 'page' : ''}
          >
            {item.isLast ? (
              item.label
            ) : (
              <a onClick={() => refine(item.value)}>{item.label}</a>
            )}
            {!item.isLast && (
              <span className="mx-2">
                <svg
                  className="fill-current w-3 h-3 inline-block"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M5 8h3.586l1.707-1.707a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-1.707-1.707H5a1 1 0 01-1-1V9a1 1 0 011-1z" />
                </svg>
              </span>
            )}
          </li>
        )}
        )}
      </ol>
    </nav>
  );
};
