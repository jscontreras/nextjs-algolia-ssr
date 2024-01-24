import Link from 'next/link';

function friendlyURL(value) {
  return value;
}

function renderItem(item, path, key, level = 2) {
  if (!item.data) {
    return (
      <li key={key} className="ais-HierarchicalMenu-item mr-4">
        <Link href={friendlyURL(`${path}/${item.label}`)}>
          <span className={'text-red-600'}>{`[ ${item.label} ]`}</span>
        </Link>
      </li>
    )
  } else {
    return (<li key={key} className='mr-4'>
      <Link href={friendlyURL(`${path}/${item.label}`)}>
        <span className={'text-red-600'}>{`[ ${item.label} ]`}</span>
      </Link>
      {/* <ul className={`ml-${level}`}>
        {item.data.map((child, keyChild) => (
          renderItem(child, `${path}/${item.label}`, `${key}_${keyChild}`, level+2)
        ))}
      </ul> */}
    </li>)
  }

}

function PrintLinks({url}) {
  let acc = '/category_pages';
  let acc2 = ''

  return <ul className='mr-4'>
    <Link href={acc}><span className={'text-red-600'}>{'Catalog > '}</span></Link>
   {url.split('/').map(element => {
    acc2 = `[${element}]`;
    acc = `${acc}/${element}`;
    return <Link key={element} href={acc}><span className={'text-red-600'}>{acc2}</span></Link>
  })}</ul>
}

export function SubCategoriesMenu() {
  return (<ul className="ais-HierarchicalMenu ais-HierarchicalMenuLinks text-base flex p-4 flex-wrap">
    <li className='ml-2 mr-4 font-bold'>Example Subcategories:</li>
    <PrintLinks url="Women/Clothing/Jackets" />
    <PrintLinks url="Men/Shoes/Sneakers" />

  </ul>);
}
