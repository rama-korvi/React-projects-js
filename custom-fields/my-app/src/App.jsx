import { useState,useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import OTTPlatformDetailsTable from './OTTPlatformDetailsTable/OTTPlatformDetailsTable.jsx'
import SearchBoxComp from './SearchBox/searchBoxComp.jsx'

function App(){
  return (
    <>  
        <SearchBoxComp />
        {/* <OTTPlatformDetailsTable name='Netflix'/>     */}
    </>
  );
}


export default App
