import { useContext } from "react"
import { AlgoliaFetchContext } from "../_app";



const AlgoliaUrlsInspector = ({payloads, channel}) => {
  return (
    <div>
      <h2 className="font-bold">Interceptor ready...</h2>
      <p className="mb-4">
        Inspecting Recent <span className="text-sky-500">Algolia</span> Callbacks
      </p>
      <p><button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => {
        channel.sendMessage('cleanCallbacks')
      }}>Flush Callbacks</button></p>
      <ul className="flex flex-col-reverse	flex-wrap content-justify justify-center ">
        {payloads.map(({url, body}, index) => {
          const paramString = body.requests[0].params;
          const queryString = new URLSearchParams(paramString);
          return (<li className="mt-4 w-full p-4 bg-slate-100" key={index}>
            <p><span className="font-bold">facets:</span>{queryString.get('facets')}</p>
            <p><span className="font-bold">facetsFilters:</span>{queryString.get('facetFilters')}</p>
            <p><span className="font-bold">filters:</span>{queryString.get('filters')}</p>
          </li>)
        })}
      </ul>

    </div>
  );
}



export default function DebugPage() {

  const {payloads, channel} = useContext(AlgoliaFetchContext);
  const EmptyUrls = () => (
    <div>
      <h2>Interceptor ready...</h2>
      <p>
        Algolia queries will be inspected on real time.
      </p>
    </div>
  )
  return (
    <>
      <h1>Debugging Algolia URLs!!</h1>
      {payloads.length === 0 ? <EmptyUrls /> : <AlgoliaUrlsInspector payloads={payloads} channel={channel} />}
    </>
  )
}