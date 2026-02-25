import Header from './Header.tsx'
import Footer from './Footer.tsx'
import { useState } from 'react'
import CardiffMap from './interactive-map/CardiffMap.tsx'
import AmenityPanel from './interactive-map/AmenityPanel.tsx'
import 'maplibre-gl/dist/maplibre-gl.css';
import '../styles/app.css'

function App() {
  const [mapLayers, setMapLayers] = useState({
    showStreetNetwork: false,
    showGrid: false,
    showGP: false,
    showPark: false,
    showSchool: false
  })

  const toggleLayer = (layer: keyof typeof mapLayers) =>
    setMapLayers(prev => ({ ...prev, [layer]: !prev[layer] }))
  
  return (
    <>
        <Header />
        <div className="display-container">
            <CardiffMap 
              mapLayers={mapLayers}
            />
            <AmenityPanel 
              mapLayers={mapLayers}
              toggleLayer={toggleLayer}

            />
        </div>
        <Footer />
    </>
  )
}

export default App