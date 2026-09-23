/**
 * AdMir Consulting — Shared Components (Navbar + Footer)
 * v2: Updated navigation with Sectoare, Echipă, Insights
 */

(function () {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    const isActive = (page) => {
        if (page === 'index.html' && (currentPage === '' || currentPage === 'index.html' || currentPage === '/')) return 'active';
        if (currentPage === page) return 'active';
        return '';
    };

    // Active state for dropdown parents
    const isDropdownActive = () => {
        return ['agro.html', 'itpark.html', 'sectoare.html'].includes(currentPage) ? 'active' : '';
    };

    // === NAVBAR ===
    const navHTML = `
    <nav class="navbar" id="navbar">
        <div class="container nav-container">
            <a href="index.html" class="nav-logo">
                <span class="text-gold">AdMir</span> Consulting
            </a>

            <ul class="nav-menu" id="nav-menu">
                <li><a href="index.html" class="nav-link ${isActive('index.html')}" data-ro="Acasă" data-en="Home">Acasă</a></li>
                <li><a href="despre.html" class="nav-link ${isActive('despre.html')}" data-ro="Despre" data-en="About">Despre</a></li>
                <li class="nav-dropdown">
                    <a href="sectoare.html" class="nav-link ${isDropdownActive()}" data-ro="Sectoare" data-en="Sectors">Sectoare</a>
                    <ul class="dropdown-menu">
                        <li><a href="agro.html" data-ro="Agricultură" data-en="Agriculture">Agricultură</a></li>
                        <li><a href="itpark.html" data-ro="IT Park" data-en="IT Park">IT Park</a></li>
                        <li><a href="sectoare.html#constructii" data-ro="Construcții" data-en="Construction">Construcții</a></li>
                        <li><a href="sectoare.html#financiar" data-ro="Financiar" data-en="Financial">Financiar</a></li>
                        <li><a href="sectoare.html#industrie" data-ro="Industrie" data-en="Industry">Industrie</a></li>
                    </ul>
                </li>
                <li><a href="servicii.html" class="nav-link ${isActive('servicii.html')}" data-ro="Servicii" data-en="Services">Servicii</a></li>
                <li><a href="echipa.html" class="nav-link ${isActive('echipa.html')}" data-ro="Echipă" data-en="Team">Echipă</a></li>
                <li><a href="insights.html" class="nav-link ${isActive('insights.html')}" data-ro="Insights" data-en="Insights">Insights</a></li>
                <li><a href="contact.html" class="nav-link ${isActive('contact.html')}" data-ro="Contact" data-en="Contact">Contact</a></li>
            </ul>

            <div class="nav-actions">
                <button class="lang-toggle" id="lang-toggle" aria-label="Schimbă limba">
                    <span class="lang-active">RO</span>
                    <span class="lang-separator">|</span>
                    <span class="lang-inactive">EN</span>
                </button>
                <a href="contact.html" class="btn btn-primary btn-nav" data-ro="Consultație gratuită" data-en="Free consultation">Consultație gratuită</a>
            </div>

            <button class="hamburger" id="hamburger" aria-label="Meniu">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </nav>`;

    // === FOOTER ===
    const footerHTML = `
    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <a href="index.html" class="footer-logo">
                        <span class="text-gold">AdMir</span> Consulting
                    </a>
                    <p class="footer-tagline" data-ro="Implementăm idei" data-en="We implement ideas">Implementăm idei</p>
                    <p class="footer-desc" data-ro="Consultanță strategică premium. Juridic, financiar, agricol, tehnologic — și nu numai. Chișinău, Republica Moldova." data-en="Premium strategic consulting. Legal, financial, agricultural, technological — and beyond. Chișinău, Republic of Moldova.">
                        Consultanță strategică premium. Juridic, financiar, agricol, tehnologic — și nu numai. Chișinău, Republica Moldova.
                    </p>
                </div>

                <div class="footer-links">
                    <h4 data-ro="Companie" data-en="Company">Companie</h4>
                    <ul>
                        <li><a href="despre.html" data-ro="Despre noi" data-en="About us">Despre noi</a></li>
                        <li><a href="echipa.html" data-ro="Echipa" data-en="Team">Echipa</a></li>
                        <li><a href="servicii.html" data-ro="Servicii" data-en="Services">Servicii</a></li>
                        <li><a href="insights.html" data-ro="Insights" data-en="Insights">Insights</a></li>
                    </ul>
                </div>

                <div class="footer-links">
                    <h4 data-ro="Sectoare" data-en="Sectors">Sectoare</h4>
                    <ul>
                        <li><a href="sectoare.html" data-ro="Toate sectoarele" data-en="All sectors">Toate sectoarele</a></li>
                        <li><a href="agro.html" data-ro="Agricultură" data-en="Agriculture">Agricultură</a></li>
                        <li><a href="itpark.html" data-ro="IT Park" data-en="IT Park">IT Park</a></li>
                    </ul>
                </div>

                <div class="footer-links">
                    <h4 data-ro="Contact" data-en="Contact">Contact</h4>
                    <ul>
                        <li><span style="color: var(--text-secondary)">contact@admirconsulting.md</span></li>
                        <li><span style="color: var(--text-secondary)">+373 XX XXX XXX</span></li>
                        <li><span style="color: var(--text-secondary)" data-ro="Chișinău, Moldova" data-en="Chișinău, Moldova">Chișinău, Moldova</span></li>
                    </ul>
                </div>
            </div>

            <div class="footer-bottom">
                <p>&copy; 2026 AdMir Consulting. <span data-ro="Toate drepturile rezervate." data-en="All rights reserved.">Toate drepturile rezervate.</span></p>
            </div>
        </div>
    </footer>`;

    // Inject
    const navPlaceholder = document.getElementById('navbar-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (navPlaceholder) navPlaceholder.outerHTML = navHTML;
    if (footerPlaceholder) footerPlaceholder.outerHTML = footerHTML;
})();
