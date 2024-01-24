import Link from 'next/link';
import React, {useEffect, useRef} from 'react';
import { useHierarchicalMenu, useInstantSearch } from 'react-instantsearch';

function friendlyURL(value) {
  return value;
}

function renderItem(item, path, key, level=2) {
  if (!item.data) {
    return (
      <li key={key} className="ais-HierarchicalMenu-item">
        <Link href={friendlyURL(`${path}/${item.label}`)}>
          <span className={item.isRefined ? 'font-bold text-blue-600 underline' : 'text-red-600 underline'}>{item.label}</span>
        </Link>
      </li>
    )
  } else {
    return (<li key={key}>
      <Link href={friendlyURL(`${path}/${item.label}`)}>
        <span className={item.isRefined ? 'font-bold text-blue-600 underline' : 'text-red-600 underline'}>{item.label}</span>
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

  const { uiState, setUiState } = useInstantSearch();
  const uiStateRef = useRef(uiState);
  const rootPathUrl = props.rootPath ? '/' + props.rootPath.replace(/\s>\s/g, '/') : '';
  // Keep up to date uiState in a reference
  useEffect(() => {
    uiStateRef.current = uiState;
  },[uiState]);

  return <ul className="ais-HierarchicalMenu ais-HierarchicalMenuLinks text-base">{items.map((item, key) => (renderItem(item, `/category_pages${rootPathUrl}`, key)))}</ul>;
}