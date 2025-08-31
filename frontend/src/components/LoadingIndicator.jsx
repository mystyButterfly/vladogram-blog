import "../css/LoadingIndicator.css"
import Footer from "./Footer"

function LoadingIndicator() {
  return (
    <div className="loading-container">
        <div className="loader"></div>
        <Footer/>
    </div>
  )
}

export default LoadingIndicator