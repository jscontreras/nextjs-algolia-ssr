import Link from 'next/link';
import React, {useEffect, useRef} from 'react';
import { useHierarchicalMenu, useInstantSearch } from 'react-instantsearch';

function friendlyURL(value) {
  return value;
}

function renderItem(item, path, key, level=2) {
  if (!item.data) {
    return (
      <li key={key} className="ais-HierarchicalMenu-item mr-4">
        <Link href={friendlyURL(`${path}/${item.label}`)}>
          <a className={'text-red-600'}>{`[ ${item.label} ]`}</a>
        </Link>
      </li>
    )
  } else {
    return (<li key={key} className='mr-4'>
      <Link href={friendlyURL(`${path}/${item.label}`)}>
        <a className={'text-red-600'}>{`[ ${item.label} ]`}</a>
      </Link>
      {/* <ul className={`ml-${level}`}>
        {item.data.map((child, keyChild) => (
          renderItem(child, `${path}/${item.label}`, `${key}_${keyChild}`, level+2)
        ))}
      </ul> */}
    </li>)
  }

}

export function SubCategoriesMenu(props) {
  const {
    items,
  } = useHierarchicalMenu(props);

  const { uiState, setUiState } = useInstantSearch();
  const uiStateRef = useRef(uiState);
  const rootPathUrl = props.rootPath ? '/' + props.rootPath.replace(/\s>\s/g, '/') : '';
  // Keep up to date uiState in a reference
  useEffect(() => {
    uiStateRef.current = uiState;
  },[uiState]);

  return <ul className="ais-HierarchicalMenu ais-HierarchicalMenuLinks text-base flex p-4 flex-wrap">
    {items.length > 0 && <li className='ml-2 mr-4 font-bold'>Subcategories:</li>}
    {items.map((item, key) => (renderItem(item, `/category_pages${rootPathUrl}`, key)))}
    </ul>;
}