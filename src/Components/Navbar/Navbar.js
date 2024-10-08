import React from 'react';
import './Navbar.css';
import Logo from './Logo.png';
function Navbar() {
  return (
    React.createElement('nav', { className: 'navbar' },
      React.createElement('div', { className: 'navbar-container' },
        React.createElement('div', { className: 'logo' },
          React.createElement('img', { src: Logo, alt: 'logo' }),
        ),
        React.createElement('ul', { className: 'nav-links' },
          React.createElement('li', null,
            React.createElement('a', { href: '#', className: 'nav-link' }, 'Remove Background')
          ),
          React.createElement('li', null,
            React.createElement('a', { href: '#', className: 'nav-link' }, 'How to use')
          ),
          React.createElement('li', null,
            React.createElement('a', { href: '#', className: 'nav-link' }, 'Tools & API')
          ),
          React.createElement('li', null,
            React.createElement('a', { href: '#', className: 'nav-link' }, 'Pricing')
          )
        ),
        React.createElement('div', { className: 'auth-buttons' },
          React.createElement('a', { href: '#', className: 'login-btn' }, 'Log in'),
          React.createElement('a', { href: '#', className: 'signup-btn' }, 'Sign up')
        )
      )
    )
  );
}

export default Navbar;