import React from 'react';
import {
 Configure,
  HierarchicalMenu,
  Hits,
  InstantSearch,
} from 'react-instantsearch-hooks-web';
import { NavigationMenu } from './navigationMenu';


import { HitComponent } from './app';

export function NavApp(props) {
  return (
    <InstantSearch {...props}>
      <Configure hitsPerPage={0} ruleContexts={['nav_bar']}/>
      <main>
        <div className="menu">
          <NavigationMenu attributes={[
            'hierarchicalCategories.lvl0',
            'hierarchicalCategories.lvl1',
            'hierarchicalCategories.lvl2',
          ]} separator=' > '
          limit={5}
          />
        </div>
      </main>
      <div className="results">
        <Hits hitComponent={HitComponent} />
      </div>
    </InstantSearch>
  );
}
