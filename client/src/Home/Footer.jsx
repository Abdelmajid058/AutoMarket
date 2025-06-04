import React from 'react'
import '../styles/footer.css'
import { BsLinkedin, BsGithub } from 'react-icons/bs'
import logo from '../images/logo.jpg'

const Footer = () => {
    return (
        <div>
  <section id="contact" className="footer_wrapper">
    <div className="container">
      <div className="row">
        <div className="col-lg-5 footer_logo mb-4 mb-lg-0">
          {/* <img decoding="async" src={logo} width={150} /> */}
          <h3 style={{ color: '#d11a2a' }}>AutoMarket</h3>
          <p className="footer_text" style={{ textAlign: 'justify' }}>
            Chez AutoMarket, nous nous engageons à rendre votre expérience d’achat
            automobile aussi fluide que la route qui vous attend. Avec un large
            choix de marques, des conseils d’experts, des transactions sécurisées et
            des fonctionnalités innovantes, nous sommes votre partenaire de confiance
            pour trouver le véhicule parfait. Réalisez vos rêves avec AutoMarket,
            où votre satisfaction est notre priorité.
          </p>
        </div>
        <div className="col-lg-4 px-lg-5 mb-4 mb-lg-0">
          <h3 className="footer_title" style={{ color: '#d11a2a' }}>Contact</h3>
          <p className="footer_text">
            <a href="mailto:ibrahimimajid058@gmail.com">ibrahimimajid058@gmail.com</a><br />
            <span className="footer-address">
              Ariana, Tunisie
            </span>
          </p>
        </div>
        <div className="col-lg-3 mb-4 mb-lg-0">
          <h3 className="footer_title" style={{ color: '#d11a2a' }}>Réseaux sociaux</h3>
          <p>
            <a href="https://www.linkedin.com/in/abdelmajid/" className="footer_social_media_icon" style={{ color: 'white' }}>
              <BsLinkedin size={25} />
            </a>
            <a href="https://github.com/Abdelmajid058" className="footer_social_media_icon" style={{ color: 'white' }}>
              <BsGithub size={25} />
            </a>
          </p>
        </div>
        <div className="col-12 footer_credits text-center">
          <span>© 2025 <a>AutoMarket</a>™. Tous droits réservés.</span>
        </div>
      </div>
    </div>
  </section>
</div>

    )
}

export default Footer
