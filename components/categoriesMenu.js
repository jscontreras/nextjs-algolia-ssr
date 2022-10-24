import Link from 'next/link';
import React from 'react';
import { useHierarchicalMenu } from 'react-instantsearch-hooks-web';

function friendlyURL(value) {
  return value;
}

function renderItem(item, path, key, level=2) {
  if (!item.data) {
    return (
      <li key={key}>
        <Link href={friendlyURL(`${path}/${item.label}`)}>
          <a className={item.isRefined ? 'font-bold text-amber-600' : ''}>{item.label}</a>
        </Link>
      </li>
    )
  } else {
    return (<li key={key}>
      <Link href={friendlyURL(`${path}/${item.label}`)}>
        <a className={item.isRefined ? 'font-bold text-amber-600' : ''}>{item.label}</a>
      </Link>
      <ul className={`ml-${level}`}>
        {item.data.map((child, keyChild) => (
          renderItem(child, `${path}/${item.label}`, `${key}_${keyChild}`, level+2)
        ))}
      </ul>
    </li>)
  }

}

export function CategoriesMenu(props) {

  const {
    items,
    isShowingMore,
    canToggleShowMore,
    canRefine,
    refine,
    sendEvent,
    toggleShowMore,
    createURL,
  } = useHierarchicalMenu(props);

  return <ul>{items.map((item, key) => (renderItem(item, '/category_pages', key)))}</ul>;
}