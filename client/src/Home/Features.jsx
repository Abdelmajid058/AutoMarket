import React from 'react'
import '../styles/features.css'
import secure from '../images/secure.gif'
import rotate from '../images/views.gif'
import fast from '../images/money.gif'

const Features = () => {
    return (
        <div>
  <section id="features" className="features_wrapper">
    <div className="container">
      <div className="row">
        <div className="col-12 text-center mb-5">
          <p className="features_subtitle">Conduite riche en fonctionnalités</p>
          <h2 className="features_title">Nos fonctionnalités innovantes</h2>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-4 col-sm-6 mb-5">
          <div className="ft-1 text-center header-img-section">
            <img src={secure} width={195} />
            <h3 className='mt-2' style={{ color: 'white' }}>Navigation Sécurisée</h3>
            <p className="features_text" style={{ color: 'white' }}>
              Parcourez notre site en toute confiance grâce à des protocoles de sécurité modernes qui protègent vos données personnelles à chaque étape.
            </p>
          </div>
        </div>
        <div className="col-lg-4 col-sm-6 mb-5">
          <div className="ft-2 text-center header-img-section">
            <img src={rotate} width={195} />
            <h3 className='mt-2' style={{ color: 'white' }}>Visualisation 360°</h3>
            <p className="features_text" style={{ color: 'white' }}>
              Explorez chaque angle, chaque détail de votre voiture idéale directement depuis votre écran grâce à notre technologie immersive.
            </p>
          </div>
        </div>
        <div className="col-lg-4 col-sm-6 mb-5">
          <div className="ft-3 text-center header-img-section">
            <img src={fast} width={195} />
            <h3 className='mt-2' style={{ color: 'white' }}>Navigation rapide et fluide</h3>
            <p className="features_text" style={{ color: 'white' }}>
              Profitez d'une expérience utilisateur fluide et rapide pour comparer, sélectionner et contacter nos vendeurs ou concessionnaires en toute simplicité.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>

    )
}

export default Features
