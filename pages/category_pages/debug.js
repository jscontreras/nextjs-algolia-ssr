import { useContext } from "react"
import { AlgoliaFetchContext } from "../_app";

const hiddenKeys = ['highlightPostTag', 'highlightPreTag'];
const mandatoryKeys = ['query', 'filters'];

const formatedTimestamp = (timestamp) => {
  const d = new Date(timestamp)
  const date = d.toISOString().split('T')[0];
  const time = d.toTimeString().split(' ')[0];
  return `${date} ${time}.${d.getMilliseconds()}`
}

const AlgoliaUrlsInspector = ({ payloads, channel }) => {
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
        {payloads.map(({ timestamp, body }, index) => {
          const dateString = formatedTimestamp(timestamp);
          const paramString = body.requests[0].params;
          const queryString = new URLSearchParams(paramString);
          // Autocomplete
          if (body.requests[0].query) {
            queryString.append('query', body.requests[0].query);
          }
          const renderValues = [<span className='text-xs absolute right-2 text-slate-400' key='date'>{dateString}</span>];
          for (const key of queryString.keys()) {
            if (!hiddenKeys.includes(key) && (mandatoryKeys.includes(key) || queryString.get(key))) {
              renderValues.push(<p key={key}><span className="font-bold">{key}:</span>{queryString.get(key)}</p>)
            }
          }
          return(<li className="mt-4 w-full p-4 bg-slate-100 relative" key={index}>
          {renderValues}
          </li>);
        })}
      </ul>

    </div>
  );
}



export default function DebugPage() {

  const { payloads, channel } = useContext(AlgoliaFetchContext);
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