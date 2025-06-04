import React from 'react'
import '../styles/faq.css'
import faq from '../images/search.png'

const Faq = () => {
    return (
        <div>
            <section id="faqs" className="faq_wrapper mb-5">
                <div className="container">
                    <div className="row">
                        <div className="col-12 text-center mb-5">
                            <p className="faq_subtitle">Nous sommes là pour vous aider</p>
                            <h2 className="faq_title">Questions fréquentes</h2>
                        </div>
                    </div>
                    <div className="row align-items-center">
                        <div className="col-sm-12 col-lg-7 mb-5 mb-lg-0">
                            <div className="accordion accordion-flush" id="accordionExample">
                                <div className="accordion-item">
                                <h2 className="accordion-header" id="headingOne">
                                    <button
                                    className="accordion-button collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapseOne"
                                    aria-expanded="false"
                                    aria-controls="collapseOne"
                                    >
                                    1. Puis-je réserver une voiture en ligne ?
                                    </button>
                                </h2>
                                <div
                                    id="collapseOne"
                                    className="accordion-collapse collapse"
                                    aria-labelledby="headingOne"
                                    data-bs-parent="#accordionExample"
                                >
                                    <div className="accordion-body">
                                    Bien sûr ! Vous pouvez parcourir notre inventaire en ligne et nous
                                    contacter pour réserver un véhicule ou organiser un rendez-vous
                                    pour un essai.
                                    </div>
                                </div>
                                </div>
                                <div className="accordion-item">
                                <h2 className="accordion-header" id="headingTwo">
                                    <button
                                    className="accordion-button collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapseTwo"
                                    aria-expanded="false"
                                    aria-controls="collapseTwo"
                                    >
                                    2. Puis-je acheter une voiture en ligne ?
                                    </button>
                                </h2>
                                <div
                                    id="collapseTwo"
                                    className="accordion-collapse collapse"
                                    aria-labelledby="headingTwo"
                                    data-bs-parent="#accordionExample"
                                >
                                    <div className="accordion-body">
                                    Nous facilitons votre recherche et pré-approbation en ligne, mais la
                                    finalisation de l’achat se fait en concession ou lors d’un rendez-vous.
                                    Contactez-nous pour plus d’informations.
                                    </div>
                                </div>
                                </div>
                                <div className="accordion-item">
                                <h2 className="accordion-header" id="headingThree">
                                    <button
                                    className="accordion-button collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapseThree"
                                    aria-expanded="false"
                                    aria-controls="collapseThree"
                                    >
                                    3. Combien de voitures sont actuellement disponibles chez AutoMarket ?
                                    </button>
                                </h2>
                                <div
                                    id="collapseThree"
                                    className="accordion-collapse collapse"
                                    aria-labelledby="headingThree"
                                    data-bs-parent="#accordionExample"
                                >
                                    <div className="accordion-body">
                                    Nous proposons une large sélection de voitures de grandes marques. Vous
                                    pouvez facilement trouver le modèle qui vous intéresse grâce à la barre
                                    de recherche ou en explorant la section « Voitures ».
                                    </div>
                                </div>
                                </div>
                                <div className="accordion-item">
                                <h2 className="accordion-header" id="headingFour">
                                    <button
                                    className="accordion-button collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapseFour"
                                    aria-expanded="false"
                                    aria-controls="collapseFour"
                                    >
                                    4. Proposez-vous un service express ?
                                    </button>
                                </h2>
                                <div
                                    id="collapseFour"
                                    className="accordion-collapse collapse"
                                    aria-labelledby="headingFour"
                                    data-bs-parent="#accordionExample"
                                >
                                    <div className="accordion-body">
                                    Oui. Si vous avez besoin d’une intervention rapide, notre service
                                    express est à votre disposition pour un traitement rapide et efficace.
                                    </div>
                                </div>
                                </div>
                                <div className="accordion-item">
                                <h2 className="accordion-header" id="headingFive">
                                    <button
                                    className="accordion-button collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapseFive"
                                    aria-expanded="false"
                                    aria-controls="collapseFive"
                                    >
                                    5. Combien de marques sont disponibles chez AutoMarket ?
                                    </button>
                                </h2>
                                <div
                                    id="collapseFive"
                                    className="accordion-collapse collapse"
                                    aria-labelledby="headingFive"
                                    data-bs-parent="#accordionExample"
                                >
                                    <div className="accordion-body">
                                    Nous proposons une large gamme de marques automobiles premium et
                                    d’accessoires. Vous pouvez consulter toutes les options dans la section
                                    « Marques ».
                                    </div>
                                </div>
                                </div>
                            </div>
                            </div>

                        <div className="col-sm-12 col-lg-4">
                            <img decoding="async" src={faq} className="img-fluid hideOnMob" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Faq
