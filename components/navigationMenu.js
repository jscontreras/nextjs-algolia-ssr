import React, { useEffect, useRef, useState } from 'react';
import { useHierarchicalMenu, useInstantSearch } from 'react-instantsearch-hooks-web';

export function cx(
  ...classNames
) {
  return classNames.filter(Boolean).join(' ');
}


export function isModifierClick(event) {
  const isMiddleClick = event.button === 1;

  return Boolean(
    isMiddleClick ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey
  );
}

let counter = 0;

function HierarchicalList({
  className,
  classNames = {},
  items,
  createURL,
  onNavigate,
  firstSelected,
  setFirstSelected,
  level,
  lastLevel,
  setLastLevel
}) {
  const { uiState, setUiState } = useInstantSearch();

  return (
    <ul className={`${cx('ais-HierarchicalMenu-list', classNames.list, className)} flex justify-start relative level--${level}`} onMouseLeave={() => {
    }}>
      {items.map((item) => (
        <li
          key={item.value}
          className={cx(
            'ais-HierarchicalMenu-item',
            'ais-HierarchicalNav-item',
            classNames.item,
            item.data &&
            cx('ais-HierarchicalMenu-item--parent', classNames.parentItem),
            item.isRefined &&
            cx('ais-HierarchicalMenu-item--selected', classNames.selectedItem)
          )}
        >
          <a
            onMouseLeave={(event) => {
              counter--;
              event.preventDefault();
              setLastLevel(level)
              setTimeout(() => {
                if (counter == 0) {
                  const newState = { ...uiState, };
                  newState.instant_search.hierarchicalMenu = {};
                  setUiState(newState);
                }
              }, 1000)
            }}
            onMouseEnter={(event) => {
              counter++;
              if (firstSelected == null) {
                setFirstSelected({ ...item, level });
              }
              event.preventDefault();
              onNavigate(item.value);
            }}
            className={cx(
              'ais-HierarchicalMenu-link',
              classNames.link,
              item.isRefined &&
              cx(
                'ais-HierarchicalMenu-link--selected',
                classNames.selectedItemLink
              )
            )}
            href={createURL(item.value)}
            // onClick={(event) => {
            //   if (isModifierClick(event)) {
            //     return;
            //   }
            //   event.preventDefault();
            //   onNavigate(item.value);
            // }}
          >
            <span
              className={cx('ais-HierarchicalMenu-label', classNames.label)}
            >
              {item.label}
            </span>
            {/* <span
              className={cx('ais-HierarchicalMenu-count', classNames.count)}
            >
              {item.count}
            </span> */}
          </a>
          {item.data && (
            <HierarchicalList
              className={cx(
                'ais-HierarchicalMenu-list--child',
                'ais-HierarchicalNav-list--child',
                classNames.childList
              )}
              classNames={classNames}
              items={item.data}
              onNavigate={onNavigate}
              createURL={createURL}
              firstSelected={firstSelected}
              setFirstSelected={setFirstSelected}
              level={level + 1}
              lastLevel={lastLevel}
              setLastLevel={setLastLevel}
            />
          )}
        </li>
      ))}
    </ul>
  );
}



export function NavigationMenu(props) {
  const { uiState, setUiState } = useInstantSearch();
  const [firstSelected, setFirstSelected] = useState(firstSelected);
  const [lastLevel, setLastLevel] = useState(0);
  const uiStateRef = useRef(uiState);
  const menuProps = useHierarchicalMenu(props);

  const {
    items,
    classNames,
    hasItems,
    createURL,
  } = menuProps;
  const onNavigate = menuProps.refine;

  // Keep up to date uiState in a reference
  useEffect(() => {
    uiStateRef.current = uiState;
  }, [uiState]);

  return (
    <div
      {...props}
      className={cx(
        'ais-HierarchicalMenu',
        !hasItems &&
        cx('ais-HierarchicalMenu--noRefinement'),
        props.className
      )}
    >
      <HierarchicalList
        classNames={classNames}
        items={items}
        onNavigate={onNavigate}
        createURL={createURL}
        firstSelected={firstSelected}
        setFirstSelected={setFirstSelected}
        level={0}
        lastLevel={lastLevel}
        setLastLevel={setLastLevel}
      />
    </div>
  );
}