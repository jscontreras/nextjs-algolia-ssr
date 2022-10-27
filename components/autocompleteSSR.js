export function AutocomplteSSR() {
  return <div className="aa-Autocomplete invisible">
    <form className="aa-Form" role="search">
      <div className="aa-InputWrapperPrefix">
        <label className="aa-Label" htmlFor="autocomplete-13-input" id="autocomplete-13-label">
          <button className="aa-SubmitButton" type="submit" title="Submit">
            <svg className="aa-SubmitIcon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            </svg>
          </button>
        </label>
      </div>
      <div className="aa-InputWrapper">
        <input className="aa-Input" aria-autocomplete="both" aria-labelledby="autocomplete-13-label" id="autocomplete-13-input" placeholder="Search for Products" type="search" />
      </div>
    </form>
  </div>;
}