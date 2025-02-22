// frontend>src>components>Header.jsx

import { Fragment, useState } from 'react'
import { Dialog, Disclosure, Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid'
import {
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faUserDoctor, faHospital, faHeartCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { NavLink } from 'react-router-dom';


const users = [
  { name: 'Patient Login', description: 'Get AI-driven diagnosis, chat with our bot, and receive prescriptions', to: "/patient/login", icon: faUser },
  { name: 'Doctor Login', description: 'Review AI diagnoses, manage patients, and provide prescriptions', to: '/doctor/login', icon: faUserDoctor }
]
const callsToAction = [
  { name: 'Watch demo', to: '/', icon: PlayCircleIcon },
  { name: 'Contact', to: '#contact', icon: PhoneIcon },
]


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)


  return (
    <header style={{ backgroundColor: 'white' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', maxWidth: '1200px', margin: '0 auto' }} aria-label="Global">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <NavLink to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: '#1a202c', fontSize: '1.25rem', fontWeight: 'bold' }}>
            <img src="/logo.png" alt="Logo" style={{ height: '2rem', marginRight: '0.5rem' }} />
            AI-Enhanced Medical Diagnostics System
          </NavLink>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <a href="#features" style={{ margin: '0 1rem', textDecoration: 'none', color: '#1a202c', fontSize: '0.875rem', fontWeight: '600' }}>Features</a>
          <a href="#contact" style={{ margin: '0 1rem', textDecoration: 'none', color: '#1a202c', fontSize: '0.875rem', fontWeight: '600' }}>About</a>
          <NavLink to="/" style={{ margin: '0 1rem', textDecoration: 'none', color: '#1a202c', fontSize: '0.875rem', fontWeight: '600' }}>GitHub</NavLink>
          <NavLink to="/" style={{ margin: '0 1rem', textDecoration: 'none', color: '#1a202c', fontSize: '0.875rem', fontWeight: '600' }}>Demo</NavLink>
          <NavLink to="/" style={{ margin: '0 1rem', textDecoration: 'none', color: '#1a202c', fontSize: '0.875rem', fontWeight: '600' }}>Presentation</NavLink>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Popover className="relative">
            <Popover.Button style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: '#1a202c', fontSize: '0.875rem', fontWeight: '600' }}>
              <ChevronDownIcon style={{ height: '1.25rem', width: '1.25rem', color: '#9ca3af', marginRight: '0.25rem' }} aria-hidden="true" />
              Login
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
             
            >
              <Popover.Panel className="absolute left-0 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5 transform -translate-x-1/2">
              <div className="p-4">
                  {users.map((item) => (
                    <div
                      key={item.name}
                      style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderRadius: '0.5rem', padding: '1rem', fontSize: '0.875rem', lineHeight: '1.5rem', backgroundColor: 'white', transition: 'background-color 0.3s' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      <div style={{ display: 'flex', height: '2.75rem', width: '2.75rem', flexShrink: 0, alignItems: 'center', justifyContent: 'center', borderRadius: '0.5rem', backgroundColor: '#f9fafb', transition: 'background-color 0.3s' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'white'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                      >
                        <FontAwesomeIcon className="fa-2x" icon={item.icon} />
                      </div>
                      <div style={{ flex: '1 1 auto' }}>
                        <NavLink to={item.to} style={{ display: 'block', fontWeight: '600', color: '#1a202c' }}>
                          {item.name}
                        </NavLink>
                        <p style={{ marginTop: '0.25rem', color: '#6b7280' }}>{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Popover.Panel>
            </Transition>
          </Popover>
          <NavLink to="/patient/Register" style={{ marginLeft: '1.5rem', fontSize: '0.875rem', fontWeight: '600', lineHeight: '1.5rem', color: 'white', backgroundColor: '#3182ce', padding: '0.5rem 1rem', borderRadius: '0.25rem' }}>
            Get Started for Free
          </NavLink>
        </div>
      </nav>
    </header>
  )
}

