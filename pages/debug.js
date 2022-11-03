import Link from "next/link";
import { useContext } from "react"
import { AlgoliaFetchContext } from "./_app";

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
          const renderValues = [<span className='text-xs absolute right-4 text-slate-400' key='date'>{dateString}</span>];
          for (const key of queryString.keys()) {
            if (!hiddenKeys.includes(key) && (mandatoryKeys.includes(key) || queryString.get(key))) {
              renderValues.push(<p key={key} className={`break-all ${renderValues.length == 1 ? 'pt-4 mt-1 mb-1': 'pt-0'}`}><span className="font-bold">{key}:</span>{queryString.get(key)}</p>)
            }
          }
          return(<li className="mt-4 w-full p-4 bg-slate-100 relative text-xs" key={index}>
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
      <h2 className="font-bold">Interceptor ready (via Service Worker)...</h2>
      <p className="text-sm">
        Whenever any of the prototypes executes an Algolia callback, the debugger inspects the associated request and displays specific attributes below.
      </p>
    </div>
  )
  return (
    <>
      <Link href={'/'}><a className="text-blue-700">&larr; Home</a></Link>
      <h1 className="text-2xl font-bold mb-4 mt-4">Debugging Algolia URLs!!</h1>
      <div>
        <h2 className="font-bold">Interceptor ready...</h2>
        <p className="mb-4">
          Inspecting Recent <span className="text-sky-500">Algolia</span> Callbacks
        </p>
        <div className="bg-slate-50 p-2 mb-2">
        <p>
          <span className="font-bold text-sm">Request Hidden Fields:</span>
            {hiddenKeys.map((hiddenKey, i) => (
              <span className="italic text-sm" key={hiddenKey}> {hiddenKey}{i < hiddenKeys.length - 1 ? ',' : ''}</span>
            ))}
        </p>
          <p>
            <span className="font-bold text-sm">Request Mandatory Fields:</span>
            {mandatoryKeys.map((mandatoryKey, i) => (
              <span className="italic text-sm" key={mandatoryKey}> {mandatoryKey}{i < mandatoryKeys.length - 1 ? ',' : ''}</span>
            ))}
          </p>


        </div>
      </div>
      {payloads.length === 0 ? <EmptyUrls /> : <AlgoliaUrlsInspector payloads={payloads} channel={channel} />}
    </>
  )
}