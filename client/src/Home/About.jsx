import React from 'react'
import '../styles/about.css'
import about from '../images/aboutUs.jpg'
import about2 from '../images/aboutUs2.jpg'

const About = () => {
    return (
        <div>
            <section id="about" className="about_wrapper">
                <div className="container">
                    <div className="row align-items-center" >
                        <div className="col-sm-12 col-lg-5 text-center text-lg-start">
                            <p className="about_number">1</p>
                            <h2 className="about_title">AutoMarket, le point de départ de votre aventure automobile</h2>
                            <p className="about_text " style={{ textAlign: 'justify' }}>Animés par la passion de l’automobile et le désir de vous aider à trouver le véhicule idéal, nous avons conçu une plateforme qui simplifie l’achat de voiture.
Notre vaste inventaire, nos avis d’experts et nos outils faciles à utiliser vous permettent de prendre des décisions éclairées. Que vous recherchiez une citadine économique ou une voiture de luxe haute performance, CarWale répond à tous vos besoins.
Nous pensons que l’achat d’une voiture doit être une expérience enthousiasmante, et non source de stress. C’est pourquoi nous vous accompagnons à chaque étape de votre parcours.
Rejoignez-nous dans cette aventure vers la voiture de vos rêves, et avançons ensemble vers vos ambitions.</p>
                            <div className="my-5">
                                <a className="learn-more-btn" href="#cars">Découvrez dès maintenant </a>
                            </div>
                        </div>
                        <div className="col-sm-12 col-lg-7 text-center text-md-start">
                            <img decoding="async" src={about} className="img-fluid" />
                        </div>
                    </div>
                </div>
                <div className="innovate mt-5">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-sm-12 col-lg-6 px-5 text-center text-md-start">
                                <img decoding="async" src={about2} className="img-fluid" />
                            </div>
                            <div className="col-sm-12 col-lg-6 text-center text-lg-start">
                                <p className="about_number">2</p>
                                <h2 className="about_title">La meilleure entreprise pour l’achat de voitures, nous comprenons vos besoins.</h2>
                                <p className="about_text" style={{ textAlign: 'justify' }}>Nous ne sommes pas qu’un simple site web : nous sommes votre partenaire de confiance pour trouver le véhicule idéal.
Animés par la passion de l’automobile et soucieux de votre satisfaction, nous avons sélectionné une large gamme de voitures adaptées à tous les besoins et à tous les budgets.
Notre mission est de simplifier l’achat de voiture en vous fournissant les outils et les ressources nécessaires pour prendre des décisions éclairées.
Notre équipe d’experts est là pour vous accompagner, en vous offrant des conseils avisés tout au long de votre parcours.</p>
                                <div className="mt-5">
                                    <a className="learn-more-btn btn-header" href="#brands">Achetez maintenant</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default About
