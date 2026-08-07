import Link from "next/link";

export function SiteHeader() {
  return (
    <nav className="nav shell" aria-label="Main navigation">
      <Link className="mark" href="/" aria-label="Dimitrios Ioannidis, home">DI<span>.</span></Link>
      <div className="navlinks">
        <Link href="/#work">Work</Link>
        <Link href="/#about">About</Link>
        <Link href="/blog">Blog</Link>
        <Link href="/#contact">Contact</Link>
      </div>
      <a className="nav-cta" href="/dimitrios-ioannidis-resume.pdf" target="_blank">Résumé <span aria-hidden="true">↗</span></a>
    </nav>
  );
}
