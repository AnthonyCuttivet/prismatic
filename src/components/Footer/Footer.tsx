import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
        <p className="footer__text">
          © {new Date().getFullYear()} Anthony CUTTIVET - Prismatic was created under Riot Games' "Legal Jibber Jabber" policy using assets owned by Riot Games. Riot Games does not endorse or sponsor this project.
        </p>
        <div className="footer__links">
          <a href="https://github.com/AnthonyCuttivet" target="_blank" rel="noopener noreferrer" className="footer__link">
            GitHub
          </a>
          <span className="footer__separator">•</span>
          <a href="https://anthonycuttivet.github.io/" target="_blank" rel="noopener noreferrer" className="footer__link">
            Portfolio
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
