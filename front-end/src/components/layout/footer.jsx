// components/layout/Footer.jsx
import { Link } from 'react-router-dom';

export default function Footer() {
  const footerSections = [
    {
      title: 'About',
      content: 'Our institutional repository provides open access to the institution\'s research output.',
    },
    {
      title: 'Quick Links',
      links: [
        { text: 'Help', href: '/help' },
        { text: 'Policies', href: '/policies' },
        { text: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { text: 'Submit Work', href: '/submit' },
        { text: 'Browse', href: '/browse' },
        { text: 'FAQ', href: '/faq' },
      ],
    },
    {
      title: 'Connect',
      links: [
        { text: 'Twitter', href: '#' },
        { text: 'LinkedIn', href: '#' },
        { text: 'RSS Feed', href: '#' },
      ],
    },
  ];

  return (
    <footer className="bg-muted py-8 mt-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              {section.content ? (
                <p className="text-muted-foreground">{section.content}</p>
              ) : (
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.text}>
                      <Link
                        to={link.href}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
        <div className="border-t border-border my-6 opacity-20" />
        <div className="mt-8  text-center text-muted-foreground">
          <p>© 2024 HUDC Institutional Repository. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}