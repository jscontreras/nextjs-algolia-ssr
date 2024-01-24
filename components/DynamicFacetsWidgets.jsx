import { HierarchicalMenu, RefinementList } from "react-instantsearch";
// Configure your indices here
export const searchConfig = {
  attributeLabels: {
    'price.value': 'Price',
    'hierarchical_categories': "Catalog",
    'color.original_name': 'Colors',
    'price.on_sales': 'Promos',
    'reviews.rating': 'Customer Review',
    'available_sizes': 'Sizes'
  }
};

/**
 * Returns friendly name if available in the config
 * @param {} attribute
 * @returns
 */
export function friendlyAttributeName(attribute) {
  if (searchConfig.attributeLabels[attribute]) {
    return searchConfig.attributeLabels[attribute];
  } else if (attribute.includes('.lvl')) {
    const hierarchicalAttribute = attribute.split('.lvl')[0];
    return friendlyAttributeName(hierarchicalAttribute);
  }
  return attribute;
}

/**
 * Use this widget to render your facets
 * @param {*} props
 * @returns
 */
export function FallbackFacetWidget(props) {
  const { attributes, attribute } = props;
  if (attributes) {
    return <div attributes={attributes} className="is-facet">
      <h3 className="is-facet__label">{friendlyAttributeName(attributes[0]).toUpperCase()}</h3>
      <HierarchicalMenu {...props} />
    </div>
  }
  else if (!attribute.includes('hierarchical')) {
    return <div attribute={attribute} className="is-facet p-4">
      <h3 className="is-facet__label">{friendlyAttributeName(attribute).toUpperCase()}</h3>
      <RefinementList {...props} />
    </div>
  }
  return <></>;
}

/**
 * Use this function to modify the way in which your facets are rendered
 * (For exmaple removing empty facets)
 */
export function transformDynamicFacets(items, { results }) {
  const filteredFacets = items.filter(facet => {
    if (facet.includes('hierarchicalCategories')) {
      return true;
    }
    return Object.keys(results._rawResults[0].facets).some((facetObj) => {
      return facet.includes(facetObj);
    })

  });

  return filteredFacets;
}

/**
 * Function that adds a label when rendering a facet widget.
 * @param {*} param0
 * @returns
 */
export function FacetWidgetPanel({ attribute, children }) {
  return <div attribute={attribute} className="is-facet p-4">
    <h3 className="is-facet__label">{friendlyAttributeName(attribute).toUpperCase()}</h3>
    {children}
  </div>
}